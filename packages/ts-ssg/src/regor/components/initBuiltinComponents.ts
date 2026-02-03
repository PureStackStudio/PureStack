import { ensureDomGlobals } from '../registerDomGlobals'
import { createCardComponents } from './cardGrid'
import { registerDocLayoutStyles } from './docLayoutStyles'
import { createNavigationComponents } from './navComponent'
import { componentRegistry } from './registry'
import { createThemeSwitcherComponents } from './themeSwitcher'
import { createTopBarComponents } from './topBar'

let initialized = false

export function initBuiltinComponents() {
  if (initialized) return
  initialized = true
  ensureDomGlobals()
  registerDocLayoutStyles()
  componentRegistry.registerMany(createCardComponents())
  componentRegistry.registerMany(createTopBarComponents())
  componentRegistry.registerMany(createThemeSwitcherComponents())
  componentRegistry.registerMany(createNavigationComponents())
}
