import type { BasicHeadConfig, TSNode } from '@purestack/ts-html'
import type { ThemeStylesheetLink } from '@purestack/ts-style'
import type { PageFrontmatter } from './frontmatter-types'
import type { PageNavigation } from './navMenu-types'

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
  navigation?: PageNavigation
  pageInfo: PageInfo
  siteTitle?: string
  headerHtml?: string
  footerHtml?: string
}

export type PageTemplate = (
  input: PageTemplateInput,
) => TSNode<'html'> | Promise<TSNode<'html'>>

export type PageTemplateMap = Record<string, PageTemplate>
