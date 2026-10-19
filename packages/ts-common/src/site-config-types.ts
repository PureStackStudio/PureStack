import type {
  SemanticTone,
  ThemeOptions,
  ThemeOptionsInput,
} from '@purestack/ts-style'
import type { DeepPartial } from '@purestack/ts-util'
import type { ConsentConfig } from './consent-types'
import type { SiteLogoConfig } from './logo-types'
import type { NavigationConfig } from './navMenu-types'

/** Settings normalized by the builder before plugin configuration runs. */
export interface CoreSiteConfig {
  rootDir: string
  contentDir: string
  outDir: string
  publishDir: string
  basePath: string
  siteTitle: string
  html: SiteHtmlConfig
  navigation: NavigationConfig
  scripts: SiteScriptsConfig
  sitemap: SitemapConfig
  i18n: I18nConfig
  mdx: SiteMdxConfig
  /**
   * Whether plugins may read and write persistent caches outside the output
   * directory. Set per run (`--no-cache`, `options.cache`), never by site settings.
   */
  cache: boolean
}

export interface SiteConfig extends CoreSiteConfig {
  /** Plugin-owned settings, normalized by the installed owners. */
  extensions: SiteExtensions
  favicon?: string
  logo?: SiteLogoConfig
  docLayout?: DocLayoutConfig
  style?: SiteStyleConfig
  pageToc?: PageTocConfig
  auth?: AuthConfig
  consent?: ConsentConfig
  analytics?: AnalyticsConfig
  pagefind?: PagefindConfig
  preview?: PreviewConfig
}

/** Plugins may augment this interface with optional, typed namespaces. */
export interface SiteExtensions {
  [plugin: string]: unknown
}

export interface DocLayoutConfig {
  /** CSS length reserved above desktop navigation and TOC sidebars. */
  sidebarTop: string
  /** CSS length reserved above mobile navigation and TOC drawers. */
  sidebarTopMobile: string
}

export interface PageTocConfig {
  enabled: boolean
  tone: SemanticTone
  /** Treatment of the table of contents panel, such as flat, surfaceAlt or glass. */
  variant?: string
  /** Extra classes for the table of contents panel. */
  class?: string
}

export interface AuthConfig {
  enabled: boolean
  signUp: boolean
  signedInStorageKey: string
}

export interface SiteScriptsConfig {
  cacheBusting: boolean
}

export interface SiteStyleConfig {
  fileName: string
  href: string
  themes: string[]
  pretty: boolean
  theme: ThemeOptions
}

export interface SiteHtmlConfig {
  minify: boolean
}

export interface SitemapConfig {
  enabled: boolean
  baseUrl: string
  fileName: string
  robots: RobotsConfig
}

export interface RobotsConfig {
  enabled: boolean
  fileName: string
  userAgent: string
  allow: string[]
  disallow: string[]
  crawlDelay?: number
  host?: string
  additionalSitemaps: string[]
  customDirectives: string[]
}

export interface Ga4Config {
  enabled: boolean
  measurementId?: string
  serviceId: string
  consentCategory: string
}

export interface AnalyticsConfig {
  ga4: Ga4Config
}

export interface PagefindConfig {
  enabled: boolean
  excludePaths: string[]
}

export interface PreviewConfig {
  title?: string
  description?: string
  image?: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
  siteName?: string
  type?: string
  locale?: string
  twitterCard?: string
  twitterSite?: string
  twitterCreator?: string
}

export type I18nUrlStrategy = 'prefix-all' | 'hidden'

export interface I18nConfig {
  enabled: boolean
  defaultLocale: string
  locales: string[]
  urlStrategy: I18nUrlStrategy
  queryParam: string
  cookieName: string
}

export interface SiteMdxConfig {
  /** An optional provider-owned backend identifier. Core does not select an engine. */
  highlighter?: string
  disableHighlighter: boolean
  compileMdAsMdx: boolean
}

export type SiteStyleConfigInput = DeepPartial<
  Omit<SiteStyleConfig, 'theme'>
> & {
  theme?: ThemeOptionsInput
}

export type SiteConfigInput = DeepPartial<
  Omit<SiteConfig, 'style' | 'cache'>
> & {
  style?: SiteStyleConfigInput
}

/** Core fields are ready; plugin sections may still contain partial input. */
export type SiteConfigDraft = CoreSiteConfig &
  Omit<SiteConfigInput, keyof CoreSiteConfig | 'extensions'> & {
    extensions: DeepPartial<SiteExtensions>
  }

/** Inputs for a pure configuration contribution, before build factories run. */
export interface SiteConfigResolution<TConfig = SiteConfigDraft> {
  config: TConfig
  input: SiteConfigInput
  file: SiteConfigInput
}

export type SiteConfigResolver = (
  source: SiteConfigResolution,
) => DeepPartial<SiteConfig>

/** Runs after every installed owner's normalizer has completed. */
export type SiteConfigFinalizer = (
  source: SiteConfigResolution<SiteConfig>,
) => DeepPartial<SiteConfig>

/** Overrides, normalization, then dependent settings; all run before factories. */
export interface SiteConfigContributions {
  resolve?: SiteConfigResolver
  normalize?: SiteConfigResolver
  finalize?: SiteConfigFinalizer
}
