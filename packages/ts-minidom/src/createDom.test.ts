import { describe, expect, it } from 'vitest'
import { type AsyncScope, createDom, runInDom, useDomScope } from './createDom'

const tick = () => new Promise((resolve) => setTimeout(resolve, 5))

describe('runInDom', () => {
  it('points the DOM globals at its own document and returns what render returns', () => {
    const title = runInDom('<html><body><h1>Own</h1></body></html>', (doc) => {
      expect(globalThis.document).toBe(doc)
      expect(globalThis.window.document).toBe(doc)
      return document.querySelector('h1')?.textContent
    })

    expect(title).toBe('Own')
  })

  it('keeps its document across awaits until the render finishes', async () => {
    const text = await runInDom(
      '<html><body><p>first</p></body></html>',
      async (doc) => {
        await tick()
        expect(globalThis.document).toBe(doc)
        document.body.appendChild(document.createTextNode(' then'))
        return document.body.textContent
      },
    )

    expect(text).toBe('first then')
  })

  it('restores the outer document after a nested render', async () => {
    await runInDom('<html><body>outer</body></html>', async (outer) => {
      const inner = await runInDom(
        '<html><body>inner</body></html>',
        async () => {
          await tick()
          return document.body.textContent
        },
      )
      expect(inner).toBe('inner')
      expect(globalThis.document).toBe(outer)
    })
  })

  it('returns to the process DOM when the render finishes, even when it fails', async () => {
    const restore = createDom('<html><body><p>process</p></body></html>')
    try {
      const processDocument = globalThis.document

      expect(() =>
        runInDom('<html><body></body></html>', () => {
          throw new Error('Render failed.')
        }),
      ).toThrow('Render failed.')
      await expect(
        runInDom('<html><body></body></html>', async () => {
          await tick()
          throw new Error('Async render failed.')
        }),
      ).rejects.toThrow('Async render failed.')

      expect(globalThis.document).toBe(processDocument)
      expect(document.body.textContent).toBe('process')
    } finally {
      restore()
    }
  })

  it('keeps each DOM in the scope useDomScope installs', () => {
    const runs: unknown[] = []
    let store: unknown
    const scope: AsyncScope = {
      getStore: () => store,
      run(next, callback) {
        runs.push(next)
        store = next
        try {
          return callback()
        } finally {
          store = undefined
        }
      },
    }
    const restore = useDomScope(scope)
    try {
      runInDom('<html><body></body></html>', (doc) => {
        expect(globalThis.document).toBe(doc)
      })
    } finally {
      restore()
    }

    expect(runs).toHaveLength(1)
    expect((runs[0] as { document: unknown }).document).toBeDefined()
  })
})

describe('createDom', () => {
  it('restores the previous process DOM', () => {
    const restoreOuter = createDom('<html><body>outer</body></html>')
    try {
      const outer = globalThis.document
      const restoreInner = createDom('<html><body>inner</body></html>')
      expect(document.body.textContent).toBe('inner')
      restoreInner()
      expect(globalThis.document).toBe(outer)
    } finally {
      restoreOuter()
    }
  })
})
