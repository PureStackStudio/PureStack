import path from 'node:path'

import { getLogger, type Logger } from 'logpot'

import { resolveSiteConfig, type SiteConfig } from '../config/config'
import {
  type ContentFile,
  discoverContent,
  isContentFile,
  isSiteConfigFile,
  type StaticAssetFile,
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
import type { BuildHooks, BuildInput, BuildResult } from './site'
import { writeStyles, type WriteStylesResult } from './styles'

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

type BuildPreparationResult = {
  contentFiles: ContentFile[]
  assetFiles: StaticAssetFile[]
}

type BuildSummaryInput = {
  contentFiles: ContentFile[]
  assetFiles: StaticAssetFile[]
  pages: number
}

type FinalizeBuildInput = BuildSummaryInput & {
  styleResult: WriteStylesResult
  hooks: BuildHooks
}

type ChangeState = {
  relPath: string
  ext: string
  signature: FileSignature | null
  result: IncrementalBuildResult
  contentEntry: ContentManifestEntry | undefined
  assetEntry: AssetManifestEntry | undefined
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
    const hooks = this.resolveBuildHooks()

    this.log.info('build started', { reason })
    const prepared = await this.prepareBuild(hooks)
    const pages = await this.renderAllPages(prepared.contentFiles, hooks)
    const styleResult = await this.writeStylesWithHooks(hooks)
    const finalResult = await this.finalizeBuild({
      ...prepared,
      pages,
      styleResult,
      hooks,
    })

    this.log.info('build completed', {
      ...finalResult,
      totalDurationMs: Date.now() - buildStartMs,
    })
    return finalResult
  }

  private resolveBuildHooks(): BuildHooks {
    return this.input.hooks ?? {}
  }

  private async prepareBuild(
    hooks: BuildHooks,
  ): Promise<BuildPreparationResult> {
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
    return { contentFiles, assetFiles: copiedAssets.files }
  }

  private async renderAllPages(
    contentFiles: ContentFile[],
    hooks: BuildHooks,
  ): Promise<number> {
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
    return pages
  }

  private async writeStylesWithHooks(hooks: BuildHooks) {
    const styleResult = await writeStyles(
      this.config.outDir,
      this.config.styleFileName,
      this.config.styleThemes,
    )
    await hooks.onStylesWritten?.(this.context, styleResult)
    return styleResult
  }

  private createBuildSummary(input: BuildSummaryInput): BuildResult {
    const { contentFiles, assetFiles, pages } = input
    return {
      outDir: this.config.outDir,
      pages,
      content: countByExt(contentFiles),
      assets: countByExt(assetFiles),
    }
  }

  private async finalizeBuild(input: FinalizeBuildInput): Promise<BuildResult> {
    const { contentFiles, assetFiles, styleResult, hooks, pages } = input
    const finalResult = this.createBuildSummary({
      contentFiles,
      assetFiles,
      pages,
    })

    this.manifest = await buildManifest(this.config, contentFiles, assetFiles, {
      signature: styleResult.signature,
      outputs: styleResult.outputs,
    })
    await writeManifest(this.config.outDir, this.manifest)
    this.contentIndex.rebuildFromManifest(this.manifest)
    this.dirtyPages.clear()
    await hooks.onBuildComplete?.(this.context, finalResult)
    return finalResult
  }

  applyChange = async (filePath: string): Promise<IncrementalBuildResult> => {
    const relPath = path.relative(this.config.contentDir, filePath)
    const result = this.createIncrementalResult(`content change: ${filePath}`)
    if (isOutsideContentRoot(relPath)) return result
    if (isSiteConfigFile(relPath)) {
      result.fullRebuild = true
      return result
    }

    const state = await this.readChangeState(filePath, relPath, result)
    await this.applyChangeState(state)
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
    if (!signature) {
      await this.refreshNavigationAndMarkDirty()
      await this.removeContentEntryForDeletedSource(relPath, result)
      return
    }

    const contentFiles = await this.refreshNavigationAndMarkDirty()
    await this.rebuildNavigatedContent(
      contentFiles,
      relPath,
      ext,
      signature,
      result,
    )
  }

  private async renderPageByRelPath(
    relPath: string,
    onlyIfDirty: boolean,
  ): Promise<boolean> {
    if (this.shouldSkipDirtyRender(relPath, onlyIfDirty)) return false
    const inFlight = this.renderInFlight.get(relPath)
    if (inFlight) return inFlight

    const task = this.createRenderTask(relPath)
    this.renderInFlight.set(relPath, task)
    return task
  }

  private shouldSkipDirtyRender(relPath: string, onlyIfDirty: boolean) {
    return onlyIfDirty && !this.dirtyPages.has(relPath)
  }

  private createRenderTask(relPath: string): Promise<boolean> {
    return (async () => {
      try {
        return await this.runRenderByRelPath(relPath)
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
  }

  private async runRenderByRelPath(relPath: string): Promise<boolean> {
    const signature = await this.readRelPathSignature(relPath)
    if (!signature) {
      return this.handleMissingRelPathSource(relPath)
    }
    return this.renderAndPersistRelPath(relPath, signature)
  }

  private async readRelPathSignature(relPath: string) {
    const absPath = path.join(this.config.contentDir, relPath)
    return readSignature(absPath)
  }

  private async handleMissingRelPathSource(relPath: string): Promise<boolean> {
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

  private async renderAndPersistRelPath(
    relPath: string,
    signature: FileSignature,
  ): Promise<boolean> {
    const ext = this.resolveContentExt(relPath)
    const contentFile = toContentFile(this.config.contentDir, relPath, ext)
    await buildPage(this.context, contentFile)
    this.upsertContentManifestEntry(relPath, contentFile.ext, signature)
    this.dirtyPages.delete(relPath)
    await writeManifest(this.config.outDir, this.manifest)
    return true
  }

  private resolveContentExt(relPath: string): string {
    return this.manifest.content[relPath]?.ext ?? path.extname(relPath)
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

  private async readChangeState(
    filePath: string,
    relPath: string,
    result: IncrementalBuildResult,
  ): Promise<ChangeState> {
    const ext = path.extname(relPath).toLowerCase()
    const signature = await readSignature(filePath)
    return {
      relPath,
      ext,
      signature,
      result,
      contentEntry: this.manifest.content[relPath],
      assetEntry: this.manifest.assets[relPath],
    }
  }

  private async applyChangeState(state: ChangeState): Promise<void> {
    if (!state.signature) {
      await this.handleMissingSignatureChange(state)
      return
    }
    if (this.isContentChange(state)) {
      await this.handleContentChange({
        relPath: state.relPath,
        ext: state.ext,
        signature: state.signature,
        contentEntry: state.contentEntry,
        result: state.result,
      })
      return
    }
    await this.handleAssetChange({
      relPath: state.relPath,
      ext: state.ext,
      signature: state.signature,
      assetEntry: state.assetEntry,
      result: state.result,
    })
  }

  private isContentChange(state: ChangeState): boolean {
    return (
      Boolean(state.contentEntry) || isContentFile(state.relPath, state.ext)
    )
  }

  private async refreshNavigationAndMarkDirty(): Promise<ContentFile[]> {
    const contentFiles = await discoverContent(this.config.contentDir)
    this.context.navigation = await buildNavigation(
      this.config.contentDir,
      contentFiles,
      this.navigationConfig,
    )
    this.markAllPagesDirty(contentFiles)
    return contentFiles
  }

  private markAllPagesDirty(contentFiles: ContentFile[]) {
    this.dirtyPages.clear()
    for (const file of contentFiles) {
      this.dirtyPages.add(file.relPath)
    }
  }

  private async removeContentEntryForDeletedSource(
    relPath: string,
    result: IncrementalBuildResult,
  ) {
    const contentEntry = this.manifest.content[relPath]
    if (!contentEntry) return
    await removeFile(contentEntry.outPath)
    delete this.manifest.content[relPath]
    this.contentIndex.remove(relPath)
    result.deletedPages += 1
  }

  private async rebuildNavigatedContent(
    contentFiles: ContentFile[],
    relPath: string,
    ext: string,
    signature: FileSignature,
    result: IncrementalBuildResult,
  ) {
    const contentFile =
      contentFiles.find((file) => file.relPath === relPath) ??
      toContentFile(this.config.contentDir, relPath, ext)
    await buildPage(this.context, contentFile)
    this.upsertContentManifestEntry(relPath, contentFile.ext, signature)
    result.changedPages += 1
    this.dirtyPages.delete(relPath)
  }

  private upsertContentManifestEntry(
    relPath: string,
    ext: string,
    signature: FileSignature,
  ) {
    const contentFile = toContentFile(this.config.contentDir, relPath, ext)
    const outPath = resolveOutPath(this.config.outDir, contentFile)
    this.manifest.content[relPath] = {
      relPath,
      ext,
      outPath,
      ...signature,
    }
    this.contentIndex.set(relPath, outPath, ext)
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
