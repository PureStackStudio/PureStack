import fsPromises from 'node:fs/promises'
import path from 'node:path'
import type { SiteConfig } from '@purestack/ts-common'
import { styleBuilder, themes } from '@purestack/ts-style'
import { toOutputAssetRelPath, toPosixPath } from '@purestack/ts-util'
import { getLogger, type Logger } from 'logpot'
import {
  DEFAULT_NAV_FILENAME,
  discoverStaticAssets,
  isContentFile,
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
import { copyStaticAsset, copyStaticAssets } from '../assets'
import { resolveBuildSiteConfig } from '../build-config'
import { ContentRouteIndex } from '../content-urls'
import { writeGeneratedFavicon } from '../favicon'
import { prepareOutDir } from '../io'
import {
  type BuildManifest,
  createEmptyManifest,
  isCompatibleManifest,
  readManifest,
  readSignature,
  writeManifest,
} from '../manifest'
import { type BuildContext, resolveHeaderFooterHtml } from '../page'
import { buildPagefindIndex } from '../pagefind'
import { createScriptCacheKey, ScriptCacheKeyStore } from '../script-cache-key'
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
  removeFile,
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
    styleCacheKey: createScriptCacheKey(),
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
  private assetWork: Promise<unknown> = Promise.resolve()
  private pageAssetRevision = 0
  private preparedAssetRevision = -1
  private preparedStyleRevision = -1
  private renderOnRequest = false
  private staticAssets = new Map<string, StaticAssetFile>()
  private searchRevision = -1
  private manifestWork: Promise<unknown> = Promise.resolve()

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
      getAssets: () => this.manifest.assets,
      scriptCacheKeys: this.scriptCacheKeys,
      persistManifest: () => this.persistManifest(),
    })
    this.contentState = new IncrementalContentState({
      config: options.config,
      context: options.context,
      hooks: options.hooks,
      plugins: options.plugins,
      log: options.log,
      onPageBuilt: (relPath, scriptEntrypoints) => {
        this.scriptEntrypoints.setPageEntrypoints(relPath, scriptEntrypoints)
        this.pageAssetRevision += 1
      },
      onPageRemoved: (relPath) => {
        this.scriptEntrypoints.removePage(relPath)
        this.pageAssetRevision += 1
      },
      renderOnRequest: () => this.renderOnRequest,
      persistManifest: () => this.persistManifest(),
      getManifest: () => this.manifest,
    })
    this.changeApplier = new IncrementalChangeApplier({
      config: options.config,
      context: options.context,
      getManifest: () => this.manifest,
      contentState: this.contentState,
      scriptEntrypoints: this.scriptEntrypoints,
      renderOnRequest: () => this.renderOnRequest,
      persistManifest: () => this.persistManifest(),
    })
  }

  toBuilder(): IncrementalBuilder {
    return {
      prepareForRequests: this.prepareForRequests,
      buildAll: this.buildAll,
      applyChange: this.applyChange,
      applyChanges: this.applyChanges,
      renderIfDirtyByOutPath: this.renderIfDirtyByOutPath,
      renderByUrlPath: this.renderByUrlPath,
      preparePageAssets: this.preparePageAssets,
      prepareAssetByUrlPath: this.prepareAssetByUrlPath,
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

  prepareForRequests = async (): Promise<void> => {
    const switchingFromBuild =
      !this.renderOnRequest && this.contentReady !== undefined
    this.renderOnRequest = true
    this.contentReady ??= this.settleContentReady(this.prepareRequestState())
    await this.contentReady
    if (switchingFromBuild) await this.discoverRequestAssets()
  }

  private async prepareRequestState() {
    await this.options.hooks.onConfigResolved?.(this.context)
    await prepareOutDir(this.config.outDir, { clean: this.options.cleanOutDir })
    // Keep the records object shared with the script manager, but start this
    // session with no rendered pages or copied assets, even without --clean.
    this.manifest.content = {}
    for (const key of Object.keys(this.manifest.assets))
      delete this.manifest.assets[key]
    this.scriptCacheKeys.clear()
    await writeGeneratedFavicon(this.config)
    await this.discoverRequestAssets()
    const files = await this.prepareContent(
      [...this.staticAssets.values()].map((file) => file.relPath),
      this.options.hooks,
    )
    this.contentState.markAllPagesDirty(files)
    this.contentState.takeMarkedPageCount()
  }

  private async discoverRequestAssets() {
    const files = await discoverStaticAssets(this.config.contentDir)
    this.staticAssets = new Map(
      files.map((file) => [
        `/${toPosixPath(toOutputAssetRelPath(file.relPath))}`,
        file,
      ]),
    )
  }

  buildAll = async (reason: string): Promise<BuildResult> => {
    this.context.styleCacheKey = createScriptCacheKey()
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
    this.preparedAssetRevision = this.pageAssetRevision
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
      this.renderOnRequest
        ? this.prepareRequestState()
        : this.prepareContent(Object.keys(this.manifest.assets)),
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
        cacheKey: this.context.styleCacheKey,
      },
      style,
    )
    this.preparedStyleRevision = styleResult.revision
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
    this.searchRevision = this.pageAssetRevision

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
    if (!relPath || isOutsideContentRoot(relPath)) return result
    const sourceStats = await fsPromises
      .stat(filePath)
      .catch((error: NodeJS.ErrnoException) => {
        if (error.code === 'ENOENT' || error.code === 'ENOTDIR')
          return undefined
        throw error
      })
    // Recursive watchers also emit directory events. They are not asset files.
    if (sourceStats?.isDirectory()) return result
    if (isSiteConfigFile(relPath)) {
      result.fullRebuild = true
      return result
    }

    await this.ensureContentReady()
    if (!sourceStats) {
      const prefix = `${toPosixPath(relPath)}/`
      const removedDirectory =
        this.context.contentRoutes.pages.some((file) =>
          toPosixPath(file.relPath).startsWith(prefix),
        ) ||
        [...this.staticAssets.values()].some((file) =>
          toPosixPath(file.relPath).startsWith(prefix),
        )
      if (removedDirectory) {
        // Refresh discovery for a removed subtree; never rm its output as a file.
        result.fullRebuild = true
        return result
      }
    }
    this.contentState.takeMarkedPageCount()
    const ext = path.extname(relPath).toLowerCase()
    if (
      this.renderOnRequest &&
      !isContentFile(relPath, ext) &&
      !isSharedContentFile(relPath) &&
      !isDefaultHeaderFile(relPath) &&
      !isDefaultFooterFile(relPath) &&
      ext !== '.ts' &&
      path.basename(relPath).toUpperCase() !==
        DEFAULT_NAV_FILENAME.toUpperCase()
    ) {
      const cachedAsset = this.manifest.assets[relPath]
      const knownAsset = this.staticAssets.get(
        `/${toPosixPath(toOutputAssetRelPath(relPath))}`,
      )
      // A missing, empty directory can also arrive as an event. Only invalidate
      // output for paths previously discovered or copied as actual files.
      if (cachedAsset || knownAsset) {
        await removeFile(
          cachedAsset?.outPath ??
            path.join(this.config.outDir, toOutputAssetRelPath(relPath)),
        )
      }
      delete this.manifest.assets[relPath]
      await this.discoverRequestAssets()
      this.contentState.refreshAssets(
        [...this.staticAssets.values()].map((file) => file.relPath),
      )
      await this.contentState.refreshGeneratedPages()
      result.changedAssets += 1
    } else if (isDefaultHeaderFile(relPath) || isDefaultFooterFile(relPath)) {
      await this.contentState.refreshPartials()
    } else if (!isSharedContentFile(relPath) || ext === '.ts') {
      // Shared TypeScript can be a script dependency as well as an import.
      await this.changeApplier.applyFileChange(filePath, relPath, result)
    }
    await this.contentState.refreshImporters(relPath)
    result.markedPages = this.contentState.takeMarkedPageCount()
    return result
  }

  applyChanges = async (
    filePaths: readonly string[],
    signal?: AbortSignal,
  ): Promise<IncrementalBuildResult[]> => {
    if (signal?.aborted || filePaths.length === 0) return []
    await this.ensureContentReady()
    const apply = async () => {
      const results: IncrementalBuildResult[] = []
      for (const filePath of new Set(filePaths)) {
        if (signal?.aborted) break
        const result = await this.applyChange(filePath)
        results.push(result)
        if (result.fullRebuild) break
      }
      return results
    }
    return this.renderOnRequest
      ? this.contentState.withChangeBatch(apply)
      : apply()
  }

  renderIfDirtyByOutPath = async (outPath: string): Promise<boolean> => {
    await this.ensureContentReady()
    return this.contentState.renderIfDirtyByOutPath(outPath)
  }

  renderByUrlPath = async (
    urlPath: string,
    locale?: string,
  ): Promise<boolean> => {
    await this.ensureContentReady()
    return this.contentState.renderByUrlPath(urlPath, locale)
  }

  preparePageAssets = async (): Promise<void> => {
    await this.ensureContentReady()
    await this.queueAssetWork(async () => {
      const revision = this.pageAssetRevision
      if (
        revision === this.preparedAssetRevision &&
        this.preparedStyleRevision === styleBuilder.revision
      )
        return
      // Only pages rendered in this session have registered script entries.
      await this.scriptEntrypoints.buildMissingEntrypoints(
        this.changeApplier.createResult('requested page assets'),
      )
      if (this.preparedStyleRevision !== styleBuilder.revision) {
        const styles = await this.writeStylesWithHooks(this.options.hooks)
        this.manifest.styles = {
          signature: styles.signature,
          outputs: styles.outputs,
        }
      }
      this.preparedAssetRevision = revision
    })
  }

  prepareAssetByUrlPath = async (urlPath: string): Promise<boolean> => {
    await this.ensureContentReady()
    if (!this.renderOnRequest) return false
    let pathname: string
    try {
      pathname = decodeURIComponent(urlPath)
    } catch {
      return false
    }
    if (pathname.startsWith('/pagefind/')) {
      await this.queueAssetWork(async () => {
        if (this.searchRevision === this.pageAssetRevision) return
        const revision = this.pageAssetRevision
        await buildPagefindIndex(
          this.config.outDir,
          this.config.pagefind,
          this.contentState.unindexedOutPaths(),
          Object.values(this.manifest.content).map((entry) => entry.outPath),
        )
        this.searchRevision = revision
      })
      return true
    }
    const asset =
      this.staticAssets.get(pathname) ??
      this.staticAssets.get(
        pathname.endsWith('/')
          ? `${pathname}index.html`
          : `${pathname}/index.html`,
      )
    if (!asset) return false
    await this.queueAssetWork(async () => {
      if (this.manifest.assets[asset.relPath]) return
      const signature = await readSignature(asset.absPath)
      if (!signature) return
      const copied = await copyStaticAsset(
        this.config.contentDir,
        this.config.outDir,
        asset,
      )
      if (!copied.copied) return
      this.manifest.assets[asset.relPath] = {
        relPath: asset.relPath,
        ext: asset.ext,
        outPath: copied.outPath,
        ...signature,
      }
    })
    return true
  }

  private queueAssetWork<T>(work: () => Promise<T>): Promise<T> {
    const task = this.assetWork.then(work)
    this.assetWork = task.catch(() => undefined)
    return task
  }

  private persistManifest(): Promise<void> {
    const task = this.manifestWork.then(() => this.writeManifestAndSitemap())
    this.manifestWork = task.catch(() => undefined)
    return task
  }

  private async writeManifestAndSitemap() {
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
