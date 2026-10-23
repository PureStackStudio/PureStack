import type { HtmlFormattingOptions } from './html'

export interface SourceRange {
  start: number
  end: number
}

export interface SourceEdit extends SourceRange {
  newText: string
}

export interface FormatDiagnostic extends SourceRange {
  message: string
}

export interface FormatOptions extends Partial<HtmlFormattingOptions> {
  filePath?: string
  language?: 'mdx' | 'typescript'
  onlyWithinRange?: SourceRange
}

export function intersects(left: SourceRange, right: SourceRange) {
  return left.start <= right.end && right.start <= left.end
}

/** Immutable source snapshot. All edit offsets refer to this text. */
export class SourceText {
  readonly filePath: string
  readonly options: HtmlFormattingOptions
  readonly diagnostics: FormatDiagnostic[] = []
  private readonly lines: Array<{ text: string; range: SourceRange }> = []
  private readonly eol: '\n' | '\r\n'

  constructor(
    readonly text: string,
    options: FormatOptions = {},
  ) {
    this.filePath = options.filePath ?? 'source.mdx'
    this.options = {
      printWidth: options.printWidth ?? 80,
      tabSize: options.tabSize ?? 2,
      useTabs: options.useTabs ?? false,
    }
    for (const value of [this.options.printWidth, this.options.tabSize]) {
      if (!Number.isInteger(value) || value < 1)
        throw new Error('Print width and tab size must be positive integers.')
    }
    this.eol = /\r\n/.test(text) ? '\r\n' : '\n'
    let start = 0
    for (const line of text.split('\n')) {
      const content = line.endsWith('\r') ? line.slice(0, -1) : line
      this.lines.push({
        text: content,
        range: { start, end: start + content.length },
      })
      start += line.length + 1
    }
  }

  get lineCount() {
    return this.lines.length
  }

  lineAt(line: number) {
    return this.lines[line]
  }

  positionAt(offset: number) {
    const bounded = Math.max(0, Math.min(offset, this.text.length))
    let low = 0
    let high = this.lines.length - 1
    while (low < high) {
      const middle = Math.ceil((low + high) / 2)
      if (this.lines[middle].range.start > bounded) high = middle - 1
      else low = middle
    }
    const line = this.lines[low]
    return {
      line: low,
      character: Math.min(bounded, line.range.end) - line.range.start,
    }
  }

  offsetAt(position: { line: number; character: number }) {
    const line =
      this.lines[Math.max(0, Math.min(position.line, this.lines.length - 1))]
    return Math.min(
      line.range.end,
      line.range.start + Math.max(0, position.character),
    )
  }

  preserveEol(text: string) {
    return text.replace(/\r?\n/g, this.eol)
  }

  report(range: SourceRange, error: unknown) {
    this.diagnostics.push({
      ...range,
      message: error instanceof Error ? error.message : String(error),
    })
  }
}

/** Apply non-overlapping edits against their original snapshot. */
export function applySourceEdits(source: string, edits: readonly SourceEdit[]) {
  const ordered = [...edits].sort((a, b) => a.start - b.start || a.end - b.end)
  let cursor = 0
  const parts: string[] = []
  for (const edit of ordered) {
    if (
      edit.start < cursor ||
      edit.end < edit.start ||
      edit.end > source.length
    )
      throw new Error('Formatter returned overlapping or invalid source edits.')
    parts.push(source.slice(cursor, edit.start), edit.newText)
    cursor = edit.end
  }
  parts.push(source.slice(cursor))
  return parts.join('')
}
