import { parseHTML } from 'linkedom'
import { createApp, ref } from 'regor'
import { describe, expect, it } from 'vitest'

import { registerDomGlobals } from './registerDomGlobals'

describe('regor + linkedom', () => {
  it('renders a template into a linkedom document', () => {
    const { document, window } = parseHTML(
      '<html><body><div id="app"><button>Count is: {{ count }}</button></div></body></html>',
    )
    const restoreGlobals = registerDomGlobals(window, document)

    try {
      const app = document.getElementById('app')
      if (!app) throw new Error('Missing #app container')

      createApp({ count: ref(0) }, { element: app })

      expect(app.textContent?.trim()).toBe('Count is: 0')
    } finally {
      restoreGlobals()
    }
  })
})
