import type { Component } from 'regor'
import { createApp } from 'regor'

import { parseHtml } from '../dom/minidom'
import { registerDomGlobals } from './registerDomGlobals'
import { componentRegistry } from './registry'
import type { TsSsgContext } from './ts-ssg-context'

export interface RenderAppOptions {
  components?: Record<string, Component<unknown>>
  context?: TsSsgContext
}

export const renderApp = (html: string, options: RenderAppOptions = {}) => {
  const isDocument =
    html.startsWith('<!DOCTYPE html>') || html.startsWith('<html')
  const htmlToParse = isDocument
    ? html
    : `<!DOCTYPE html><html><body>${html}</body></html>`
  const { document, window } = parseHtml(htmlToParse)
  const cleanup = registerDomGlobals(window, document)
  const snapshot = componentRegistry.snapshot()
  try {
    if (options.components) {
      componentRegistry.registerMany(options.components)
    }
    const components = {
      ...componentRegistry.getAll(),
    }
    createApp(
      {
        components,
        tsSsgContext: options.context,
      },
      {
        element: document.body as unknown as Node,
      },
    )
    if (isDocument) return document.documentElement?.outerHTML ?? ''
    return document.body?.innerHTML ?? ''
  } finally {
    componentRegistry.restore(snapshot)
    cleanup()
  }
}
