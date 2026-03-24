import {
  createAlertComponents,
  createBadgeComponents,
  createButtonComponents,
  createConsentComponents,
  createContactFormComponents,
  createFooterComponents,
  createFormComponents,
  createGridComponents,
  createHeroComponents,
  createIconComponents,
  createLoginComponents,
  createLogoComponents,
  createModalComponents,
  createNavigationComponents,
  createPageTocComponents,
  createPricingComponents,
  createScriptComponents,
  createSearchComponents,
  createTabsComponents,
  createThemeSwitcherComponents,
  createTopBarComponents,
} from '@purestack/ts-components'
import { ensureDomGlobals } from '@purestack/ts-minidom'
import { componentRegistry } from '@purestack/ts-render'
import { registerNormalizeStyles, styleBuilder } from '@purestack/ts-style'
import { registerDocLayoutStyles } from '../templates/docLayoutStyles'
import { registerMarkdownStyles } from '../templates/markdownStyles'

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
