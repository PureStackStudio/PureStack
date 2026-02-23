import { ensureDomGlobals } from '../minidom/createDom'
import { registerNormalizeStyles } from '../style/normalize.css'
import { styleBuilder } from '../style/styles'
import { registerDocLayoutStyles } from '../templates/docLayoutStyles'
import { registerMarkdownStyles } from '../templates/markdownStyles'
import { createAlertComponents } from './components/alert/alert'
import { createBadgeComponents } from './components/badge/badge'
import { createCardComponents } from './components/cardGrid/cardGrid'
import { createConsentComponents } from './components/consent/consent'
import { createContactFormComponents } from './components/contactForm/contactForm'
import { createFooterComponents } from './components/footer/footer'
import { createFormComponents } from './components/form/form'
import { createHeroComponents } from './components/hero/hero'
import { createLoginComponents } from './components/login/login'
import { createLogoComponents } from './components/logo/logo'
import { createNavigationComponents } from './components/navMenu/navMenu'
import { createPageTocComponents } from './components/pageToc/pageToc'
import { createPricingComponents } from './components/pricing/pricing'
import { createScriptComponents } from './components/script/script'
import { createSearchComponents } from './components/searchBox/searchBox'
import { createThemeSwitcherComponents } from './components/themeSwitcher/themeSwitcher'
import { createTopBarComponents } from './components/topBar/topBar'
import { componentRegistry } from './registry'

export function initBuiltinComponents() {
  ensureDomGlobals()
  styleBuilder.reset()
  componentRegistry.clear()
  registerNormalizeStyles()
  registerDocLayoutStyles()
  registerMarkdownStyles()
  componentRegistry.registerMany(createAlertComponents())
  componentRegistry.registerMany(createBadgeComponents())
  componentRegistry.registerMany(createCardComponents())
  componentRegistry.registerMany(createConsentComponents())
  componentRegistry.registerMany(createContactFormComponents())
  componentRegistry.registerMany(createFooterComponents())
  componentRegistry.registerMany(createFormComponents())
  componentRegistry.registerMany(createHeroComponents())
  componentRegistry.registerMany(createLoginComponents())
  componentRegistry.registerMany(createLogoComponents())
  componentRegistry.registerMany(createTopBarComponents())
  componentRegistry.registerMany(createThemeSwitcherComponents())
  componentRegistry.registerMany(createNavigationComponents())
  componentRegistry.registerMany(createPageTocComponents())
  componentRegistry.registerMany(createPricingComponents())
  componentRegistry.registerMany(createScriptComponents())
  componentRegistry.registerMany(createSearchComponents())
}
