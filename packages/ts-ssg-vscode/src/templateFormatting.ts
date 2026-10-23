import {
  buildTemplateFormattingEdits as buildSourceEdits,
  getSupportedTaggedTemplates as getSourceTemplates,
  type SupportedTaggedTemplate as SourceTemplate,
} from '@purestack/ts-format'
import type * as vscode from 'vscode'
import {
  createFormattingSource,
  toEditorEdits,
  toEditorRange,
  toSourceRange,
} from './formatting'
import { shouldFormatOnSave } from './htmlFormatting'

export {
  isOffsetInsideSupportedTaggedTemplate,
  type SupportedTemplateTagName,
} from '@purestack/ts-format'

export interface SupportedTaggedTemplate
  extends Omit<SourceTemplate, 'contentRange'> {
  contentRange: vscode.Range
}

interface TemplateFormattingRequest {
  onlyWithinRange?: vscode.Range
  requireFormatOnSave?: boolean
}

export async function buildTemplateFormattingEdits(
  document: vscode.TextDocument,
  request: TemplateFormattingRequest = {},
) {
  if (document.languageId !== 'typescript') return []
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

export function getSupportedTaggedTemplates(
  document: vscode.TextDocument,
): SupportedTaggedTemplate[] {
  const source = createFormattingSource(document)
  return getSourceTemplates(source).map((template) => ({
    ...template,
    contentRange: toEditorRange(source, template.contentRange),
  }))
}

export async function formatActiveEditorTemplates(
  editor: vscode.TextEditor,
  request: TemplateFormattingRequest = {},
) {
  const version = editor.document.version
  const edits = await buildTemplateFormattingEdits(editor.document, request)
  if (!edits.length || editor.document.version !== version) return false
  return editor.edit((builder) => {
    for (const edit of edits) builder.replace(edit.range, edit.newText)
  })
}
