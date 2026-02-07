import type { BasicHeadConfig } from '@purestack/ts-html'
import matter from 'gray-matter'
import { getLogger } from 'logpot'
import type { Component } from 'regor'

import { type SiteConfig } from '../config/config'
import { type ContentFile } from '../discover/content'
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
  mdx?: MdxRenderOptions
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
  log.info('page written', { outPath: page.outPath, urlPath: page.urlPath })
}

export async function renderPageFromFile(
  context: BuildContext,
  file: ContentFile,
): Promise<PageRenderResult> {
  const { urlPath } = resolveRouteInfo(file)
  const outPath = resolveOutPath(context.config.outDir, file)
  try {
    const source = await readSource(file.absPath)
    const parsed = matter(source)
    const frontmatter = parsed.data as Record<string, unknown>
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
        outline: new Array<PageOutlineItem>(),
        theme: context.config.theme,
      },
    }
    const headConfig = resolveHeadConfig(frontmatter, {
      siteTitle: context.config.siteTitle,
    })
    const compiled =
      file.ext === '.mdx'
        ? compileMdx(parsed.content, context.mdx)
        : compileMarkdown(parsed.content, context.mdx)
    const bodyHtml = compiled.html
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
    renderAppOptions.context.outline = compiled.outline
    const html = renderApp(htmlShell, renderAppOptions)
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
      outline: compiled.outline,
    }
  } catch (error) {
    throw attachPageContext(error, {
      relPath: file.relPath,
      urlPath,
      outPath,
    })
  }
}

function resolveTemplateName(frontmatter: Record<string, unknown>) {
  const template = frontmatter.template
  return typeof template === 'string' ? template : undefined
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
