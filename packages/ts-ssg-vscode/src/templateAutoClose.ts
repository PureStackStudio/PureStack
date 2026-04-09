import * as vscode from 'vscode'
import {
  getMarkupContextAtOffset,
  getPendingOpeningTagAtEnd,
  hasImmediateClosingTag,
  isOffsetInsideIgnoredRange,
  sanitizeMarkup,
  scanTagTokens,
  VOID_HTML_TAG_NAMES,
  type MarkupContext,
} from './markupSupport'

let isApplyingAutoCloseEdit = false

export function registerTemplateAutoClose() {
  return vscode.workspace.onDidChangeTextDocument(async (event) => {
    if (isApplyingAutoCloseEdit) return
    if (
      event.document.languageId !== 'typescript' &&
      event.document.languageId !== 'mdx'
    ) {
      return
    }
    if (event.contentChanges.length !== 1) return

    const editor = vscode.window.activeTextEditor
    if (
      !editor ||
      editor.document.uri.toString() !== event.document.uri.toString()
    )
      return
    if (editor.selections.length !== 1 || !editor.selection.isEmpty) return

    const [change] = event.contentChanges
    if (change.rangeLength !== 0) return
    if (change.text !== '>' && change.text !== '/') return

    const cursorOffset =
      event.document.offsetAt(change.range.start) + change.text.length
    const cursorPosition = event.document.positionAt(cursorOffset)
    const changedOffset = cursorOffset - change.text.length
    const autoCloseContext = getMarkupContextAtOffset(
      event.document,
      cursorOffset,
    )
    if (!autoCloseContext) return
    if (isOffsetInsideIgnoredRange(autoCloseContext, changedOffset)) return

    if (change.text === '>') {
      await maybeAutoInsertClosingTag(
        editor,
        autoCloseContext,
        cursorOffset,
        cursorPosition,
      )
      return
    }

    await maybeCompleteSelfClosingTag(
      editor,
      autoCloseContext,
      cursorOffset,
      cursorPosition,
    )
  })
}

async function maybeAutoInsertClosingTag(
  editor: vscode.TextEditor,
  templateContext: MarkupContext,
  cursorOffset: number,
  cursorPosition: vscode.Position,
) {
  const sanitizedBeforeCursor = sanitizeMarkup(
    editor.document,
    templateContext,
    templateContext.contentStartOffset,
    cursorOffset,
  )
  const tokens = scanTagTokens(sanitizedBeforeCursor)
  const lastToken = tokens[tokens.length - 1]

  if (!lastToken || lastToken.kind !== 'opening') return
  if (lastToken.end !== sanitizedBeforeCursor.length) return
  if (lastToken.selfClosing) return
  if (
    VOID_HTML_TAG_NAMES.has(lastToken.name.toLowerCase()) ||
    /^[A-Z]/.test(lastToken.name)
  ) {
    await applyAutoCloseEdit(editor, cursorPosition.translate(0, -1), '/', {
      position: cursorPosition,
    })
    return
  }
  if (hasImmediateClosingTag(editor.document, cursorOffset, lastToken.name))
    return

  await applyAutoCloseEdit(editor, cursorPosition, `</${lastToken.name}>`, {
    position: cursorPosition,
  })
}

async function maybeCompleteSelfClosingTag(
  editor: vscode.TextEditor,
  templateContext: MarkupContext,
  cursorOffset: number,
  cursorPosition: vscode.Position,
) {
  if (cursorOffset > templateContext.contentEndOffset) return

  const nextCharacter = editor.document.getText(
    new vscode.Range(
      editor.document.positionAt(cursorOffset),
      editor.document.positionAt(
        Math.min(cursorOffset + 1, editor.document.getText().length),
      ),
    ),
  )
  if (nextCharacter === '>') return

  const sanitizedBeforeCursor = sanitizeMarkup(
    editor.document,
    templateContext,
    templateContext.contentStartOffset,
    cursorOffset,
  )
  const pendingTag = getPendingOpeningTagAtEnd(sanitizedBeforeCursor)
  if (!pendingTag) return
  if (VOID_HTML_TAG_NAMES.has(pendingTag.toLowerCase())) return

  await applyAutoCloseEdit(editor, cursorPosition, '>', {
    position: cursorPosition.translate(0, 1),
  })
}

async function applyAutoCloseEdit(
  editor: vscode.TextEditor,
  position: vscode.Position,
  text: string,
  selection: { position: vscode.Position },
) {
  isApplyingAutoCloseEdit = true
  try {
    const applied = await editor.edit((editBuilder) => {
      editBuilder.insert(position, text)
    })
    if (!applied) return

    editor.selection = new vscode.Selection(
      selection.position,
      selection.position,
    )
  } finally {
    isApplyingAutoCloseEdit = false
  }
}
