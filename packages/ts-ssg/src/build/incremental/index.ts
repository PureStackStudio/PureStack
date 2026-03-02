import path from 'node:path'

import { getLogger, type Logger } from 'logpot'

import { resolveSiteConfig, type SiteConfig } from '../../config/config'
import {
  type ContentFile,
  discoverContent,
  isContentFile,
  isDefaultFooterFile,
  isDefaultHeaderFile,
  isSiteConfigFile,
  type StaticAssetFile,
} from '../../discover/content'
import { buildNavigation } from '../../navigation/navigation'
import { initBuiltinComponents } from '../../regor/initBuiltinComponents'
import { themes } from '../../style/themeOptions'
import { copyStaticAsset, copyStaticAssets } from '../assets'
import { prepareOutDir } from '../io'
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
} from '../manifest'
import { resolveRouteInfo } from '../out-path'
import { type BuildContext, buildPage, resolveFooterHtmlByDirectory, resolveHeaderHtmlByDirectory } from '../page'
import { buildPagefindIndex } from '../pagefind'
import type { BuildHooks, BuildInput, BuildResult } from '../site'
import { writeSitemap } from '../sitemap'
import { type WriteStylesResult, writeStyles } from '../styles'
import { IncrementalContentState } from './content-state'
import { ScriptEntrypointManager } from './script-entry-manager'
import {
  buildManifest,
  countByExt,
  isOutsideContentRoot,
  removeFile,
  resolveMdxBuildOptions,
  toAssetFile,
  toContentFile,
} from './support'
import type { IncrementalBuildResult, IncrementalBuilder } from './types'
export type { IncrementalBuildResult, IncrementalBuilder } from './types'

export async function createIncrementalBuilder(
  input: BuildInput = {},
): Promise<IncrementalBuilder> {
  const runtime = await createIncrementalRuntime(input)
  return runtime.toBuilder()
}

interface IncrementalRuntimeOptions {
  config: SiteConfig
  hooks: BuildHooks
  cleanOutDir: boolean
  log: Logger
  context: BuildContext
  manifest: BuildManifest
}

async function createIncrementalRuntime(
  input: BuildInput,
): Promise<IncrementalRuntime> {
  const configInput = input.siteConfig ?? {}
  const buildOptions = input.options ?? {}
  const config = resolveSiteConfig(configInput)
  const hooks = buildOptions.hooks ?? {}
  const cleanOutDir = buildOptions.cleanOutDir === true
  const mdx = await resolveMdxBuildOptions(config.mdx)
  themes.setOptions(config.style.theme)
  initBuiltinComponents({ includeShikiStyles: isShikiEnabled(config.mdx) })
  const log = getLogger()
  const discovered = await discoverContent(config.contentDir)
  const navigation = await buildNavigation(
    config.contentDir,
    discovered,
    config.navigation,
  )
  const context: BuildContext = {
    config,
    writeErrorPages: buildOptions.writeErrorPages === true,
    components: buildOptions.components,
    templates: buildOptions.templates,
    navigation,
    mdx,
  }
  context.headerHtmlByDir = await resolveHeaderHtmlByDirectory(config, mdx)
  context.footerHtmlByDir = await resolveFooterHtmlByDirectory(config, mdx)

  const existing = await readManifest(config.outDir)
  const manifest =
    existing && isCompatibleManifest(existing, config)
      ? existing
      : createEmptyManifest(config)

  return new IncrementalRuntime({
    config,
    hooks,
    cleanOutDir,
    log,
    context,
    manifest,
  })
}

function isShikiEnabled(mdx: SiteConfig['mdx'] | undefined): boolean {
  return mdx?.disableHighlighter !== true && mdx?.highlighter === 'shiki'
}

function isHighlightJsEnabled(mdx: SiteConfig['mdx'] | undefined): boolean {
  return mdx?.disableHighlighter !== true && mdx?.highlighter === 'highlightjs'
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
  private readonly contentState: IncrementalContentState
  private readonly scriptEntrypoints: ScriptEntrypointManager

  constructor(private readonly options: IncrementalRuntimeOptions) {
    this.scriptEntrypoints = new ScriptEntrypointManager({
      config: {
        contentDir: options.config.contentDir,
        outDir: options.config.outDir,
      },
      assets: options.manifest.assets,
      persistManifest: () => this.persistManifest(),
    })
    this.contentState = new IncrementalContentState({
      config: options.config,
      context: options.context,
      log: options.log,
      onPageBuilt: (relPath, scriptEntrypoints) =>
        this.scriptEntrypoints.setPageEntrypoints(relPath, scriptEntrypoints),
      persistManifest: () => this.persistManifest(),
      getManifest: () => this.manifest,
    })
  }

  toBuilder(): IncrementalBuilder {
    return {
      buildAll: this.buildAll,
      applyChange: this.applyChange,
      renderIfDirtyByOutPath: this.renderIfDirtyByOutPath,
      renderByUrlPath: this.renderByUrlPath,
    }
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
    this.scriptEntrypoints.clearPageEntrypoints()
    const pages = await this.contentState.renderAllPages(
      prepared.contentFiles,
      hooks,
    )
    const scriptAssetFiles = await this.scriptEntrypoints.syncState({
      result: this.createIncrementalResult(reason),
      persist: false,
      rebuildAll: true,
    })
    const styleResult = await this.writeStylesWithHooks(hooks)
    const finalResult = await this.finalizeBuild({
      ...prepared,
      assetFiles: [...prepared.assetFiles, ...scriptAssetFiles],
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
    return this.options.hooks
  }

  private async prepareBuild(
    hooks: BuildHooks,
  ): Promise<BuildPreparationResult> {
    await hooks.onConfigResolved?.(this.context)
    await prepareOutDir(this.config.outDir, { clean: this.options.cleanOutDir })
    const copiedAssets = await copyStaticAssets(
      this.config.contentDir,
      this.config.outDir,
    )
    this.scriptEntrypoints.rebuildDependencyIndex(copiedAssets.tsDependencyIndex)
    this.context.headerHtmlByDir = await resolveHeaderHtmlByDirectory(
      this.config,
      this.context.mdx,
    )
    this.context.footerHtmlByDir = await resolveFooterHtmlByDirectory(
      this.config,
      this.context.mdx,
    )
    const contentFiles = await discoverContent(this.config.contentDir)
    await hooks.onContentDiscovered?.(this.context, contentFiles)
    this.context.navigation = await buildNavigation(
      this.config.contentDir,
      contentFiles,
      this.config.navigation,
    )
    await hooks.onNavigationBuilt?.(this.context, this.context.navigation)
    return { contentFiles, assetFiles: copiedAssets.files }
  }

  private async writeStylesWithHooks(hooks: BuildHooks) {
    const { outDir, style } = this.config
    const styleResult = await writeStyles(
      {
        outDir,
        includeHljsTheme: isHighlightJsEnabled(this.config.mdx),
      },
      style,
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

    await buildPagefindIndex(this.config.outDir, this.config.pagefind)

    this.manifest = await buildManifest(this.config, contentFiles, assetFiles, {
      signature: styleResult.signature,
      outputs: styleResult.outputs,
    })
    await this.persistManifest()
    this.contentState.rebuildIndexFromManifest()
    this.contentState.clearDirtyPages()
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
    if (isDefaultFooterFile(relPath)) {
      result.fullRebuild = true
      return result
    }
    if (isDefaultHeaderFile(relPath)) {
      result.fullRebuild = true
      return result
    }

    const state = await this.readChangeState(filePath, relPath, result)
    await this.applyChangeState(state)
    if (isContentFile(relPath, state.ext) || state.ext === '.ts') {
      await this.scriptEntrypoints.syncState({
        result,
        persist: true,
        rebuildAll: false,
      })
    }
    return result
  }

  renderIfDirtyByOutPath = async (outPath: string): Promise<boolean> => {
    return this.contentState.renderIfDirtyByOutPath(outPath)
  }

  renderByUrlPath = async (urlPath: string): Promise<boolean> => {
    return this.contentState.renderByUrlPath(urlPath)
  }

  private async rebuildNavigationForChange(
    relPath: string,
    ext: string,
    result: IncrementalBuildResult,
    signature: FileSignature | null,
  ) {
    if (!signature) {
      await this.contentState.refreshNavigationAndMarkDirty()
      await this.contentState.removeContentEntryForDeletedSource(relPath, result)
      return
    }

    const contentFiles = await this.contentState.refreshNavigationAndMarkDirty()
    await this.contentState.rebuildNavigatedContent({
      contentFiles,
      relPath,
      ext,
      signature,
      result,
    })
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

  private async handleMissingSignatureChange(
    input: HandleMissingSignatureChangeInput,
  ) {
    const { relPath, ext, result, contentEntry, assetEntry } = input
    if (contentEntry && this.config.navigation.mode !== 'none') {
      await this.rebuildNavigationForChange(relPath, ext, result, null)
      await this.persistManifest()
      return
    }
    if (contentEntry) {
      await removeFile(contentEntry.outPath)
      delete this.manifest.content[relPath]
      this.contentState.removeContentForDeletedRelPath(relPath)
      this.scriptEntrypoints.removePage(relPath)
      result.deletedPages += 1
    }
    if (assetEntry) {
      await removeFile(assetEntry.outPath)
      delete this.manifest.assets[relPath]
      this.scriptEntrypoints.removeTrackedEntrypoint(relPath)
      result.deletedAssets += 1
    }
    if (ext === '.ts') {
      await this.scriptEntrypoints.rebuildDependents(relPath, result)
    }
    if (contentEntry || assetEntry) {
      await this.persistManifest()
    }
  }

  private async handleContentChange(input: HandleContentChangeInput) {
    const { relPath, ext, signature, contentEntry, result } = input
    if (signatureEqual(contentEntry, signature)) return

    if (this.config.navigation.mode !== 'none') {
      await this.rebuildNavigationForChange(relPath, ext, result, signature)
      await this.persistManifest()
      return
    }

    const contentFile = toContentFile(this.config.contentDir, relPath, ext)
    const page = await buildPage(this.context, contentFile)
    this.scriptEntrypoints.setPageEntrypoints(
      contentFile.relPath,
      page.scriptEntrypoints,
    )
    this.contentState.upsertContentManifestEntry(relPath, ext, signature)
    result.changedPages += 1
    await this.persistManifest()
  }

  private async handleAssetChange(input: HandleAssetChangeInput) {
    const { relPath, ext, signature, assetEntry, result } = input
    if (signatureEqual(assetEntry, signature)) return

    if (ext === '.ts') {
      await this.scriptEntrypoints.rebuildAssetGraph(relPath, result)
      await this.persistManifest()
      return
    }

    const assetFile = toAssetFile(this.config.contentDir, relPath, ext)
    const assetCopy = await copyStaticAsset(
      this.config.contentDir,
      this.config.outDir,
      assetFile,
    )
    if (!assetCopy.copied) return

    this.manifest.assets[relPath] = {
      relPath,
      ext,
      outPath: assetCopy.outPath,
      ...signature,
    }
    result.changedAssets += 1
    await this.persistManifest()
  }

  private async persistManifest() {
    await writeManifest(this.config.outDir, this.manifest)
    const sitemap = await this.writeSitemapFromManifest()
    if (!sitemap) return
    this.log.info('sitemap written', {
      outPath: sitemap.outPath,
      urls: sitemap.urls,
    })
    if (sitemap.robotsOutPath) {
      this.log.info('robots written', {
        outPath: sitemap.robotsOutPath,
      })
    }
  }

  private async writeSitemapFromManifest() {
    const pages = Object.values(this.manifest.content).map((entry) => {
      const file = toContentFile(
        this.config.contentDir,
        entry.relPath,
        entry.ext,
      )
      const route = resolveRouteInfo(file)
      return {
        urlPath: route.urlPath,
        lastModifiedMs: entry.mtimeMs,
      }
    })
    return writeSitemap(this.config.outDir, this.config.sitemap, pages)
  }
}
