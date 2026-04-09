import htmlPlugin from 'prettier/plugins/html'
import prettier from 'prettier/standalone'
import * as vscode from 'vscode'

const DEFAULT_PRINT_WIDTH = 80
const DEFAULT_TAB_SIZE = 2

export interface HtmlFormattingOptions {
  printWidth: number
  tabSize: number
  useTabs: boolean
}

export async function formatHtmlFragment(
  source: string,
  options: HtmlFormattingOptions,
) {
  return prettier.format(source, {
    htmlWhitespaceSensitivity: 'ignore',
    parser: 'html',
    plugins: [htmlPlugin],
    printWidth: options.printWidth,
    tabWidth: options.tabSize,
    useTabs: options.useTabs,
  })
}

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

export function getIndentUnit(options: HtmlFormattingOptions) {
  return options.useTabs ? '\t' : ' '.repeat(options.tabSize)
}

export function getLineIndent(line: string) {
  const match = /^\s*/.exec(line)
  return match?.[0] ?? ''
}

export function getBlockIndent(blockContent: string) {
  const firstNonEmptyLine = blockContent
    .split(/\r?\n/)
    .find((line) => line.trim().length > 0)

  return firstNonEmptyLine ? getLineIndent(firstNonEmptyLine) : ''
}

export function normalizeSelfClosingTagSpacing(formatted: string) {
  return formatted.replace(/\s+\/>/g, '/>')
}

export function shouldFormatOnSave(document: vscode.TextDocument) {
  const editorConfig = vscode.workspace.getConfiguration('editor', document.uri)
  return editorConfig.get<boolean>('formatOnSave', false)
}
