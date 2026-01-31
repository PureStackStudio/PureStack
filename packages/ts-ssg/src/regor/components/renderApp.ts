import { parseHTML } from 'linkedom'
import { createApp } from 'regor'

import { registerDomGlobals } from '../registerDomGlobals'
import { card, cardGrid } from './cardGrid'

export const renderApp = (html: string) => {
  const isHtml =
    !html.startsWith('<!DOCTYPE html>') && !html.startsWith('<html')
  if (!isHtml) html = `<!DOCTYPE html><html><body>${html}</body></html>`
  const { document, window } = parseHTML(html)
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
    if (isHtml) return document.documentElement.outerHTML
    return document.body.innerHTML
  } finally {
    restoreGlobals()
  }
}
