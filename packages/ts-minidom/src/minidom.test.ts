import { describe, expect, it } from 'vitest'
import { parseFragment } from './minidom'

describe('parseFragment', () => {
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
