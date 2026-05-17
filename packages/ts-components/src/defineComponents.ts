import { defineAlertComponents } from './standard/alertBox/alertBox'
import { defineBadgeComponents } from './standard/badge/badge'
import { defineBarChartComponents } from './standard/barChart/barChart'
import { defineButtonComponents } from './standard/btn/btn'
import { defineConsentComponents } from './standard/consent/consent'
import { defineContactFormComponents } from './standard/contactForm/contactForm'
import { defineDoughnutChartComponents } from './standard/doughnutChart/doughnutChart'
import { defineExpandablePanelComponents } from './standard/expandablePanel/expandablePanel'
import { defineFlexComponents } from './standard/flex/flex'
import { defineFooterComponents } from './standard/footer/footer'
import { defineFormComponents } from './standard/form/form'
import { defineFormInputField } from './standard/form/formInputField'
import { defineFormSelectField } from './standard/form/formSelectField'
import { defineGridComponents } from './standard/grid/grid'
import { defineIconComponents, type GetSvgIcon } from './standard/icon/icon'
import { defineLandingComponents } from './standard/landing/landing'
import { defineLineChartComponents } from './standard/lineChart/lineChart'
import { defineLogoComponents } from './standard/logo/logo'
import { defineModalComponents } from './standard/modal/modal'
import { defineNavigationComponents } from './standard/navMenu/navMenu'
import { defineScriptComponents } from './standard/pageScript/pageScript'
import { definePageTocComponents } from './standard/pageToc/pageToc'
import { definePanelComponents } from './standard/panel/panel'
import { definePricingComponents } from './standard/pricing/pricing'
import { defineSearchComponents } from './standard/searchBox/searchBox'
import { defineSectionHeaderComponents } from './standard/sectionHeader/sectionHeader'
import { defineSignInComponents } from './standard/signIn/signIn'
import { defineTabsComponents } from './standard/tabs/tabs'
import { defineThemeSwitcherComponents } from './standard/themeSwitcher/themeSwitcher'
import { defineTopBarComponents } from './standard/topBar/topBar'
import { defineVirtualListComponents } from './standard/virtualList/virtualList'
import { defineVirtualTableComponents } from './standard/virtualList/virtualTable'

export function defineComponents(getSvgIcon: GetSvgIcon) {
  return {
    ...defineAlertComponents(),
    ...defineBarChartComponents(),
    ...defineBadgeComponents(),
    ...defineButtonComponents(),
    ...defineConsentComponents(),
    ...defineContactFormComponents(),
    ...defineDoughnutChartComponents(),
    ...defineExpandablePanelComponents(),
    ...defineFlexComponents(),
    ...defineFooterComponents(),
    ...defineFormComponents(),
    ...defineFormInputField(),
    ...defineFormSelectField(),
    ...defineGridComponents(),
    ...defineIconComponents(getSvgIcon),
    ...defineLandingComponents(),
    ...defineLineChartComponents(),
    ...defineLogoComponents(),
    ...defineModalComponents(),
    ...defineTopBarComponents(),
    ...defineThemeSwitcherComponents(),
    ...defineVirtualListComponents(),
    ...defineVirtualTableComponents(),
    ...defineNavigationComponents(),
    ...definePanelComponents(),
    ...definePageTocComponents(),
    ...definePricingComponents(),
    ...defineSearchComponents(),
    ...defineSectionHeaderComponents(),
    ...defineSignInComponents(),
    ...defineTabsComponents(),
    ...defineScriptComponents(),
  }
}
