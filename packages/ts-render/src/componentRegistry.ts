import { isPlainObject } from '@purestack/ts-util'
import type { Component } from 'regor'

const registry = new Map<string, Component<never>>()

export const componentRegistry = {
  register(name: string, component: Component<never>) {
    registry.set(name, component)
  },
  registerMany<TComponents>(...components: (TComponents | object)[]) {
    for (const compSet of components) {
      if (!isPlainObject(compSet)) continue
      for (const [name, component] of Object.entries(compSet)) {
        registry.set(name, component as Component<never>)
      }
    }
  },
  getAll(): Record<string, Component> {
    return Object.fromEntries(registry.entries())
  },
  hasComponentName(name: string) {
    return hasComponentName(name, registry)
  },
  clear() {
    registry.clear()
  },
}

function hasComponentName(
  input: string,
  source: Map<string, Component<never>>,
) {
  const normalizedInput = normalizeComponentName(input)
  if (!normalizedInput) return false
  for (const key of source.keys()) {
    const normalizedKey = normalizeComponentName(key)
    if (!normalizedKey) continue
    if (normalizedKey === normalizedInput) return true
  }
  return false
}

function normalizeComponentName(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  return trimmed.toLowerCase().replace(/[^a-z0-9]/g, '')
}
