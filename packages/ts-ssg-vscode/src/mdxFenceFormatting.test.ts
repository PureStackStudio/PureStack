import { describe, expect, it, vi } from 'vitest'

class TestPosition {
  constructor(
    readonly line: number,
    readonly character: number,
  ) {}
}

class TestRange {
  constructor(
    readonly start: TestPosition,
    readonly end: TestPosition,
  ) {}

  intersection(other: TestRange) {
    const start =
      comparePositions(this.start, other.start) >= 0 ? this.start : other.start
    const end =
      comparePositions(this.end, other.end) <= 0 ? this.end : other.end

    return comparePositions(start, end) <= 0
      ? new TestRange(start, end)
      : undefined
  }
}

vi.mock('vscode', () => ({
  Position: TestPosition,
  Range: TestRange,
  TextEdit: {
    replace: (range: TestRange, newText: string) => ({ range, newText }),
  },
}))

function comparePositions(left: TestPosition, right: TestPosition) {
  if (left.line !== right.line) return left.line - right.line

  return left.character - right.character
}

function createMdxDocument(text: string) {
  const lines = text.split('\n')

  return {
    lineCount: lines.length,
    lineAt: (line: number) => ({
      text: lines[line],
      range: new TestRange(
        new TestPosition(line, 0),
        new TestPosition(line, lines[line].length),
      ),
    }),
  }
}

function applyEdits(
  source: string,
  edits: Array<{ range?: TestRange; newText: string }>,
) {
  const lineStarts = getLineStarts(source)
  let result = source

  for (const edit of [...edits].sort(
    (left, right) =>
      getOffset(lineStarts, requireRange(right).start) -
      getOffset(lineStarts, requireRange(left).start),
  )) {
    const range = requireRange(edit)
    const start = getOffset(lineStarts, range.start)
    const end = getOffset(lineStarts, range.end)
    result = `${result.slice(0, start)}${edit.newText}${result.slice(end)}`
  }

  return result
}

function requireRange(edit: { range?: TestRange }) {
  if (!edit.range) throw new Error('Expected edit range')

  return edit.range
}

function getLineStarts(source: string) {
  const starts = [0]

  for (let index = 0; index < source.length; index++) {
    if (source[index] === '\n') starts.push(index + 1)
  }

  return starts
}

function getOffset(lineStarts: number[], position: TestPosition) {
  return lineStarts[position.line] + position.character
}

describe('MDX fence formatting', () => {
  it('masks and restores tilde fences while normalizing only delimiter indentation', async () => {
    const { maskMdxFencedRegions, restoreMdxFencedRegions } = await import(
      './mdxFenceFormatting.js'
    )
    const source = `  ~~~mdx
    <LandingSection>
      <a>asdf</a>
    </LandingSection>
  ~~~`

    const { fences, placeholderContent } = maskMdxFencedRegions(source)
    const restored = restoreMdxFencedRegions(placeholderContent, fences)

    expect(placeholderContent).toBe('<!--PURESTACK_MDX_FENCE_0-->')
    expect(restored).toBe(`~~~mdx
    <LandingSection>
      <a>asdf</a>
    </LandingSection>
~~~`)
  })

  it('does not close a longer fence on shorter nested fence delimiters', async () => {
    const { maskMdxFencedRegions, restoreMdxFencedRegions } = await import(
      './mdxFenceFormatting.js'
    )
    const source = ['````mdx', '```ts', 'const value = 1', '```', '````'].join(
      '\n',
    )

    const { fences, placeholderContent } = maskMdxFencedRegions(source)
    const restored = restoreMdxFencedRegions(placeholderContent, fences)

    expect(placeholderContent).toBe('<!--PURESTACK_MDX_FENCE_0-->')
    expect(restored).toBe(source)
  })

  it('builds line edits for standalone inline fence delimiters', async () => {
    const { buildMdxFenceDelimiterEdits } = await import(
      './mdxFenceFormatting.js'
    )
    const source = `before \`\`\`mdx
<LandingSection /> \`\`\``

    const edits = buildMdxFenceDelimiterEdits(
      createMdxDocument(source) as never,
      [],
    )
    const formatted = applyEdits(source, edits as Array<{ newText: string }>)

    expect(formatted).toBe(`before
\`\`\`mdx
<LandingSection />
\`\`\``)
  })
})
