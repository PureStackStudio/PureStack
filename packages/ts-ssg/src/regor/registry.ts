import type { Component } from 'regor'

const registry = new Map<string, Component<never>>()

export const componentRegistry = {
  register<TProps>(name: string, component: Component<TProps>) {
    registry.set(name, component)
  },
  registerMany(components: Record<string, Component<never>>) {
    for (const [name, component] of Object.entries(components)) {
      registry.set(name, component)
    }
  },
  getAll(): Record<string, Component<unknown>> {
    return Object.fromEntries(registry.entries()) as Record<
      string,
      Component<unknown>
    >
  },
  hasComponentName(name: string) {
    return hasComponentName(name, registry)
  },
  snapshot(): Map<string, Component<never>> {
    return new Map(registry)
  },
  restore(snapshot: Map<string, Component<never>>) {
    registry.clear()
    for (const [name, component] of snapshot) {
      registry.set(name, component)
    }
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
