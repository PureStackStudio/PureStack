import { getLogger } from 'logpot'
import type { Component } from 'regor'

import { type PartialSiteConfig, resolveSiteConfig } from '../config/config'
import { type ContentFile, discoverContent } from '../discover/content'
import { MdxRenderOptions } from '../mdx/compile'
import {
  createMdxHighlighter,
  DEFAULT_MDX_CODE_LANGS,
  DEFAULT_MDX_CODE_THEMES,
  type MdxCodeHighlighter,
  type MdxCodeLangs,
  type MdxCodeThemes,
} from '../mdx/highlight'
import {
  buildNavigation,
  type NavigationConfig,
  type NavigationTree,
} from '../navigation/navigation'
import { initBuiltinComponents } from '../regor/initBuiltinComponents'
import { themes } from '../style/themeOptions'
import type { PageTemplateMap } from '../templates/page-templates'
import { copyStaticAssets } from './assets'
import { prepareOutDir } from './io'
import {
  type BuildContext,
  type PageRenderResult,
  renderPageFromFile,
  writePage,
} from './page'
import { writeStyles, type WriteStylesResult } from './styles'

export interface BuildResult {
  outDir: string
  pages: number
  content?: BuildCountSummary
  assets?: BuildCountSummary
}

export interface BuildCountSummary {
  total: number
  byExt: Record<string, number>
}

export interface BuildHooks {
  onConfigResolved?: (context: BuildContext) => void | Promise<void>
  onContentDiscovered?: (
    context: BuildContext,
    files: ContentFile[],
  ) => void | Promise<void>
  onNavigationBuilt?: (
    context: BuildContext,
    navigation: NavigationTree | undefined,
  ) => void | Promise<void>
  onPageStart?: (
    context: BuildContext,
    file: ContentFile,
  ) => void | Promise<void>
  onPageRendered?: (
    context: BuildContext,
    page: PageRenderResult,
  ) => void | Promise<void>
  onPageWritten?: (
    context: BuildContext,
    page: PageRenderResult,
  ) => void | Promise<void>
  onStylesWritten?: (
    context: BuildContext,
    result: WriteStylesResult,
  ) => void | Promise<void>
  onBuildComplete?: (
    context: BuildContext,
    result: BuildResult,
  ) => void | Promise<void>
}

export interface BuildOptions {
  cleanOutDir?: boolean
  concurrency?: number
  hooks?: BuildHooks
  components?: Record<string, Component<unknown>>
  templates?: PageTemplateMap
  navigation?: NavigationConfig
  mdx?: MdxOptions
}

export type BuildInput = PartialSiteConfig & BuildOptions

export interface MdxOptions {
  highlighter?: MdxCodeHighlighter
  themes?: MdxCodeThemes
  langs?: MdxCodeLangs
  disableHighlighter?: boolean
}

export async function buildSite(input: BuildInput = {}): Promise<BuildResult> {
  const config = resolveSiteConfig(input)
  const log = getLogger()
  const hooks = resolveBuildHooks(input.hooks)
  const mdxOptions = await resolveMdxBuildOptions(input.mdx)
  const context = createBuildContext(input, config, mdxOptions)
  themes.setOptions(config.theme)
  initBuiltinComponents()

  await hooks.onConfigResolved?.(context)

  log.info('build config resolved', {
    contentDir: config.contentDir,
    outDir: config.outDir,
  })

  await prepareOutDir(config.outDir, { clean: input.cleanOutDir })

  await copyStaticAssets(config.contentDir, config.outDir)

  const files = await discoverBuildContent(config.contentDir)
  await hooks.onContentDiscovered?.(context, files)
  const navigation = await buildBuildNavigation(
    config.contentDir,
    files,
    input.navigation ?? config.navigation,
  )
  context.navigation = navigation
  await hooks.onNavigationBuilt?.(context, navigation)

  const concurrency = normalizeConcurrency(input.concurrency)
  const pages = await buildPagesWithConcurrency({
    files,
    concurrency,
    context,
    hooks,
  })

  const styleResult = await writeStyles(
    config.outDir,
    config.styleFileName,
    config.styleThemes,
  )
  await hooks.onStylesWritten?.(context, styleResult)

  const result = { outDir: config.outDir, pages }
  await hooks.onBuildComplete?.(context, result)
  return result
}

function resolveBuildHooks(hooks: BuildHooks | undefined): BuildHooks {
  return hooks ?? {}
}

async function resolveMdxBuildOptions(
  mdx: MdxOptions | undefined,
): Promise<MdxRenderOptions> {
  const mdxThemes = mdx?.themes ?? DEFAULT_MDX_CODE_THEMES
  const mdxLangs = mdx?.langs ?? DEFAULT_MDX_CODE_LANGS
  const highlighter = mdx?.disableHighlighter
    ? undefined
    : (mdx?.highlighter ?? (await createMdxHighlighter(mdxThemes, mdxLangs)))
  return { highlighter }
}

function createBuildContext(
  input: BuildInput,
  config: ReturnType<typeof resolveSiteConfig>,
  mdx: MdxRenderOptions,
): BuildContext {
  return {
    config,
    components: input.components,
    templates: input.templates,
    mdx,
  }
}

async function discoverBuildContent(contentDir: string) {
  return await discoverContent(contentDir)
}

async function buildBuildNavigation(
  contentDir: string,
  files: ContentFile[],
  navigation: NavigationConfig | undefined,
) {
  return await buildNavigation(contentDir, files, navigation)
}

type BuildPagesWithConcurrencyInput = {
  files: ContentFile[]
  concurrency: number
  context: BuildContext
  hooks: BuildHooks
}

async function buildPagesWithConcurrency(
  input: BuildPagesWithConcurrencyInput,
): Promise<number> {
  const { files, concurrency, context, hooks } = input
  let pages = 0
  await runWithConcurrency(files, concurrency, async (file) => {
    await hooks.onPageStart?.(context, file)
    const page = await renderPageFromFile(context, file)
    await hooks.onPageRendered?.(context, page)
    await writePage(page)
    await hooks.onPageWritten?.(context, page)
    pages += 1
  })
  return pages
}

function normalizeConcurrency(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 1
  return Math.max(1, Math.floor(value))
}

async function runWithConcurrency<T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>,
) {
  if (items.length === 0) return
  const limit = Math.min(concurrency, items.length)
  let index = 0
  const workers = Array.from({ length: limit }, async () => {
    while (true) {
      const current = index
      index += 1
      if (current >= items.length) return
      await worker(items[current])
    }
  })
  await Promise.all(workers)
}
