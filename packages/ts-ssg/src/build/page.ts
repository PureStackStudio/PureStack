import type { BasicHeadConfig } from '@purestack/ts-html'
import matter from 'gray-matter'
import { getLogger } from 'logpot'
import type { Component } from 'regor'

import { type SiteConfig } from '../config/config'
import { type ContentFile } from '../discover/content'
import { compileMdxToHtml } from '../mdx/mdx'
import {
  type NavigationTree,
  type PageNavigation,
  resolvePageNavigation,
} from '../navigation/navigation'
import { renderApp } from '../regor/renderApp'
import { resolveThemeStyleLinks } from '../style/themes'
import type {
  PageTemplateMap,
  PageTemplatePage,
} from '../templates/page-templates'
import { resolveHeadConfig } from './head-config'
import { readSource, writeHtml } from './io'
import { resolveOutPath, resolveRouteInfo } from './out-path'
import { renderPage } from './renderer'

export interface BuildContext {
  config: SiteConfig
  components?: Record<string, Component<unknown>>
  templates?: PageTemplateMap
  navigation?: NavigationTree
}

export interface PageRenderResult {
  file: ContentFile
  frontmatter: Record<string, unknown>
  body: string
  headConfig: BasicHeadConfig
  bodyHtml: string
  html: string
  template?: string
  outPath: string
  urlPath: string
  navigation?: PageNavigation
  page?: PageTemplatePage
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
  log.info('page written', { outPath: page.outPath, urlPath: page.urlPath })
}

export async function renderPageFromFile(
  context: BuildContext,
  file: ContentFile,
): Promise<PageRenderResult> {
  const source = await readSource(file.absPath)
  const parsed = matter(source)
  const frontmatter = parsed.data as Record<string, unknown>
  const { urlPath } = resolveRouteInfo(file)
  const navigation = resolvePageNavigation(context.navigation, file)
  const pageInfo = {
    relPath: file.relPath,
    urlPath,
    frontmatter,
  }
  const renderAppOptions = {
    components: context.components,
    context: {
      site: context.config,
      page: pageInfo,
      navigation,
      theme: context.config.theme,
    },
  }
  const headConfig = resolveHeadConfig(frontmatter, {
    siteTitle: context.config.siteTitle,
  })
  const bodyHtml = await compileMdxToHtml(parsed.content)
  const template = resolveTemplateName(frontmatter)
  const htmlShell = await renderPage({
    bodyHtml,
    headConfig,
    styleLinks: resolveThemeStyleLinks(
      context.config.styleHref,
      context.config.styleThemes,
    ),
    template,
    templates: context.templates,
    navigation,
    page: pageInfo,
    siteTitle: context.config.siteTitle,
  })
  const html = renderApp(htmlShell, renderAppOptions)
  const outPath = resolveOutPath(context.config.outDir, file)
  return {
    file,
    frontmatter,
    body: parsed.content,
    headConfig,
    bodyHtml,
    html,
    template,
    outPath,
    urlPath,
    navigation,
    page: pageInfo,
  }
}

function resolveTemplateName(frontmatter: Record<string, unknown>) {
  const template = frontmatter.template
  return typeof template === 'string' ? template : undefined
}
