import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import { getLogger } from 'logpot'

import { resolveSiteConfig } from '../config/config'
import {
  type ContentFile,
  discoverContent,
  discoverStaticAssets,
  isContentFile,
  isSiteConfigFile,
  type StaticAssetFile,
} from '../discover/content'
import {
  buildNavigation,
  type NavigationTree,
  resolveNavigationConfig,
} from '../navigation/navigation'
import { initBuiltinComponents } from '../regor/initBuiltinComponents'
import { styleBuilder } from '../style/styles'
import { orderThemes, resolveThemeFileName } from '../style/themeAssets'
import { themes } from '../style/themeOptions'
import { copyStaticAsset, resolveStaticOutPath } from './assets'
import {
  type AssetManifestEntry,
  type BuildManifest,
  type ContentManifestEntry,
  createEmptyManifest,
  type FileSignature,
  isCompatibleManifest,
  manifestConfigFromSiteConfig,
  readManifest,
  readSignature,
  signatureEqual,
  type StylesManifestEntry,
  writeManifest,
} from './manifest'
import { resolveOutPath, resolveRouteInfo } from './out-path'
import { buildPage } from './page'
import {
  type BuildCountSummary,
  type BuildHooks,
  type BuildInput,
  type BuildResult,
  buildSite,
} from './site'

export interface IncrementalBuildResult {
  fullRebuild: boolean
  changedPages: number
  changedAssets: number
  deletedPages: number
  deletedAssets: number
  reason: string
}

export interface IncrementalBuilder {
  buildAll: (reason: string) => Promise<BuildResult>
  applyChange: (filePath: string) => Promise<IncrementalBuildResult>
  renderIfDirtyByOutPath: (outPath: string) => Promise<boolean>
  renderByUrlPath: (urlPath: string) => Promise<boolean>
}

export async function createIncrementalBuilder(
  input: BuildInput = {},
): Promise<IncrementalBuilder> {
  const config = resolveSiteConfig(input)
  themes.setOptions(config.theme)
  initBuiltinComponents()
  const log = getLogger()
  const navigationConfig = resolveNavigationConfig(
    input.navigation ?? config.navigation,
  )
  let navigation: NavigationTree | undefined = await buildNavigation(
    config.contentDir,
    await discoverContent(config.contentDir),
    navigationConfig,
  )
  const context = {
    config,
    components: input.components,
    templates: input.templates,
    navigation,
  }
  const existing = await readManifest(config.outDir)
  let manifest =
    existing && isCompatibleManifest(existing, config)
      ? existing
      : createEmptyManifest(config)
  const dirtyPages = new Set<string>()
  const renderInFlight = new Map<string, Promise<boolean>>()
  const outPathToRelPath = new Map<string, string>()
  const relPathToOutPath = new Map<string, string>()
  const urlPathToRelPath = new Map<string, string>()
  const relPathToUrlPath = new Map<string, string>()

  const indexManifestContent = () => {
    outPathToRelPath.clear()
    relPathToOutPath.clear()
    urlPathToRelPath.clear()
    relPathToUrlPath.clear()
    for (const entry of Object.values(manifest.content)) {
      setContentIndex(entry.relPath, entry.outPath, entry.ext)
    }
  }

  const setContentIndex = (relPath: string, outPath: string, ext?: string) => {
    const prevOutPath = relPathToOutPath.get(relPath)
    if (prevOutPath && prevOutPath !== outPath) {
      outPathToRelPath.delete(prevOutPath)
    }
    const prevUrlPath = relPathToUrlPath.get(relPath)
    if (prevUrlPath) {
      urlPathToRelPath.delete(prevUrlPath)
    }
    relPathToOutPath.set(relPath, outPath)
    outPathToRelPath.set(outPath, relPath)
    const routeInfo = resolveRouteInfo(
      toContentFile(config.contentDir, relPath, ext ?? path.extname(relPath)),
    )
    relPathToUrlPath.set(relPath, routeInfo.urlPath)
    urlPathToRelPath.set(routeInfo.urlPath, relPath)
  }

  const removeContentIndex = (relPath: string) => {
    const outPath = relPathToOutPath.get(relPath)
    const urlPath = relPathToUrlPath.get(relPath)
    if (outPath) outPathToRelPath.delete(outPath)
    if (urlPath) urlPathToRelPath.delete(urlPath)
    relPathToOutPath.delete(relPath)
    relPathToUrlPath.delete(relPath)
  }

  const normalizeUrlPath = (urlPath: string) => {
    if (!urlPath || urlPath === '/') return '/'
    let normalized = urlPath.startsWith('/') ? urlPath : `/${urlPath}`
    if (path.posix.extname(normalized)) return normalized
    if (!normalized.endsWith('/')) normalized += '/'
    return normalized
  }

  indexManifestContent()

  const buildAll = async (reason: string) => {
    let discoveredContent: ContentFile[] | undefined
    let stylesResult: StylesManifestEntry | undefined
    const hooks = mergeHooks(input.hooks, {
      onContentDiscovered: async (_ctx, files) => {
        discoveredContent = files
      },
      onNavigationBuilt: async (_ctx, tree) => {
        navigation = tree
        context.navigation = tree
      },
      onStylesWritten: async (_ctx, result) => {
        stylesResult = {
          signature: result.signature,
          outputs: result.outputs,
        }
      },
    })

    log.info('build started', { reason })
    const result = await buildSite({ ...input, ...config, hooks })

    const contentFiles =
      discoveredContent ?? (await discoverContent(config.contentDir))
    const assetFiles = await discoverStaticAssets(config.contentDir)

    const contentCounts = countByExt(contentFiles)
    const assetCounts = countByExt(assetFiles)

    const nextManifest = await buildManifest(
      config,
      contentFiles,
      assetFiles,
      stylesResult,
    )
    manifest = nextManifest
    await writeManifest(config.outDir, nextManifest)
    indexManifestContent()
    dirtyPages.clear()

    log.info('build completed', { outDir: config.outDir })
    return {
      ...result,
      content: contentCounts,
      assets: assetCounts,
    }
  }

  const rebuildNavigationForChange = async (
    relPath: string,
    ext: string,
    result: IncrementalBuildResult,
    signature: FileSignature | null,
  ) => {
    const contentFiles = await discoverContent(config.contentDir)
    navigation = await buildNavigation(
      config.contentDir,
      contentFiles,
      navigationConfig,
    )
    context.navigation = navigation
    dirtyPages.clear()
    for (const file of contentFiles) {
      dirtyPages.add(file.relPath)
    }

    const contentEntry = manifest.content[relPath]
    if (!signature) {
      if (contentEntry) {
        await removeFile(contentEntry.outPath)
        delete manifest.content[relPath]
        removeContentIndex(relPath)
        result.deletedPages += 1
      }
      return
    }

    const contentFile =
      contentFiles.find((file) => file.relPath === relPath) ??
      toContentFile(config.contentDir, relPath, ext)

    await buildPage(context, contentFile)
    const outPath = resolveOutPath(config.outDir, contentFile)
    manifest.content[relPath] = {
      relPath,
      ext: contentFile.ext,
      outPath,
      ...signature,
    }
    setContentIndex(relPath, outPath, contentFile.ext)
    result.changedPages += 1
    dirtyPages.delete(relPath)
  }

  const applyChange = async (filePath: string) => {
    const relPath = path.relative(config.contentDir, filePath)
    const reason = `content change: ${filePath}`
    const result = createIncrementalResult(reason)

    if (relPath.startsWith('..') || relPath.startsWith('.\\..')) {
      return result
    }

    if (isSiteConfigFile(relPath)) {
      result.fullRebuild = true
      return result
    }

    const ext = path.extname(relPath).toLowerCase()
    const signature = await readSignature(filePath)
    const contentEntry = manifest.content[relPath]
    const assetEntry = manifest.assets[relPath]

    if (!signature) {
      await handleMissingSignatureChange({
        relPath,
        ext,
        result,
        contentEntry,
        assetEntry,
      })
      return result
    }

    const treatedAsContent = contentEntry || isContentFile(relPath, ext)
    if (treatedAsContent) {
      await handleContentChange({
        relPath,
        ext,
        signature,
        contentEntry,
        result,
      })
      return result
    }

    await handleAssetChange({
      relPath,
      ext,
      signature,
      assetEntry,
      result,
    })
    return result
  }

  const renderPageByRelPath = async (relPath: string, onlyIfDirty: boolean) => {
    if (onlyIfDirty && !dirtyPages.has(relPath)) return false
    const inFlight = renderInFlight.get(relPath)
    if (inFlight) return inFlight

    const task = (async () => {
      try {
        const absPath = path.join(config.contentDir, relPath)
        const signature = await readSignature(absPath)
        if (!signature) {
          const entry = manifest.content[relPath]
          if (entry) {
            await removeFile(entry.outPath)
            delete manifest.content[relPath]
            removeContentIndex(relPath)
            await writeManifest(config.outDir, manifest)
          }
          dirtyPages.delete(relPath)
          return false
        }

        const entry = manifest.content[relPath]
        const ext = entry?.ext ?? path.extname(relPath)
        const contentFile = toContentFile(config.contentDir, relPath, ext)
        await buildPage(context, contentFile)
        const nextOutPath = resolveOutPath(config.outDir, contentFile)
        manifest.content[relPath] = {
          relPath,
          ext: contentFile.ext,
          outPath: nextOutPath,
          ...signature,
        }
        setContentIndex(relPath, nextOutPath, contentFile.ext)
        dirtyPages.delete(relPath)
        await writeManifest(config.outDir, manifest)
        return true
      } catch (error) {
        log.error('incremental render failed', {
          relPath,
          error: error instanceof Error ? error.message : String(error),
        })
        return false
      } finally {
        renderInFlight.delete(relPath)
      }
    })()

    renderInFlight.set(relPath, task)
    return task
  }

  const renderIfDirtyByOutPath = async (outPath: string) => {
    const relPath = outPathToRelPath.get(outPath)
    if (!relPath) return false
    return renderPageByRelPath(relPath, true)
  }

  const renderByUrlPath = async (urlPath: string) => {
    const normalized = normalizeUrlPath(urlPath)
    let relPath = urlPathToRelPath.get(normalized)
    if (!relPath) {
      const contentFiles = await discoverContent(config.contentDir)
      for (const file of contentFiles) {
        const routeInfo = resolveRouteInfo(file)
        relPathToUrlPath.set(file.relPath, routeInfo.urlPath)
        urlPathToRelPath.set(routeInfo.urlPath, file.relPath)
      }
      relPath = urlPathToRelPath.get(normalized)
      if (!relPath) return false
    }
    return renderPageByRelPath(relPath, false)
  }

  function createIncrementalResult(reason: string): IncrementalBuildResult {
    return {
      fullRebuild: false,
      changedPages: 0,
      changedAssets: 0,
      deletedPages: 0,
      deletedAssets: 0,
      reason,
    }
  }

  type HandleMissingSignatureChangeInput = {
    relPath: string
    ext: string
    result: IncrementalBuildResult
    contentEntry: ContentManifestEntry | undefined
    assetEntry: AssetManifestEntry | undefined
  }

  const handleMissingSignatureChange = async (
    input: HandleMissingSignatureChangeInput,
  ) => {
    const { relPath, ext, result, contentEntry, assetEntry } = input
    if (contentEntry && navigationConfig.mode !== 'none') {
      await rebuildNavigationForChange(relPath, ext, result, null)
      await writeManifest(config.outDir, manifest)
      return
    }
    if (contentEntry) {
      await removeFile(contentEntry.outPath)
      delete manifest.content[relPath]
      removeContentIndex(relPath)
      result.deletedPages += 1
    }
    if (assetEntry) {
      await removeFile(assetEntry.outPath)
      delete manifest.assets[relPath]
      result.deletedAssets += 1
    }
    if (contentEntry || assetEntry) {
      await writeManifest(config.outDir, manifest)
    }
  }

  type HandleContentChangeInput = {
    relPath: string
    ext: string
    signature: FileSignature
    contentEntry: ContentManifestEntry | undefined
    result: IncrementalBuildResult
  }

  const handleContentChange = async (input: HandleContentChangeInput) => {
    const { relPath, ext, signature, contentEntry, result } = input
    if (signatureEqual(contentEntry, signature)) {
      return
    }
    if (navigationConfig.mode !== 'none') {
      await rebuildNavigationForChange(relPath, ext, result, signature)
      await writeManifest(config.outDir, manifest)
      return
    }
    const contentFile = toContentFile(config.contentDir, relPath, ext)
    await buildPage(context, contentFile)
    const outPath = resolveOutPath(config.outDir, contentFile)
    manifest.content[relPath] = {
      relPath,
      ext,
      outPath,
      ...signature,
    }
    setContentIndex(relPath, outPath, ext)
    result.changedPages += 1
    await writeManifest(config.outDir, manifest)
  }

  type HandleAssetChangeInput = {
    relPath: string
    ext: string
    signature: FileSignature
    assetEntry: AssetManifestEntry | undefined
    result: IncrementalBuildResult
  }

  const handleAssetChange = async (input: HandleAssetChangeInput) => {
    const { relPath, ext, signature, assetEntry, result } = input
    if (signatureEqual(assetEntry, signature)) {
      return
    }
    const assetFile = toAssetFile(config.contentDir, relPath, ext)
    const assetCopy = await copyStaticAsset(config.outDir, assetFile)
    if (!assetCopy.copied) {
      return
    }
    manifest.assets[relPath] = {
      relPath,
      ext,
      outPath: assetCopy.outPath,
      ...signature,
    }
    result.changedAssets += 1
    await writeManifest(config.outDir, manifest)
  }

  return { buildAll, applyChange, renderIfDirtyByOutPath, renderByUrlPath }
}

function mergeHooks(
  base: BuildHooks | undefined,
  next: BuildHooks,
): BuildHooks {
  if (!base) return next
  return {
    ...base,
    onConfigResolved: async (ctx) => {
      await base.onConfigResolved?.(ctx)
      await next.onConfigResolved?.(ctx)
    },
    onContentDiscovered: async (ctx, files) => {
      await base.onContentDiscovered?.(ctx, files)
      await next.onContentDiscovered?.(ctx, files)
    },
    onNavigationBuilt: async (ctx, tree) => {
      await base.onNavigationBuilt?.(ctx, tree)
      await next.onNavigationBuilt?.(ctx, tree)
    },
    onPageStart: async (ctx, file) => {
      await base.onPageStart?.(ctx, file)
      await next.onPageStart?.(ctx, file)
    },
    onPageRendered: async (ctx, page) => {
      await base.onPageRendered?.(ctx, page)
      await next.onPageRendered?.(ctx, page)
    },
    onPageWritten: async (ctx, page) => {
      await base.onPageWritten?.(ctx, page)
      await next.onPageWritten?.(ctx, page)
    },
    onStylesWritten: async (ctx, result) => {
      await base.onStylesWritten?.(ctx, result)
      await next.onStylesWritten?.(ctx, result)
    },
    onBuildComplete: async (ctx, result) => {
      await base.onBuildComplete?.(ctx, result)
      await next.onBuildComplete?.(ctx, result)
    },
  }
}

function toContentFile(
  contentDir: string,
  relPath: string,
  ext: string,
): ContentFile {
  return {
    absPath: path.join(contentDir, relPath),
    relPath,
    ext,
  }
}

function toAssetFile(
  contentDir: string,
  relPath: string,
  ext: string,
): StaticAssetFile {
  return {
    absPath: path.join(contentDir, relPath),
    relPath,
    ext,
  }
}

async function removeFile(filePath: string) {
  try {
    await fs.rm(filePath, { force: true })
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === 'ENOENT') return
    throw error
  }
}

async function buildManifest(
  config: ReturnType<typeof resolveSiteConfig>,
  contentFiles: ContentFile[],
  assetFiles: StaticAssetFile[],
  stylesResult: StylesManifestEntry | undefined,
): Promise<BuildManifest> {
  const content: Record<string, ContentManifestEntry> = {}
  for (const file of contentFiles) {
    const signature = await readSignature(file.absPath)
    if (!signature) continue
    const outPath = resolveOutPath(config.outDir, file)
    content[file.relPath] = {
      relPath: file.relPath,
      ext: file.ext,
      outPath,
      ...signature,
    }
  }

  const assets: Record<string, AssetManifestEntry> = {}
  for (const asset of assetFiles) {
    const signature = await readSignature(asset.absPath)
    if (!signature) continue
    const outPath = resolveStaticOutPath(config.outDir, asset)
    assets[asset.relPath] = {
      relPath: asset.relPath,
      ext: asset.ext,
      outPath,
      ...signature,
    }
  }

  const styles = stylesResult ?? (await computeStylesSignature(config))

  return {
    version: 1,
    generatedAt: Date.now(),
    config: manifestConfigFromSiteConfig(config),
    content,
    assets,
    styles,
  }
}

async function computeStylesSignature(
  config: ReturnType<typeof resolveSiteConfig>,
): Promise<StylesManifestEntry> {
  const orderedThemes = orderThemes(config.styleThemes)
  styleBuilder.ensureThemes(orderedThemes)
  const hash = crypto.createHash('sha256')
  const outputs: string[] = []

  for (const theme of orderedThemes) {
    const cssName = resolveThemeFileName(config.styleFileName, theme)
    const outPath = path.join(config.outDir, cssName)
    outputs.push(outPath)
    try {
      const css = await fs.readFile(outPath, 'utf8')
      hash.update(css)
      hash.update('\0')
    } catch (error) {
      const err = error as NodeJS.ErrnoException
      if (err.code === 'ENOENT') continue
      throw error
    }
  }

  return { signature: hash.digest('hex'), outputs }
}

function countByExt(files: Array<{ ext: string }>): BuildCountSummary {
  const byExt: Record<string, number> = {}
  for (const file of files) {
    const ext = file.ext || ''
    byExt[ext] = (byExt[ext] ?? 0) + 1
  }
  return { total: files.length, byExt }
}
