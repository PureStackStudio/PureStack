import type {
  PageFrontmatter,
  PageOutlineItem,
  PageTemplateInput,
  SiteConfig,
  SiteConfigResolution,
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
import { merge } from '@purestack/ts-util'
import {
  resolveDocLayoutConfig,
  resolveFavicon,
  resolvePageTocConfig,
  resolveStyleConfig,
} from './config'
import { registerDocLayoutStyles } from './docLayoutStyles'
import { writeGeneratedFavicon } from './favicon'
import { markdownPresentation } from './markdownPresentation'
import { registerMarkdownStyles } from './markdownStyles'
import { defaultTemplates, removeUnusedDocToc } from './templates'
import { writeStyles } from './writeStyles'

export { defaultTemplates } from './templates'

/** The default layouts, theme CSS, and critical theme startup. */
export function themePlugin() {
  return {
    name: 'purestack:theme',
    defaults: true,
    config: {
      resolve({ config, input, file }: SiteConfigResolution) {
        return {
          style: merge(resolveStyleConfig(input, file), config.style),
          docLayout: merge(
            resolveDocLayoutConfig(input.docLayout, file.docLayout),
            config.docLayout,
          ),
          pageToc: merge(
            resolvePageTocConfig(input.pageToc, file.pageToc),
            config.pageToc,
          ),
          favicon:
            config.favicon ?? resolveFavicon(input.favicon, file.favicon),
        }
      },
      normalize({ config }: SiteConfigResolution) {
        return {
          style: resolveStyleConfig({ style: config.style }, {}),
          docLayout: resolveDocLayoutConfig(config.docLayout),
          pageToc: resolvePageTocConfig(config.pageToc),
          favicon: resolveFavicon(config.favicon),
        }
      },
    },
    templates: defaultTemplates,
    markdown: { rehypePostPlugins: [markdownPresentation] },
    styles: createSiteStyles,
    head: renderThemeHead,
    hooks: {
      onPageDocument(
        _context: unknown,
        page: {
          document: Document
          frontmatter: PageFrontmatter
          outline: PageOutlineItem[]
        },
      ) {
        removeUnusedDocToc(page.document, page.frontmatter, page.outline)
      },
      onContentDiscovered: ({ config }: { config: SiteConfig }) =>
        writeGeneratedFavicon(config),
    },
  }
}

function createSiteStyles(config: SiteConfig): SiteStyles {
  const style = config.style
  if (!style) throw new Error('Theme styles require resolved style settings.')
  const context = getStyleContext()
  themes.setOptions(style.theme)
  style.theme = themes.getOptions()
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
      resolveThemeStyleLinks(style.href, style.themes, cacheKey),
    write: (input) =>
      runWithStyleContext(context, () =>
        writeStyles(
          {
            ...input,
            includeHljsTheme:
              !config.mdx.disableHighlighter &&
              config.mdx.highlighter === 'highlightjs',
          },
          style,
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
