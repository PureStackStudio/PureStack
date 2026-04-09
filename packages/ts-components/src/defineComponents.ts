import { createAlertComponents } from './standard/alertBox/alertBox'
import { createBadgeComponents } from './standard/badge/badge'
import { createButtonComponents } from './standard/btn/btn'
import { createConsentComponents } from './standard/consent/consent'
import { createContactFormComponents } from './standard/contactForm/contactForm'
import { createExpandablePanelComponents } from './standard/expandablePanel/expandablePanel'
import { createFlexComponents } from './standard/flex/flex'
import { createFooterComponents } from './standard/footer/footer'
import { createFormComponents } from './standard/form/form'
import { createGridComponents } from './standard/grid/grid'
import { createHeroComponents } from './standard/hero/hero'
import { createIconComponents, type GetSvgIcon } from './standard/icon/icon'
import { createLoginComponents } from './standard/login/login'
import { createLogoComponents } from './standard/logo/logo'
import { createModalComponents } from './standard/modal/modal'
import { createNavigationComponents } from './standard/navMenu/navMenu'
import { createScriptComponents } from './standard/pageScript/pageScript'
import { createPageTocComponents } from './standard/pageToc/pageToc'
import { createPanelComponents } from './standard/panel/panel'
import { createPricingComponents } from './standard/pricing/pricing'
import { createSearchComponents } from './standard/searchBox/searchBox'
import { createTabsComponents } from './standard/tabs/tabs'
import { createThemeSwitcherComponents } from './standard/themeSwitcher/themeSwitcher'
import { createTopBarComponents } from './standard/topBar/topBar'

export function defineComponents(getSvgIcon: GetSvgIcon) {
  return {
    ...createAlertComponents(),
    ...createBadgeComponents(),
    ...createButtonComponents(),
    ...createConsentComponents(),
    ...createContactFormComponents(),
    ...createExpandablePanelComponents(),
    ...createFlexComponents(),
    ...createFooterComponents(),
    ...createFormComponents(),
    ...createGridComponents(),
    ...createHeroComponents(),
    ...createIconComponents(getSvgIcon),
    ...createLoginComponents(),
    ...createLogoComponents(),
    ...createModalComponents(),
    ...createTopBarComponents(),
    ...createThemeSwitcherComponents(),
    ...createNavigationComponents(),
    ...createPanelComponents(),
    ...createPageTocComponents(),
    ...createPricingComponents(),
    ...createScriptComponents(),
    ...createSearchComponents(),
    ...createTabsComponents(),
  }
}
