import {
  buildMdxFormattingEdits as buildSourceEdits,
  getMdxMarkupBlocks as getSourceBlocks,
} from '@purestack/ts-format'
import type * as vscode from 'vscode'
import {
  createFormattingSource,
  toEditorEdits,
  toEditorRange,
  toSourceRange,
} from './formatting'
import { shouldFormatOnSave } from './htmlFormatting'

export { maskMdxExpressions } from '@purestack/ts-format'

export interface MdxMarkupBlock {
  content: string
  range: vscode.Range
}

interface MdxFormattingRequest {
  onlyWithinRange?: vscode.Range
  requireFormatOnSave?: boolean
}

export async function buildMdxFormattingEdits(
  document: vscode.TextDocument,
  request: MdxFormattingRequest = {},
) {
  if (document.languageId !== 'mdx') return []
  if (request.requireFormatOnSave && !shouldFormatOnSave(document)) return []
  const source = createFormattingSource(document)
  return toEditorEdits(
    source,
    await buildSourceEdits(source, {
      onlyWithinRange: request.onlyWithinRange
        ? toSourceRange(source, request.onlyWithinRange)
        : undefined,
    }),
  )
}

export function getMdxMarkupBlocks(
  document: vscode.TextDocument,
  options: { includeIncomplete?: boolean } = {},
): MdxMarkupBlock[] {
  const source = createFormattingSource(document)
  return getSourceBlocks(source, options).map((block) => ({
    content: block.content,
    range: toEditorRange(source, block.range),
  }))
}

export async function formatActiveEditorMdxMarkup(
  editor: vscode.TextEditor,
  request: MdxFormattingRequest = {},
) {
  const version = editor.document.version
  const edits = await buildMdxFormattingEdits(editor.document, request)
  if (!edits.length || editor.document.version !== version) return false
  return editor.edit((builder) => {
    for (const edit of edits) builder.replace(edit.range, edit.newText)
  })
}
