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
  locale?: string
  translationKey?: string
  translations?: PageTranslationInfo[]
}

export interface PageTranslationInfo {
  locale: string
  urlPath: string
  relPath: string
}

export interface PageHeadConfigInput {
  site: SiteConfig
  pageInfo: PageInfo
}

/** Supplies head defaults before explicit page frontmatter overrides. */
export type PageHeadConfigTemplate = (
  input: PageHeadConfigInput,
) => BasicHeadConfig | Promise<BasicHeadConfig>

export interface PageTemplateInput extends PageHeadConfigInput {
  head: TSNode<'head'>
  bodyHtml: string
  headConfig?: BasicHeadConfig
  styleLinks?: ThemeStylesheetLink[]
  templateName: string
  navigation?: PageNavigation
  outline?: PageOutlineItem[]
  headerHtml?: string
  footerHtml?: string
}

export type PageTemplate = (
  input: PageTemplateInput,
) => TSNode<'html'> | Promise<TSNode<'html'>>

export type PageTemplateMap = Record<string, PageTemplate>

/** Composes head markup before the page template receives it. */
export type PageHeadTemplate = (
  input: PageTemplateInput,
) => TSNode<'head'> | Promise<TSNode<'head'>>
