import { describe, expect, it } from 'vitest'
import { sanitizeEmailStyleValue } from './emailHtmlPolicy'

describe('sanitizeEmailStyleValue', () => {
  it.each([
    [' red ', 'red'],
    ['red!important', 'red'],
    [' red \t!IMPORTANT \n', 'red'],
    ['red !important extra', 'red !important extra'],
    ['red ! important', 'red ! important'],
    ['!important', undefined],
  ])('normalizes %j to %j', (value, expected) => {
    expect(sanitizeEmailStyleValue('color', value)).toBe(expected)
  })

  it('rejects oversized values containing long internal whitespace', () => {
    const value = `red${' '.repeat(200_000)}x`
    expect(sanitizeEmailStyleValue('color', value)).toBeUndefined()
  })

  it('applies the length limit after removing the important suffix', () => {
    const value = 'a'.repeat(512)
    expect(sanitizeEmailStyleValue('font-family', `${value} !important`)).toBe(
      value,
    )
    expect(
      sanitizeEmailStyleValue('font-family', `${value}a !important`),
    ).toBeUndefined()
  })
})
