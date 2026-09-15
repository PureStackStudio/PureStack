import { styleBuilder, themes } from '@purestack/ts-style'
import { registerArchitectureStyles } from './architectureStyles'
import { registerClosingStyles } from './closingStyles'
import { registerCompositionStyles } from './compositionStyles'
import { registerEcosystemStyles } from './ecosystemStyles'
import { registerFeaturesStyles } from './featuresStyles'
import { registerFooterStyles } from './footerStyles'
import { registerFoundationStyles } from './foundationStyles'
import { registerGettingStartedStyles } from './gettingStartedStyles'
import { registerHeroStyles } from './heroStyles'
import { registerNavigationStyles } from './navigationStyles'
import { registerResponsiveStyles } from './responsiveStyles'
import { registerWorkbenchStyles } from './workbenchStyles'

/** Extend the framework's generated theme styles with the launch page's layouts. */
export function registerStudioStyles() {
  themes.forEach((theme, palette) => {
    const root = styleBuilder.get(theme)
    registerFoundationStyles(root, palette)
    registerNavigationStyles(root, palette)
    registerHeroStyles(root, palette)
    registerWorkbenchStyles(root, palette)
    registerFeaturesStyles(root, palette)
    registerArchitectureStyles(root, palette)
    registerEcosystemStyles(root, palette)
    registerGettingStartedStyles(root, palette)
    registerClosingStyles(root, palette)
    registerFooterStyles(root, palette)
    registerResponsiveStyles(root, palette)
    registerCompositionStyles(root, palette)
  })
}
