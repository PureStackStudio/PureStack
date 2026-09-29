import { defineAlertComponents } from './standard/alertBox/alertBox'
import { defineBadgeComponents } from './standard/badge/badge'
import { defineBarChartComponents } from './standard/barChart/barChart'
import { defineButtonComponents } from './standard/btn/btn'
import { defineBtnGroupComponents } from './standard/btnGroup/btnGroup'
import { defineClassicLogoComponents } from './standard/classicLogo/classicLogo'
import { defineComposerComponents } from './standard/composer/composer'
import { defineConsentComponents } from './standard/consent/consent'
import { defineContactFormComponents } from './standard/contactForm/contactForm'
import { defineDoughnutChartComponents } from './standard/doughnutChart/doughnutChart'
import { defineDropFilesComponents } from './standard/dropFiles/dropFiles'
import { defineExpandablePanelComponents } from './standard/expandablePanel/expandablePanel'
import { defineFlexComponents } from './standard/flex/flex'
import { defineFooterComponents } from './standard/footer/footer'
import { defineAutoCompleteInputComponents } from './standard/form/autoCompleteInput'
import { defineFormComponents } from './standard/form/form'
import { defineFormInputField } from './standard/form/formInputField'
import { defineFormSelectField } from './standard/form/formSelectField'
import { defineMultiAutoCompleteInputComponents } from './standard/form/multiAutoCompleteInput'
import { defineGridComponents } from './standard/grid/grid'
import { defineIconComponents, type GetSvgIcon } from './standard/icon/icon'
import { defineLandingComponents } from './standard/landing/landing'
import { defineLineChartComponents } from './standard/lineChart/lineChart'
import { defineLogoComponents } from './standard/logo/logo'
import { defineModalComponents } from './standard/modal/modal'
import { defineNavigationComponents } from './standard/navMenu/navMenu'
import { definePageLinksComponents } from './standard/pageLinks/pageLinks'
import { defineScriptComponents } from './standard/pageScript/pageScript'
import { definePageTocComponents } from './standard/pageToc/pageToc'
import { definePanelComponents } from './standard/panel/panel'
import { definePricingComponents } from './standard/pricing/pricing'
import { defineSearchComponents } from './standard/searchBox/searchBox'
import { defineSectionHeaderComponents } from './standard/sectionHeader/sectionHeader'
import { defineSignInComponents } from './standard/signIn/signIn'
import { defineTabsComponents } from './standard/tabs/tabs'
import { defineThemeSwitcherComponents } from './standard/themeSwitcher/themeSwitcher'
import { defineToastComponents } from './standard/toast/toastHost'
import { defineTopBarComponents } from './standard/topBar/topBar'
import { defineVariableVirtualTableComponents } from './standard/virtualList/variableVirtualTable'
import { defineVirtualListComponents } from './standard/virtualList/virtualList'
import { defineVirtualTableComponents } from './standard/virtualList/virtualTable'

export function defineComponents(getSvgIcon: GetSvgIcon) {
  return {
    ...defineAlertComponents(),
    ...defineBarChartComponents(),
    ...defineBadgeComponents(),
    ...defineButtonComponents(),
    ...defineBtnGroupComponents(),
    ...defineConsentComponents(),
    ...defineContactFormComponents(),
    ...defineComposerComponents(),
    ...defineDoughnutChartComponents(),
    ...defineDropFilesComponents(),
    ...defineExpandablePanelComponents(),
    ...defineFlexComponents(),
    ...defineFooterComponents(),
    ...defineAutoCompleteInputComponents(),
    ...defineFormComponents(),
    ...defineFormInputField(),
    ...defineFormSelectField(),
    ...defineMultiAutoCompleteInputComponents(),
    ...defineGridComponents(),
    ...defineIconComponents(getSvgIcon),
    ...defineLandingComponents(),
    ...defineLineChartComponents(),
    ...defineLogoComponents(),
    ...defineClassicLogoComponents(),
    ...defineModalComponents(),
    ...defineTopBarComponents(),
    ...defineThemeSwitcherComponents(),
    ...defineToastComponents(),
    ...defineVirtualListComponents(),
    ...defineVirtualTableComponents(),
    ...defineVariableVirtualTableComponents(),
    ...defineNavigationComponents(),
    ...definePanelComponents(),
    ...definePageLinksComponents(),
    ...definePageTocComponents(),
    ...definePricingComponents(),
    ...defineSearchComponents(),
    ...defineSectionHeaderComponents(),
    ...defineSignInComponents(),
    ...defineTabsComponents(),
    ...defineScriptComponents(),
  }
}
