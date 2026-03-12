import { Consent } from '../standard/consent/consent'
import type { NavItem } from '../standard/navMenu/navMenu'
import type { ThemeOptions } from '../style/themeOptions'

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

export interface TsSsgSiteConfig {
  siteTitle?: string
  style: {
    theme: ThemeOptions
  }
  logo: {
    wordOne?: string
    wordTwo?: string
    subtitle?: string
    subtitleAlign?: 'start' | 'center' | 'end' | 'justify'
    href?: string
    iconSvg?: string
    iconSize?: string
    wordFontSize?: string
    subtitleFontSize?: string
  }
  consent: Consent
}

export interface TsSsgNavigation {
  global?: NavItem[]
  items?: NavItem[]
}

export interface TsSsgContext {
  site: TsSsgSiteConfig
  pageInfo: TsSsgPageInfo
  navigation?: TsSsgNavigation
  outline?: PageOutlineItem[]
  theme: ThemeOptions
  recordScriptEntrypoint: (sourceRelPath: string) => void
  recordRuntimeEmbed: (name: string, position: 'body' | 'head') => void
}
