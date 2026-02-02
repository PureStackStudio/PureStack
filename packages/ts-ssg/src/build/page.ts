import type { BasicHeadConfig } from '@purestack/ts-html'
import matter from 'gray-matter'
import { getLogger } from 'logpot'
import type { Component } from 'regor'

import { type SiteConfig } from '../config/config'
import { type ContentFile } from '../discover/content'
import { compileMdxToHtml } from '../mdx/mdx'
import { renderPage } from '../renderer'
import { resolveThemeStyleLinks } from '../style/themes'
import { resolveHeadConfig } from './head-config'
import { readSource, writeHtml } from './io'
import { resolveOutPath, resolveRouteInfo } from './out-path'

export interface BuildContext {
  config: SiteConfig
  components?: Record<string, Component<unknown>>
}

export interface PageRenderResult {
  file: ContentFile
  frontmatter: Record<string, unknown>
  body: string
  headConfig: BasicHeadConfig
  bodyHtml: string
  html: string
  outPath: string
  urlPath: string
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
  const headConfig = resolveHeadConfig(frontmatter, {
    siteTitle: context.config.siteTitle,
  })
  const bodyHtml = await compileMdxToHtml(parsed.content, {
    components: context.components,
  })
  const html = await renderPage({
    bodyHtml,
    headConfig,
    styleLinks: resolveThemeStyleLinks(
      context.config.styleHref,
      context.config.styleThemes,
    ),
  })
  const { urlPath } = resolveRouteInfo(file)
  const outPath = resolveOutPath(context.config.outDir, file)
  return {
    file,
    frontmatter,
    body: parsed.content,
    headConfig,
    bodyHtml,
    html,
    outPath,
    urlPath,
  }
}
