import { createCardComponents } from './cardGrid'
import { registerDocLayoutStyles } from './docLayoutStyles'
import { createNavigationComponents } from './navComponent'
import { componentRegistry } from './registry'
import { createTopBarComponents } from './topBar'

export function initBuiltinComponents() {
  registerDocLayoutStyles()
  componentRegistry.registerMany(createCardComponents())
  componentRegistry.registerMany(createTopBarComponents())
  componentRegistry.registerMany(createNavigationComponents())
}
