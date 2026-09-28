import { createDom, ensureDomGlobals } from '@purestack/ts-minidom'
import { createApp, ref } from 'regor'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineIconComponents } from '../icon/icon'
import { createComposerBodyHtml, defineComposerComponents } from './composer'

describe('Composer', () => {
  it('updates the visible draft when an external HTML value needs normalization', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<html><body><div id="app"></div></body></html>',
    )
    const messageHtml = ref('<p>Original draft</p>')
    const messageText = ref('')
    const app = createApp(
      {
        components: {
          ...defineComposerComponents(),
          ...defineIconComponents(() => ''),
        },
        tsSsgContext: createTestContext(),
        messageHtml,
        messageText,
      },
      {
        selector: '#app',
        template: '<Composer :html="messageHtml" :text="messageText"/>',
      },
    )
    try {
      const editor = document.querySelector<HTMLElement>('.composer__editor')!
      expect(editor.textContent).toBe('Original draft')

      messageHtml(
        createComposerBodyHtml(
          '<p class="discard">Replacement <strong>draft</strong></p><script>unsafe()</script>',
        ),
      )

      expect(messageHtml()).not.toContain('<script>')
      expect(messageHtml()).not.toContain('class=')
      expect(editor.innerHTML).toBe(messageHtml())
      expect(editor.textContent).toBe('Replacement draft')
      expect(messageText()).toBe('Replacement draft')

      messageHtml('<p>Another draft</p>')
      expect(editor.innerHTML).toBe(messageHtml())
      expect(messageText()).toBe('Another draft')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })
})
