import {
  createAlertComponents,
  createBadgeComponents,
  createButtonComponents,
  createConsentComponents,
  createContactFormComponents,
  createExpandablePanelComponents,
  createFlexComponents,
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
  createPanelComponents,
  createPricingComponents,
  createSearchComponents,
  createTabsComponents,
  createThemeSwitcherComponents,
  createTopBarComponents,
} from '@purestack/ts-components'
import { ensureDomGlobals } from '@purestack/ts-minidom'
import { componentRegistry } from '@purestack/ts-render'
import {
  registerNormalizeStyles,
  registerSemanticToneUtilityStyles,
  styleBuilder,
} from '@purestack/ts-style'
import { createScriptComponents } from '../../../ts-components/src/standard/pageScript/pageScript'
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
  componentRegistry.registerMany(createExpandablePanelComponents())
  componentRegistry.registerMany(createFlexComponents())
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
  componentRegistry.registerMany(createPanelComponents())
  componentRegistry.registerMany(createPageTocComponents())
  componentRegistry.registerMany(createPricingComponents())
  componentRegistry.registerMany(createScriptComponents())
  componentRegistry.registerMany(createSearchComponents())
  componentRegistry.registerMany(createTabsComponents())
  registerSemanticToneUtilityStyles()
}
