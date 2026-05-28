import { createDom, ensureDomGlobals } from '@purestack/ts-minidom'
import { createApp, defineComponent, html, ref, sref } from 'regor'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineIconComponents } from '../icon/icon'
import {
  type AutoCompleteOption,
  defineAutoCompleteInputComponents,
  type ResolvedAutoCompleteOption,
} from './autoCompleteInput'
import { defineFormInputField } from './formInputField'

describe('AutoCompleteInput', () => {
  it('reuses the form input surface and renders filtered suggestions', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const model = ref('de')
    const options = sref<AutoCompleteOption[]>([
      { label: 'Design', value: 'design' },
      { label: 'Engineering', value: 'engineering' },
      { label: 'Delivery', value: 'delivery' },
    ])
    const app = createApp(
      {
        components: {
          ...defineIconComponents((name) =>
            name === 'lucide:chevron-down'
              ? '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>'
              : name === 'lucide:check'
                ? '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>'
                : '',
          ),
          ...defineFormInputField(),
          ...defineAutoCompleteInputComponents(),
        },
        tsSsgContext: createTestContext(),
        model,
        options,
      },
      {
        selector: '#app',
        template:
          '<AutoCompleteInput label="Team" :model="model" :options="options" minLength="1" />',
      },
    )

    try {
      const input = document.querySelector<HTMLInputElement>('input')
      const field = document.querySelector('.form-block__field')
      const shell = document.querySelector('.form-block__input-shell')

      expect(input).toBeTruthy()
      expect(field).toBeTruthy()
      expect(shell).toBeTruthy()
      expect(input?.getAttribute('role')).toBe('combobox')
      expect(input?.getAttribute('aria-expanded')).toBe('false')

      input?.dispatchEvent(new Event('focusin', { bubbles: true }))

      expect(input?.getAttribute('aria-expanded')).toBe('true')
      expect(document.querySelectorAll('[role="option"]')).toHaveLength(2)
      expect(document.body.innerHTML).toContain('Design')
      expect(document.body.innerHTML).toContain('Delivery')
      expect(document.body.innerHTML).not.toContain('Engineering')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })

  it('selects suggestions with keyboard navigation', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const model = ref('d')
    const selectedValue = ref<string | number | null>(null)
    const selectedLabels: string[] = []
    const options = sref<AutoCompleteOption[]>([
      { label: 'Design', value: 'design' },
      { label: 'Delivery', value: 'delivery' },
    ])
    const app = createApp(
      {
        components: {
          ...defineIconComponents(() => ''),
          ...defineFormInputField(),
          ...defineAutoCompleteInputComponents(),
        },
        tsSsgContext: createTestContext(),
        model,
        selectedValue,
        options,
        handleSelect: (option: ResolvedAutoCompleteOption) => {
          selectedLabels.push(option.label)
        },
      },
      {
        selector: '#app',
        template:
          '<AutoCompleteInput :model="model" :selectedValue="selectedValue" :options="options" @optionselect="handleSelect($event.detail.option)" />',
      },
    )

    try {
      const input = document.querySelector<HTMLInputElement>('input')
      input?.dispatchEvent(createKeyboardEvent('ArrowDown'))
      input?.dispatchEvent(createKeyboardEvent('ArrowDown'))
      input?.dispatchEvent(createKeyboardEvent('Enter'))

      expect(model()).toBe('Delivery')
      expect(selectedValue()).toBe('delivery')
      expect(selectedLabels).toEqual(['Delivery'])
      expect(input?.getAttribute('aria-expanded')).toBe('false')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })

  it('renders custom suggestion rows through the row component name', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const model = ref('ada')
    const options = sref<AutoCompleteOption[]>([
      { label: 'Ada Lovelace', value: 'ada', keywords: ['engine'] },
    ])
    const customRow = defineComponent<{
      option: ResolvedAutoCompleteOption
      active: boolean
      query: string
    }>(
      html`<article class="person-row" :data-active="active">
        <strong>{{ option.label }}</strong>
        <small>{{ query }}</small>
      </article>`,
      {
        props: ['option', 'active', 'query'],
        context: (head) => head.props,
      },
    )
    const app = createApp(
      {
        components: {
          customAutoCompleteRow: customRow,
          ...defineIconComponents(() => ''),
          ...defineFormInputField(),
          ...defineAutoCompleteInputComponents(),
        },
        tsSsgContext: createTestContext(),
        model,
        options,
      },
      {
        selector: '#app',
        template:
          '<AutoCompleteInput :model="model" :options="options" rowComponent="CustomAutoCompleteRow" />',
      },
    )

    try {
      const input = document.querySelector<HTMLInputElement>('input')
      input?.dispatchEvent(new Event('focusin', { bubbles: true }))

      const row = document.querySelector('.person-row')
      expect(row).toBeTruthy()
      expect(row?.getAttribute('data-active')).toBe('true')
      expect(row?.textContent).toContain('Ada Lovelace')
      expect(row?.textContent).toContain('ada')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })
})

function createKeyboardEvent(key: string) {
  const event = new Event('keydown', { bubbles: true })
  Object.defineProperty(event, 'key', { value: key })
  return event
}
