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
  return `(function(){var themes=${serialized};if(!themes.length){return;}var storageKey='ts-ssg-theme';var root=document.documentElement;function isValid(theme){return themes.indexOf(theme)!==-1;}function getStored(){try{return localStorage.getItem(storageKey)||'';}catch(e){return ''}}function setStored(theme){try{localStorage.setItem(storageKey,theme);}catch(e){}}function prefersDark(){return window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;}function resolvePreferred(){var stored=getStored();if(isValid(stored)){return stored;}if(prefersDark()&&isValid('dark')){return 'dark';}return themes[0];}function applyTheme(theme){if(!isValid(theme)){return null;}var links=document.querySelectorAll('link[data-theme]');var active=null;for(var i=0;i<links.length;i++){var link=links[i];var linkTheme=link.getAttribute('data-theme');link.disabled=linkTheme!==theme;if(linkTheme===theme){active=link;}}root.setAttribute('data-theme',theme);return active;}function updateThumb(el,theme){var thumb=el.querySelector('.theme-switcher__thumb');if(!thumb){return;}var inset=10;var size=36;var max=el.clientWidth-(inset*2)-size;if(max<0){max=0;}var translate=theme==='dark'?max:0;thumb.style.transition='transform 260ms cubic-bezier(0.4, 0, 0.2, 1), background 200ms ease, box-shadow 200ms ease';thumb.style.transform='translateY(-50%) translateX('+translate+'px)';}function syncSwitchers(theme){var switches=document.querySelectorAll('.theme-switcher');for(var i=0;i<switches.length;i++){var el=switches[i];el.setAttribute('data-theme',theme);el.setAttribute('aria-pressed',theme==='dark'?'true':'false');updateThumb(el,theme);}requestAnimationFrame(function(){var after=document.querySelectorAll('.theme-switcher');for(var i=0;i<after.length;i++){updateThumb(after[i],theme);}});}function scheduleSync(theme,link){syncSwitchers(theme);if(link&&link.sheet==null){link.addEventListener('load',function(){syncSwitchers(theme);},{once:true});}}function bindSwitchers(){var switches=document.querySelectorAll('.theme-switcher');for(var i=0;i<switches.length;i++){var el=switches[i];if(el.getAttribute('data-ts-ssg-theme-bound')==='true'){continue;}el.setAttribute('data-ts-ssg-theme-bound','true');el.addEventListener('click',function(){var idx=themes.indexOf(current);var next=themes[(idx+1)%themes.length];window.tsSsgTheme.set(next);});}}function initSwitchers(){bindSwitchers();scheduleSync(current,null);}var current=resolvePreferred();var active=applyTheme(current);root.setAttribute('data-theme',current);root.setAttribute('data-theme-mode','auto');root.setAttribute('data-theme-ready','true');if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initSwitchers);}else{initSwitchers();}window.tsSsgTheme={get:function(){return current;},list:function(){return themes.slice();},set:function(theme){if(!isValid(theme)){return;}current=theme;var activeLink=applyTheme(current);setStored(current);scheduleSync(current,activeLink);}};})();`
}
