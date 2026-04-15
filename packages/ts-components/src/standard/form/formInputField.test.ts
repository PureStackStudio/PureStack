import { createDom, ensureDomGlobals } from '@purestack/ts-minidom'
import { createApp, ref } from 'regor'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineFormInputField } from './formInputField'

describe('FormInputField', () => {
  it('keeps the autocomplete attribute reactive', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const model = ref('Ada')
    const autocomplete = ref('name')
    const app = createApp(
      {
        components: defineFormInputField(),
        tsSsgContext: createTestContext(),
        model,
        autocomplete,
      },
      {
        selector: '#app',
        template:
          '<FormInputField :model="model" :autocomplete="autocomplete" />',
      },
    )

    try {
      const input = document.querySelector<HTMLInputElement>('input')

      expect(input).toBeTruthy()
      expect(input?.getAttribute('autocomplete')).toBe('name')

      autocomplete('email')

      expect(input?.getAttribute('autocomplete')).toBe('email')

      autocomplete(undefined)
      expect(input?.getAttribute('autocomplete')).toBe('off')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })
})
