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

function createTypeScriptDocument(text: string, fsPath = 'test.ts') {
  const lineStarts = getLineStarts(text)

  return {
    languageId: 'typescript',
    uri: { fsPath },
    getText: () => text,
    positionAt: (offset: number) => {
      const line = findLineIndex(lineStarts, offset)
      return new TestPosition(line, offset - lineStarts[line])
    },
  }
}

function getLineStarts(text: string) {
  const starts = [0]

  for (let index = 0; index < text.length; index++) {
    if (text[index] === '\n') starts.push(index + 1)
  }

  return starts
}

function findLineIndex(lineStarts: number[], offset: number) {
  for (let index = lineStarts.length - 1; index >= 0; index--) {
    if (offset >= lineStarts[index]) return index
  }

  return 0
}

function applyEdits(source: string, edits: Array<{ newText: string }>) {
  if (edits.length === 0) return source
  if (edits.length !== 1) {
    throw new Error(`Expected one edit, received ${edits.length}`)
  }

  return edits[0].newText
}

describe('buildTemplateFormattingEdits', () => {
  it('formats supported HTML tagged templates', async () => {
    const { buildTemplateFormattingEdits } = await import(
      './templateFormatting.js'
    )
    const source = 'const view = html`<Panel><Badge tone="accent" /></Panel>`'

    const edits = await buildTemplateFormattingEdits(
      createTypeScriptDocument(source) as never,
      { requireFormatOnSave: true },
    )
    const formatted = applyEdits(source, edits as Array<{ newText: string }>)

    expect(formatted).toBe('<Panel><Badge tone="accent"/></Panel>')
  })

  it('skips templates that are likely closed by a raw fenced-code backtick', async () => {
    const { buildTemplateFormattingEdits } = await import(
      './templateFormatting.js'
    )
    const source = [
      'const view = html`<Tabs tone="neutral">',
      '  <TabPane>',
      '```mdx',
      '    <LandingSection>',
      '      <a>asdf</a>',
      '    </LandingSection>',
      '```',
      '  </TabPane>',
      '</Tabs>',
      '`',
    ].join('\n')

    const edits = await buildTemplateFormattingEdits(
      createTypeScriptDocument(source) as never,
      { requireFormatOnSave: true },
    )

    expect(edits).toEqual([])
  })
})
