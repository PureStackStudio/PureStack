import { AsyncLocalStorage } from 'node:async_hooks'
import { ensureDomGlobals, useDomScope } from '@purestack/ts-minidom'

// Each page renders in a DOM of its own, which async hooks keep while they
// await, so renders in `serve` can overlap.
const pageDomScope = new AsyncLocalStorage()

export function initRenderer() {
  ensureDomGlobals()
  useDomScope(pageDomScope)
}
