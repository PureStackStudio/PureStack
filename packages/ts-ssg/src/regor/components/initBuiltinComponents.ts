import { createCardComponents } from './cardGrid'
import { createNavigationComponents } from './navComponent'
import { componentRegistry } from './registry'

export function initBuiltinComponents() {
  componentRegistry.registerMany(createCardComponents())
  componentRegistry.registerMany(createNavigationComponents())
}
