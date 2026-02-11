import { registerNormalizeStyles } from '../style/normalize.css'
import { registerDocLayoutStyles } from '../templates/docLayoutStyles'
import { registerMarkdownStyles } from '../templates/markdownStyles'
import { createAlertComponents } from './components/alert'
import { createCardComponents } from './components/cardGrid'
import { createFooterComponents } from './components/footer'
import { createHeroComponents } from './components/hero'
import { createNavigationComponents } from './components/navMenu'
import { createPageTocComponents } from './components/pageToc'
import { createPricingComponents } from './components/pricing'
import { createThemeSwitcherComponents } from './components/themeSwitcher'
import { createTopBarComponents } from './components/topBar'
import { ensureDomGlobals } from './registerDomGlobals'
import { componentRegistry } from './registry'

let initialized = false

export function initBuiltinComponents() {
  if (initialized) return
  initialized = true
  ensureDomGlobals()
  registerNormalizeStyles()
  registerDocLayoutStyles()
  registerMarkdownStyles()
  componentRegistry.registerMany(createAlertComponents())
  componentRegistry.registerMany(createCardComponents())
  componentRegistry.registerMany(createFooterComponents())
  componentRegistry.registerMany(createHeroComponents())
  componentRegistry.registerMany(createTopBarComponents())
  componentRegistry.registerMany(createThemeSwitcherComponents())
  componentRegistry.registerMany(createNavigationComponents())
  componentRegistry.registerMany(createPageTocComponents())
  componentRegistry.registerMany(createPricingComponents())
}
