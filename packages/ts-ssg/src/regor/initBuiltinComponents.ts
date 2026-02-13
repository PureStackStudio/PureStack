import { registerNormalizeStyles } from '../style/normalize.css'
import { styleBuilder } from '../style/styles'
import { registerDocLayoutStyles } from '../templates/docLayoutStyles'
import { registerMarkdownStyles } from '../templates/markdownStyles'
import { createAlertComponents } from './components/alert/alert'
import { createCardComponents } from './components/cardGrid/cardGrid'
import { createConsentComponents } from './components/consent/consent'
import { createContactFormComponents } from './components/contactForm/contactForm'
import { createFooterComponents } from './components/footer/footer'
import { createHeroComponents } from './components/hero/hero'
import { createLogoComponents } from './components/logo/logo'
import { createNavigationComponents } from './components/navMenu/navMenu'
import { createPageTocComponents } from './components/pageToc/pageToc'
import { createPricingComponents } from './components/pricing/pricing'
import { createSearchComponents } from './components/searchBox/searchBox'
import { createThemeSwitcherComponents } from './components/themeSwitcher/themeSwitcher'
import { createTopBarComponents } from './components/topBar/topBar'
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
  componentRegistry.registerMany(createConsentComponents())
  componentRegistry.registerMany(createContactFormComponents())
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
