import { createCardComponents } from './cardGrid'
import { registerDocLayoutStyles } from './docLayoutStyles'
import { createNavigationComponents } from './navComponent'
import { componentRegistry } from './registry'

export function initBuiltinComponents() {
  registerDocLayoutStyles()
  componentRegistry.registerMany(createCardComponents())
  componentRegistry.registerMany(createNavigationComponents())
}
