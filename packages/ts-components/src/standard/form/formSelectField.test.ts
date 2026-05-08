import { createDom, ensureDomGlobals } from '@purestack/ts-minidom'
import { createApp, ref, sref } from 'regor'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineIconComponents } from '../icon/icon'
import {
  defineFormSelectField,
  type FormSelectOption,
} from './formSelectField'

describe('FormSelectField', () => {
  it('renders placeholder, options, and the default select affordance', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const model = ref('')
    const options = sref<FormSelectOption[]>([
      { label: 'Design', value: 'design' },
      { label: 'Engineering', value: 'engineering', disabled: true },
    ])
    const app = createApp(
      {
        components: {
          ...defineIconComponents((name) =>
            name === 'lucide:chevron-down'
              ? '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>'
              : '',
          ),
          ...defineFormSelectField(),
        },
        tsSsgContext: createTestContext(),
        model,
        options,
      },
      {
        selector: '#app',
        template:
          '<FormSelectField label="Team" placeholder="Choose a team" :model="model" :options="options" required="true" />',
      },
    )

    try {
      const select = document.querySelector<HTMLSelectElement>('select')
      const renderedOptions = document.querySelectorAll('option')
      const icon = document.querySelector('.form-block__select-icon')

      expect(select).toBeTruthy()
      expect(select?.getAttribute('required')).toBe('')
      expect(renderedOptions).toHaveLength(3)
      expect(renderedOptions[0]?.value).toBe('')
      expect(renderedOptions[0]?.getAttribute('disabled')).toBe('')
      expect(renderedOptions[0]?.textContent).toBe('Choose a team')
      expect(renderedOptions[1]?.value).toBe('design')
      expect(renderedOptions[1]?.textContent).toBe('Design')
      expect(renderedOptions[2]?.getAttribute('disabled')).toBe('')
      expect(icon).toBeTruthy()
      expect(document.body.innerHTML).toContain('<path d="m6 9 6 6 6-6"></path>')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })

  it('keeps attributes and options reactive', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const model = ref('standard')
    const autocomplete = ref('organization')
    const disabled = ref(false)
    const options = sref<FormSelectOption[]>([
      { label: 'Standard', value: 'standard' },
      { label: 'Priority', value: 'priority' },
    ])
    const app = createApp(
      {
        components: {
          ...defineIconComponents(() => ''),
          ...defineFormSelectField(),
        },
        tsSsgContext: createTestContext(),
        model,
        autocomplete,
        disabled,
        options,
      },
      {
        selector: '#app',
        template:
          '<FormSelectField :model="model" :autocomplete="autocomplete" :disabled="disabled" :options="options" />',
      },
    )

    try {
      const select = document.querySelector<HTMLSelectElement>('select')

      expect(select).toBeTruthy()
      expect(select?.getAttribute('autocomplete')).toBe('organization')
      expect(select?.getAttribute('disabled')).toBeNull()
      expect(document.querySelectorAll('option')).toHaveLength(2)

      autocomplete(undefined)
      disabled(true)
      options([{ label: 'Enterprise', value: 'enterprise' }])

      expect(select?.getAttribute('autocomplete')).toBe('off')
      expect(select?.getAttribute('disabled')).toBe('')
      expect(document.querySelectorAll('option')).toHaveLength(1)
      expect(document.querySelector('option')?.textContent).toBe('Enterprise')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })
})
