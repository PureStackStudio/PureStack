import { Script } from 'node:vm'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { buildSiteColorInitScript } from './head'

const config = vi.hoisted(() => ({
  defaultColor: 'cobalt',
  storageKey: 'purestack-site-color',
  ids: ['cobalt', 'violet'],
}))

vi.mock('./presets', () => ({
  get DEFAULT_SITE_COLOR() {
    return config.defaultColor
  },
  get SITE_COLOR_STORAGE_KEY() {
    return config.storageKey
  },
  get palettePresets() {
    return config.ids.map((id) => ({ id }))
  },
}))

function runStartup(stored: string | null, unavailable = false) {
  const attributes = new Map<string, string>()
  const getItem = vi.fn((key: string) => {
    expect(key).toBe(config.storageKey)
    if (unavailable) throw new Error('Storage unavailable')
    return stored
  })
  new Script(buildSiteColorInitScript()).runInNewContext({
    localStorage: { getItem },
    document: {
      documentElement: {
        setAttribute: (name: string, value: string) =>
          attributes.set(name, value),
      },
    },
  })
  expect(getItem).toHaveBeenCalledOnce()
  return attributes.get('data-site-color')
}

describe('site color startup serialization', () => {
  beforeEach(() => {
    config.defaultColor = 'cobalt'
    config.storageKey = 'purestack-site-color'
    config.ids = ['cobalt', 'violet']
  })

  it('keeps script-closing markup inside serialized configuration strings', () => {
    const payload =
      '</ScRiPt><script>throw new Error("injected")</script><!--\u2028\u2029"\\'
    config.defaultColor = payload
    config.storageKey = payload
    config.ids = [payload, 'violet']

    expect(buildSiteColorInitScript()).not.toMatch(/[<\u2028\u2029]/)
    expect(runStartup(null)).toBe(payload)
    expect(runStartup(payload)).toBe(payload)
    expect(runStartup('violet')).toBe('violet')
  })

  it.each([
    ['violet', 'violet'],
    [null, 'cobalt'],
    ['</script><script>throw new Error("injected")</script>', 'cobalt'],
  ])('validates the stored color %j', (stored, expected) => {
    expect(runStartup(stored)).toBe(expected)
  })

  it('applies the default when storage is unavailable', () => {
    expect(runStartup(null, true)).toBe('cobalt')
  })
})
