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
  getAll(): Record<string, Component<never>> {
    return Object.fromEntries(registry.entries())
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
