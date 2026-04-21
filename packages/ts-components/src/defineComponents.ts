import { defineAlertComponents } from './standard/alertBox/alertBox'
import { defineBadgeComponents } from './standard/badge/badge'
import { defineButtonComponents } from './standard/btn/btn'
import { defineConsentComponents } from './standard/consent/consent'
import { defineContactFormComponents } from './standard/contactForm/contactForm'
import { defineExpandablePanelComponents } from './standard/expandablePanel/expandablePanel'
import { defineFlexComponents } from './standard/flex/flex'
import { defineFooterComponents } from './standard/footer/footer'
import { defineFormComponents } from './standard/form/form'
import { defineFormInputField } from './standard/form/formInputField'
import { defineGridComponents } from './standard/grid/grid'
import { defineHeroComponents } from './standard/hero/hero'
import { defineIconComponents, type GetSvgIcon } from './standard/icon/icon'
import { defineLoginComponents } from './standard/login/login'
import { defineLogoComponents } from './standard/logo/logo'
import { defineModalComponents } from './standard/modal/modal'
import { defineNavigationComponents } from './standard/navMenu/navMenu'
import { defineScriptComponents } from './standard/pageScript/pageScript'
import { definePageTocComponents } from './standard/pageToc/pageToc'
import { definePanelComponents } from './standard/panel/panel'
import { definePricingComponents } from './standard/pricing/pricing'
import { defineSearchComponents } from './standard/searchBox/searchBox'
import { defineSectionHeaderComponents } from './standard/sectionHeader/sectionHeader'
import { defineTabsComponents } from './standard/tabs/tabs'
import { defineThemeSwitcherComponents } from './standard/themeSwitcher/themeSwitcher'
import { defineTopBarComponents } from './standard/topBar/topBar'

export function defineComponents(getSvgIcon: GetSvgIcon) {
  return {
    ...defineAlertComponents(),
    ...defineBadgeComponents(),
    ...defineButtonComponents(),
    ...defineConsentComponents(),
    ...defineContactFormComponents(),
    ...defineExpandablePanelComponents(),
    ...defineFlexComponents(),
    ...defineFooterComponents(),
    ...defineFormComponents(),
    ...defineFormInputField(),
    ...defineGridComponents(),
    ...defineHeroComponents(),
    ...defineIconComponents(getSvgIcon),
    ...defineLoginComponents(),
    ...defineLogoComponents(),
    ...defineModalComponents(),
    ...defineTopBarComponents(),
    ...defineThemeSwitcherComponents(),
    ...defineNavigationComponents(),
    ...definePanelComponents(),
    ...definePageTocComponents(),
    ...definePricingComponents(),
    ...defineSearchComponents(),
    ...defineSectionHeaderComponents(),
    ...defineTabsComponents(),
    ...defineScriptComponents(),
  }
}
