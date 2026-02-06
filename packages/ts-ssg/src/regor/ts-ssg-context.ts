import type { SiteConfig } from '../config/config'
import type { PageOutlineItem } from '../mdx/mdx'
import type { PageNavigation } from '../navigation/navigation'
import type { ThemeOptions } from '../style/themeOptions'
import type { PageTemplatePage } from '../templates/page-templates'

export interface TsSsgContext {
  site: SiteConfig
  page?: PageTemplatePage
  navigation?: PageNavigation
  outline?: PageOutlineItem[]
  theme: ThemeOptions
}
