import { type ThemeStylesheetLink, themes } from '@purestack/ts-components'
import { type BasicHeadConfig, h } from '@purestack/ts-html'
import type { AnalyticsConfig, ConsentConfig } from '../config/config'
import { getHead } from '../config/head'
import type { PageFrontmatter } from '../frontmatter/frontmatter'
import type { PageNavigation } from '../navigation/navigation'
import { buildCodeCopyScript } from '../templates/buildCodeCopyScript'
import { buildConsentScript } from '../templates/buildConsentScript'
import { buildGa4Script } from '../templates/buildGa4Script'
import { buildNavMenuScript } from '../templates/buildNavMenuScript'
import { buildNavTransitionReadyScript } from '../templates/buildNavTransitionReadyScript'
import { buildPagefindSearchScript } from '../templates/buildPagefindSearchScript'
import { buildPageTocScript } from '../templates/buildPageTocScript'
import { buildThemeSwitchScript } from '../templates/buildThemeSwitchScript'
import {
  type PageInfo,
  type PageTemplateMap,
  resolvePageTemplate,
} from '../templates/page-templates'

export interface RenderPageInput {
  bodyHtml: string
  headConfig?: BasicHeadConfig
  styleLinks?: ThemeStylesheetLink[]
  template?: string
  templates?: PageTemplateMap
  navigation?: PageNavigation
  pageInfo: PageInfo
  siteTitle?: string
  headerHtml?: string
  footerHtml?: string
  consent?: ConsentConfig
  analytics?: AnalyticsConfig
}

export async function renderPage(input: RenderPageInput): Promise<string> {
  const { bodyHtml, headConfig, styleLinks, template, templates } = input
  const head = getHead(headConfig)
  const themes = getStyleThemes(styleLinks)
  head.push(h('style').raw(buildCriticalThemeStyle(themes.length > 0)))
  appendStyleLinkTags(head, styleLinks)
  appendThemeSwitchScript(head, themes)
  appendConsentScript(head, input.consent)
  appendGa4Script(head, input.analytics, input.consent)
  appendNavTransitionReadyScript(head)
  appendNavMenuScript(head)
  appendCodeCopyScript(head)
  appendPagefindSearchScript(head)
  const { pageTemplate, templateName } = resolvePageTemplate(
    template,
    templates,
  )
  appendTocScript(head, input.pageInfo.frontmatter)
  const html = await pageTemplate({
    head,
    bodyHtml,
    headConfig,
    styleLinks,
    templateName,
    navigation: input.navigation,
    pageInfo: input.pageInfo,
    siteTitle: input.siteTitle,
    headerHtml: input.headerHtml,
    footerHtml: input.footerHtml,
  })
  return html.toHtml()
}

function getStyleThemes(
  styleLinks: ThemeStylesheetLink[] | undefined,
): string[] {
  return (styleLinks ?? [])
    .map((link) => link.dataTheme)
    .filter((theme): theme is string => Boolean(theme))
}

function appendStyleLinkTags(
  head: ReturnType<typeof getHead>,
  styleLinks: ThemeStylesheetLink[] | undefined,
) {
  if (!styleLinks || styleLinks.length === 0) return
  for (const link of styleLinks) {
    head.push(
      h('link').attr({
        rel: 'preload',
        as: 'style',
        href: link.href,
        ...(link.media ? { media: link.media } : {}),
        ...(link.title ? { title: link.title } : {}),
        ...(link.dataTheme ? { 'data-theme': link.dataTheme } : {}),
      }),
    )
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
}

function appendThemeSwitchScript(
  head: ReturnType<typeof getHead>,
  themes: string[],
) {
  if (themes.length === 0) return
  const script = buildThemeSwitchScript(themes)
  head.push(h('script').raw(script))
}

function appendConsentScript(
  head: ReturnType<typeof getHead>,
  consent: ConsentConfig | undefined,
) {
  if (!consent?.enabled) return
  head.push(h('script').raw(buildConsentScript(consent)))
}

function appendGa4Script(
  head: ReturnType<typeof getHead>,
  analytics: AnalyticsConfig | undefined,
  consent: ConsentConfig | undefined,
) {
  const ga4 = analytics?.ga4
  if (!ga4?.enabled || !ga4.measurementId) return
  if (consent?.enabled) return
  const script = buildGa4Script(ga4)
  head.push(
    h('script').attr({ async: 'true', src: script.src }),
    h('script').raw(script.init),
  )
}

function appendNavTransitionReadyScript(head: ReturnType<typeof getHead>) {
  const script = buildNavTransitionReadyScript()
  head.push(h('script').raw(script))
}

function appendNavMenuScript(head: ReturnType<typeof getHead>) {
  const script = buildNavMenuScript()
  head.push(h('script').raw(script))
}

function appendTocScript(
  head: ReturnType<typeof getHead>,
  frontmatter: PageFrontmatter,
) {
  if (!frontmatter.layout.showToc) return
  const script = buildPageTocScript()
  head.push(h('script').raw(script))
}

function appendCodeCopyScript(head: ReturnType<typeof getHead>) {
  const script = buildCodeCopyScript()
  head.push(h('script').raw(script))
}

function appendPagefindSearchScript(head: ReturnType<typeof getHead>) {
  const script = buildPagefindSearchScript()
  head.push(h('script').attr({ type: 'module' }).raw(script))
}

function buildCriticalThemeStyle(hasThemeGate: boolean) {
  const options = themes.getOptions()
  const lightPalette = options.colors.light
  const darkPalette = options.colors.dark
  const light = {
    background: lightPalette.background.canvas,
    text: lightPalette.text.default,
  }
  const dark = {
    background: darkPalette.background.canvas,
    text: darkPalette.text.default,
  }
  const css = [
    ':root{color-scheme:light dark;}',
    `html,body{background:${light.background};color:${light.text};}`,
    '@media (prefers-color-scheme: dark){',
    `html,body{background:${dark.background};color:${dark.text};}`,
    '}',
  ]
  if (hasThemeGate) {
    css.push('html:not([data-theme-ready]) body{visibility:hidden;}')
  }
  return css.join('')
}
