import path from 'node:path'

import { getLogger } from 'logpot'

import { resolveSiteConfig } from '../config/config'
import {
  discoverContent,
  isContentFile,
  isSiteConfigFile,
} from '../discover/content'
import {
  buildNavigation,
  type NavigationTree,
  resolveNavigationConfig,
} from '../navigation/navigation'
import { initBuiltinComponents } from '../regor/initBuiltinComponents'
import { themes } from '../style/themeOptions'
import {
  copyStaticAsset,
  copyStaticAssets,
} from './assets'
import {
  buildManifest,
  countByExt,
  isOutsideContentRoot,
  ManifestContentIndex,
  normalizeConcurrency,
  normalizeUrlPath,
  removeFile,
  resolveMdxBuildOptions,
  runWithConcurrency,
  toAssetFile,
  toContentFile,
} from './incremental-support'
import { prepareOutDir } from './io'
import {
  type AssetManifestEntry,
  type ContentManifestEntry,
  createEmptyManifest,
  type FileSignature,
  isCompatibleManifest,
  readManifest,
  readSignature,
  signatureEqual,
  writeManifest,
} from './manifest'
import { resolveOutPath } from './out-path'
import { buildPage, renderPageFromFile, writePage } from './page'
import type { BuildInput, BuildResult } from './site'
import { writeStyles } from './styles'

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
  const mdx = await resolveMdxBuildOptions(input.mdx)
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
    mdx,
  }
  const existing = await readManifest(config.outDir)
  let manifest =
    existing && isCompatibleManifest(existing, config)
      ? existing
      : createEmptyManifest(config)
  const dirtyPages = new Set<string>()
  const renderInFlight = new Map<string, Promise<boolean>>()
  const contentIndex = new ManifestContentIndex(config.contentDir)
  contentIndex.rebuildFromManifest(manifest)

  const buildAll = async (reason: string) => {
    const buildStartMs = Date.now()
    const hooks = input.hooks ?? {}

    log.info('build started', { reason })
    await hooks.onConfigResolved?.(context)
    await prepareOutDir(config.outDir, { clean: input.cleanOutDir })
    const copiedAssets = await copyStaticAssets(config.contentDir, config.outDir)

    const contentFiles = await discoverContent(config.contentDir)
    await hooks.onContentDiscovered?.(context, contentFiles)
    navigation = await buildNavigation(
      config.contentDir,
      contentFiles,
      navigationConfig,
    )
    context.navigation = navigation
    await hooks.onNavigationBuilt?.(context, navigation)

    const concurrency = normalizeConcurrency(input.concurrency)
    let pages = 0
    await runWithConcurrency(contentFiles, concurrency, async (file) => {
      await hooks.onPageStart?.(context, file)
      const page = await renderPageFromFile(context, file)
      await hooks.onPageRendered?.(context, page)
      await writePage(page)
      await hooks.onPageWritten?.(context, page)
      pages += 1
    })

    const styleResult = await writeStyles(
      config.outDir,
      config.styleFileName,
      config.styleThemes,
    )
    await hooks.onStylesWritten?.(context, styleResult)

    const result = { outDir: config.outDir, pages }
    const assetFiles = copiedAssets.files

    const contentCounts = countByExt(contentFiles)
    const assetCounts = countByExt(assetFiles)
    const finalResult = {
      ...result,
      content: contentCounts,
      assets: assetCounts,
    }

    const nextManifest = await buildManifest(
      config,
      contentFiles,
      assetFiles,
      { signature: styleResult.signature, outputs: styleResult.outputs },
    )
    manifest = nextManifest
    await writeManifest(config.outDir, nextManifest)
    contentIndex.rebuildFromManifest(manifest)
    dirtyPages.clear()
    await hooks.onBuildComplete?.(context, finalResult)

    log.info('build completed', {
      ...finalResult,
      totalDurationMs: Date.now() - buildStartMs,
    })
    return finalResult
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
        contentIndex.remove(relPath)
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
    contentIndex.set(relPath, outPath, contentFile.ext)
    result.changedPages += 1
    dirtyPages.delete(relPath)
  }

  const applyChange = async (filePath: string) => {
    const relPath = path.relative(config.contentDir, filePath)
    const reason = `content change: ${filePath}`
    const result = createIncrementalResult(reason)

    if (isOutsideContentRoot(relPath)) {
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
            contentIndex.remove(relPath)
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
        contentIndex.set(relPath, nextOutPath, contentFile.ext)
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
    const relPath = contentIndex.getRelPathByOutPath(outPath)
    if (!relPath) return false
    return renderPageByRelPath(relPath, true)
  }

  const renderByUrlPath = async (urlPath: string) => {
    const normalized = normalizeUrlPath(urlPath)
    let relPath = contentIndex.getRelPathByUrlPath(normalized)
    if (!relPath) {
      const contentFiles = await discoverContent(config.contentDir)
      contentIndex.updateUrlPathMapFromFiles(contentFiles)
      relPath = contentIndex.getRelPathByUrlPath(normalized)
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
      contentIndex.remove(relPath)
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
    contentIndex.set(relPath, outPath, ext)
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
