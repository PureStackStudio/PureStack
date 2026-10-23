import { runInDom } from '@purestack/ts-minidom'
import { createApp, html, sref } from 'regor'
import { describe, expect, it } from 'vitest'
import { defineComponents } from '../../../forge/modules/components'
import type { OptionState } from '../../../forge/modules/model'
import type { OptionValue } from '../../../forge/modules/shared/protocol'

describe('template option controls', () => {
  it('renders select choices and writes the selected value back to the shared option', () =>
    runInDom('<div id="forge-app"></div>', (document) => {
      const entry: OptionState = {
        field: {
          id: 'palette',
          label: 'Palette',
          description: 'Colors',
          type: 'select',
          default: 'blue',
          choices: [
            { label: 'Ocean', value: 'blue' },
            { label: 'Ember', value: 'orange' },
          ],
          bindings: [],
        },
        value: sref<OptionValue>('blue'),
      }
      const app = createApp(
        { components: defineComponents(), entry },
        {
          selector: '#forge-app',
          template: html`<OptionField :option="entry"/>`,
        },
      )
      try {
        const choices = document.querySelectorAll('option')
        expect(
          Array.from(choices).map((choice) => choice.textContent?.trim()),
        ).toEqual(['Ocean', 'Ember'])
        const select = document.querySelector('select') as HTMLSelectElement
        select.selectedIndex = 1
        select.dispatchEvent(new Event('change', { bubbles: true }))
        expect(entry.value()).toBe('orange')
      } finally {
        app.unbind()
      }
    }))
})
