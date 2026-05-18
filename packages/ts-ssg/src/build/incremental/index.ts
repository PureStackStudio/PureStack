import path from 'node:path'
import type { SiteConfig } from '@purestack/ts-common'
import { themes } from '@purestack/ts-style'
import { getLogger, type Logger } from 'logpot'
import {
  type ContentFile,
  discoverContent,
  isDefaultFooterFile,
  isDefaultHeaderFile,
  isSiteConfigFile,
  type StaticAssetFile,
} from '../../discover/content'
import { buildNavigation } from '../../navigation/navigation'
import { initBuiltinComponents } from '../../regor/initBuiltinComponents'
import { copyStaticAssets } from '../assets'
import { resolveBuildSiteConfig } from '../build-config'
import { writeGeneratedFavicon } from '../favicon'
import { prepareOutDir } from '../io'
import {
  type BuildManifest,
  createEmptyManifest,
  isCompatibleManifest,
  readManifest,
  writeManifest,
} from '../manifest'
import { resolveRouteInfo } from '../out-path'
import {
  type BuildContext,
  resolveFooterHtmlByDirectory,
  resolveHeaderHtmlByDirectory,
} from '../page'
import { buildPagefindIndex } from '../pagefind'
import type { BuildHooks, BuildInput, BuildResult } from '../site'
import { writeSitemap } from '../sitemap'
import { type WriteStylesResult, writeStyles } from '../styles'
import { IncrementalChangeApplier } from './change-applier'
import { IncrementalContentState } from './content-state'
import { ScriptEntrypointManager } from './script-entry-manager'
import {
  buildManifest,
  countByExt,
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
  cleanOutDir: boolean
  minifyScripts: boolean
  failOnAssetError: boolean
  log: Logger
  context: BuildContext
  manifest: BuildManifest
}

async function createIncrementalRuntime(
  input: BuildInput,
): Promise<IncrementalRuntime> {
  const buildOptions = input.options ?? {}
  const publishOptions = input.publish ?? {}
  const config = resolveBuildSiteConfig(input)
  const hooks = buildOptions.hooks ?? {}
  const cleanOutDir = buildOptions.cleanOutDir === true
  const minifyScripts = publishOptions.enabled === true
  const failOnAssetError = publishOptions.enabled === true
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
    minifyScripts,
    failOnAssetError,
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

class IncrementalRuntime {
  private readonly contentState: IncrementalContentState
  private readonly scriptEntrypoints: ScriptEntrypointManager
  private readonly changeApplier: IncrementalChangeApplier

  constructor(private readonly options: IncrementalRuntimeOptions) {
    this.scriptEntrypoints = new ScriptEntrypointManager({
      config: {
        contentDir: options.config.contentDir,
        outDir: options.config.outDir,
      },
      minifyScripts: options.minifyScripts,
      failOnAssetError: options.failOnAssetError,
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

    this.log.info('build started', { reason })
    const prepared = await this.prepareBuild(hooks)
    this.scriptEntrypoints.clearPageEntrypoints()
    const pages = await this.contentState.renderAllPages(
      prepared.contentFiles,
      hooks,
    )
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
      { minifyScripts: this.options.minifyScripts },
    )
    this.scriptEntrypoints.rebuildDependencyIndex(
      copiedAssets.tsDependencyIndex,
    )
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
    const result = this.changeApplier.createResult(
      `content change: ${filePath}`,
    )
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

    await this.changeApplier.applyFileChange(filePath, relPath, result)
    return result
  }

  renderIfDirtyByOutPath = async (outPath: string): Promise<boolean> => {
    return this.contentState.renderIfDirtyByOutPath(outPath)
  }

  renderByUrlPath = async (urlPath: string): Promise<boolean> => {
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
