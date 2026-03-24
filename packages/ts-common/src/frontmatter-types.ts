export interface FrontmatterLayoutOptions {
  navMode: 'sidebar' | 'drawer'
  fullWidth: boolean
  showToc: boolean
  tocCollapsed?: boolean
  showFooter: boolean
  [key: string]: unknown
}

export interface FrontmatterNavOptions {
  title?: string
  order?: number
  hidden: boolean
  [key: string]: unknown
}

export interface FrontmatterEmbedOptions {
  tabs?: 'head' | 'body'
  modal?: 'head' | 'body'
  [key: string]: unknown
}

export interface PageFrontmatter {
  title?: string
  description?: string
  head?: Record<string, unknown>
  template: string
  order?: number
  hidden: boolean
  draft: boolean
  nav: FrontmatterNavOptions
  layout: FrontmatterLayoutOptions
  embed?: FrontmatterEmbedOptions
  [key: string]: unknown
}

export interface ParsedFrontmatterSource {
  body: string
  frontmatter: PageFrontmatter
}
