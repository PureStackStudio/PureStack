import fsPromises from 'node:fs/promises'
import path from 'node:path'
import type { SiteConfig, WriteStylesResult } from '@purestack/ts-common'
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
  initializePluginContext,
  resolveBuildPlugins,
} from '../../plugins/default-plugins'
import {
  composePluginHooks,
  type PureStackPlugin,
  resolvePluginContentProcessor,
} from '../../plugins/plugin'
import { initRenderer } from '../../regor/initRenderer'
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
  const plugins = resolveBuildPlugins(buildOptions)
  const config = resolveBuildSiteConfig(input, plugins)
  const hooks = composePluginHooks(plugins)
  const cleanOutDir =
    publishOptions.enabled === true || buildOptions.cleanOutDir === true
  const minifyScripts = publishOptions.enabled === true
  const failOnAssetError = publishOptions.enabled === true
  const mdx = {
    ...(await resolveMdxBuildOptions(config.mdx, plugins)),
    contentProcessor: resolvePluginContentProcessor(plugins),
  }
  initRenderer()
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

type BuildPreparationResult = {
  contentFiles: ResolvedContentFile[]
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
  private importedFiles = new Set<string>()
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
      getAssetRelPaths: () =>
        [...this.staticAssets.values()].map((file) => file.relPath),
    })
    this.changeApplier = new IncrementalChangeApplier({
      config: options.config,
      context: options.context,
      getManifest: () => this.manifest,
      contentState: this.contentState,
      scriptEntrypoints: this.scriptEntrypoints,
      renderOnRequest: () => this.renderOnRequest,
      isGeneratedOutput: (relPath) => this.isGeneratedOutput(relPath),
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
    if (switchingFromBuild) await this.discoverAssets()
  }

  private async prepareRequestState() {
    await initializePluginContext(this.context, this.options.plugins)
    await prepareOutDir(this.config.outDir, { clean: this.options.cleanOutDir })
    // Keep the records object shared with the script manager, but start this
    // session with no rendered pages or copied assets, even without --clean.
    this.manifest.content = {}
    for (const key of Object.keys(this.manifest.assets))
      delete this.manifest.assets[key]
    this.scriptCacheKeys.clear()
    await writeGeneratedFavicon(this.config)
    await this.discoverAssets()
    const files = await this.prepareContent(
      [...this.staticAssets.values()].map((file) => file.relPath),
      this.options.hooks,
    )
    await this.syncImportedAssets()
    this.contentState.markAllPagesDirty(files)
    this.contentState.takeMarkedPageCount()
  }

  private async discoverAssets() {
    const files = await discoverStaticAssets(this.config.contentDir)
    this.staticAssets = new Map(
      files.map((file) => [
        `/${toPosixPath(toOutputAssetRelPath(file.relPath))}`,
        file,
      ]),
    )
  }

  private publicStaticAssets() {
    return [...this.staticAssets.values()].filter(
      (file) =>
        !this.importedFiles.has(toPosixPath(file.relPath)) &&
        !this.isGeneratedOutput(file.relPath),
    )
  }

  private isGeneratedOutput(relPath: string) {
    const outPath = path.join(this.config.outDir, relPath)
    return (
      this.contentState.isPageOutput(outPath) ||
      (path.extname(relPath).toLowerCase() === '.js' &&
        this.scriptEntrypoints.ownsOutputPath(outPath))
    )
  }

  /** Uses the render dependency records; no content is read or parsed here. */
  private syncImportedAssets(duringBuild = false): Promise<void> {
    return this.queueAssetWork(async () => {
      const imported = this.contentState.getImportedFiles()
      let changed = imported.size !== this.importedFiles.size
      for (const relPath of imported) {
        if (this.importedFiles.has(relPath)) continue
        changed = true
        const asset = this.staticAssets.get(`/${relPath}`)
        if (!asset) continue
        if (!this.isGeneratedOutput(asset.relPath)) {
          const outPath = path.join(this.config.outDir, asset.relPath)
          const stats = await fsPromises
            .stat(outPath)
            .catch((error: NodeJS.ErrnoException) => {
              if (error.code === 'ENOENT' || error.code === 'ENOTDIR')
                return undefined
              throw error
            })
          // An extensionless source file can share its name with a page folder.
          if (stats && !stats.isDirectory()) await removeFile(outPath)
        }
        delete this.manifest.assets[asset.relPath]
      }
      if (!duringBuild && !this.renderOnRequest) {
        for (const relPath of this.importedFiles) {
          if (imported.has(relPath)) continue
          const asset = this.staticAssets.get(`/${relPath}`)
          if (asset) await this.prepareStaticAsset(asset)
        }
      }
      this.importedFiles = imported
      if (!changed) return
      if (!duringBuild) await this.persistManifest()
    })
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
    await this.syncImportedAssets(true)
    const copiedAssets = await copyStaticAssets(
      this.config.contentDir,
      this.config.outDir,
      { files: this.publicStaticAssets() },
    )
    this.scriptEntrypoints.rebuildDependencyIndex(
      copiedAssets.tsDependencyIndex,
    )
    const scriptAssetFiles = await this.scriptEntrypoints.syncState({
      result: this.changeApplier.createResult(reason),
      persist: false,
      rebuildAll: true,
    })
    const styleResult = await this.writeStylesWithHooks(hooks)
    this.preparedAssetRevision = this.pageAssetRevision
    const finalResult = await this.finalizeBuild({
      ...prepared,
      assetFiles: [...copiedAssets.files, ...scriptAssetFiles],
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
    await initializePluginContext(this.context, this.options.plugins)
    await prepareOutDir(this.config.outDir, { clean: this.options.cleanOutDir })
    await writeGeneratedFavicon(this.config)
    await this.discoverAssets()
    const assetFiles = [...this.staticAssets.values()]
    const contentFiles = await this.prepareContent(
      assetFiles.map((file) => file.relPath),
      hooks,
    )
    return { contentFiles }
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
        : this.prepareExistingContent(),
    )
    return this.contentReady
  }

  private async prepareExistingContent() {
    await initializePluginContext(this.context, this.options.plugins)
    await this.discoverAssets()
    await this.prepareContent(
      [...this.staticAssets.values()].map((file) => file.relPath),
    )
    await this.syncImportedAssets()
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
    const styleResult = (await this.context.styles?.write({
      outDir: this.config.outDir,
      cacheKey: this.context.styleCacheKey,
    })) ?? { revision: 0, outPath: '', outputs: [], signature: '' }
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
    const imported = this.importedFiles.has(toPosixPath(relPath))
    const navigationFile =
      path.basename(relPath).toUpperCase() ===
      DEFAULT_NAV_FILENAME.toUpperCase()
    const knownAsset = this.staticAssets.get(
      `/${toPosixPath(toOutputAssetRelPath(relPath))}`,
    )
    if (!isContentFile(relPath, ext) && ext !== '.ts') {
      await this.discoverAssets()
      this.contentState.refreshAssets()
    }
    if (
      this.renderOnRequest &&
      !isContentFile(relPath, ext) &&
      !isSharedContentFile(relPath) &&
      !isDefaultHeaderFile(relPath) &&
      !isDefaultFooterFile(relPath) &&
      ext !== '.ts' &&
      !navigationFile
    ) {
      const cachedAsset = this.manifest.assets[relPath]
      // A missing, empty directory can also arrive as an event. Only invalidate
      // output for paths previously discovered or copied as actual files.
      if (
        !imported &&
        !this.isGeneratedOutput(relPath) &&
        (cachedAsset || knownAsset)
      ) {
        await removeFile(
          cachedAsset?.outPath ??
            path.join(this.config.outDir, toOutputAssetRelPath(relPath)),
        )
      }
      delete this.manifest.assets[relPath]
      await this.contentState.refreshGeneratedPages()
      if (!imported) result.changedAssets += 1
    } else if (isDefaultHeaderFile(relPath) || isDefaultFooterFile(relPath)) {
      await this.contentState.refreshPartials()
    } else if (
      ext === '.ts' ||
      navigationFile ||
      (!isSharedContentFile(relPath) &&
        (isContentFile(relPath, ext) || !imported))
    ) {
      // Shared TypeScript can be a script dependency as well as an import.
      await this.changeApplier.applyFileChange(filePath, relPath, result)
    } else if (imported && !isContentFile(relPath, ext)) {
      // Copy exclusion must not suppress generators that read this data file.
      await this.contentState.refreshGeneratedPages()
    }
    await this.contentState.refreshImporters(relPath)
    await this.syncImportedAssets()
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
    const rendered = await this.contentState.renderIfDirtyByOutPath(outPath)
    await this.syncImportedAssets()
    return rendered
  }

  renderByUrlPath = async (
    urlPath: string,
    locale?: string,
  ): Promise<boolean> => {
    await this.ensureContentReady()
    const rendered = await this.contentState.renderByUrlPath(urlPath, locale)
    await this.syncImportedAssets()
    return rendered
  }

  preparePageAssets = async (): Promise<void> => {
    await this.ensureContentReady()
    await this.queueAssetWork(async () => {
      const revision = this.pageAssetRevision
      if (
        revision === this.preparedAssetRevision &&
        this.preparedStyleRevision === (this.context.styles?.revision ?? 0)
      )
        return
      // Only pages rendered in this session have registered script entries.
      await this.scriptEntrypoints.buildMissingEntrypoints(
        this.changeApplier.createResult('requested page assets'),
      )
      if (this.preparedStyleRevision !== (this.context.styles?.revision ?? 0)) {
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
    if (
      !asset ||
      this.importedFiles.has(toPosixPath(asset.relPath)) ||
      this.isGeneratedOutput(asset.relPath)
    )
      return false
    await this.queueAssetWork(async () => {
      if (!this.importedFiles.has(toPosixPath(asset.relPath))) {
        await this.prepareStaticAsset(asset)
      }
    })
    return true
  }

  private async prepareStaticAsset(asset: StaticAssetFile) {
    if (this.isGeneratedOutput(asset.relPath)) return
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
