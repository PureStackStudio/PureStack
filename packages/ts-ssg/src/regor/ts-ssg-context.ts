import type { SiteConfig } from '../config/config'
import type { PageOutlineItem } from '../mdx/mdx'
import type { PageNavigation } from '../navigation/navigation'
import type { ThemeOptions } from '../style/themeOptions'
import type { PageInfo } from '../templates/page-templates'

export interface TsSsgContext {
  site: SiteConfig
  pageInfo: PageInfo
  navigation?: PageNavigation
  outline?: PageOutlineItem[]
  theme: ThemeOptions
}
