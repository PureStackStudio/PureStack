import { describe, expect, it } from 'vitest'
import { clip, graphemes, pad, safeText, width } from './layout'

describe('terminal text layout', () => {
  it('measures display cells and edits whole graphemes', () => {
    expect(width('中文')).toBe(4)
    expect(width('e\u0301')).toBe(1)
    expect(graphemes('👩🏽‍💻')).toHaveLength(1)
    expect(width(pad('中文', 8))).toBe(8)
    expect(width(clip('中文abc', 5))).toBeLessThanOrEqual(5)
  })
  it('removes terminal control characters from untrusted labels', () => {
    const esc = String.fromCharCode(27)
    expect(
      safeText(`${esc}[31mLabel\nOther${String.fromCharCode(7)}`),
    ).not.toContain(esc)
    expect(safeText('a\nb')).toBe('a b')
  })
})
