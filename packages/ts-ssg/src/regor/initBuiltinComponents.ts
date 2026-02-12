import { registerNormalizeStyles } from '../style/normalize.css'
import { styleBuilder } from '../style/styles'
import { registerDocLayoutStyles } from '../templates/docLayoutStyles'
import { registerMarkdownStyles } from '../templates/markdownStyles'
import { createAlertComponents } from './components/alert'
import { createCardComponents } from './components/cardGrid'
import { createFooterComponents } from './components/footer'
import { createHeroComponents } from './components/hero'
import { createLogoComponents } from './components/logo'
import { createNavigationComponents } from './components/navMenu'
import { createPageTocComponents } from './components/pageToc'
import { createPricingComponents } from './components/pricing'
import { createSearchComponents } from './components/searchBox'
import { createThemeSwitcherComponents } from './components/themeSwitcher'
import { createTopBarComponents } from './components/topBar'
import { ensureDomGlobals } from './registerDomGlobals'
import { componentRegistry } from './registry'

export function initBuiltinComponents() {
  ensureDomGlobals()
  styleBuilder.reset()
  componentRegistry.clear()
  registerNormalizeStyles()
  registerDocLayoutStyles()
  registerMarkdownStyles()
  componentRegistry.registerMany(createAlertComponents())
  componentRegistry.registerMany(createCardComponents())
  componentRegistry.registerMany(createFooterComponents())
  componentRegistry.registerMany(createHeroComponents())
  componentRegistry.registerMany(createLogoComponents())
  componentRegistry.registerMany(createTopBarComponents())
  componentRegistry.registerMany(createThemeSwitcherComponents())
  componentRegistry.registerMany(createNavigationComponents())
  componentRegistry.registerMany(createPageTocComponents())
  componentRegistry.registerMany(createPricingComponents())
  componentRegistry.registerMany(createSearchComponents())
}
