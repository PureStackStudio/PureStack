import path from 'node:path'
import type { SiteConfig } from '@purestack/ts-common'
import { themes } from '@purestack/ts-style'
import { toOutputAssetRelPath } from '@purestack/ts-util'
import { getLogger, type Logger } from 'logpot'
import {
  isDefaultFooterFile,
  isDefaultHeaderFile,
  isSharedContentFile,
  isSiteConfigFile,
  type StaticAssetFile,
} from '../../discover/content'
import {
  buildTranslationsByKey,
  type ResolvedContentFile,
  resolveContentFile,
} from '../../i18n/content'
import { buildNavigation } from '../../navigation/navigation'
import {
  composePluginHooks,
  type PureStackPlugin,
  resolvePluginComponents,
  resolvePluginContentProcessor,
  resolvePluginTemplates,
} from '../../plugins/plugin'
import { initBuiltinComponents } from '../../regor/initBuiltinComponents'
import { resolveRouteInfo } from '../../routing/route'
import { copyStaticAssets } from '../assets'
import { resolveBuildSiteConfig } from '../build-config'
import { ContentRouteIndex } from '../content-urls'
import { writeGeneratedFavicon } from '../favicon'
import { prepareOutDir } from '../io'
import {
  type BuildManifest,
  createEmptyManifest,
  isCompatibleManifest,
  readManifest,
  writeManifest,
} from '../manifest'
import { type BuildContext, resolveHeaderFooterHtml } from '../page'
import { buildPagefindIndex } from '../pagefind'
import { ScriptCacheKeyStore } from '../script-cache-key'
import type { BuildHooks, BuildInput, BuildResult } from '../site'
import { writeSitemap } from '../sitemap'
import { type WriteStylesResult, writeStyles } from '../styles'
import { IncrementalChangeApplier } from './change-applier'
import { IncrementalContentState } from './content-state'
import { ScriptEntrypointManager } from './script-entry-manager'
import {
  buildManifest,
  countByExt,
  discoverSiteContent,
  isOutsideContentRoot,
  resolveMdxBuildOptions,
  toContentFile,
} from './support'
import type { IncrementalBuilder, IncrementalBuildResult } from './types'

export type { IncrementalBuilder, IncrementalBuildResult } from './types'

export async function createIncrementalBuilder(
  input: BuildInput = {},
): Promise<IncrementalBuilder> {
  const runtime = await createIncrementalRuntime(input)
  return runtime.toBuilder()
}

interface IncrementalRuntimeOptions {
  config: SiteConfig
  hooks: BuildHooks
  plugins: readonly PureStackPlugin[]
  cleanOutDir: boolean
  minifyScripts: boolean
  failOnAssetError: boolean
  log: Logger
  context: BuildContext
  manifest: BuildManifest
  scriptCacheKeys: ScriptCacheKeyStore
}

async function createIncrementalRuntime(
  input: BuildInput,
): Promise<IncrementalRuntime> {
  const buildOptions = input.options ?? {}
  const publishOptions = input.publish ?? {}
  const plugins = buildOptions.plugins ?? []
  const config = resolveBuildSiteConfig(input)
  const hooks = composePluginHooks(plugins)
  const cleanOutDir =
    publishOptions.enabled === true || buildOptions.cleanOutDir === true
  const minifyScripts = publishOptions.enabled === true
  const failOnAssetError = publishOptions.enabled === true
  const mdx = {
    ...(await resolveMdxBuildOptions(config.mdx)),
    contentProcessor: resolvePluginContentProcessor(plugins),
  }
  themes.setOptions(config.style.theme)
  initBuiltinComponents({ includeShikiStyles: isShikiEnabled(config.mdx) })
  const log = getLogger()
  const existing = await readManifest(config.outDir)
  const manifest =
    existing && isCompatibleManifest(existing, config)
      ? existing
      : createEmptyManifest(config)
  const scriptCacheKeys = new ScriptCacheKeyStore(manifest.assets)
  const context: BuildContext = {
    config,
    // The content is prepared once, by the first build or the first change or
    // request; see IncrementalRuntime.ensureContentReady.
    contentRoutes: new ContentRouteIndex([]),
    writeErrorPages: buildOptions.writeErrorPages === true,
    components: resolvePluginComponents(plugins, config),
    templates: resolvePluginTemplates(plugins),
    mdx,
    resolveScriptPublicPath: config.scripts.cacheBusting
      ? (sourceRelPath) =>
          `/${toOutputAssetRelPath(sourceRelPath, {
            cacheKey: scriptCacheKeys.ensure(sourceRelPath),
          })}`
      : undefined,
  }

  return new IncrementalRuntime({
    config,
    hooks,
    plugins,
    cleanOutDir,
    minifyScripts,
    failOnAssetError,
    log,
    context,
    manifest,
    scriptCacheKeys,
  })
}

function isShikiEnabled(mdx: SiteConfig['mdx'] | undefined): boolean {
  return mdx?.disableHighlighter !== true && mdx?.highlighter === 'shiki'
}

function isHighlightJsEnabled(mdx: SiteConfig['mdx'] | undefined): boolean {
  return mdx?.disableHighlighter !== true && mdx?.highlighter === 'highlightjs'
}

type BuildPreparationResult = {
  contentFiles: ResolvedContentFile[]
  assetFiles: StaticAssetFile[]
}

type BuildSummaryInput = {
  contentFiles: ResolvedContentFile[]
  assetFiles: StaticAssetFile[]
  pages: number
}

type FinalizeBuildInput = BuildSummaryInput & {
  styleResult: WriteStylesResult
  hooks: BuildHooks
}

class IncrementalRuntime {
  private readonly contentState: IncrementalContentState
  private readonly scriptEntrypoints: ScriptEntrypointManager
  private readonly changeApplier: IncrementalChangeApplier
  private readonly scriptCacheKeys: ScriptCacheKeyStore
  /** Settles once the content is prepared; see ensureContentReady. */
  private contentReady: Promise<void> | undefined

  constructor(private readonly options: IncrementalRuntimeOptions) {
    this.scriptCacheKeys = options.scriptCacheKeys
    this.scriptEntrypoints = new ScriptEntrypointManager({
      config: {
        contentDir: options.config.contentDir,
        outDir: options.config.outDir,
      },
      minifyScripts: options.minifyScripts,
      failOnAssetError: options.failOnAssetError,
      cacheBusting: options.config.scripts.cacheBusting,
      assets: options.manifest.assets,
      scriptCacheKeys: this.scriptCacheKeys,
      persistManifest: () => this.persistManifest(),
    })
    this.contentState = new IncrementalContentState({
      config: options.config,
      context: options.context,
      hooks: options.hooks,
      plugins: options.plugins,
      log: options.log,
      onPageBuilt: (relPath, scriptEntrypoints) =>
        this.scriptEntrypoints.setPageEntrypoints(relPath, scriptEntrypoints),
      onPageRemoved: (relPath) => this.scriptEntrypoints.removePage(relPath),
      persistManifest: () => this.persistManifest(),
      getManifest: () => this.manifest,
    })
    this.changeApplier = new IncrementalChangeApplier({
      config: options.config,
      context: options.context,
      getManifest: () => this.manifest,
      contentState: this.contentState,
      scriptEntrypoints: this.scriptEntrypoints,
      persistManifest: () => this.persistManifest(),
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

    this.scriptCacheKeys.clear()
    this.log.info('build started', { reason })
    const preparing = this.prepareBuild(hooks)
    this.contentReady = this.settleContentReady(preparing)
    const prepared = await preparing
    this.scriptEntrypoints.clearPageEntrypoints()
    const pages = await this.contentState.renderAllPages(prepared.contentFiles)
    const scriptAssetFiles = await this.scriptEntrypoints.syncState({
      result: this.changeApplier.createResult(reason),
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
    await writeGeneratedFavicon(this.config)
    const copiedAssets = await copyStaticAssets(
      this.config.contentDir,
      this.config.outDir,
      {
        minifyScripts: this.options.minifyScripts,
        getScriptCacheKey: this.resolveScriptCacheKey,
      },
    )
    this.scriptEntrypoints.rebuildDependencyIndex(
      copiedAssets.tsDependencyIndex,
    )
    const contentFiles = await this.prepareContent(
      copiedAssets.files.map((file) => file.relPath),
      hooks,
    )
    return { contentFiles, assetFiles: copiedAssets.files }
  }

  /**
   * Discovers the pages, generated ones included, and prepares everything
   * pages share: content routes, headers and footers, navigation, and
   * translations. Runs once per full build.
   */
  private async prepareContent(assetRelPaths: string[], hooks?: BuildHooks) {
    const contentFiles = await discoverSiteContent(
      this.config,
      this.options.plugins,
    )
    const generated = this.contentState.trackGeneratedPages(contentFiles)
    for (const relPath of generated.removed) {
      await this.contentState.handleMissingRelPathSource(relPath)
    }
    this.contentState.indexContentFiles(contentFiles)
    this.context.contentRoutes = new ContentRouteIndex(
      contentFiles,
      assetRelPaths,
    )
    await resolveHeaderFooterHtml(this.context)
    await hooks?.onContentDiscovered?.(this.context, contentFiles)
    this.context.navigation = await buildNavigation(
      this.config.contentDir,
      contentFiles,
      this.config.navigation,
    )
    this.context.translationsByKey = buildTranslationsByKey(contentFiles)
    await hooks?.onNavigationBuilt?.(this.context, this.context.navigation)
    return contentFiles
  }

  /**
   * Waits until the content is prepared. A full build prepares it; a change
   * or request that comes first, such as one resuming from an earlier
   * build's manifest, prepares it from the manifest instead. Either way it is
   * prepared once, and calls made meanwhile wait for it.
   */
  private ensureContentReady(): Promise<void> {
    this.contentReady ??= this.settleContentReady(
      this.prepareContent(Object.keys(this.manifest.assets)),
    )
    return this.contentReady
  }

  private settleContentReady(preparing: Promise<unknown>): Promise<void> {
    const ready = preparing.then(
      () => undefined,
      (error: unknown) => {
        // The next build, change, or request prepares the content again.
        if (this.contentReady === ready) this.contentReady = undefined
        throw error
      },
    )
    // Whoever started the preparation handles its failure.
    ready.catch(() => undefined)
    return ready
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

    await buildPagefindIndex(
      this.config.outDir,
      this.config.pagefind,
      this.contentState.unindexedOutPaths(),
    )

    this.manifest = await buildManifest(
      this.config,
      contentFiles,
      assetFiles,
      {
        signature: styleResult.signature,
        outputs: styleResult.outputs,
      },
      {
        getScriptCacheKey: this.resolveScriptCacheKey,
      },
    )
    this.contentState.markUnindexedEntries(this.manifest)
    await this.persistManifest()
    this.contentState.rebuildIndexFromManifest()
    this.contentState.clearDirtyPages()
    await hooks.onBuildComplete?.(this.context, finalResult)
    return finalResult
  }

  applyChange = async (filePath: string): Promise<IncrementalBuildResult> => {
    const relPath = path.relative(this.config.contentDir, filePath)
    const result = this.changeApplier.createResult(
      `content change: ${filePath}`,
    )
    if (isOutsideContentRoot(relPath)) return result
    if (isSiteConfigFile(relPath)) {
      result.fullRebuild = true
      return result
    }

    await this.ensureContentReady()
    this.contentState.takeMarkedPageCount()
    if (isDefaultHeaderFile(relPath) || isDefaultFooterFile(relPath)) {
      await this.contentState.refreshPartials()
    } else if (!isSharedContentFile(relPath)) {
      // Shared content is never a page; its importers refresh below.
      await this.changeApplier.applyFileChange(filePath, relPath, result)
    }
    await this.contentState.refreshImporters(relPath)
    result.markedPages = this.contentState.takeMarkedPageCount()
    return result
  }

  renderIfDirtyByOutPath = async (outPath: string): Promise<boolean> => {
    await this.ensureContentReady()
    return this.contentState.renderIfDirtyByOutPath(outPath)
  }

  renderByUrlPath = async (urlPath: string): Promise<boolean> => {
    await this.ensureContentReady()
    return this.contentState.renderByUrlPath(urlPath)
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

  private resolveScriptCacheKey = (relPath: string) => {
    return this.config.scripts.cacheBusting
      ? this.scriptCacheKeys.get(relPath)
      : undefined
  }

  private async writeSitemapFromManifest() {
    const indexed = Object.values(this.manifest.content).filter(
      (entry) => entry.index !== false,
    )
    const pages = indexed.map((entry) => {
      const file = toContentFile(
        this.config.contentDir,
        entry.relPath,
        entry.ext,
      )
      const route = resolveRouteInfo(resolveContentFile(this.config, file))
      return {
        urlPath: route.urlPath,
        lastModifiedMs: entry.mtimeMs,
      }
    })
    return writeSitemap(
      this.config.outDir,
      this.config.sitemap,
      pages,
      this.config.basePath,
    )
  }
}
