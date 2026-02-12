import { describe, expect, it } from 'vitest'

import { renderApp } from './renderApp'

describe('renderApp', () => {
  it('returns doctype-prefixed html for full document input', () => {
    const output = renderApp('<html><body><main>ok</main></body></html>')

    expect(output.startsWith('<!DOCTYPE html><html')).toBe(true)
    expect(output).toContain('<main>ok</main>')
  })
})
