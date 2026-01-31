import { parseHTML } from 'linkedom'
import { createApp } from 'regor'

import { registerDomGlobals } from '../registerDomGlobals'
import { registerCardStyles } from './cardGrid'
import { initBuiltinComponents } from './initBuiltinComponents'
import { componentRegistry } from './registry'

export const renderApp = (html: string) => {
  const isDocument =
    html.startsWith('<!DOCTYPE html>') || html.startsWith('<html')
  const htmlToParse = isDocument
    ? html
    : `<!DOCTYPE html><html><body>${html}</body></html>`
  const { document, window } = parseHTML(htmlToParse)
  const restoreGlobals = registerDomGlobals(window, document)

  try {
    registerCardStyles()
    initBuiltinComponents()
    const components = {
      ...componentRegistry.getAll(),
    }
    createApp(
      {
        components,
        message: 'Hello from app!',
      },
      {
        element: document.body,
      },
    )
    if (isDocument) return document.documentElement.outerHTML
    return document.body.innerHTML
  } finally {
    restoreGlobals()
  }
}
