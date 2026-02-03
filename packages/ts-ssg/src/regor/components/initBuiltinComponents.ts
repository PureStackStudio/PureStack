import { createCardComponents } from './cardGrid'
import { createDocHeaderComponents } from './docHeader'
import { registerDocLayoutStyles } from './docLayoutStyles'
import { createNavigationComponents } from './navComponent'
import { componentRegistry } from './registry'

export function initBuiltinComponents() {
  registerDocLayoutStyles()
  componentRegistry.registerMany(createCardComponents())
  componentRegistry.registerMany(createDocHeaderComponents())
  componentRegistry.registerMany(createNavigationComponents())
}
