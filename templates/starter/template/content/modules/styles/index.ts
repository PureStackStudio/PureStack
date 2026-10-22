import { styleBuilder, themes } from '@purestack/ts-style'
import { registerHomeStyles } from './home'
import { registerShellStyles } from './shell'

export type StarterStyle = ReturnType<typeof styleBuilder.get>

export function registerStarterStyles() {
  themes.forEach((theme, palette) => {
    const root = styleBuilder.get(theme)
    registerShellStyles(root, palette)
    registerHomeStyles(root, palette)
  })
}
