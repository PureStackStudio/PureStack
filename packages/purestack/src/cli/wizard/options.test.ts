import { runInDom } from '@purestack/ts-minidom'
import { createApp, html, sref } from 'regor'
import { describe, expect, it } from 'vitest'
import { defineWizardComponents } from '../../../wizard/modules/components'
import type { WizardOption } from '../../../wizard/modules/model'
import type { OptionValue } from '../../../wizard/modules/shared/protocol'

describe('template option controls', () => {
  it('renders select choices and writes the selected value back to the shared option', () =>
    runInDom('<div id="wizard-app"></div>', (document) => {
      const entry: WizardOption = {
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
        { components: defineWizardComponents(), entry },
        {
          selector: '#wizard-app',
          template: html`<WizardOptionField :option="entry"/>`,
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
