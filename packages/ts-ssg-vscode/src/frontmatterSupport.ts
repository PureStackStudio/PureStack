import * as vscode from 'vscode'
import {
  clearFrontmatterMetadataCache,
  type FrontmatterPropertyMetadata,
  getPageFrontmatterMetadata,
} from './frontmatterMetadata'

interface FrontmatterLineState {
  indent: number
  key: string
}

interface FrontmatterRangeInfo {
  contentEndLine: number
  contentStartLine: number
}

interface FrontmatterKeyContext {
  kind: 'key'
  indent: number
  keyRange: vscode.Range
  parentPath: string[]
}

interface FrontmatterValueContext {
  key: string
  kind: 'value'
  parentPath: string[]
  valueRange: vscode.Range
}

type FrontmatterContext = FrontmatterKeyContext | FrontmatterValueContext

const FRONTMATTER_SELECTOR: vscode.DocumentSelector = [
  { language: 'mdx', scheme: 'file' },
]

export function registerFrontmatterSupport() {
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    FRONTMATTER_SELECTOR,
    new FrontmatterCompletionProvider(),
    ':',
    ' ',
    '"',
    "'",
  )
  const hoverProvider = vscode.languages.registerHoverProvider(
    FRONTMATTER_SELECTOR,
    new FrontmatterHoverProvider(),
  )
  const definitionProvider = vscode.languages.registerDefinitionProvider(
    FRONTMATTER_SELECTOR,
    new FrontmatterDefinitionProvider(),
  )
  const suggestTrigger = vscode.workspace.onDidChangeTextDocument((event) => {
    if (event.document.languageId !== 'mdx') return
    if (event.contentChanges.length !== 1) return

    const editor = vscode.window.activeTextEditor
    if (
      !editor ||
      editor.document.uri.toString() !== event.document.uri.toString()
    ) {
      return
    }
    if (editor.selections.length !== 1 || !editor.selection.isEmpty) return

    const [change] = event.contentChanges
    if (change.rangeLength !== 0) return
    if (change.text !== '\n' && change.text !== ':' && change.text !== ' ')
      return

    const position = event.document.positionAt(
      event.document.offsetAt(change.range.start) + change.text.length,
    )
    if (!getFrontmatterContext(event.document, position)) return

    void vscode.commands.executeCommand('editor.action.triggerSuggest')
  })
  const metadataWatchers = registerFrontmatterMetadataWatchers()

  return vscode.Disposable.from(
    completionProvider,
    hoverProvider,
    definitionProvider,
    suggestTrigger,
    ...metadataWatchers,
  )
}

class FrontmatterCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
  ) {
    const context = getFrontmatterContext(document, position)
    if (!context) return undefined

    const metadataRoot = resolveFrontmatterMetadata(document)
    if (!metadataRoot) return undefined

    if (context.kind === 'value') {
      return buildValueCompletionItems(metadataRoot.properties, context)
    }

    return buildKeyCompletionItems(document, metadataRoot.properties, context)
  }
}

class FrontmatterHoverProvider implements vscode.HoverProvider {
  provideHover(document: vscode.TextDocument, position: vscode.Position) {
    const context = getFrontmatterContext(document, position)
    if (!context) return undefined

    const metadataRoot = resolveFrontmatterMetadata(document)
    if (!metadataRoot) return undefined

    if (context.kind === 'value') {
      const property = findPropertyMetadata(metadataRoot.properties, [
        ...context.parentPath,
        context.key,
      ])
      if (!property) return undefined

      return new vscode.Hover(createHoverContents(property))
    }

    const key = document.getText(context.keyRange).trim()
    const property = key
      ? findPropertyMetadata(metadataRoot.properties, [
          ...context.parentPath,
          key,
        ])
      : undefined

    if (property) {
      return new vscode.Hover(createHoverContents(property))
    }

    const parentProperty = findPropertyMetadata(
      metadataRoot.properties,
      context.parentPath,
    )
    if (!parentProperty) return undefined

    return new vscode.Hover(createHoverContents(parentProperty))
  }
}

class FrontmatterDefinitionProvider implements vscode.DefinitionProvider {
  provideDefinition(document: vscode.TextDocument, position: vscode.Position) {
    const context = getFrontmatterContext(document, position)
    if (!context) return undefined

    const metadataRoot = resolveFrontmatterMetadata(document)
    if (!metadataRoot) return undefined

    const keyPath =
      context.kind === 'value'
        ? [...context.parentPath, context.key]
        : [...context.parentPath, document.getText(context.keyRange).trim()]
    const property = findPropertyMetadata(
      metadataRoot.properties,
      keyPath.filter((segment) => segment.length > 0),
    )
    if (!property) return undefined

    return new vscode.Location(
      vscode.Uri.file(property.declarationFilePath),
      new vscode.Position(property.declarationLine, 0),
    )
  }
}

function registerFrontmatterMetadataWatchers() {
  const subscriptions: vscode.Disposable[] = []

  for (const folder of vscode.workspace.workspaceFolders ?? []) {
    const workspaceRoot = folder.uri.fsPath
    const invalidate = () => clearFrontmatterMetadataCache()

    const workspaceWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(
        folder,
        'packages/ts-common/src/frontmatter-types.ts',
      ),
    )
    workspaceWatcher.onDidCreate(invalidate)
    workspaceWatcher.onDidChange(invalidate)
    workspaceWatcher.onDidDelete(invalidate)

    const dependencyWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(
        folder,
        'node_modules/@purestack/ts-common/src/frontmatter-types.ts',
      ),
    )
    dependencyWatcher.onDidCreate(invalidate)
    dependencyWatcher.onDidChange(invalidate)
    dependencyWatcher.onDidDelete(invalidate)

    subscriptions.push(workspaceWatcher, dependencyWatcher)
    void workspaceRoot
  }

  subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      clearFrontmatterMetadataCache()
    }),
  )

  return subscriptions
}

function buildKeyCompletionItems(
  document: vscode.TextDocument,
  properties: FrontmatterPropertyMetadata[],
  context: FrontmatterKeyContext,
) {
  const parentProperty = findPropertyMetadata(properties, context.parentPath)
  const availableProperties =
    context.parentPath.length === 0
      ? properties
      : parentProperty?.nestedProperties
  if (!availableProperties) return undefined

  const existingKeys = getObjectKeysAtPath(document, context.parentPath)
  const indentText = document
    .lineAt(context.keyRange.start.line)
    .text.slice(0, context.indent)
  const indentUnit = getIndentUnit(document)
  const currentKey = document.getText(context.keyRange).trim()

  return availableProperties
    .filter((property) => {
      if (
        normalizeFrontmatterKey(currentKey) ===
        normalizeFrontmatterKey(property.name)
      ) {
        return true
      }

      return !existingKeys.has(normalizeFrontmatterKey(property.name))
    })
    .map((property) => {
      const item = new vscode.CompletionItem(
        property.name,
        property.kind === 'object'
          ? vscode.CompletionItemKind.Module
          : vscode.CompletionItemKind.Property,
      )
      item.range = context.keyRange
      item.detail = property.fullPath.join('.')
      item.documentation = createDocumentationText(property)

      if (property.kind === 'object') {
        item.insertText = new vscode.SnippetString(
          `${property.name}:\n${indentText}${indentUnit}$0`,
        )
      } else {
        item.insertText = new vscode.SnippetString(`${property.name}: $0`)
      }

      return item
    })
}

function buildValueCompletionItems(
  properties: FrontmatterPropertyMetadata[],
  context: FrontmatterValueContext,
) {
  const property = findPropertyMetadata(properties, [
    ...context.parentPath,
    context.key,
  ])
  if (!property) return undefined

  if (property.kind === 'boolean') {
    return ['true', 'false'].map((value) =>
      createValueCompletionItem(context, property, value),
    )
  }

  if (property.kind === 'enum' && property.values) {
    return property.values.map((value) =>
      createValueCompletionItem(context, property, value),
    )
  }

  return undefined
}

function createValueCompletionItem(
  context: FrontmatterValueContext,
  property: FrontmatterPropertyMetadata,
  value: string,
) {
  const item = new vscode.CompletionItem(value, vscode.CompletionItemKind.Value)
  item.range = context.valueRange
  item.insertText = ` ${value}`
  item.detail = property.fullPath.join('.')
  item.documentation = createDocumentationText(property)
  return item
}

function resolveFrontmatterMetadata(document: vscode.TextDocument) {
  const workspaceRoot = resolveWorkspaceRoot(document.uri.fsPath)
  if (!workspaceRoot) return undefined

  return getPageFrontmatterMetadata(workspaceRoot)
}

function findPropertyMetadata(
  properties: FrontmatterPropertyMetadata[],
  path: string[],
): FrontmatterPropertyMetadata | undefined {
  if (path.length === 0) return undefined

  let currentProperties = properties
  let currentProperty: FrontmatterPropertyMetadata | undefined

  for (const segment of path) {
    currentProperty = currentProperties.find(
      (property) =>
        normalizeFrontmatterKey(property.name) ===
        normalizeFrontmatterKey(segment),
    )
    if (!currentProperty) return undefined
    currentProperties = currentProperty.nestedProperties ?? []
  }

  return currentProperty
}

function createDocumentationText(property: FrontmatterPropertyMetadata) {
  return createHoverContents(property).join('\n\n')
}

function createHoverContents(property: FrontmatterPropertyMetadata) {
  const contents = [`\`\`\`ts\n${property.signature}\n\`\`\``]
  if (property.description) {
    contents.push(stripJsDoc(property.description))
  }
  if (
    property.kind === 'enum' &&
    property.values &&
    property.values.length > 0
  ) {
    contents.push(
      `Values: ${property.values.map((value) => `\`${value}\``).join(', ')}`,
    )
  }

  return contents
}

function stripJsDoc(value: string) {
  return value
    .replace(/^\/\*\*?/, '')
    .replace(/\*\/$/, '')
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trimEnd())
    .join('\n')
    .trim()
}

function getFrontmatterContext(
  document: vscode.TextDocument,
  position: vscode.Position,
): FrontmatterContext | undefined {
  const frontmatterRange = getFrontmatterRange(document)
  if (!frontmatterRange) return undefined
  if (
    position.line < frontmatterRange.contentStartLine ||
    position.line > frontmatterRange.contentEndLine
  ) {
    return undefined
  }

  const previousState = collectPreviousFrontmatterState(
    document,
    frontmatterRange.contentStartLine,
    position.line,
  )
  const line = document.lineAt(position.line)
  const lineText = line.text
  const keyMatch = /^(\s*)([A-Za-z][A-Za-z0-9-]*)?(\s*:)?/.exec(lineText)
  const indent = keyMatch?.[1].length ?? 0
  const parentPath = resolveParentPath(previousState, indent)
  const parsedLine = parseFrontmatterPropertyLine(lineText)

  if (!parsedLine) {
    const keyStart = indent
    const keyEnd = Math.max(
      keyStart,
      Math.min(position.character, line.range.end.character),
    )
    return {
      indent,
      keyRange: new vscode.Range(
        new vscode.Position(position.line, keyStart),
        new vscode.Position(position.line, keyEnd),
      ),
      kind: 'key',
      parentPath,
    }
  }

  if (position.character <= parsedLine.valueStartCharacter) {
    const keyEnd = parsedLine.keyStartCharacter + parsedLine.key.length
    return {
      indent: parsedLine.indent,
      keyRange: new vscode.Range(
        new vscode.Position(position.line, parsedLine.keyStartCharacter),
        new vscode.Position(position.line, keyEnd),
      ),
      kind: 'key',
      parentPath,
    }
  }

  return {
    key: parsedLine.key,
    kind: 'value',
    parentPath,
    valueRange: new vscode.Range(
      new vscode.Position(position.line, parsedLine.valueStartCharacter),
      new vscode.Position(position.line, line.range.end.character),
    ),
  }
}

function getFrontmatterRange(
  document: vscode.TextDocument,
): FrontmatterRangeInfo | undefined {
  if (document.lineCount < 3) return undefined
  if (document.lineAt(0).text.trim() !== '---') return undefined

  for (let lineIndex = 1; lineIndex < document.lineCount; lineIndex++) {
    if (document.lineAt(lineIndex).text.trim() !== '---') continue

    return {
      contentEndLine: lineIndex - 1,
      contentStartLine: 1,
    }
  }

  return undefined
}

function collectPreviousFrontmatterState(
  document: vscode.TextDocument,
  startLine: number,
  endLineExclusive: number,
) {
  const stack: FrontmatterLineState[] = []

  for (let lineIndex = startLine; lineIndex < endLineExclusive; lineIndex++) {
    const parsedLine = parseFrontmatterPropertyLine(
      document.lineAt(lineIndex).text,
    )
    if (!parsedLine || !parsedLine.startsObject) continue

    while (
      stack.length > 0 &&
      parsedLine.indent <= stack[stack.length - 1].indent
    ) {
      stack.pop()
    }

    stack.push({
      indent: parsedLine.indent,
      key: parsedLine.key,
    })
  }

  return stack
}

function resolveParentPath(stack: FrontmatterLineState[], indent: number) {
  const activeStack = [...stack]

  while (
    activeStack.length > 0 &&
    indent <= activeStack[activeStack.length - 1].indent
  ) {
    activeStack.pop()
  }

  return activeStack.map((entry) => entry.key)
}

function getObjectKeysAtPath(
  document: vscode.TextDocument,
  parentPath: string[],
) {
  const frontmatterRange = getFrontmatterRange(document)
  const keys = new Set<string>()
  if (!frontmatterRange) return keys

  const stack: FrontmatterLineState[] = []
  for (
    let lineIndex = frontmatterRange.contentStartLine;
    lineIndex <= frontmatterRange.contentEndLine;
    lineIndex++
  ) {
    const parsedLine = parseFrontmatterPropertyLine(
      document.lineAt(lineIndex).text,
    )
    if (!parsedLine) continue

    while (
      stack.length > 0 &&
      parsedLine.indent <= stack[stack.length - 1].indent
    ) {
      stack.pop()
    }

    const currentParentPath = stack.map((entry) => entry.key)
    if (pathsEqual(currentParentPath, parentPath)) {
      keys.add(normalizeFrontmatterKey(parsedLine.key))
    }

    if (parsedLine.startsObject) {
      stack.push({
        indent: parsedLine.indent,
        key: parsedLine.key,
      })
    }
  }

  return keys
}

function pathsEqual(left: string[], right: string[]) {
  if (left.length !== right.length) return false

  return left.every(
    (value, index) =>
      normalizeFrontmatterKey(value) === normalizeFrontmatterKey(right[index]),
  )
}

function parseFrontmatterPropertyLine(lineText: string) {
  const match = /^(\s*)([A-Za-z][A-Za-z0-9-]*)\s*:(?:\s*(.*?))?\s*$/.exec(
    lineText,
  )
  if (!match) return undefined

  const indent = match[1].length
  const key = match[2]
  const keyStartCharacter = indent
  const colonIndex = lineText.indexOf(':', keyStartCharacter)
  const valueText = match[3] ?? ''

  return {
    indent,
    key,
    keyStartCharacter,
    startsObject: valueText.trim().length === 0,
    valueStartCharacter: colonIndex + 1,
  }
}

function normalizeFrontmatterKey(value: string) {
  return value.trim().toLowerCase()
}

function getIndentUnit(document: vscode.TextDocument) {
  const editorConfig = vscode.workspace.getConfiguration('editor', document.uri)
  const tabSize = editorConfig.get<number | string>('tabSize', 2)
  const insertSpaces = editorConfig.get<boolean | string>('insertSpaces', true)

  if (insertSpaces === false) return '\t'

  const size =
    typeof tabSize === 'number' && tabSize > 0
      ? tabSize
      : Number.parseInt(String(tabSize), 10)

  return ' '.repeat(Number.isFinite(size) && size > 0 ? size : 2)
}

function resolveWorkspaceRoot(documentPath: string): string | undefined {
  const folders = vscode.workspace.workspaceFolders
  if (!folders || folders.length === 0) return undefined

  for (const folder of folders) {
    if (documentPath.startsWith(folder.uri.fsPath)) return folder.uri.fsPath
  }

  return folders[0].uri.fsPath
}
