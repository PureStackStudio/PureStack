import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { TextDocument } from 'vscode'
import { buildMdxFormattingEdits, getMdxMarkupBlocks } from './mdxFormatting'

const { Position, Range, TextEdit } = vi.hoisted(() => {
  class Position {
    constructor(
      public line: number,
      public character: number,
    ) {}

    compareTo(other: Position) {
      if (this.line !== other.line) return this.line - other.line
      return this.character - other.character
    }

    isAfter(other: Position) {
      return this.compareTo(other) > 0
    }

    isAfterOrEqual(other: Position) {
      return this.compareTo(other) >= 0
    }

    isBefore(other: Position) {
      return this.compareTo(other) < 0
    }

    isBeforeOrEqual(other: Position) {
      return this.compareTo(other) <= 0
    }

    isEqual(other: Position) {
      return this.compareTo(other) === 0
    }

    translate(lineDelta = 0, characterDelta = 0) {
      return new Position(
        this.line + lineDelta,
        this.character + characterDelta,
      )
    }

    with(line = this.line, character = this.character) {
      return new Position(line, character)
    }
  }

  class Range {
    constructor(
      public start: Position,
      public end: Position,
    ) {}

    intersection(other: Range) {
      const startOffset = Math.max(
        positionToOffset(this.start),
        positionToOffset(other.start),
      )
      const endOffset = Math.min(
        positionToOffset(this.end),
        positionToOffset(other.end),
      )
      if (startOffset > endOffset) return undefined
      return new Range(
        offsetToPosition(startOffset),
        offsetToPosition(endOffset),
      )
    }
  }

  class TextEdit {
    constructor(
      public range: Range,
      public newText: string,
    ) {}

    static replace(range: Range, newText: string) {
      return new TextEdit(range, newText)
    }
  }

  return { Position, Range, TextEdit }
})

const { mockedFormatHtmlFragment } = vi.hoisted(() => ({
  mockedFormatHtmlFragment: vi.fn(async (source: string) =>
    fakeFormatHtmlFragment(source),
  ),
}))

type TestPosition = InstanceType<typeof Position>
type TestRange = InstanceType<typeof Range>
type DocumentPosition = Parameters<TextDocument['offsetAt']>[0]

vi.mock('vscode', () => ({
  Position,
  Range,
  TextEdit,
  workspace: {
    getConfiguration: () => ({
      get: (_name: string, fallback: unknown) => fallback,
    }),
  },
}))

vi.mock('./htmlFormatting', () => ({
  formatHtmlFragment: mockedFormatHtmlFragment,
  getHtmlFormattingOptions: () => ({
    printWidth: 80,
    tabSize: 2,
    useTabs: false,
  }),
  normalizeSelfClosingTagSpacing: (formatted: string) => formatted,
  shouldFormatOnSave: () => true,
}))

describe('mdxFormatting', () => {
  beforeEach(() => {
    mockedFormatHtmlFragment.mockClear()
  })

  it('collects full MDX markup blocks without dropping fenced code or prose', () => {
    const document = createTextDocument(`
---
title: Tabs
---

Before tabs.

<Tabs id="demo">
  <TabPane id="alpha" label="Alpha">
    Intro paragraph.

    \`\`\`ts
    console.log('alpha')
    \`\`\`

    Closing paragraph.
  </TabPane>
</Tabs>

After tabs.
`)

    const blocks = getMdxMarkupBlocks(document)

    expect(blocks).toHaveLength(1)
    expect(blocks[0]?.content).toContain('Intro paragraph.')
    expect(blocks[0]?.content).toContain("console.log('alpha')")
    expect(blocks[0]?.content).toContain('Closing paragraph.')
    expect(blocks[0]?.content).toContain('</Tabs>')
  })

  it('preserves fenced code blocks when the HTML formatter reindents placeholder lines', async () => {
    const source = [
      '<Tabs id="demo">',
      '<TabPane id="alpha" label="Alpha">',
      '    ```ts',
      "    console.log('alpha')",
      '    ```',
      '</TabPane>',
      '</Tabs>',
    ].join('\n')
    const document = createTextDocument(source)

    const edits = await buildMdxFormattingEdits(document)

    expect(edits).toHaveLength(1)
    expect(edits[0]?.newText).toContain('    ```ts')
    expect(edits[0]?.newText).not.toContain('      ```ts')
    expect(edits[0]?.newText).toContain("    console.log('alpha')")
    expect(edits[0]?.newText).toContain('  </TabPane>')
  })

  it('is idempotent across repeated save formatting passes', async () => {
    const source = [
      '<Tabs id="demo">',
      '<TabPane id="alpha" label="Alpha">',
      '    ```ts',
      "    console.log('alpha')",
      '    ```',
      '</TabPane>',
      '</Tabs>',
    ].join('\n')

    const firstDocument = createTextDocument(source)
    const firstEdits = await buildMdxFormattingEdits(firstDocument)
    const firstPass = applyEdits(source, firstEdits)
    const secondDocument = createTextDocument(firstPass)
    const secondEdits = await buildMdxFormattingEdits(secondDocument)

    expect(firstEdits).toHaveLength(1)
    expect(firstPass).toContain('    ```ts')
    expect(firstPass).not.toContain('      ```ts')
    expect(secondEdits).toHaveLength(0)
  })

  it('does not delete markdown content surrounding fenced blocks inside tab panes', async () => {
    const source = [
      '<Tabs id="demo">',
      '  <TabPane id="alpha" label="Alpha">',
      '    Lead paragraph with `inline code`.',
      '',
      '    ```bash',
      '    npm install @purestack/ts-ssg',
      '    ```',
      '',
      '    Trailing paragraph after the fence.',
      '    <TabPane>`asdf`</TabPane>',
      '  </TabPane>',
      '</Tabs>',
    ].join('\n')
    const document = createTextDocument(source)

    const edits = await buildMdxFormattingEdits(document)

    expect(edits).toHaveLength(1)
    expect(edits[0]?.newText).toContain('Lead paragraph with `inline code`.')
    expect(edits[0]?.newText).toContain('npm install @purestack/ts-ssg')
    expect(edits[0]?.newText).toContain('Trailing paragraph after the fence.')
    expect(edits[0]?.newText).toContain('<TabPane>`asdf`</TabPane>')
  })

  it('preserves tilde fences the same way as backtick fences', async () => {
    const source = [
      '<Tabs id="demo">',
      '<TabPane id="alpha" label="Alpha">',
      '    ~~~html',
      '    <div>alpha</div>',
      '    ~~~',
      '</TabPane>',
      '</Tabs>',
    ].join('\n')
    const document = createTextDocument(source)

    const edits = await buildMdxFormattingEdits(document)

    expect(edits).toHaveLength(1)
    expect(edits[0]?.newText).toContain('    ~~~html')
    expect(edits[0]?.newText).not.toContain('      ~~~html')
    expect(edits[0]?.newText).toContain('    <div>alpha</div>')
  })

  it('keeps double-digit fenced placeholders distinct across repeated saves', async () => {
    const lines = ['<Tabs id="demo">']

    for (let index = 0; index < 12; index++) {
      lines.push(`  <TabPane id="tab-${index}" label="Tab ${index}">`)
      lines.push('    ```ts')
      lines.push(`    console.log('Tab ${index} content')`)
      lines.push('    ```')
      lines.push('  </TabPane>')
    }

    lines.push('</Tabs>')

    const source = lines.join('\n')
    const firstPass = applyEdits(
      source,
      await buildMdxFormattingEdits(createTextDocument(source)),
    )
    const secondEdits = await buildMdxFormattingEdits(
      createTextDocument(firstPass),
    )

    expect(firstPass).toContain("console.log('Tab 10 content')")
    expect(firstPass).toContain("console.log('Tab 11 content')")
    expect(firstPass).not.toContain('```0')
    expect(firstPass).not.toContain('```1')
    expect(secondEdits).toHaveLength(0)
  })

  it('does not let fenced markup-like text affect markup block balancing', () => {
    const document = createTextDocument(`
<Tabs id="demo">
  <TabPane id="alpha" label="Alpha">
    \`\`\`html
    <TabPane id="fake">not real markup</TabPane>
    \`\`\`
  </TabPane>
</Tabs>
`)

    const blocks = getMdxMarkupBlocks(document)

    expect(blocks).toHaveLength(1)
    expect(blocks[0]?.content).toContain(
      '<TabPane id="fake">not real markup</TabPane>',
    )
    expect(blocks[0]?.content).toContain('</Tabs>')
  })

  it('moves an opening fence onto its own indented line when it is attached to a tag', async () => {
    const source = [
      '<Tabs id="demo">',
      '  <TabPane id="npm" label="npm">```bash',
      '    npm install @purestack/ts-ssg',
      '  ```',
      '  </TabPane>',
      '</Tabs>',
    ].join('\n')

    const edits = await buildMdxFormattingEdits(createTextDocument(source))

    expect(edits).toHaveLength(1)
    expect(edits[0]?.newText).toContain('  <TabPane id="npm" label="npm">')
    expect(edits[0]?.newText).toContain('    ```bash')
    expect(edits[0]?.newText).toContain('    npm install @purestack/ts-ssg')
    expect(edits[0]?.newText).toContain('    ```')
    expect(edits[0]?.newText).not.toContain(
      '<TabPane id="npm" label="npm">```bash',
    )
  })

  it('aligns misindented opening and closing fences to the current tab depth', async () => {
    const source = [
      '<Tabs id="demo">',
      '  <TabPane id="yarn" label="yarn">',
      '       ```bash',
      '    yarn add @purestack/ts-ssg',
      '           ```',
      '  </TabPane>',
      '</Tabs>',
    ].join('\n')

    const edits = await buildMdxFormattingEdits(createTextDocument(source))

    expect(edits).toHaveLength(1)
    expect(edits[0]?.newText).toContain('    ```bash')
    expect(edits[0]?.newText).toContain('    yarn add @purestack/ts-ssg')
    expect(edits[0]?.newText).toContain('    ```')
    expect(edits[0]?.newText).not.toContain('       ```bash')
    expect(edits[0]?.newText).not.toContain('           ```')
  })
})

function createTextDocument(text: string) {
  const normalizedText = stripLeadingNewline(text)
  const lines = normalizedText.split('\n')
  const lineOffsets = buildLineOffsets(lines)

  return {
    languageId: 'mdx',
    lineCount: lines.length,
    uri: { fsPath: '/virtual/test.mdx' },
    fileName: '/virtual/test.mdx',
    isUntitled: false,
    encoding: 'utf8',
    version: 1,
    isDirty: false,
    isClosed: false,
    eol: 1,
    save: async () => true,
    getText(range?: TestRange) {
      if (!range) return normalizedText
      const start = offsetAtPosition(range.start, lineOffsets, lines)
      const end = offsetAtPosition(range.end, lineOffsets, lines)
      return normalizedText.slice(start, end)
    },
    lineAt(lineIndex: number) {
      const text = lines[lineIndex] ?? ''
      const start = new Position(lineIndex, 0)
      const end = new Position(lineIndex, text.length)
      return {
        text,
        range: new Range(start, end),
        rangeIncludingLineBreak: new Range(
          start,
          new Position(
            lineIndex,
            text.length + (lineIndex < lines.length - 1 ? 1 : 0),
          ),
        ),
      }
    },
    offsetAt(position: TestPosition) {
      return offsetAtPosition(position, lineOffsets, lines)
    },
    positionAt(offset: number) {
      return positionFromOffset(offset, lineOffsets, lines)
    },
    validateRange(range: TestRange) {
      return range
    },
    validatePosition(position: TestPosition) {
      return position
    },
    getWordRangeAtPosition() {
      return undefined
    },
  } as unknown as TextDocument
}

function applyEdits(
  text: string,
  edits: Array<{ range: TestRange; newText: string }>,
) {
  let nextText = text
  const sortedEdits = [...edits].sort(
    (left, right) =>
      offsetFromRangeStart(right.range) - offsetFromRangeStart(left.range),
  )

  for (const edit of sortedEdits) {
    const document = createTextDocument(nextText)
    const start = document.offsetAt(edit.range.start as DocumentPosition)
    const end = document.offsetAt(edit.range.end as DocumentPosition)
    nextText = `${nextText.slice(0, start)}${edit.newText}${nextText.slice(end)}`
  }

  return nextText
}

function fakeFormatHtmlFragment(source: string) {
  const lines = source
    .trim()
    .split('\n')
    .map((line) => line.trim())

  const formattedLines: string[] = []
  let depth = 0

  for (const line of lines) {
    if (/^<\//.test(line)) {
      depth = Math.max(0, depth - 1)
    }

    formattedLines.push(`${'  '.repeat(depth)}${line}`)

    if (isBlockOpeningLine(line)) {
      depth++
    }
  }

  return formattedLines.join('\n')
}

function isBlockOpeningLine(line: string) {
  return /^<[A-Za-z]/.test(line) && !/\/>$/.test(line) && !line.includes('</')
}

function stripLeadingNewline(text: string) {
  return text.startsWith('\n') ? text.slice(1) : text
}

function buildLineOffsets(lines: string[]) {
  const lineOffsets: number[] = []
  let offset = 0

  for (const line of lines) {
    lineOffsets.push(offset)
    offset += line.length + 1
  }

  return lineOffsets
}

function offsetAtPosition(
  position: TestPosition,
  lineOffsets: number[],
  lines: string[],
) {
  const lineOffset = lineOffsets[position.line] ?? 0
  const lineLength = (lines[position.line] ?? '').length
  return lineOffset + Math.min(position.character, lineLength)
}

function positionFromOffset(
  offset: number,
  lineOffsets: number[],
  lines: string[],
) {
  for (let lineIndex = 0; lineIndex < lineOffsets.length; lineIndex++) {
    const lineStart = lineOffsets[lineIndex]
    const lineEnd = lineStart + (lines[lineIndex] ?? '').length
    if (offset <= lineEnd || lineIndex === lineOffsets.length - 1) {
      return new Position(lineIndex, Math.max(0, offset - lineStart))
    }
  }

  return new Position(0, 0)
}

function offsetFromRangeStart(range: TestRange) {
  return positionToOffset(range.start)
}

function positionToOffset(position: TestPosition) {
  return position.line * 100000 + position.character
}

function offsetToPosition(offset: number) {
  return new Position(Math.floor(offset / 100000), offset % 100000)
}
