import { registerNormalizeStyles } from '../style/normalize.css'
import { createCardComponents } from './components/cardGrid'
import { createNavigationComponents } from './components/navMenu'
import { createThemeSwitcherComponents } from './components/themeSwitcher'
import { createTopBarComponents } from './components/topBar'
import { registerDocLayoutStyles } from './docLayoutStyles'
import { ensureDomGlobals } from './registerDomGlobals'
import { componentRegistry } from './registry'

let initialized = false

export function initBuiltinComponents() {
  if (initialized) return
  initialized = true
  ensureDomGlobals()
  registerNormalizeStyles()
  registerDocLayoutStyles()
  componentRegistry.registerMany(createCardComponents())
  componentRegistry.registerMany(createTopBarComponents())
  componentRegistry.registerMany(createThemeSwitcherComponents())
  componentRegistry.registerMany(createNavigationComponents())
}
