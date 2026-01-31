import { createCardComponents } from './cardGrid'
import { componentRegistry } from './registry'

export function initBuiltinComponents() {
  componentRegistry.registerMany(createCardComponents())
}
