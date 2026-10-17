import type {
  PageTemplateInput,
  SiteConfig,
  SiteStyles,
} from '@purestack/ts-common'
import { h } from '@purestack/ts-html'
import { buildThemeSwitchScript } from '@purestack/ts-page-scripts'
import {
  getStyleContext,
  registerNormalizeStyles,
  resolveThemeStyleLinks,
  runWithStyleContext,
  styleBuilder,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'
import { registerDocLayoutStyles } from './docLayoutStyles'
import { writeGeneratedFavicon } from './favicon'
import { markdownPresentation } from './markdownPresentation'
import { registerMarkdownStyles } from './markdownStyles'
import { defaultTemplates } from './templates'
import { writeStyles } from './writeStyles'

export { defaultTemplates } from './templates'

/** The default layouts, theme CSS, and critical theme startup. */
export function themePlugin() {
  return {
    name: 'purestack:theme',
    defaults: true,
    templates: defaultTemplates,
    markdown: { rehypePostPlugins: [markdownPresentation] },
    styles: createSiteStyles,
    head: renderThemeHead,
    hooks: {
      onContentDiscovered: ({ config }: { config: SiteConfig }) =>
        writeGeneratedFavicon(config),
    },
  }
}

function createSiteStyles(config: SiteConfig): SiteStyles {
  const context = getStyleContext()
  themes.setOptions(config.style.theme)
  config.style.theme = themes.getOptions()
  styleBuilder.reset()
  registerNormalizeStyles()
  registerDocLayoutStyles()
  registerMarkdownStyles({
    includeShikiStyles:
      !config.mdx.disableHighlighter && config.mdx.highlighter === 'shiki',
  })
  return {
    get revision() {
      return runWithStyleContext(context, () => styleBuilder.revision)
    },
    links: (cacheKey) =>
      resolveThemeStyleLinks(config.style.href, config.style.themes, cacheKey),
    write: (input) =>
      runWithStyleContext(context, () =>
        writeStyles(
          {
            ...input,
            includeHljsTheme:
              !config.mdx.disableHighlighter &&
              config.mdx.highlighter === 'highlightjs',
          },
          config.style,
        ),
      ),
  }
}

function renderThemeHead({ head, styleLinks = [] }: PageTemplateInput) {
  const options = themes.getOptions()
  head.push(h('meta').attr({ name: 'color-scheme', content: 'dark light' }))
  for (const mode of ['light', 'dark'] as const) {
    head.push(
      h('meta').attr({
        name: 'theme-color',
        media: `(prefers-color-scheme: ${mode})`,
        content: options.palette[mode].accent,
      }),
    )
  }
  const names = styleLinks.flatMap((link) =>
    link.dataTheme ? [link.dataTheme] : [],
  )
  head.push(h('style').raw(buildCriticalThemeStyle(options, names.length > 0)))
  for (const link of styleLinks) {
    head.push(
      h('link').attr({
        rel: link.rel,
        href: link.href,
        ...(link.media ? { media: link.media } : {}),
        ...(link.dataTheme ? { 'data-theme': link.dataTheme } : {}),
      }),
    )
  }
  if (names.length > 0)
    head.push(h('script').raw(buildThemeSwitchScript(names)))
  return head
}

function buildCriticalThemeStyle(options: ThemeOptions, hasThemeGate: boolean) {
  const { light, dark } = options.palette
  const css = [
    ':root{color-scheme:light dark;}',
    `html,body{background:${light.semanticTone.neutral.canvas};color:${light.semanticTone.neutral.text.default};}`,
    '@media (prefers-color-scheme: dark){',
    `html,body{background:${dark.semanticTone.neutral.canvas};color:${dark.semanticTone.neutral.text.default};}`,
    '}',
  ]
  if (hasThemeGate)
    css.push('html:not([data-theme-ready]) body{visibility:hidden;}')
  return css.join('')
}
