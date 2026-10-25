import { describe, expect, it } from 'vitest'
import { parseFragment } from './minidom'

describe('parseFragment', () => {
  it('finds the closest ancestor including self and toggles classes with a force value', () => {
    const section = parseFragment(
      '<section class="scope"><h2>Heading</h2></section>',
    ).firstElementChild
    const heading = section?.firstElementChild
    if (!section || !heading) throw new Error('Missing fixture elements')
    expect(heading.closest('section')).toBe(section)
    expect(section.closest('.scope')).toBe(section)
    expect(heading.closest('aside')).toBeNull()
    expect(section.classList.toggle('open')).toBe(true)
    expect(section.classList.toggle('open', true)).toBe(true)
    expect(section.classList.toggle('open')).toBe(false)
    expect(section.classList.toggle('scope', false)).toBe(false)
    expect(section.hasAttribute('class')).toBe(false)
  })
  it.each([
    '/images/photo.png',
    './photo.png',
    'https://example.com/photo.png',
    '/images/',
  ])('preserves slashes in unquoted attribute values: %s', (url) => {
    const fragment = parseFragment(`<img src=${url} alt=Photo>`)
    expect(fragment.firstElementChild?.getAttribute('src')).toBe(url)
    expect(fragment.firstElementChild?.getAttribute('alt')).toBe('Photo')
    expect(fragment.firstElementChild?.attributes.length).toBe(2)
  })

  it('treats a trailing slash as part of an unquoted value and keeps explicit self-closing syntax', () => {
    expect(
      parseFragment('<img src=/image.png/>').firstElementChild?.getAttribute(
        'src',
      ),
    ).toBe('/image.png/')
    const fragment = parseFragment('<image-box src="/image.png"/><p>After</p>')
    expect(fragment.childNodes.length).toBe(2)
    expect(fragment.firstElementChild?.getAttribute('src')).toBe('/image.png')
  })

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
