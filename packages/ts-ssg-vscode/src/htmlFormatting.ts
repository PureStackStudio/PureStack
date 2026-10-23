import * as vscode from 'vscode'

export type { HtmlFormattingOptions } from '@purestack/ts-format'
export {
  formatHtmlFragment,
  getLineIndent,
  normalizeSelfClosingTagSpacing,
} from '@purestack/ts-format'

const DEFAULT_PRINT_WIDTH = 80
const DEFAULT_TAB_SIZE = 2

export function getHtmlFormattingOptions(document: vscode.TextDocument) {
  const editorConfig = vscode.workspace.getConfiguration('editor', document.uri)
  const configuredWordWrap = Number(
    editorConfig.get<number>('wordWrapColumn', DEFAULT_PRINT_WIDTH),
  )
  const configuredTabSize = editorConfig.get<number | string>(
    'tabSize',
    DEFAULT_TAB_SIZE,
  )
  const configuredInsertSpaces = editorConfig.get<boolean | string>(
    'insertSpaces',
    true,
  )

  return {
    printWidth:
      configuredWordWrap > 0 ? configuredWordWrap : DEFAULT_PRINT_WIDTH,
    tabSize:
      typeof configuredTabSize === 'number' && configuredTabSize > 0
        ? configuredTabSize
        : DEFAULT_TAB_SIZE,
    useTabs: configuredInsertSpaces === false,
  }
}

export function shouldFormatOnSave(document: vscode.TextDocument) {
  const editorConfig = vscode.workspace.getConfiguration('editor', document.uri)
  return editorConfig.get<boolean>('formatOnSave', false)
}
