import ts from 'typescript'
import * as vscode from 'vscode'
import { resolveComponentTarget } from './componentResolver'

const COMPONENT_TAG_PATTERN = /[A-Za-z][A-Za-z0-9-]*/
const COMPONENT_NAME_PATTERN = /^[A-Za-z][A-Za-z0-9-]*$/

const SUPPORTED_SELECTORS: vscode.DocumentSelector = [
  { language: 'markdown', scheme: 'file' },
  { language: 'mdx', scheme: 'file' },
  { language: 'typescript', scheme: 'file' },
]

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      SUPPORTED_SELECTORS,
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
  if (!isSupportedComponentTagRange(document, position, range)) return undefined

  return word
}

function isSupportedComponentTagRange(
  document: vscode.TextDocument,
  position: vscode.Position,
  range: vscode.Range,
): boolean {
  if (document.languageId === 'typescript') {
    return isHtmlTemplateComponentTagRange(document, position, range)
  }

  return isComponentTagRange(document, range)
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

function isHtmlTemplateComponentTagRange(
  document: vscode.TextDocument,
  position: vscode.Position,
  range: vscode.Range,
): boolean {
  if (!isComponentTagRange(document, range)) return false

  const offset = document.offsetAt(position)
  const sourceFile = ts.createSourceFile(
    document.uri.fsPath,
    document.getText(),
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  )

  return isOffsetInsideHtmlTaggedTemplate(sourceFile, offset)
}

function isOffsetInsideHtmlTaggedTemplate(
  sourceFile: ts.SourceFile,
  offset: number,
): boolean {
  let isInsideTemplate = false

  visitNode(sourceFile)
  return isInsideTemplate

  function visitNode(node: ts.Node) {
    if (isInsideTemplate) return
    if (offset < node.getStart(sourceFile) || offset >= node.getEnd()) return

    if (
      ts.isTaggedTemplateExpression(node) &&
      node.tag.getText(sourceFile) === 'html'
    ) {
      const template = node.template
      if (
        offset >= template.getStart(sourceFile) &&
        offset < template.getEnd()
      ) {
        isInsideTemplate = true
        return
      }
    }

    ts.forEachChild(node, visitNode)
  }
}

function resolveWorkspaceRoot(documentPath: string): string | undefined {
  const folders = vscode.workspace.workspaceFolders
  if (!folders || folders.length === 0) return undefined

  for (const folder of folders) {
    if (documentPath.startsWith(folder.uri.fsPath)) return folder.uri.fsPath
  }

  return folders[0]?.uri.fsPath
}
