import type { Component } from 'regor'

const registry = new Map<string, Component<unknown>>()

export const componentRegistry = {
  register<TProps>(name: string, component: Component<TProps>) {
    registry.set(name, component as Component<unknown>)
  },
  registerMany<TProps>(components: Record<string, Component<TProps>>) {
    for (const [name, component] of Object.entries(components)) {
      registry.set(name, component as Component<unknown>)
    }
  },
  getAll(): Record<string, Component<unknown>> {
    return Object.fromEntries(registry.entries())
  },
}
