import { describe, expect, it } from 'vitest'
import {
  buildMdxFenceDelimiterEdits,
  type MdxFence,
  maskMdxFencedRegions,
  parseInlineMdxFenceCloser,
  parseInlineMdxFenceOpener,
  restoreMdxFencedRegions,
} from './fences'
import { applySourceEdits, SourceText } from './source'

describe('inline fence delimiters', () => {
  it.each(['```', '````', '~~~', '~~~~~~'])(
    'preserves %s marker length, fence info, content, and repeated-format stability',
    (fence) => {
      const source = `before \t${fence}mdx title="Example"\n  <Panel />\nafter \t${fence}\t `
      const expected = `before\n${fence}mdx title="Example"\n  <Panel />\nafter\n${fence}`
      const edits = buildMdxFenceDelimiterEdits(new SourceText(source), [])
      expect(applySourceEdits(source, edits)).toBe(expected)
      expect(buildMdxFenceDelimiterEdits(new SourceText(expected), [])).toEqual(
        [],
      )
      const { fences, placeholderContent } = maskMdxFencedRegions(source)
      expect(restoreMdxFencedRegions(placeholderContent, fences)).toBe(expected)
    },
  )

  it('uses the first inline opener and preserves its complete suffix', () => {
    expect(parseInlineMdxFenceOpener('before ~~ ````mdx ~~~')).toEqual({
      marker: '`',
      length: 4,
      suffix: 'mdx ~~~',
    })
    expect(parseInlineMdxFenceOpener(' \t```mdx')).toBeUndefined()
    expect(parseInlineMdxFenceOpener('before `` ~ around')).toBeUndefined()
  })

  it('accepts longer closing fences on either side and rejects shorter or different markers', () => {
    const active: MdxFence = { marker: '`', length: 4 }
    expect(parseInlineMdxFenceCloser('before \t`````\t ', active)).toEqual({
      marker: '`',
      length: 5,
      suffix: '',
    })
    expect(parseInlineMdxFenceCloser('\t`````<Panel/>', active)).toEqual({
      marker: '`',
      length: 5,
      suffix: '',
    })
    for (const line of [
      'before ```',
      'before ~~~~',
      'before ```` x',
      'before ````\u00a0',
    ]) {
      expect(parseInlineMdxFenceCloser(line, active)).toBeUndefined()
    }
  })

  it('preserves CRLF and honors excluded ranges', () => {
    const source = 'before ```mdx\r\n<Panel /> ```\r\n'
    const document = new SourceText(source)
    const edits = buildMdxFenceDelimiterEdits(document, [])
    expect(applySourceEdits(source, edits)).toBe(
      'before\r\n```mdx\r\n<Panel />\r\n```\r\n',
    )
    expect(
      buildMdxFenceDelimiterEdits(document, [{ start: 0, end: source.length }]),
    ).toEqual([])
  })

  it('handles long nonmatching and matching whitespace runs before openers and closers', () => {
    const whitespace = '\t'.repeat(100_000)
    const source = `a${whitespace}\nbefore${whitespace}~~~mdx\na${whitespace}x\nafter${whitespace}~~~\t `
    const expected = `a${whitespace}\nbefore\n~~~mdx\na${whitespace}x\nafter\n~~~`
    expect(
      applySourceEdits(
        source,
        buildMdxFenceDelimiterEdits(new SourceText(source), []),
      ),
    ).toBe(expected)
  })
})
