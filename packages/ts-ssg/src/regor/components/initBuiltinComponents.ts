import { createCardComponents } from './cardGrid'
import { registerDocLayoutStyles } from './docLayoutStyles'
import { createNavigationComponents } from './navComponent'
import { componentRegistry } from './registry'
import { createThemeSwitcherComponents } from './themeSwitcher'
import { createTopBarComponents } from './topBar'

export function initBuiltinComponents() {
  registerDocLayoutStyles()
  componentRegistry.registerMany(createCardComponents())
  componentRegistry.registerMany(createTopBarComponents())
  componentRegistry.registerMany(createThemeSwitcherComponents())
  componentRegistry.registerMany(createNavigationComponents())
}
