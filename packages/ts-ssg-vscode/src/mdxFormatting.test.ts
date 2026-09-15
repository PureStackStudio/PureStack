import * as fs from 'node:fs'
import * as path from 'node:path'
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

function comparePositions(left: TestPosition, right: TestPosition) {
  if (left.line !== right.line) return left.line - right.line

  return left.character - right.character
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

function createMdxDocument(text: string, fsPath = 'test.mdx') {
  const lines = text.split('\n')

  return {
    languageId: 'mdx',
    lineCount: lines.length,
    uri: { fsPath },
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

function applyEdits(
  source: string,
  edits: Array<{ range?: TestRange; newText: string }>,
) {
  if (edits.length === 0) return source

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

  it('formats rmdx documents through the MDX language mode', async () => {
    const { buildMdxFormattingEdits } = await import('./mdxFormatting.js')
    const source = `<Panel><Badge tone="accent" /></Panel>`

    const edits = await buildMdxFormattingEdits(
      createMdxDocument(source, 'test.rmdx') as never,
      { requireFormatOnSave: true },
    )
    const formatted = applyEdits(source, edits as Array<{ newText: string }>)

    expect(formatted).toBe('<Panel><Badge tone="accent"/></Panel>')
  })

  it('preserves standalone tag-shaped inline code spans inside MDX components', async () => {
    const { buildMdxFormattingEdits } = await import('./mdxFormatting.js')
    const inlineCode =
      '`<LandingSection> asdas asdcasd asd asdas asd asdas asadas </LandingSection>`'
    const source = `<Tabs tone="neutral">
  <TabPane>
    ${inlineCode}
  </TabPane>
</Tabs>`

    const edits = await buildMdxFormattingEdits(
      createMdxDocument(source) as never,
      { requireFormatOnSave: true },
    )
    const formatted = applyEdits(source, edits as Array<{ newText: string }>)

    expect(formatted).toContain(inlineCode)
    expect(formatted).not.toContain('</LandingSection\n')
    expect(formatted).not.toContain('</LandingSection\r\n')
  })

  it('preserves inline tag-shaped code spans inside MDX component text', async () => {
    const { buildMdxFormattingEdits } = await import('./mdxFormatting.js')
    const inlineCode =
      '`<LandingSection> asdas asdcasd asd asdas asd asdas asadas </LandingSection>`'
    const source = `<Callout>Use ${inlineCode} when documenting a component.</Callout>`

    const edits = await buildMdxFormattingEdits(
      createMdxDocument(source) as never,
      { requireFormatOnSave: true },
    )
    const formatted = applyEdits(source, edits as Array<{ newText: string }>)

    expect(formatted).toContain(inlineCode)
    expect(formatted).not.toContain('</LandingSection\n')
    expect(formatted).not.toContain('</LandingSection\r\n')
  })

  it('keeps fenced code blocks on standalone lines inside MDX components', async () => {
    const { buildMdxFormattingEdits } = await import('./mdxFormatting.js')
    const source = `<Tabs tone="neutral">
  <TabPane>
\`\`\`mdx
<LandingSection>
</LandingSection>
\`\`\`
  </TabPane>
  <TabPane>
\`\`\`mdx
<LandingSection>
</LandingSection>
\`\`\`
  </TabPane>
</Tabs>`

    const edits = await buildMdxFormattingEdits(
      createMdxDocument(source) as never,
      { requireFormatOnSave: true },
    )
    const formatted = applyEdits(source, edits as Array<{ newText: string }>)

    expect(formatted).toBe(source)
    expect(formatted).not.toContain('<TabPane> ```mdx')
    expect(formatted).not.toContain('``` </TabPane>')
  })

  it('aligns MDX fence delimiters without changing fenced code content', async () => {
    const { buildMdxFormattingEdits } = await import('./mdxFormatting.js')
    const source = `<Tabs tone="neutral">
  <TabPane>
    \`\`\`mdx
      <LandingSection>
        <a>asdf</a>
      </LandingSection>
    \`\`\`
  </TabPane>
</Tabs>`

    const edits = await buildMdxFormattingEdits(
      createMdxDocument(source) as never,
      { requireFormatOnSave: true },
    )
    const formatted = applyEdits(source, edits as Array<{ newText: string }>)

    expect(formatted).toBe(`<Tabs tone="neutral">
  <TabPane>
\`\`\`mdx
      <LandingSection>
        <a>asdf</a>
      </LandingSection>
\`\`\`
  </TabPane>
</Tabs>`)
  })

  it('splits regular MDX fence closers away from preceding code content', async () => {
    const { buildMdxFormattingEdits } = await import('./mdxFormatting.js')
    const source = `\`\`\`mdx
<LandingSection> </LandingSection> \`\`\`

asdas`

    const edits = await buildMdxFormattingEdits(
      createMdxDocument(source) as never,
      { requireFormatOnSave: true },
    )
    const formatted = applyEdits(source, edits as Array<{ newText: string }>)

    expect(formatted).toBe(`\`\`\`mdx
<LandingSection> </LandingSection>
\`\`\`

asdas`)
  })

  it('limits standalone fence delimiter edits to the requested range', async () => {
    const { buildMdxFormattingEdits } = await import('./mdxFormatting.js')
    const source = `\`\`\`mdx
<First> </First> \`\`\`

middle

\`\`\`mdx
<Second> </Second> \`\`\``

    const edits = await buildMdxFormattingEdits(
      createMdxDocument(source) as never,
      {
        onlyWithinRange: new TestRange(
          new TestPosition(5, 0),
          new TestPosition(6, 100),
        ) as never,
        requireFormatOnSave: true,
      },
    )
    const formatted = applyEdits(source, edits as Array<{ newText: string }>)

    expect(formatted).toBe(`\`\`\`mdx
<First> </First> \`\`\`

middle

\`\`\`mdx
<Second> </Second>
\`\`\``)
  })

  it('splits MDX fence openers away from preceding tag closers', async () => {
    const { buildMdxFormattingEdits } = await import('./mdxFormatting.js')
    const source = `<Tabs tone="neutral">
  <TabPane
    >\`\`\`mdx
    <LandingSection>
      <a>asdf</a>
    </LandingSection>
\`\`\`
  </TabPane>
</Tabs>`

    const edits = await buildMdxFormattingEdits(
      createMdxDocument(source) as never,
      { requireFormatOnSave: true },
    )
    const formatted = applyEdits(source, edits as Array<{ newText: string }>)

    expect(formatted).toBe(`<Tabs tone="neutral">
  <TabPane>
\`\`\`mdx
    <LandingSection>
      <a>asdf</a>
    </LandingSection>
\`\`\`
  </TabPane>
</Tabs>`)
  })

  it('splits MDX fence openers away from preceding text', async () => {
    const { buildMdxFormattingEdits } = await import('./mdxFormatting.js')
    const source = `<Tabs tone="neutral">
  <TabPane
    >text \`\`\`mdx
    <LandingSection>
      <a>asdf</a>
    </LandingSection>
\`\`\`
  </TabPane>
</Tabs>`

    const edits = await buildMdxFormattingEdits(
      createMdxDocument(source) as never,
      { requireFormatOnSave: true },
    )
    const formatted = applyEdits(source, edits as Array<{ newText: string }>)

    expect(formatted).toBe(`<Tabs tone="neutral">
  <TabPane
    >text
\`\`\`mdx
    <LandingSection>
      <a>asdf</a>
    </LandingSection>
\`\`\`
  </TabPane>
</Tabs>`)
  })

  it('splits MDX fence closers away from following tags', async () => {
    const { buildMdxFormattingEdits } = await import('./mdxFormatting.js')
    const source = `<Tabs tone="neutral">
  <TabPane>
\`\`\`mdx
    <LandingSection>
      <a>asdf</a>
    </LandingSection>
\`\`\`</TabPane>
</Tabs>`

    const edits = await buildMdxFormattingEdits(
      createMdxDocument(source) as never,
      { requireFormatOnSave: true },
    )
    const formatted = applyEdits(source, edits as Array<{ newText: string }>)

    expect(formatted).toBe(`<Tabs tone="neutral">
  <TabPane>
\`\`\`mdx
    <LandingSection>
      <a>asdf</a>
    </LandingSection>
\`\`\`
  </TabPane>
</Tabs>`)
  })

  it('formats markup that starts on the same line as an inline MDX fence opener', async () => {
    const { buildMdxFormattingEdits } = await import('./mdxFormatting.js')
    const source = `<Tabs tone="neutral"><TabPane>\`\`\`mdx
    <LandingSection>
      <a>asdf</a>
    </LandingSection>
\`\`\`
  </TabPane>
</Tabs>`

    const edits = await buildMdxFormattingEdits(
      createMdxDocument(source) as never,
      { requireFormatOnSave: true },
    )
    const formatted = applyEdits(source, edits as Array<{ newText: string }>)

    expect(formatted).toBe(`<Tabs tone="neutral">
  <TabPane>
\`\`\`mdx
    <LandingSection>
      <a>asdf</a>
    </LandingSection>
\`\`\`
  </TabPane>
</Tabs>`)
  })
})

describe('Regor MDX language identity', () => {
  it('keeps .mdx and .rmdx on the stable MDX language contribution', () => {
    const manifest = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'packages', 'ts-ssg-vscode', 'package.json'),
        'utf8',
      ),
    ) as {
      contributes?: {
        languages?: Array<{ id?: string; extensions?: string[] }>
        grammars?: Array<{ language?: string }>
      }
    }

    const mdxLanguage = manifest.contributes?.languages?.find(
      (language) => language.id === 'mdx',
    )

    expect(mdxLanguage?.extensions).toEqual(
      expect.arrayContaining(['.mdx', '.rmdx']),
    )
    expect(
      manifest.contributes?.languages?.some(
        (language) =>
          language.id !== 'mdx' && language.extensions?.includes('.mdx'),
      ),
    ).toBe(false)
    expect(
      manifest.contributes?.grammars?.some(
        (grammar) => grammar.language === 'mdx',
      ),
    ).toBe(true)
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
