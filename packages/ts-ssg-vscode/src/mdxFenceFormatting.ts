import {
  buildMdxFenceDelimiterEdits as buildSourceEdits,
  SourceText,
} from '@purestack/ts-format'
import type * as vscode from 'vscode'
import { toEditorEdits, toSourceRange } from './formatting'

export {
  isMdxFenceClosingDelimiter,
  type MdxFence,
  type MdxFenceDelimiter,
  type MdxFencePlaceholder,
  maskMdxFencedRegions,
  parseInlineMdxFenceCloser,
  parseInlineMdxFenceOpener,
  parseMdxFenceDelimiter,
  restoreMdxFencedRegions,
} from '@purestack/ts-format'

export function buildMdxFenceDelimiterEdits(
  document: Pick<vscode.TextDocument, 'lineCount' | 'lineAt'>,
  excludedRanges: vscode.Range[],
  options: { onlyWithinRange?: vscode.Range } = {},
) {
  const source = new SourceText(
    Array.from(
      { length: document.lineCount },
      (_, line) => document.lineAt(line).text,
    ).join('\n'),
  )
  return toEditorEdits(
    source,
    buildSourceEdits(
      source,
      excludedRanges.map((range) => toSourceRange(source, range)),
      {
        onlyWithinRange: options.onlyWithinRange
          ? toSourceRange(source, options.onlyWithinRange)
          : undefined,
      },
    ),
  )
}
