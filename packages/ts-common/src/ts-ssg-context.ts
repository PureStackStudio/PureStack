import type { ThemeOptions } from '@purestack/ts-style'
import type {
  NavItem,
  PageInfo,
  PageNavigationLinks,
  SiteConfig,
} from './index'

export interface PageOutlineItem {
  id: string
  title: string
  depth?: number
  children?: PageOutlineItem[]
}

export interface TsSsgNavigation {
  folder?: string
  root?: string
  global?: NavItem[]
  items?: NavItem[]
  pageLinks?: PageNavigationLinks
}

export interface TsSsgContext {
  site: SiteConfig
  pageInfo: PageInfo
  navigation?: TsSsgNavigation
  outline?: PageOutlineItem[]
  theme: ThemeOptions
  basePath: string
  locale?: string
  locales: string[]
  defaultLocale?: string
  resolveLocaleHref: (locale: string) => string | undefined
  resolvePublicHref: (href: string) => string
  recordScriptEntrypoint: (sourceRelPath: string) => void
  resolveScriptPublicPath?: (sourceRelPath: string) => string
  recordRuntimeEmbed: (name: string, position: 'body' | 'head') => void
}
