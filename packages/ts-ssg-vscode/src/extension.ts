import * as vscode from 'vscode'
import { resolveComponentTarget } from './componentResolver'

const COMPONENT_TAG_PATTERN = /[A-Za-z][A-Za-z0-9]*/
const COMPONENT_NAME_PATTERN = /^[A-Z][A-Za-z0-9]*$/

const MARKDOWN_SELECTORS: vscode.DocumentSelector = [
  { language: 'markdown', scheme: 'file' },
  { language: 'mdx', scheme: 'file' },
]

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      MARKDOWN_SELECTORS,
      new ComponentDefinitionProvider(),
    ),
  )
}

export function deactivate() {}

class ComponentDefinitionProvider implements vscode.DefinitionProvider {
  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.Location | undefined {
    const componentName = getComponentNameAtPosition(document, position)
    if (!componentName) return undefined

    const workspaceRoot = resolveWorkspaceRoot(document.uri.fsPath)
    if (!workspaceRoot) return undefined

    const target = resolveComponentTarget(workspaceRoot, componentName)
    if (!target) return undefined

    return new vscode.Location(
      vscode.Uri.file(target.filePath),
      new vscode.Position(target.line, 0),
    )
  }
}

function getComponentNameAtPosition(
  document: vscode.TextDocument,
  position: vscode.Position,
): string | undefined {
  const range = document.getWordRangeAtPosition(position, COMPONENT_TAG_PATTERN)
  if (!range) return undefined

  const word = document.getText(range)
  if (!COMPONENT_NAME_PATTERN.test(word)) return undefined
  if (!isComponentTagRange(document, range)) return undefined

  return word
}

function isComponentTagRange(
  document: vscode.TextDocument,
  range: vscode.Range,
): boolean {
  const line = document.lineAt(range.start.line).text
  const start = range.start.character
  const end = range.end.character
  const before = line.slice(Math.max(0, start - 2), start)
  const after = line.slice(end, end + 1)

  const startsLikeTag = before === '</' || before.endsWith('<')
  const endsLikeTag = after.length === 0 || /[\s/>]/.test(after)

  return startsLikeTag && endsLikeTag
}

function resolveWorkspaceRoot(documentPath: string): string | undefined {
  const folders = vscode.workspace.workspaceFolders
  if (!folders || folders.length === 0) return undefined

  for (const folder of folders) {
    if (documentPath.startsWith(folder.uri.fsPath)) return folder.uri.fsPath
  }

  return folders[0]?.uri.fsPath
}
