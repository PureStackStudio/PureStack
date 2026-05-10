import type {
  SemanticTone,
  ThemeOptions,
  ThemeOptionsInput,
} from '@purestack/ts-style'
import type { DeepPartial } from '@purestack/ts-util'
import type { ConsentConfig } from './consent-types'
import type { NavigationConfig } from './navMenu-types'

export interface SiteConfig {
  rootDir: string
  contentDir: string
  outDir: string
  siteTitle: string
  favicon?: string
  logo: LogoConfig
  style: SiteStyleConfig
  html: SiteHtmlConfig
  navigation: NavigationConfig
  pageToc: PageTocConfig
  auth: AuthConfig
  sitemap: SitemapConfig
  consent: ConsentConfig
  analytics: AnalyticsConfig
  pagefind: PagefindConfig
  mdx: SiteMdxConfig
}

export interface PageTocConfig {
  tone: SemanticTone
}

export interface AuthConfig {
  enabled: boolean
  signUp: boolean
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

export interface LogoConfig {
  brand: string
  letterColors?: string
  subtitleLetterColors?: string
  colors?: string[]
  logoBackground?: number
  logoForeground?: number
  brandSize?: string
  brandSizeSm?: string
  brandSizeMd?: string
  brandSizeLg?: string
  brandSizeXl?: string
  subtitleSize?: string
  subtitleSizeSm?: string
  subtitleSizeMd?: string
  subtitleSizeLg?: string
  subtitleSizeXl?: string
  iconSize?: string
  iconSizeSm?: string
  iconSizeMd?: string
  iconSizeLg?: string
  iconSizeXl?: string
  subtitleInset?: string
  subtitleInsetSm?: string
  subtitleInsetMd?: string
  subtitleInsetLg?: string
  subtitleInsetXl?: string
  subtitle?: string
  href: string
  icon?: string
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
  excludePaths: string[]
}

export interface SiteMdxConfig {
  highlighter: 'shiki' | 'highlightjs'
  disableHighlighter: boolean
}

export type SiteStyleConfigInput = DeepPartial<
  Omit<SiteStyleConfig, 'theme'>
> & {
  theme?: ThemeOptionsInput
}

export type SiteConfigInput = DeepPartial<Omit<SiteConfig, 'style'>> & {
  style?: SiteStyleConfigInput
}
