import { createDom, ensureDomGlobals } from '@purestack/ts-minidom'
import { createApp, ref } from 'regor'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineFormComponents } from './form'

describe('FormCheck', () => {
  it('renders a native checkbox with the custom visual control', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const app = createApp(
      {
        components: defineFormComponents(),
        tsSsgContext: createTestContext(),
      },
      {
        selector: '#app',
        template:
          '<FormCheck id="terms" label="Accept terms" name="terms" value="yes" checked="true" aria-describedby="terms-desc" data-track="terms" />',
      },
    )

    try {
      const label =
        document.querySelector<HTMLLabelElement>('.form-block__check')
      const input = document.querySelector<HTMLInputElement>(
        '.form-block__check-input',
      )

      expect(label?.getAttribute('for')).toBe('terms')
      expect(input).toBeTruthy()
      expect(input?.type).toBe('checkbox')
      expect(input?.id).toBe('terms')
      expect(input?.getAttribute('name')).toBe('terms')
      expect(input?.value).toBe('yes')
      expect(input?.checked).toBe(true)
      expect(input?.getAttribute('aria-describedby')).toBe('terms-desc')
      expect(input?.getAttribute('data-track')).toBe('terms')
      expect(document.querySelector('.form-block__check-control')).toBeTruthy()
      expect(
        document.querySelector('.form-block__check-label')?.textContent,
      ).toBe('Accept terms')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })

  it('keeps checked and disabled state reactive', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const checked = ref(false)
    const disabled = ref(false)
    const app = createApp(
      {
        components: defineFormComponents(),
        tsSsgContext: createTestContext(),
        checked,
        disabled,
      },
      {
        selector: '#app',
        template:
          '<FormCheck :checked="checked" :disabled="disabled" label="Notify me" />',
      },
    )

    try {
      const input = document.querySelector<HTMLInputElement>(
        '.form-block__check-input',
      )

      expect(input).toBeTruthy()
      expect(input?.checked).toBe(false)
      expect(input?.getAttribute('disabled')).toBeNull()

      checked(true)
      disabled(true)

      expect(input?.checked).toBe(true)
      expect(input?.getAttribute('disabled')).toBe('')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })

  it('treats checked="false" as unchecked', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const app = createApp(
      {
        components: defineFormComponents(),
        tsSsgContext: createTestContext(),
      },
      {
        selector: '#app',
        template: '<FormCheck label="Optional" checked="false" />',
      },
    )

    try {
      const input = document.querySelector<HTMLInputElement>(
        '.form-block__check-input',
      )

      expect(input?.checked).toBe(false)
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })
})
