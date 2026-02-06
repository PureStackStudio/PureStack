import { type BasicHeadConfig, h } from '@purestack/ts-html'

import { getHead } from '../config/head'
import type { PageNavigation } from '../navigation/navigation'
import type { ThemeStylesheetLink } from '../style/themes'
import { buildPageTocScript } from '../templates/buildPageTocScript'
import { buildThemeSwitchScript } from '../templates/buildThemeSwitchScript'
import {
  type PageTemplateMap,
  type PageTemplatePage,
  resolvePageTemplate,
} from '../templates/page-templates'

export interface RenderPageInput {
  bodyHtml: string
  headConfig?: BasicHeadConfig
  styleLinks?: ThemeStylesheetLink[]
  template?: string
  templates?: PageTemplateMap
  navigation?: PageNavigation
  page?: PageTemplatePage
  siteTitle?: string
}

export async function renderPage(input: RenderPageInput): Promise<string> {
  const { bodyHtml, headConfig, styleLinks, template, templates } = input
  const head = getHead(headConfig)
  if (styleLinks && styleLinks.length > 0) {
    for (const link of styleLinks) {
      head.push(
        h('link').attr({
          rel: link.rel,
          href: link.href,
          ...(link.media ? { media: link.media } : {}),
          ...(link.title ? { title: link.title } : {}),
          ...(link.dataTheme ? { 'data-theme': link.dataTheme } : {}),
          ...(link.disabled ? { disabled: '' } : {}),
        }),
      )
    }

    const themes = styleLinks
      .map((link) => link.dataTheme)
      .filter((theme): theme is string => Boolean(theme))
    if (themes.length > 0) {
      const script = buildThemeSwitchScript(themes)
      head.push(h('script').raw(script))
    }
  }
  const { pageTemplate, templateName } = resolvePageTemplate(
    template,
    templates,
  )
  if (isTocEnabled(input.page?.frontmatter)) {
    const script = buildPageTocScript()
    head.push(h('script').raw(script))
  }
  const html = await pageTemplate({
    head,
    bodyHtml,
    headConfig,
    styleLinks,
    templateName,
    navigation: input.navigation,
    page: input.page,
    siteTitle: input.siteTitle,
  })
  return await html.toPrettyHtml()
}

function isTocEnabled(frontmatter: Record<string, unknown> | undefined) {
  if (!isPlainObject(frontmatter)) return false
  const layout = isPlainObject(frontmatter.layout)
    ? frontmatter.layout
    : undefined
  return layout?.showToc === true
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
