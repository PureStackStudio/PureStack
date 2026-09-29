import type {
  SemanticTone,
  ThemeOptions,
  ThemeOptionsInput,
} from '@purestack/ts-style'
import type { DeepPartial } from '@purestack/ts-util'
import type { ConsentConfig } from './consent-types'
import type { SiteLogoConfig } from './logo-types'
import type { NavigationConfig } from './navMenu-types'

export interface SiteConfig {
  rootDir: string
  contentDir: string
  outDir: string
  publishDir: string
  basePath: string
  siteTitle: string
  favicon?: string
  logo: SiteLogoConfig
  style: SiteStyleConfig
  html: SiteHtmlConfig
  navigation: NavigationConfig
  pageToc: PageTocConfig
  auth: AuthConfig
  scripts: SiteScriptsConfig
  sitemap: SitemapConfig
  consent: ConsentConfig
  analytics: AnalyticsConfig
  pagefind: PagefindConfig
  preview: PreviewConfig
  i18n: I18nConfig
  mdx: SiteMdxConfig
}

export interface PageTocConfig {
  enabled: boolean
  tone: SemanticTone
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
  highlighter: 'shiki' | 'highlightjs'
  disableHighlighter: boolean
  compileMdAsMdx: boolean
}

export type SiteStyleConfigInput = DeepPartial<
  Omit<SiteStyleConfig, 'theme'>
> & {
  theme?: ThemeOptionsInput
}

export type SiteConfigInput = DeepPartial<Omit<SiteConfig, 'style'>> & {
  style?: SiteStyleConfigInput
}
