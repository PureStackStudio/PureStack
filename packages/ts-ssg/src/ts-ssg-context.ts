import type { SiteConfig } from './config/config'
import type { PageNavigation } from './navigation/navigation'
import type { PageTemplatePage } from './page-templates'

export interface TsSsgContext {
  site: SiteConfig
  page?: PageTemplatePage
  navigation?: PageNavigation
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
