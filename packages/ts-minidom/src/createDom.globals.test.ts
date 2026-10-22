import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDom, runInDom } from './createDom'

// Globals are installed once per module, so this file starts from Node's own.
const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
const nodeStorage = {} as Storage
const read = vi.fn(() => nodeStorage)
const write = vi.fn()
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  enumerable: true,
  get: read,
  set: write,
})

beforeEach(() => {
  read.mockClear()
  write.mockClear()
})

afterAll(() => {
  if (original) Object.defineProperty(globalThis, 'localStorage', original)
  else Reflect.deleteProperty(globalThis, 'localStorage')
})

describe('original DOM globals', () => {
  it('stay unread until code outside a DOM reads them', () => {
    const restore = createDom('<html><body></body></html>')
    try {
      localStorage.setItem('theme', 'dark')
      runInDom('<html><body></body></html>', () => {
        expect(localStorage.getItem('theme')).toBeNull()
      })
      expect(localStorage.getItem('theme')).toBe('dark')
      expect(read).not.toHaveBeenCalled()
    } finally {
      restore()
    }
    expect(globalThis.localStorage).toBe(nodeStorage)
    expect(read).toHaveBeenCalledOnce()
  })

  it('are replaced by assignment without writing through to them', () => {
    const replacement = {} as Storage
    globalThis.localStorage = replacement
    expect(globalThis.localStorage).toBe(replacement)
    expect(write).not.toHaveBeenCalled()
    expect(read).not.toHaveBeenCalled()
  })
})
