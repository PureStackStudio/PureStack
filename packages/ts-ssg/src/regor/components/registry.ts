import type { Component } from 'regor'

export interface ComponentRegistry {
  register<TProps>(name: string, component: Component<TProps>): void
  registerMany<TProps>(components: Record<string, Component<TProps>>): void
  getAll(): Record<string, Component<unknown>>
}

const registry = new Map<string, Component<unknown>>()

export const componentRegistry: ComponentRegistry = {
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
