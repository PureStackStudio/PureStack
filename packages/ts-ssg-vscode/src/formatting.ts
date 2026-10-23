import {
  type SourceEdit,
  type SourceRange,
  SourceText,
} from '@purestack/ts-format'
import * as vscode from 'vscode'
import { getHtmlFormattingOptions } from './htmlFormatting'

export function createFormattingSource(document: vscode.TextDocument) {
  return new SourceText(document.getText(), {
    ...getHtmlFormattingOptions(document),
    filePath: document.uri.fsPath,
  })
}

export function toSourceRange(source: SourceText, range: vscode.Range) {
  return {
    start: source.offsetAt(range.start),
    end: source.offsetAt(range.end),
  }
}

export function toEditorRange(source: SourceText, range: SourceRange) {
  const start = source.positionAt(range.start)
  const end = source.positionAt(range.end)
  return new vscode.Range(
    new vscode.Position(start.line, start.character),
    new vscode.Position(end.line, end.character),
  )
}

export function toEditorEdits(source: SourceText, edits: SourceEdit[]) {
  for (const diagnostic of source.diagnostics) {
    console.warn(
      `[PureStack] Skipping markup formatting for ${source.filePath}: ${diagnostic.message}`,
    )
  }
  return edits.map((edit) =>
    vscode.TextEdit.replace(toEditorRange(source, edit), edit.newText),
  )
}
