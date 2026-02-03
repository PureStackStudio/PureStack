import type { SiteConfig } from './config/config'
import type { PageNavigation } from './navigation/navigation'
import type { PageTemplatePage } from './page-templates'
import type { ThemeOptions } from './style/themeOptions'

export interface TsSsgContext {
  site: SiteConfig
  page?: PageTemplatePage
  navigation?: PageNavigation
  theme: ThemeOptions
}
