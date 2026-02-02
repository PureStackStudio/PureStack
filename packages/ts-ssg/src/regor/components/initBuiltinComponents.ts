import { createCardComponents } from './cardGrid'
import { createNavigationComponents } from './navigation'
import { componentRegistry } from './registry'

export function initBuiltinComponents() {
  componentRegistry.registerMany(createCardComponents())
  componentRegistry.registerMany(createNavigationComponents())
}
