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

  intersection() {
    return this
  }
}

vi.mock('vscode', () => ({
  Position: TestPosition,
  Range: TestRange,
  TextEdit: {
    replace: (range: TestRange, newText: string) => ({ range, newText }),
  },
  workspace: {
    getConfiguration: () => ({
      get: (key: string, fallback: unknown) =>
        key === 'formatOnSave' ? true : fallback,
    }),
  },
}))

function createMdxDocument(text: string) {
  const lines = text.split('\n')

  return {
    languageId: 'mdx',
    lineCount: lines.length,
    uri: { fsPath: 'test.mdx' },
    getText: () => text,
    lineAt: (line: number) => ({
      text: lines[line],
      range: new TestRange(
        new TestPosition(line, 0),
        new TestPosition(line, lines[line].length),
      ),
    }),
  }
}

function applyEdits(source: string, edits: Array<{ newText: string }>) {
  if (edits.length === 0) return source
  if (edits.length !== 1) {
    throw new Error(`Expected one edit, received ${edits.length}`)
  }

  return edits[0].newText
}

describe('buildMdxFormattingEdits', () => {
  it('formats CSS inside style blocks on save', async () => {
    const { buildMdxFormattingEdits } = await import('./mdxFormatting.js')
    const source = `<style>
.rule-0{color:var(--color-0)}
</style>`

    const edits = await buildMdxFormattingEdits(
      createMdxDocument(source) as never,
      { requireFormatOnSave: true },
    )
    const formatted = applyEdits(source, edits as Array<{ newText: string }>)

    expect(formatted).toBe(`<style>
  .rule-0 {
    color: var(--color-0);
  }
</style>`)
  })

  it('preserves CSS rule bodies in style blocks with ten or more rule bodies', async () => {
    const { buildMdxFormattingEdits } = await import('./mdxFormatting.js')
    const rules = Array.from(
      { length: 12 },
      (_, index) => `.rule-${index} {
  color: var(--color-${index});
}`,
    ).join('\n\n')
    const source = `<style>
${rules}
</style>`

    const edits = await buildMdxFormattingEdits(
      createMdxDocument(source) as never,
      { requireFormatOnSave: true },
    )
    const formatted = applyEdits(source, edits as Array<{ newText: string }>)

    expect(formatted).not.toContain('}0')
    expect(formatted).not.toContain('}1')
    expect(formatted).toContain('color: var(--color-10);')
    expect(formatted).toContain('color: var(--color-11);')
  })

  it('restores ten or more MDX expressions without prefix collisions', async () => {
    const { buildMdxFormattingEdits } = await import('./mdxFormatting.js')
    const paragraphs = Array.from(
      { length: 12 },
      (_, index) => `<p>{value${index}}</p>`,
    ).join('\n')
    const source = `<section>
${paragraphs}
</section>`

    const edits = await buildMdxFormattingEdits(
      createMdxDocument(source) as never,
      { requireFormatOnSave: true },
    )
    const formatted = applyEdits(source, edits as Array<{ newText: string }>)

    expect(formatted).toContain('{value10}')
    expect(formatted).toContain('{value11}')
    expect(formatted).not.toContain('{value1}0')
    expect(formatted).not.toContain('{value1}1')
  })
})

describe('maskMdxExpressions', () => {
  it('does not treat CSS rule braces inside style tags as MDX expressions', async () => {
    const { maskMdxExpressions } = await import('./mdxFormatting.js')
    const source = `<style>
  .first {
    color: red;
  }

  .second {
    color: blue;
  }
</style>`

    const result = maskMdxExpressions(source)

    expect(result.expressions).toEqual([])
    expect(result.placeholderContent).toBe(source)
  })
})
