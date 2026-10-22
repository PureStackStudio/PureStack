import type { SiteConfig } from 'purestack'
import { defineFooterBrandComponent } from './brand'
import { defineStarterFooterComponent } from './footer'
import { defineFooterNavigationComponent } from './navigation'
import { defineFooterStartCardComponent } from './start-card'

export function defineFooterComponents(config: SiteConfig) {
  return {
    starterFooter: defineStarterFooterComponent(),
    footerBrand: defineFooterBrandComponent(config.logo),
    footerNavigation: defineFooterNavigationComponent(),
    footerStartCard: defineFooterStartCardComponent(),
  }
}
