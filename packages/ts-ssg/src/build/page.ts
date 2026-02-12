import type { BasicHeadConfig } from '@purestack/ts-html'
import { getLogger } from 'logpot'
import type { Component } from 'regor'

import type { SiteConfig } from '../config/config'
import type { ContentFile } from '../discover/content'
import {
  type PageFrontmatter,
  parseFrontmatterSource,
} from '../frontmatter/frontmatter'
import { compileMarkdown } from '../mdx/md'
import {
  compileMdx,
  type MdxRenderOptions,
  type PageOutlineItem,
} from '../mdx/mdx'
import {
  type NavigationTree,
  type PageNavigation,
  resolvePageNavigation,
} from '../navigation/navigation'
import { renderApp } from '../regor/renderApp'
import { resolveThemeStyleLinks } from '../style/themeAssets'
import type { PageInfo, PageTemplateMap } from '../templates/page-templates'
import { resolveHeadConfig } from './head-config'
import { readSource, writeHtml } from './io'
import { resolveOutPath, resolveRouteInfo } from './out-path'
import { renderPage } from './renderer'

export interface BuildContext {
  config: SiteConfig
  components?: Record<string, Component<unknown>>
  templates?: PageTemplateMap
  navigation?: NavigationTree
  mdx?: MdxRenderOptions
}

export interface PageRenderResult {
  file: ContentFile
  frontmatter: PageFrontmatter
  body: string
  headConfig: BasicHeadConfig
  bodyHtml: string
  html: string
  template?: string
  outPath: string
  urlPath: string
  renderTimeMs: number
  navigation?: PageNavigation
  pageInfo: PageInfo
  outline?: PageOutlineItem[]
}

export async function buildPage(
  context: BuildContext,
  file: ContentFile,
): Promise<PageRenderResult> {
  const page = await renderPageFromFile(context, file)
  await writePage(page)
  return page
}

export async function writePage(page: PageRenderResult): Promise<void> {
  await writeHtml(page.outPath, page.html)
  const log = getLogger()
  const renderTimeMs = Math.round(page.renderTimeMs)
  log.info('page written', {
    outPath: page.outPath,
    urlPath: page.urlPath,
    renderTimeMs,
  })
  if (renderTimeMs > 2000) {
    log.warn('page render slow', {
      outPath: page.outPath,
      urlPath: page.urlPath,
      renderTimeMs,
      thresholdMs: 2000,
    })
  }
}

export async function renderPageFromFile(
  context: BuildContext,
  file: ContentFile,
): Promise<PageRenderResult> {
  const renderStart = process.hrtime.bigint()
  const { urlPath } = resolveRouteInfo(file)
  const outPath = resolveOutPath(context.config.outDir, file)
  try {
    const source = await readSource(file.absPath)
    const parsedContent = parsePageSource(source, file.relPath)
    const navigation = resolvePageNavigation(context.navigation, file)
    const pageInfo = createPageTemplateInfo(
      file,
      urlPath,
      parsedContent.frontmatter,
    )
    const headConfig = resolveHeadConfig(parsedContent.frontmatter, {
      siteTitle: context.config.siteTitle,
    })
    const compiled = compilePageContent(file, parsedContent.body, context.mdx)
    const template = parsedContent.frontmatter.template
    const htmlShell = await renderPageShell({
      context,
      bodyHtml: compiled.bodyHtml,
      headConfig,
      template,
      navigation,
      pageInfo,
    })
    const html = renderPageApp(context, htmlShell, {
      pageInfo,
      navigation,
      outline: compiled.outline,
    })
    const renderTimeMs =
      Number(process.hrtime.bigint() - renderStart) / 1_000_000
    return {
      file,
      ...parsedContent,
      headConfig,
      ...compiled,
      html,
      template,
      outPath,
      urlPath,
      renderTimeMs,
      navigation,
      pageInfo,
    }
  } catch (error) {
    throw attachPageContext(error, {
      relPath: file.relPath,
      urlPath,
      outPath,
    })
  }
}

type ParsedPageSource = {
  body: string
  frontmatter: PageFrontmatter
}

function parsePageSource(
  source: string,
  sourceLabel?: string,
): ParsedPageSource {
  return parseFrontmatterSource(source, sourceLabel)
}

function createPageTemplateInfo(
  file: ContentFile,
  urlPath: string,
  frontmatter: PageFrontmatter,
): PageInfo {
  return {
    relPath: file.relPath,
    urlPath,
    frontmatter,
  }
}

function compilePageContent(
  file: ContentFile,
  sourceBody: string,
  mdxOptions: MdxRenderOptions | undefined,
) {
  return file.ext === '.mdx'
    ? compileMdx(sourceBody, mdxOptions)
    : compileMarkdown(sourceBody, mdxOptions)
}

type RenderPageShellInput = {
  context: BuildContext
  bodyHtml: string
  headConfig: BasicHeadConfig
  template: string | undefined
  navigation: PageNavigation | undefined
  pageInfo: PageInfo
}

async function renderPageShell(input: RenderPageShellInput): Promise<string> {
  const { context, bodyHtml, headConfig, template, navigation, pageInfo } =
    input
  return await renderPage({
    bodyHtml,
    headConfig,
    styleLinks: resolveThemeStyleLinks(
      context.config.styleHref,
      context.config.styleThemes,
    ),
    template,
    templates: context.templates,
    navigation,
    pageInfo,
    siteTitle: context.config.siteTitle,
  })
}

type RenderAppContextInput = {
  pageInfo: PageInfo
  navigation: PageNavigation | undefined
  outline: PageOutlineItem[]
}

function renderPageApp(
  context: BuildContext,
  htmlShell: string,
  appContext: RenderAppContextInput,
) {
  return renderApp(htmlShell, {
    components: context.components,
    context: {
      site: context.config,
      ...appContext,
      theme: context.config.theme,
    },
  })
}

type PageErrorContext = {
  relPath: string
  urlPath: string
  outPath: string
}

function attachPageContext(error: unknown, context: PageErrorContext): unknown {
  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>
    if (!err.file) {
      err.file = context.relPath
    }
    if (!err.page || typeof err.page !== 'object') {
      err.page = {
        relPath: context.relPath,
        urlPath: context.urlPath,
        outPath: context.outPath,
      }
    }
    return error
  }
  const message = `Page build failed (${context.relPath}): ${String(error)}`
  const wrapped = new Error(message)
  const extended = wrapped as unknown as Record<string, unknown>
  extended.file = context.relPath
  extended.page = {
    relPath: context.relPath,
    urlPath: context.urlPath,
    outPath: context.outPath,
  }
  return wrapped
}
