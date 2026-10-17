import type { Style } from '@purestack/ts-css'
import type { ThemeOptions } from './themeOptions'
import type { ThemePalette } from './themePalette'

/** Mutable style state owned by one site builder or standalone render. */
export interface StyleContext {
  styles: Map<string, Style>
  revisionOffset: number
  options?: ThemeOptions
  palettes?: Record<'light' | 'dark', ThemePalette>
}

/** Node's AsyncLocalStorage implements this without adding Node imports here. */
export interface StyleScope {
  getStore(): StyleContext | undefined
  run<R>(context: StyleContext, render: () => R): R
}

export function createStyleContext(): StyleContext {
  return { styles: new Map(), revisionOffset: 0 }
}

const standaloneContext = createStyleContext()
let scope: StyleScope | undefined
let sequentialContext: StyleContext | undefined

export function getStyleContext(): StyleContext {
  return scope?.getStore() ?? sequentialContext ?? standaloneContext
}

/** Installs async context propagation; returns a function that restores it. */
export function useStyleScope(next: StyleScope): () => void {
  const previous = scope
  scope = next
  return () => {
    scope = previous
  }
}

/** Without an async scope, standalone renders must run sequentially. */
export function runWithStyleContext<R>(
  context: StyleContext,
  render: () => R,
): R {
  if (scope) return scope.run(context, render)
  const previous = sequentialContext
  sequentialContext = context
  const restore = () => {
    sequentialContext = previous
  }
  try {
    const result = render()
    if (result instanceof Promise) return result.finally(restore) as R
    restore()
    return result
  } catch (error) {
    restore()
    throw error
  }
}
