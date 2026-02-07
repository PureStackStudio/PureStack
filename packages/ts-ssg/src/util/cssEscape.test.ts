import { describe, expect, it } from 'vitest'

import cssEscape from './cssEscape'

describe('cssEscape', () => {
  it('throws when called with no arguments', () => {
    expect(() => (cssEscape as () => string)()).toThrow(
      '`cssEscape` requires an argument.',
    )
  })

  it('replaces null with replacement character', () => {
    expect(cssEscape('a\0b')).toBe('a\uFFFDb')
  })

  it('escapes control characters and DEL as code points', () => {
    expect(cssEscape('\u0001\u001f\u007f')).toBe('\\1 \\1f \\7f ')
  })

  it('escapes leading digits and digit after leading hyphen', () => {
    expect(cssEscape('0abc')).toBe('\\30 abc')
    expect(cssEscape('-0abc')).toBe('-\\30 abc')
  })

  it('escapes a single hyphen identifier', () => {
    expect(cssEscape('-')).toBe('\\-')
  })

  it('keeps identifier-safe characters unchanged', () => {
    expect(cssEscape('aZ09-_')).toBe('aZ09-_')
    expect(cssEscape('cafe\u00e9')).toBe('cafe\u00e9')
  })

  it('escapes other punctuation as simple escaped characters', () => {
    expect(cssEscape('a b#c.d')).toBe('a\\ b\\#c\\.d')
  })

  it('escapes colon-prefixed identifiers', () => {
    expect(cssEscape(':src')).toBe('\\:src')
  })

  it('escapes selector punctuation and existing backslashes', () => {
    expect(cssEscape('[\\:src]')).toBe('\\[\\\\\\:src\\]')
    expect(JSON.stringify(cssEscape('[\\:src]'))).toBe(
      '"\\\\[\\\\\\\\\\\\:src\\\\]"',
    )
  })

  it('handles edge-case identifiers and Unicode code units', () => {
    const cases = [
      { input: '', output: '' },
      { input: '--a', output: '--a' },
      { input: '-1', output: '-\\31 ' },
      { input: '1a', output: '\\31 a' },
      { input: '\u0000', output: '\uFFFD' },
      { input: '\u0080', output: '\u0080' },
      { input: '\uD83D\uDCA9', output: '\uD83D\uDCA9' },
      { input: '\uD83D', output: '\uD83D' },
      { input: '\uDE00', output: '\uDE00' },
      { input: '\t', output: '\\9 ' },
      { input: '\n', output: '\\a ' },
    ] as const

    for (const { input, output } of cases) {
      expect(cssEscape(input)).toBe(output)
    }
  })

  it('coerces non-string inputs exactly like CSS.escape', () => {
    const withCustomToString = { toString: () => 'a b' }
    expect(cssEscape(0)).toBe('\\30 ')
    expect(cssEscape(true)).toBe('true')
    expect(cssEscape(null)).toBe('null')
    expect(cssEscape(undefined)).toBe('undefined')
    expect(cssEscape(withCustomToString)).toBe('a\\ b')
  })
})
