import { ensureDomGlobals } from '../minidom/createDom'
import { registerNormalizeStyles } from '../style/normalize.css'
import { styleBuilder } from '../style/styles'
import { registerDocLayoutStyles } from '../templates/docLayoutStyles'
import { registerMarkdownStyles } from '../templates/markdownStyles'
import { createAlertComponents } from './components/alert/alert'
import { createBadgeComponents } from './components/badge/badge'
import { createButtonComponents } from './components/button/btn'
import { createCardComponents } from './components/cardGrid/cardGrid'
import { createConsentComponents } from './components/consent/consent'
import { createContactFormComponents } from './components/contactForm/contactForm'
import { createFooterComponents } from './components/footer/footer'
import { createFormComponents } from './components/form/form'
import { createGridComponents } from './components/grid/grid'
import { createHeroComponents } from './components/hero/hero'
import { createIconComponents } from './components/icon/icon'
import { createLoginComponents } from './components/login/login'
import { createLogoComponents } from './components/logo/logo'
import { createModalComponents } from './components/modal/modal'
import { createNavigationComponents } from './components/navMenu/navMenu'
import { createPageTocComponents } from './components/pageToc/pageToc'
import { createPricingComponents } from './components/pricing/pricing'
import { createScriptComponents } from './components/script/script'
import { createSearchComponents } from './components/searchBox/searchBox'
import { createTabsComponents } from './components/tabs/tabs'
import { createThemeSwitcherComponents } from './components/themeSwitcher/themeSwitcher'
import { createTopBarComponents } from './components/topBar/topBar'
import { componentRegistry } from './registry'

export interface BuiltinComponentInitOptions {
  includeShikiStyles?: boolean
}

export function initBuiltinComponents(
  options: BuiltinComponentInitOptions = {},
) {
  ensureDomGlobals()
  styleBuilder.reset()
  componentRegistry.clear()
  registerNormalizeStyles()
  registerDocLayoutStyles()
  registerMarkdownStyles({ includeShikiStyles: options.includeShikiStyles })
  componentRegistry.registerMany(createAlertComponents())
  componentRegistry.registerMany(createBadgeComponents())
  componentRegistry.registerMany(createButtonComponents())
  componentRegistry.registerMany(createCardComponents())
  componentRegistry.registerMany(createConsentComponents())
  componentRegistry.registerMany(createContactFormComponents())
  componentRegistry.registerMany(createFooterComponents())
  componentRegistry.registerMany(createFormComponents())
  componentRegistry.registerMany(createGridComponents())
  componentRegistry.registerMany(createHeroComponents())
  componentRegistry.registerMany(createIconComponents())
  componentRegistry.registerMany(createLoginComponents())
  componentRegistry.registerMany(createLogoComponents())
  componentRegistry.registerMany(createModalComponents())
  componentRegistry.registerMany(createTopBarComponents())
  componentRegistry.registerMany(createThemeSwitcherComponents())
  componentRegistry.registerMany(createNavigationComponents())
  componentRegistry.registerMany(createPageTocComponents())
  componentRegistry.registerMany(createPricingComponents())
  componentRegistry.registerMany(createScriptComponents())
  componentRegistry.registerMany(createSearchComponents())
  componentRegistry.registerMany(createTabsComponents())
}
