import { styleBuilder, themes } from '@purestack/ts-style'
import { registerCreationStyles } from './creation'
import { registerDashboardStyles } from './dashboard'
import { registerFooterStyles } from './footer'
import { registerShellStyles } from './shell'

export type WizardStyle = ReturnType<typeof styleBuilder.get>

export function registerWizardStyles() {
  themes.forEach((theme, palette) => {
    const root = styleBuilder.get(theme)
    registerShellStyles(root, palette)
    registerDashboardStyles(root, palette)
    registerCreationStyles(root, palette)
    registerFooterStyles(root, palette)
  })
}
