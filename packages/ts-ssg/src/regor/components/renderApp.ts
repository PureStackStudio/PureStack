import { parseHTML } from 'linkedom'
import { createApp } from 'regor'

import { registerDomGlobals } from '../registerDomGlobals'
import { card, cardGrid } from './cardGrid'

export const renderApp = (html: string) => {
  const isDocument =
    html.startsWith('<!DOCTYPE html>') || html.startsWith('<html')
  const htmlToParse = isDocument
    ? html
    : `<!DOCTYPE html><html><body>${html}</body></html>`
  const { document, window } = parseHTML(htmlToParse)
  const restoreGlobals = registerDomGlobals(window, document)

  try {
    createApp(
      {
        components: { cardGrid, card },
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
