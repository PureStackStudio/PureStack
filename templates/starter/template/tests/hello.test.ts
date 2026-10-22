import { runInDom } from '@purestack/ts-minidom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => vi.resetModules())

describe('home page greeting', () => {
  it('announces the greeting when the visitor clicks the button', () =>
    runInDom(
      '<button id="hello-button" type="button">Say hello</button><output id="hello-output" aria-live="polite"></output>',
      async (document) => {
        await import('../content/hello')
        const button =
          document.querySelector<HTMLButtonElement>('#hello-button')
        const output =
          document.querySelector<HTMLOutputElement>('#hello-output')

        expect(output?.textContent).toBe('')
        button?.click()
        expect(output?.textContent).toBe('Hello from your new PureStack site!')
      },
    ))

  it('can load on a page without the greeting controls', () =>
    runInDom('<main>Another page</main>', async () => {
      await expect(import('../content/hello')).resolves.toBeDefined()
    }))
})
