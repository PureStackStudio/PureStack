import type { ThemeOptions } from '@purestack/ts-style'
import type { NavItem, PageInfo, SiteConfig } from './index'

export interface PageOutlineItem {
  id: string
  title: string
  depth?: number
  children?: PageOutlineItem[]
}

export interface TsSsgNavigation {
  global?: NavItem[]
  items?: NavItem[]
}

export interface TsSsgContext {
  site: SiteConfig
  pageInfo: PageInfo
  navigation?: TsSsgNavigation
  outline?: PageOutlineItem[]
  theme: ThemeOptions
  recordScriptEntrypoint: (sourceRelPath: string) => void
  resolveScriptPublicPath?: (sourceRelPath: string) => string
  recordRuntimeEmbed: (name: string, position: 'body' | 'head') => void
}
