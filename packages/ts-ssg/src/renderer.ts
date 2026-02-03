import { type BasicHeadConfig, h } from '@purestack/ts-html'

import { getHead } from './config/head'
import type { PageNavigation } from './navigation/navigation'
import {
  type PageTemplateMap,
  type PageTemplatePage,
  resolvePageTemplate,
} from './page-templates'
import type { ThemeStylesheetLink } from './style/themes'

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

/**
 * Builds the inline theme switcher runtime.
 *
 * Usage (runtime):
 *   window.tsSsgTheme.get()
 *   window.tsSsgTheme.list()
 *   window.tsSsgTheme.set(theme: string)
 *
 * Behavior:
 * - Reads preferred theme from localStorage key "ts-ssg-theme" if present.
 * - Falls back to prefers-color-scheme when available.
 * - Enables the matching <link data-theme="..."> and disables the rest.
 * - Adds data-theme, data-theme-mode, and data-theme-ready attributes on <html>.
 */
function buildThemeSwitchScript(themes: string[]) {
  const unique = [...new Set(themes)]
  const serialized = JSON.stringify(unique)
  return `(function(){var themes=${serialized};if(!themes.length){return;}var storageKey='ts-ssg-theme';var root=document.documentElement;function isValid(theme){return themes.indexOf(theme)!==-1;}function getStored(){try{return localStorage.getItem(storageKey)||'';}catch(e){return ''}}function setStored(theme){try{localStorage.setItem(storageKey,theme);}catch(e){}}function prefersDark(){return window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;}function resolvePreferred(){var stored=getStored();if(isValid(stored)){return stored;}if(prefersDark()&&isValid('dark')){return 'dark';}return themes[0];}function applyTheme(theme){if(!isValid(theme)){return;}var links=document.querySelectorAll('link[data-theme]');for(var i=0;i<links.length;i++){var link=links[i];var linkTheme=link.getAttribute('data-theme');link.disabled=linkTheme!==theme;}root.setAttribute('data-theme',theme);}var current=resolvePreferred();applyTheme(current);root.setAttribute('data-theme',current);root.setAttribute('data-theme-mode','auto');root.setAttribute('data-theme-ready','true');window.tsSsgTheme={get:function(){return current;},list:function(){return themes.slice();},set:function(theme){if(!isValid(theme)){return;}current=theme;applyTheme(current);setStored(current);}};})();`
}
