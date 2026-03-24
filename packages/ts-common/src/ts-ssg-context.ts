import type { ThemeOptions } from '@purestack/ts-style'
import type { NavItem, PageInfo, SiteConfig } from './index'

export interface PageOutlineItem {
  id: string
  title: string
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
  recordRuntimeEmbed: (name: string, position: 'body' | 'head') => void
}
