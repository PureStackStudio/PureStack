import { registerUtilityStyles } from '@purestack/ts-style'
import { registerAlertBoxStyles } from './standard/alertBox/alertBoxStyle'
import { registerBadgeStyles } from './standard/badge/badgeStyle'
import { registerButtonStyles } from './standard/btn/btnStyle'
import { registerConsentStyles } from './standard/consent/consentStyle'
import { registerContactFormStyles } from './standard/contactForm/contactFormStyle'
import { registerExpandablePanelStyles } from './standard/expandablePanel/expandablePanelStyle'
import { registerFlexStyles } from './standard/flex/flexStyle'
import { registerFooterStyles } from './standard/footer/footerStyle'
import { registerFormStyles } from './standard/form/formStyle'
import { registerGridStyles } from './standard/grid/gridStyle'
import { registerIconStyles } from './standard/icon/iconStyle'
import { registerLoginStyles } from './standard/login/loginStyle'
import { registerLogoStyles } from './standard/logo/logoStyle'
import { registerModalStyles } from './standard/modal/modalStyle'
import { registerNavStyles } from './standard/navMenu/navMenuStyle'
import { registerPageTocStyles } from './standard/pageToc/pageTocStyle'
import { registerPanelStyles } from './standard/panel/panelStyle'
import { registerPricingStyles } from './standard/pricing/pricingStyle'
import { registerSearchBoxStyles } from './standard/searchBox/searchBoxStyle'
import { registerSectionHeaderStyles } from './standard/sectionHeader/sectionHeaderStyle'
import { registerTabsStyles } from './standard/tabs/tabsStyle'
import { registerThemeSwitcherStyles } from './standard/themeSwitcher/themeSwitcherStyle'
import { registerTopBarStyles } from './standard/topBar/topBarStyle'

export function registerStyles() {
  registerUtilityStyles()
  registerAlertBoxStyles()
  registerBadgeStyles()
  registerButtonStyles()
  registerConsentStyles()
  registerContactFormStyles()
  registerExpandablePanelStyles()
  registerFlexStyles()
  registerFooterStyles()
  registerFormStyles()
  registerGridStyles()
  registerIconStyles()
  registerLoginStyles()
  registerLogoStyles()
  registerModalStyles()
  registerNavStyles()
  registerPageTocStyles()
  registerPanelStyles()
  registerPricingStyles()
  registerSearchBoxStyles()
  registerSectionHeaderStyles()
  registerTabsStyles()
  registerThemeSwitcherStyles()
  registerTopBarStyles()
}
