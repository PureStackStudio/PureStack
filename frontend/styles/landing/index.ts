import { styleBuilder, themes } from '@purestack/ts-style'
import { registerArchitectureStyles } from './architecture'
import { registerClosingStyles } from './closing'
import { registerCompositionStyles } from './composition'
import { registerEcosystemStyles } from './ecosystem'
import { registerFeaturesStyles } from './features'
import { registerFooterStyles } from './footer'
import { registerFoundationStyles } from './foundation'
import { registerGettingStartedStyles } from './getting-started'
import { registerHeroStyles } from './hero'
import { registerNavigationStyles } from './navigation'
import { registerResponsiveStyles } from './responsive'
import { registerWorkbenchStyles } from './workbench'

/** Extend the framework's generated theme styles with the launch page's layouts. */
export function registerLandingStyles() {
  themes.forEach((theme, palette) => {
    const root = styleBuilder.get(theme)
    root
      .select(':scope')
      .css({ colorScheme: theme === 'light' ? 'light' : 'dark' })
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
