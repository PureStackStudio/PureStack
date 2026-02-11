import path from 'node:path'

import { getLogger, type Logger } from 'logpot'

import { resolveSiteConfig, type SiteConfig } from '../config/config'
import {
  discoverContent,
  isContentFile,
  isSiteConfigFile,
} from '../discover/content'
import {
  buildNavigation,
  type NavigationConfig,
  resolveNavigationConfig,
} from '../navigation/navigation'
import { initBuiltinComponents } from '../regor/initBuiltinComponents'
import { themes } from '../style/themeOptions'
import { copyStaticAsset, copyStaticAssets } from './assets'
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
  type BuildManifest,
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
import {
  type BuildContext,
  buildPage,
  renderPageFromFile,
  writePage,
} from './page'
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
  const runtime = await createIncrementalRuntime(input)
  return runtime.toBuilder()
}

interface IncrementalRuntimeOptions {
  input: BuildInput
  config: SiteConfig
  log: Logger
  navigationConfig: NavigationConfig
  context: BuildContext
  manifest: BuildManifest
}

async function createIncrementalRuntime(
  input: BuildInput,
): Promise<IncrementalRuntime> {
  const config = resolveSiteConfig(input)
  const mdx = await resolveMdxBuildOptions(input.mdx)
  themes.setOptions(config.theme)
  initBuiltinComponents()
  const log = getLogger()
  const navigationConfig = resolveNavigationConfig(
    input.navigation ?? config.navigation,
  )
  const discovered = await discoverContent(config.contentDir)
  const navigation = await buildNavigation(
    config.contentDir,
    discovered,
    navigationConfig,
  )
  const context: BuildContext = {
    config,
    components: input.components,
    templates: input.templates,
    navigation,
    mdx,
  }

  const existing = await readManifest(config.outDir)
  const manifest =
    existing && isCompatibleManifest(existing, config)
      ? existing
      : createEmptyManifest(config)

  return new IncrementalRuntime({
    input,
    config,
    log,
    navigationConfig,
    context,
    manifest,
  })
}

type HandleMissingSignatureChangeInput = {
  relPath: string
  ext: string
  result: IncrementalBuildResult
  contentEntry: ContentManifestEntry | undefined
  assetEntry: AssetManifestEntry | undefined
}

type HandleContentChangeInput = {
  relPath: string
  ext: string
  signature: FileSignature
  contentEntry: ContentManifestEntry | undefined
  result: IncrementalBuildResult
}

type HandleAssetChangeInput = {
  relPath: string
  ext: string
  signature: FileSignature
  assetEntry: AssetManifestEntry | undefined
  result: IncrementalBuildResult
}

class IncrementalRuntime {
  private readonly dirtyPages = new Set<string>()
  private readonly renderInFlight = new Map<string, Promise<boolean>>()
  private readonly contentIndex: ManifestContentIndex

  constructor(private readonly options: IncrementalRuntimeOptions) {
    this.contentIndex = new ManifestContentIndex(options.config.contentDir)
    this.contentIndex.rebuildFromManifest(options.manifest)
  }

  toBuilder(): IncrementalBuilder {
    return {
      buildAll: this.buildAll,
      applyChange: this.applyChange,
      renderIfDirtyByOutPath: this.renderIfDirtyByOutPath,
      renderByUrlPath: this.renderByUrlPath,
    }
  }

  private get input() {
    return this.options.input
  }

  private get config() {
    return this.options.config
  }

  private get context() {
    return this.options.context
  }

  private get log() {
    return this.options.log
  }

  private get navigationConfig() {
    return this.options.navigationConfig
  }

  private get manifest() {
    return this.options.manifest
  }

  private set manifest(value: BuildManifest) {
    this.options.manifest = value
  }

  buildAll = async (reason: string): Promise<BuildResult> => {
    const buildStartMs = Date.now()
    const hooks = this.input.hooks ?? {}

    this.log.info('build started', { reason })
    await hooks.onConfigResolved?.(this.context)
    await prepareOutDir(this.config.outDir, { clean: this.input.cleanOutDir })
    const copiedAssets = await copyStaticAssets(
      this.config.contentDir,
      this.config.outDir,
    )

    const contentFiles = await discoverContent(this.config.contentDir)
    await hooks.onContentDiscovered?.(this.context, contentFiles)
    this.context.navigation = await buildNavigation(
      this.config.contentDir,
      contentFiles,
      this.navigationConfig,
    )
    await hooks.onNavigationBuilt?.(this.context, this.context.navigation)

    const concurrency = normalizeConcurrency(this.input.concurrency)
    let pages = 0
    await runWithConcurrency(contentFiles, concurrency, async (file) => {
      await hooks.onPageStart?.(this.context, file)
      const page = await renderPageFromFile(this.context, file)
      await hooks.onPageRendered?.(this.context, page)
      await writePage(page)
      await hooks.onPageWritten?.(this.context, page)
      pages += 1
    })

    const styleResult = await writeStyles(
      this.config.outDir,
      this.config.styleFileName,
      this.config.styleThemes,
    )
    await hooks.onStylesWritten?.(this.context, styleResult)

    const assetFiles = copiedAssets.files
    const finalResult = {
      outDir: this.config.outDir,
      pages,
      content: countByExt(contentFiles),
      assets: countByExt(assetFiles),
    }

    const nextManifest = await buildManifest(
      this.config,
      contentFiles,
      assetFiles,
      { signature: styleResult.signature, outputs: styleResult.outputs },
    )
    this.manifest = nextManifest
    await writeManifest(this.config.outDir, nextManifest)
    this.contentIndex.rebuildFromManifest(this.manifest)
    this.dirtyPages.clear()
    await hooks.onBuildComplete?.(this.context, finalResult)

    this.log.info('build completed', {
      ...finalResult,
      totalDurationMs: Date.now() - buildStartMs,
    })
    return finalResult
  }

  applyChange = async (filePath: string): Promise<IncrementalBuildResult> => {
    const relPath = path.relative(this.config.contentDir, filePath)
    const reason = `content change: ${filePath}`
    const result = this.createIncrementalResult(reason)

    if (isOutsideContentRoot(relPath)) return result
    if (isSiteConfigFile(relPath)) {
      result.fullRebuild = true
      return result
    }

    const ext = path.extname(relPath).toLowerCase()
    const signature = await readSignature(filePath)
    const contentEntry = this.manifest.content[relPath]
    const assetEntry = this.manifest.assets[relPath]

    if (!signature) {
      await this.handleMissingSignatureChange({
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
      await this.handleContentChange({
        relPath,
        ext,
        signature,
        contentEntry,
        result,
      })
      return result
    }

    await this.handleAssetChange({
      relPath,
      ext,
      signature,
      assetEntry,
      result,
    })
    return result
  }

  renderIfDirtyByOutPath = async (outPath: string): Promise<boolean> => {
    const relPath = this.contentIndex.getRelPathByOutPath(outPath)
    if (!relPath) return false
    return this.renderPageByRelPath(relPath, true)
  }

  renderByUrlPath = async (urlPath: string): Promise<boolean> => {
    const normalized = normalizeUrlPath(urlPath)
    let relPath = this.contentIndex.getRelPathByUrlPath(normalized)
    if (!relPath) {
      const contentFiles = await discoverContent(this.config.contentDir)
      this.contentIndex.updateUrlPathMapFromFiles(contentFiles)
      relPath = this.contentIndex.getRelPathByUrlPath(normalized)
      if (!relPath) return false
    }
    return this.renderPageByRelPath(relPath, false)
  }

  private async rebuildNavigationForChange(
    relPath: string,
    ext: string,
    result: IncrementalBuildResult,
    signature: FileSignature | null,
  ) {
    const contentFiles = await discoverContent(this.config.contentDir)
    this.context.navigation = await buildNavigation(
      this.config.contentDir,
      contentFiles,
      this.navigationConfig,
    )
    this.dirtyPages.clear()
    for (const file of contentFiles) {
      this.dirtyPages.add(file.relPath)
    }

    const contentEntry = this.manifest.content[relPath]
    if (!signature) {
      if (contentEntry) {
        await removeFile(contentEntry.outPath)
        delete this.manifest.content[relPath]
        this.contentIndex.remove(relPath)
        result.deletedPages += 1
      }
      return
    }

    const contentFile =
      contentFiles.find((file) => file.relPath === relPath) ??
      toContentFile(this.config.contentDir, relPath, ext)

    await buildPage(this.context, contentFile)
    const outPath = resolveOutPath(this.config.outDir, contentFile)
    this.manifest.content[relPath] = {
      relPath,
      ext: contentFile.ext,
      outPath,
      ...signature,
    }
    this.contentIndex.set(relPath, outPath, contentFile.ext)
    result.changedPages += 1
    this.dirtyPages.delete(relPath)
  }

  private async renderPageByRelPath(
    relPath: string,
    onlyIfDirty: boolean,
  ): Promise<boolean> {
    if (onlyIfDirty && !this.dirtyPages.has(relPath)) return false
    const inFlight = this.renderInFlight.get(relPath)
    if (inFlight) return inFlight

    const task = (async () => {
      try {
        const absPath = path.join(this.config.contentDir, relPath)
        const signature = await readSignature(absPath)
        if (!signature) {
          const entry = this.manifest.content[relPath]
          if (entry) {
            await removeFile(entry.outPath)
            delete this.manifest.content[relPath]
            this.contentIndex.remove(relPath)
            await writeManifest(this.config.outDir, this.manifest)
          }
          this.dirtyPages.delete(relPath)
          return false
        }

        const entry = this.manifest.content[relPath]
        const ext = entry?.ext ?? path.extname(relPath)
        const contentFile = toContentFile(this.config.contentDir, relPath, ext)
        await buildPage(this.context, contentFile)
        const nextOutPath = resolveOutPath(this.config.outDir, contentFile)
        this.manifest.content[relPath] = {
          relPath,
          ext: contentFile.ext,
          outPath: nextOutPath,
          ...signature,
        }
        this.contentIndex.set(relPath, nextOutPath, contentFile.ext)
        this.dirtyPages.delete(relPath)
        await writeManifest(this.config.outDir, this.manifest)
        return true
      } catch (error) {
        this.log.error('incremental render failed', {
          relPath,
          error: error instanceof Error ? error.message : String(error),
        })
        return false
      } finally {
        this.renderInFlight.delete(relPath)
      }
    })()

    this.renderInFlight.set(relPath, task)
    return task
  }

  private createIncrementalResult(reason: string): IncrementalBuildResult {
    return {
      fullRebuild: false,
      changedPages: 0,
      changedAssets: 0,
      deletedPages: 0,
      deletedAssets: 0,
      reason,
    }
  }

  private async handleMissingSignatureChange(
    input: HandleMissingSignatureChangeInput,
  ) {
    const { relPath, ext, result, contentEntry, assetEntry } = input
    if (contentEntry && this.navigationConfig.mode !== 'none') {
      await this.rebuildNavigationForChange(relPath, ext, result, null)
      await writeManifest(this.config.outDir, this.manifest)
      return
    }
    if (contentEntry) {
      await removeFile(contentEntry.outPath)
      delete this.manifest.content[relPath]
      this.contentIndex.remove(relPath)
      result.deletedPages += 1
    }
    if (assetEntry) {
      await removeFile(assetEntry.outPath)
      delete this.manifest.assets[relPath]
      result.deletedAssets += 1
    }
    if (contentEntry || assetEntry) {
      await writeManifest(this.config.outDir, this.manifest)
    }
  }

  private async handleContentChange(input: HandleContentChangeInput) {
    const { relPath, ext, signature, contentEntry, result } = input
    if (signatureEqual(contentEntry, signature)) return

    if (this.navigationConfig.mode !== 'none') {
      await this.rebuildNavigationForChange(relPath, ext, result, signature)
      await writeManifest(this.config.outDir, this.manifest)
      return
    }

    const contentFile = toContentFile(this.config.contentDir, relPath, ext)
    await buildPage(this.context, contentFile)
    const outPath = resolveOutPath(this.config.outDir, contentFile)
    this.manifest.content[relPath] = {
      relPath,
      ext,
      outPath,
      ...signature,
    }
    this.contentIndex.set(relPath, outPath, ext)
    result.changedPages += 1
    await writeManifest(this.config.outDir, this.manifest)
  }

  private async handleAssetChange(input: HandleAssetChangeInput) {
    const { relPath, ext, signature, assetEntry, result } = input
    if (signatureEqual(assetEntry, signature)) return

    const assetFile = toAssetFile(this.config.contentDir, relPath, ext)
    const assetCopy = await copyStaticAsset(this.config.outDir, assetFile)
    if (!assetCopy.copied) return

    this.manifest.assets[relPath] = {
      relPath,
      ext,
      outPath: assetCopy.outPath,
      ...signature,
    }
    result.changedAssets += 1
    await writeManifest(this.config.outDir, this.manifest)
  }
}
