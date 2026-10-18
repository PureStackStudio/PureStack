import type { IncomingMessage, ServerResponse } from 'node:http'
import type {
  MdxCodeHighlighter,
  PageHeadConfigTemplate,
  PageHeadTemplate,
  PageTemplateMap,
  SiteAssets,
  SiteConfig,
  SiteConfigContributions,
  SiteMdxConfig,
  SiteSearch,
  SiteStyles,
} from '@purestack/ts-common'
import type { ThemeSkin } from '@purestack/ts-style'
import type { PluggableList } from 'unified'
import type { BuildHooks } from '../build/site'
import type { ResolvedContentFile } from '../i18n/content'

/**
 * A named bundle of extensions for a PureStack site. Plugins compose in
 * order: skins, components, and templates merge by name, and each lifecycle
 * hook runs every plugin's handler in turn.
 */
export interface PureStackPlugin {
  /** Names the plugin in conflict and hook error messages. */
  name: string
  /** Components, templates, and the default highlighter supply defaults that ordinary contributions may override. */
  defaults?: boolean
  /** Theme skins the site config can select with `style.theme.skin`. */
  skins?: Record<string, ThemeSkin>
  /** Pure overrides, normalization, and derived settings, before factories. */
  config?: SiteConfigContributions
  /** Regor components, built from the resolved site config. */
  components?: (config: SiteConfig) => Record<string, object>
  /** Page templates, selected by the `template` frontmatter field. */
  templates?: PageTemplateMap
  /** Head template, composed before the selected page template. */
  head?: PageHeadTemplate
  /** Head defaults, composed before explicit page overrides and head templates. */
  headConfig?: PageHeadConfigTemplate
  /** The site's stylesheet provider, initialized before component factories. */
  styles?: (config: SiteConfig) => SiteStyles
  /** Search output, used for full builds and lazy development asset requests. */
  search?: (config: SiteConfig) => SiteSearch
  /** Per-site document asset processors; core owns their outputs and dependencies. */
  assets?: (config: SiteConfig) => SiteAssets | undefined
  /** Markdown transforms and highlighter resolution for pages and shared partials. */
  markdown?: PureStackMarkdown
  /**
   * Pages without files, such as tag or index pages. Runs whenever the
   * site's content or assets change, so pages can follow other pages.
   */
  pages?: (
    context: PageGenerationContext,
  ) => GeneratedPage[] | Promise<GeneratedPage[]>
  /**
   * Sees every request the development server receives, before the site is
   * served. Respond to handle it; otherwise the next plugin, then the site,
   * handles it. Builds ignore it.
   */
  devMiddleware?: (
    request: IncomingMessage,
    response: ServerResponse,
  ) => void | Promise<void>
  /** Build lifecycle hooks. */
  hooks?: BuildHooks
}

export interface PageGenerationContext {
  config: SiteConfig
  /** The site's content files; generated pages are not among them. */
  files: readonly ResolvedContentFile[]
}

export interface GeneratedPage {
  /**
   * The content path the page takes, such as `blog/tags/regor.mdx`. Routes,
   * links, navigation, and partials treat it like a file at that path.
   */
  path: string
  /**
   * Frontmatter and Markdown or Regor MDX, as a file would hold, or a
   * function that returns it. PureStack never keeps what the function
   * returns and calls it whenever it needs the text, so the plugin decides
   * what to cache.
   */
  source: string | (() => string | Promise<string>)
}

export interface PureStackMarkdown {
  /** Creates the site's default code highlighter once per build/session. */
  createHighlighter?: (
    config: Partial<SiteMdxConfig>,
  ) => MdxCodeHighlighter | undefined | Promise<MdxCodeHighlighter | undefined>
  /** Resolves a lowercase language (empty when absent); null lets the next highlighter handle it. */
  resolveHighlighter?: (
    lang: string,
  ) =>
    | MdxCodeHighlighter['codeToHtml']
    | null
    | Promise<MdxCodeHighlighter['codeToHtml'] | null>
  /** Transform the Markdown tree, after Regor markup is restored. */
  remarkPlugins?: PluggableList
  /** Transform the HTML tree, before the outline and code highlighting. */
  rehypePlugins?: PluggableList
  /** Final HTML transforms after ordinary rehype plugins, before outline/highlighting. */
  rehypePostPlugins?: PluggableList
}

export function definePlugin(plugin: PureStackPlugin): PureStackPlugin {
  return plugin
}
