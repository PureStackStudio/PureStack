import type { BasicHeadConfig, TSNode } from '@purestack/ts-html'
import type { ThemeStylesheetLink } from '@purestack/ts-style'
import type { PageFrontmatter } from './frontmatter-types'
import type { PageNavigation } from './navMenu-types'
import type { SiteConfig } from './site-config-types'
import type { PageOutlineItem } from './ts-ssg-context'

export interface PageInfo {
  relPath: string
  urlPath: string
  frontmatter: PageFrontmatter
}

export interface PageTemplateInput {
  head: TSNode<'head'>
  bodyHtml: string
  headConfig?: BasicHeadConfig
  styleLinks?: ThemeStylesheetLink[]
  templateName: string
  site: SiteConfig
  navigation?: PageNavigation
  outline?: PageOutlineItem[]
  pageInfo: PageInfo
  headerHtml?: string
  footerHtml?: string
}

export type PageTemplate = (
  input: PageTemplateInput,
) => TSNode<'html'> | Promise<TSNode<'html'>>

export type PageTemplateMap = Record<string, PageTemplate>
