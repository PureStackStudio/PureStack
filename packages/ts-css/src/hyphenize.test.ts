import { describe, expect, it } from 'vitest'

import { hyphenizeCss } from './hyphenize'

describe('hyphenizeCss', () => {
  it('handles basic camelCase and PascalCase', () => {
    expect(hyphenizeCss('backgroundColor')).toBe('background-color')
    expect(hyphenizeCss('FontSize')).toBe('font-size')
    expect(hyphenizeCss('marginTop')).toBe('margin-top')
    expect(hyphenizeCss('padding')).toBe('padding')
  })

  it('handles vendor prefixes with correct dash and casing', () => {
    expect(hyphenizeCss('WebkitTransition')).toBe('-webkit-transition')
    expect(hyphenizeCss('webkitTransition')).toBe('-webkit-transition')
    expect(hyphenizeCss('MozSomethingElse')).toBe('-moz-something-else')
    expect(hyphenizeCss('mozSomethingElse')).toBe('-moz-something-else')
    expect(hyphenizeCss('msTransition')).toBe('-ms-transition')
    expect(hyphenizeCss('MsTransition')).toBe('-ms-transition')
    expect(hyphenizeCss('OAnimation')).toBe('-o-animation')
    expect(hyphenizeCss('oAnimation')).toBe('-o-animation')
    expect(hyphenizeCss('OTransition')).toBe('-o-transition')
    expect(hyphenizeCss('oTransition')).toBe('-o-transition')
    expect(hyphenizeCss('opacity')).toBe('opacity')
    expect(hyphenizeCss('Opacity')).toBe('opacity')
  })

  it('splits acronym-heavy names properly', () => {
    expect(hyphenizeCss('XMLHttpRequest')).toBe('xml-http-request')
    expect(hyphenizeCss('URLValue')).toBe('url-value')
    expect(hyphenizeCss('ABCdEF')).toBe('ab-cd-ef') // mixed uppercase runs
    expect(hyphenizeCss('ID')).toBe('id') // all uppercase, no hyphen
  })

  it('preserves existing kebab-case / hyphens', () => {
    expect(hyphenizeCss('font-size')).toBe('font-size')
    expect(hyphenizeCss('-moz-appearance')).toBe('-moz-appearance')
    expect(hyphenizeCss('already-hyphenated-name')).toBe(
      'already-hyphenated-name',
    )
  })

  it('handles numeric boundaries and edge patterns', () => {
    expect(hyphenizeCss('margin2Top')).toBe('margin2-top')
    expect(hyphenizeCss('aB')).toBe('a-b')
    expect(hyphenizeCss('A')).toBe('a')
    expect(hyphenizeCss('')).toBe('') // empty string
    expect(hyphenizeCss('opacity')).toBe('opacity')
    expect(hyphenizeCss('Opacity')).toBe('opacity')
  })

  it('lowercases everything except preserves delimiting hyphens', () => {
    expect(hyphenizeCss('SomeWEIRDCase')).toBe('some-weird-case')
    expect(hyphenizeCss('HTMLParser')).toBe('html-parser')
  })

  it('does not introduce extra hyphens for already segmented acronyms', () => {
    expect(hyphenizeCss('XML-HttpRequest')).toBe('xml-http-request')
  })
})
