import { describe, expect, it } from 'vitest'

import { autoVar } from './autoVar'

describe('autoVar', () => {
  const cases: Array<[string, string]> = [
    // basic variable shorthand
    ['$primary', 'var(--primary)'],
    ['$primary, blue', 'var(--primary, blue)'],
    ['$primary,blue', 'var(--primary, blue)'], // no space
    ['  $foo  ', 'var(--foo)'], // whitespace trimming
    ['$foo ,  red  ', 'var(--foo, red)'], // messy spacing around comma
    ['$name, one, two', 'var(--name, one, two)'], // fallback containing comma(s)

    // raw custom properties
    ['--bg', 'var(--bg)'],
    ['--bg, lightgray', 'var(--bg, lightgray)'],
    ['--bg,lightgray', 'var(--bg, lightgray)'],
    ['--my-prop', 'var(--my-prop)'],

    // already var(...) stays unchanged (case-insensitive)
    ['var(--accent)', 'var(--accent)'],
    ['VAR(--accent)', 'VAR(--accent)'],
    ['VaR(--accent, green)', 'VaR(--accent, green)'],

    // non-variable values
    ['10px', '10px'],
    ['solid', 'solid'],
    ['', ''], // empty string
    ['   ', ''], // only whitespace becomes empty string

    // odd edge cases
    ['$', 'var(--)'], // shorthand with no name
    ['--', 'var(--)'], // custom prop with just dashes
  ]

  it.each(cases)('transforms %j into %j', (input: string, expected: string) => {
    expect(autoVar(input)).toBe(expected)
  })

  it("does not accidentally wrap bare words (e.g., 'primary')", () => {
    expect(autoVar('primary')).toBe('primary')
  })

  it("preserves complex strings that happen to contain '$' not at start", () => {
    expect(autoVar('cost is $5')).toBe('cost is $5')
  })
})
