import path from 'node:path'
import { resolveConfigUrl, urlNormalizer } from '@purestack/ts-util'
import { describe, expect, it } from 'vitest'

describe('content-root configuration URLs', () => {
  it('preserves path and suffix semantics without Node imports in the implementation', () => {
    const segments = ['', '.', '..', 'assets', 'logo.svg', '\\icons', 'a\\b']
    const suffixes = ['', '?v=2', '#icon', '?v=2#icon']
    for (const first of segments)
      for (const second of segments)
        for (const suffix of suffixes) {
          const input = `${first}/${second}${suffix}`
          const { base, suffix: tail } = urlNormalizer.splitSuffix(input)
          const expected =
            input.startsWith('/') || urlNormalizer.isSpecialHref(input)
              ? input
              : path.posix.normalize(`/${base.replaceAll('\\', '/')}`) + tail
          expect(resolveConfigUrl(input), input).toBe(expected)
        }
    expect(resolveConfigUrl(undefined)).toBeUndefined()
    expect(resolveConfigUrl('')).toBe('')
    expect(resolveConfigUrl('https://example.com/a/../b')).toBe(
      'https://example.com/a/../b',
    )
  })
})
