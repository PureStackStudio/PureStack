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

export interface TsSsgContextGlobal {
  tsSsgContext?: TsSsgContext
}

declare global {
  var tsSsgContext: TsSsgContext | undefined
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Window extends TsSsgContextGlobal {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface GlobalThis extends TsSsgContextGlobal {}
}

export {}
