import { describe, expect, it } from 'vitest'
import { parseFragment } from './minidom'

describe('parseFragment', () => {
  it.each([
    ['&#x26;lt;', '&lt;'],
    ['&#38;lt;', '&lt;'],
    ['&#x26;#60;', '&#60;'],
    ['&#38;#x3c;', '&#x3c;'],
    ['&amp;quot;', '&quot;'],
    ['&amp;apos;', '&apos;'],
    ['&lt;&gt;&amp;&quot;&apos;', '<>&"\''],
    ['&#60;&#x3e;&#x1F600;', '<>😀'],
    ['&#60 &#x3e', '< >'],
    ['&#1114112;', '\uFFFD'],
    ['&unknown;', '&unknown;'],
  ])('decodes entities once in text and attributes: %j', (input, expected) => {
    const fragment = parseFragment(`<p title="${input}">${input}</p>`)
    const paragraph = fragment.firstElementChild
    expect(paragraph?.textContent).toBe(expected)
    expect(paragraph?.getAttribute('title')).toBe(expected)
    expect(paragraph?.children.length).toBe(0)
  })

  it('throws when a duplicate attribute would hide meaningful information', () => {
    expect(() =>
      parseFragment('<div class="first" class="second"></div>'),
    ).toThrow(
      'Duplicate attribute "class" while parsing HTML. Previous value: "first". New value: "second".',
    )
  })

  it('throws when a duplicate empty attribute would erase meaningful information', () => {
    expect(() => parseFragment('<div class="visible" class=""></div>')).toThrow(
      'Duplicate attribute "class" while parsing HTML. Previous value: "visible". New value: "".',
    )
  })

  it('allows duplicate attributes with no meaningful value', () => {
    const fragment = parseFragment('<input disabled disabled>')
    const input = fragment.firstElementChild

    expect(input?.getAttribute('disabled')).toBe('')
  })
})
