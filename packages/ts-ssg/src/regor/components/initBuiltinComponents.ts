import { card, cardGrid } from './cardGrid'
import { componentRegistry } from './registry'

let initialized = false

export function initBuiltinComponents() {
  if (initialized) return
  initialized = true
  componentRegistry.registerMany({
    card,
    cardGrid,
  })
}
