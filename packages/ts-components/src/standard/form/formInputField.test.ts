import { createDom, ensureDomGlobals } from '@purestack/ts-minidom'
import { createApp, ref } from 'regor'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineIconComponents } from '../icon/icon'
import { defineFormInputField } from './formInputField'

describe('FormInputField', () => {
  it('keeps the autocomplete attribute reactive', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const model = ref('Ada')
    const autocomplete = ref<string | null>('name')
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

      autocomplete(null)
      expect(input?.getAttribute('autocomplete')).toBe('off')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })

  it('renders shared icons at the start and end of the input shell', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const model = ref('Ada')
    const app = createApp(
      {
        components: {
          ...defineIconComponents((name) =>
            name === 'iconoir:mail'
              ? '<svg viewBox="0 0 24 24"><path d="M4 6h16"/></svg>'
              : name === 'iconoir:search'
                ? '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/></svg>'
                : '',
          ),
          ...defineFormInputField(),
        },
        tsSsgContext: createTestContext(),
        model,
      },
      {
        selector: '#app',
        template:
          '<FormInputField :model="model" icon="iconoir:mail" iconEnd="iconoir:search" />',
      },
    )

    try {
      const shell = document.querySelector('.form-block__input-shell')
      const icons = document.querySelectorAll('.form-block__input-icon')

      expect(shell).toBeTruthy()
      expect(icons).toHaveLength(2)
      expect(document.body.innerHTML).toContain('form-block__input-icon')
      expect(document.body.innerHTML).toContain('<path d="M4 6h16"></path>')
      expect(document.body.innerHTML).toContain(
        '<circle cx="11" cy="11" r="6"></circle>',
      )
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })
})
