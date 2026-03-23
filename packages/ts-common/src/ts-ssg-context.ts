import type { ThemeOptions } from '@purestack/ts-style'
import type { NavItem, SiteConfig } from './index'

export interface PageOutlineItem {
  id: string
  title: string
  children?: PageOutlineItem[]
}

export interface TsSsgPageInfo {
  relPath: string
  urlPath?: string
  frontmatter: {
    embed?: {
      modal?: 'body' | 'head'
      tabs?: 'body' | 'head'
    }
    layout: {
      navMode?: 'sidebar' | 'drawer'
      fullWidth?: boolean
      showToc?: boolean
      showFooter?: boolean
    }
  }
}

export interface TsSsgNavigation {
  global?: NavItem[]
  items?: NavItem[]
}

export interface TsSsgContext {
  site: SiteConfig
  pageInfo: TsSsgPageInfo
  navigation?: TsSsgNavigation
  outline?: PageOutlineItem[]
  theme: ThemeOptions
  recordScriptEntrypoint: (sourceRelPath: string) => void
  recordRuntimeEmbed: (name: string, position: 'body' | 'head') => void
}
