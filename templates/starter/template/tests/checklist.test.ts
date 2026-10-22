import { runInDom } from '@purestack/ts-minidom'
import { createApp, html } from 'regor'
import { describe, expect, it } from 'vitest'
import { defineLaunchChecklistComponent } from '../content/guide/checklist/checklist-component'

describe('launch checklist', () => {
  it('updates progress, announces completion, and resets every item', () =>
    runInDom('<div id="checklist"></div>', (document) => {
      const app = createApp(
        { components: { launchChecklist: defineLaunchChecklistComponent() } },
        { selector: '#checklist', template: html`<LaunchChecklist/>` },
      )
      try {
        const inputs = document.querySelectorAll<HTMLInputElement>(
          'input[type="checkbox"]',
        )
        const status = () =>
          document.querySelector('[role="status"]')?.textContent
        expect(inputs.length).toBe(6)
        expect(status()).toContain('0 of 6 complete')
        inputs[0].checked = true
        inputs[0].dispatchEvent(new Event('change', { bubbles: true }))
        expect(status()).toContain('1 of 6 complete')
        expect(
          Number(
            document.querySelector<HTMLProgressElement>('progress')?.value,
          ),
        ).toBe(1)
        for (const input of Array.from(inputs).slice(1)) {
          input.checked = true
          input.dispatchEvent(new Event('change', { bubbles: true }))
        }
        expect(status()).toContain('6 of 6 complete')
        expect(
          document.querySelector('[aria-live="polite"]')?.textContent,
        ).toContain('All checks complete')
        document.querySelector<HTMLButtonElement>('button')?.click()
        expect(status()).toContain('0 of 6 complete')
        expect(Array.from(inputs).every((input) => !input.checked)).toBe(true)
      } finally {
        app.unbind()
      }
    }))
})
