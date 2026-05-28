import { createDom, ensureDomGlobals } from '@purestack/ts-minidom'
import { createApp, ref, sref } from 'regor'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineIconComponents } from '../icon/icon'
import type { AutoCompleteOption } from './autoCompleteInput'
import {
  defineMultiAutoCompleteInputComponents,
  type MultiAutoCompleteItem,
} from './multiAutoCompleteInput'

describe('MultiAutoCompleteInput', () => {
  it('renders selected items and appends selected suggestions', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const model = ref('gr')
    const items = sref<MultiAutoCompleteItem[]>([
      { label: 'Ada Lovelace', value: 'ada' },
    ])
    const options = sref<AutoCompleteOption[]>([
      { label: 'Ada Lovelace', value: 'ada' },
      { label: 'Grace Hopper', value: 'grace', keywords: ['compiler'] },
      { label: 'Katherine Johnson', value: 'katherine' },
    ])
    const selectedLabels: string[] = []
    const app = createApp(
      {
        components: {
          ...defineIconComponents(() => ''),
          ...defineMultiAutoCompleteInputComponents(),
        },
        tsSsgContext: createTestContext(),
        model,
        items,
        options,
        handleSelect: (
          _event: CustomEvent<{ item: MultiAutoCompleteItem }>,
        ) => {
          selectedLabels.push(String(_event.detail.item.label))
        },
      },
      {
        selector: '#app',
        template:
          '<MultiAutoCompleteInput label="People" :items="items" :model="model" :options="options" name="people" @optionselect="handleSelect($event)" />',
      },
    )

    try {
      const input =
        document.querySelector<HTMLInputElement>('input[type="text"]')
      expect(input).toBeTruthy()
      expect(input?.getAttribute('role')).toBe('combobox')
      expect(document.body.textContent).toContain('Ada Lovelace')

      input?.dispatchEvent(new Event('focusin', { bubbles: true }))

      expect(document.querySelectorAll('[role="option"]')).toHaveLength(1)
      expect(document.body.textContent).toContain('Grace Hopper')
      expect(document.body.textContent).not.toContain('Katherine Johnson')

      input?.dispatchEvent(createKeyboardEvent('Enter'))

      expect(items().map((item) => item.label)).toEqual([
        'Ada Lovelace',
        'Grace Hopper',
      ])
      expect(model()).toBe('')
      expect(selectedLabels).toEqual(['Grace Hopper'])
      expect(document.querySelectorAll('input[type="hidden"]')).toHaveLength(2)
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })

  it('creates custom items from separators and pasted text', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const model = ref('')
    const items = sref<MultiAutoCompleteItem[]>([])
    const created: string[] = []
    const app = createApp(
      {
        components: {
          ...defineIconComponents(() => ''),
          ...defineMultiAutoCompleteInputComponents(),
        },
        tsSsgContext: createTestContext(),
        model,
        items,
        createItem: (value: string) => ({
          label: value.toUpperCase(),
          value: value.toLowerCase(),
        }),
        recordCreate: (
          _event: CustomEvent<{ item: MultiAutoCompleteItem }>,
        ) => {
          created.push(String(_event.detail.item.value))
        },
      },
      {
        selector: '#app',
        template:
          '<MultiAutoCompleteInput :items="items" :model="model" :onCreateItem="createItem" @itemcreate="recordCreate($event)" />',
      },
    )

    try {
      const input =
        document.querySelector<HTMLInputElement>('input[type="text"]')
      expect(input).toBeTruthy()
      if (!input) return

      input.value = 'Alpha'
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.dispatchEvent(createKeyboardEvent(','))
      input.dispatchEvent(createPasteEvent('Beta; Gamma\nalpha'))

      expect(items().map((item) => item.label)).toEqual([
        'ALPHA',
        'BETA',
        'GAMMA',
      ])
      expect(created).toEqual(['alpha', 'beta', 'gamma'])
      expect(model()).toBe('')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })

  it('removes the previous item with backspace when the query is empty', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const model = ref('')
    const items = sref<MultiAutoCompleteItem[]>([
      { label: 'Alpha', value: 'alpha' },
      { label: 'Beta', value: 'beta' },
    ])
    const removed: string[] = []
    const app = createApp(
      {
        components: {
          ...defineIconComponents(() => ''),
          ...defineMultiAutoCompleteInputComponents(),
        },
        tsSsgContext: createTestContext(),
        model,
        items,
        recordRemove: (
          _event: CustomEvent<{ item: MultiAutoCompleteItem }>,
        ) => {
          removed.push(String(_event.detail.item.value))
        },
      },
      {
        selector: '#app',
        template:
          '<MultiAutoCompleteInput :items="items" :model="model" @itemremove="recordRemove($event)" />',
      },
    )

    try {
      const input =
        document.querySelector<HTMLInputElement>('input[type="text"]')
      input?.dispatchEvent(createKeyboardEvent('Backspace'))

      expect(items().map((item) => item.label)).toEqual(['Alpha'])
      expect(removed).toEqual(['beta'])
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })
})

function createKeyboardEvent(key: string) {
  const event = new Event('keydown', { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'key', { value: key })
  return event
}

function createPasteEvent(text: string) {
  const event = new Event('paste', { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'clipboardData', {
    value: {
      getData: () => text,
    },
  })
  return event
}
