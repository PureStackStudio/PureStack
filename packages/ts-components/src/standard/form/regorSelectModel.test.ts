import { createDom, ensureDomGlobals } from '@purestack/ts-minidom'
import { createApp, ref, sref } from 'regor'
import { describe, expect, it } from 'vitest'

describe('Regor select r-model', () => {
  it('keeps the model selected when options are replaced', async () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const model = ref('1')
    const options = sref([
      { label: 'Auth 2', value: '2' },
      { label: 'Auth 1', value: '1' },
    ])
    const app = createApp(
      {
        model,
        options,
      },
      {
        selector: '#app',
        template: `<select r-model="model">
          <option r-for="option in options" :value="option.value">
            {{ option.label }}
          </option>
        </select>`,
      },
    )

    try {
      const select = document.querySelector<HTMLSelectElement>('select')
      const selectedOption = () =>
        Array.from(document.querySelectorAll<HTMLOptionElement>('option')).find(
          (option) => option.selected,
        )

      expect(select).toBeTruthy()
      expect(model()).toBe('1')
      expect(select?.selectedIndex).toBe(1)
      expect(selectedOption()?.value).toBe('1')

      options([
        { label: 'Auth 2', value: '2' },
        { label: 'Auth 1', value: '1' },
      ])
      await Promise.resolve()

      expect(model()).toBe('1')
      expect(select?.selectedIndex).toBe(1)
      expect(selectedOption()?.value).toBe('1')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })
})
