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
  resolveFolderKey,
  resolveNavigationConfig,
} from '../navigation/navigation'
import { initBuiltinComponents } from '../regor/initBuiltinComponents'
import { styleBuilder } from '../style/styles'
import { setThemeOptions } from '../style/themeOptions'
import { orderThemes, resolveThemeFileName } from '../style/themes'
import { copyStaticAsset, resolveStaticOutPath } from './assets'
import {
  type AssetManifestEntry,
  type BuildManifest,
  type ContentManifestEntry,
  createEmptyManifest,
  isCompatibleManifest,
  manifestConfigFromSiteConfig,
  readManifest,
  readSignature,
  signatureEqual,
  type StylesManifestEntry,
  writeManifest,
} from './manifest'
import { resolveOutPath } from './out-path'
import { buildPage } from './page'
import {
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
}

export async function createIncrementalBuilder(
  input: BuildInput = {},
): Promise<IncrementalBuilder> {
  const config = resolveSiteConfig(input)
  setThemeOptions(config.theme)
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

    const nextManifest = await buildManifest(
      config,
      contentFiles,
      assetFiles,
      stylesResult,
    )
    manifest = nextManifest
    await writeManifest(config.outDir, nextManifest)

    log.info('build completed', { outDir: config.outDir })
    return result
  }

  const rebuildNavigationForChange = async (
    relPath: string,
    result: IncrementalBuildResult,
  ) => {
    const contentFiles = await discoverContent(config.contentDir)
    navigation = await buildNavigation(
      config.contentDir,
      contentFiles,
      navigationConfig,
    )
    context.navigation = navigation

    const affectedFolders = collectAffectedFolders(
      relPath,
      navigationConfig.maxDepth,
    )
    const affectedFiles = contentFiles.filter((file) =>
      affectedFolders.has(resolveFolderKey(file.relPath)),
    )
    const affectedRelPaths = new Set(affectedFiles.map((file) => file.relPath))

    for (const file of affectedFiles) {
      await buildPage(context, file)
      const signature = await readSignature(file.absPath)
      if (!signature) continue
      const outPath = resolveOutPath(config.outDir, file)
      manifest.content[file.relPath] = {
        relPath: file.relPath,
        ext: file.ext,
        outPath,
        ...signature,
      }
      result.changedPages += 1
    }

    const deletions = Object.keys(manifest.content).filter((key) => {
      if (affectedRelPaths.has(key)) return false
      const folder = resolveFolderKey(key)
      return affectedFolders.has(folder)
    })
    for (const key of deletions) {
      const entry = manifest.content[key]
      if (entry) {
        await removeFile(entry.outPath)
        delete manifest.content[key]
        result.deletedPages += 1
      }
    }
  }

  const applyChange = async (filePath: string) => {
    const relPath = path.relative(config.contentDir, filePath)
    const reason = `content change: ${filePath}`
    const result: IncrementalBuildResult = {
      fullRebuild: false,
      changedPages: 0,
      changedAssets: 0,
      deletedPages: 0,
      deletedAssets: 0,
      reason,
    }

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
      if (contentEntry && navigationConfig.mode !== 'none') {
        await rebuildNavigationForChange(relPath, result)
        await writeManifest(config.outDir, manifest)
        return result
      }
      if (contentEntry) {
        await removeFile(contentEntry.outPath)
        delete manifest.content[relPath]
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
      return result
    }

    const treatedAsContent = contentEntry || isContentFile(relPath, ext)
    if (treatedAsContent) {
      if (signatureEqual(contentEntry, signature)) {
        return result
      }
      if (navigationConfig.mode !== 'none') {
        await rebuildNavigationForChange(relPath, result)
        await writeManifest(config.outDir, manifest)
        return result
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
      result.changedPages += 1
      await writeManifest(config.outDir, manifest)
      return result
    }

    if (signatureEqual(assetEntry, signature)) {
      return result
    }

    const assetFile = toAssetFile(config.contentDir, relPath, ext)
    const assetCopy = await copyStaticAsset(config.outDir, assetFile)
    if (assetCopy.copied) {
      manifest.assets[relPath] = {
        relPath,
        ext,
        outPath: assetCopy.outPath,
        ...signature,
      }
      result.changedAssets += 1
      await writeManifest(config.outDir, manifest)
    }
    return result
  }

  return { buildAll, applyChange }
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

function collectAffectedFolders(relPath: string, maxDepth: number) {
  const folder = resolveFolderKey(relPath)
  const result = new Set<string>()
  result.add(folder)
  if (!folder) return result
  const segments = folder.split('/')
  const limit = Math.max(1, Math.floor(maxDepth))
  for (let depth = 1; depth <= limit - 1; depth += 1) {
    const slice = segments.slice(0, segments.length - depth)
    if (slice.length === 0) {
      result.add('')
    } else {
      result.add(slice.join('/'))
    }
  }
  return result
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
