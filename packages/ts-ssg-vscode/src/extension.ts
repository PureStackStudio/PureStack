import ts from 'typescript'
import * as vscode from 'vscode'
import {
  clearComponentMetadataCache,
  getComponentMetadata,
} from './componentMetadata'
import {
  clearComponentResolverCaches,
  resolveComponentTarget,
} from './componentResolver'
import { registerFrontmatterSupport } from './frontmatterSupport'
import { registerLinkedEditingProvider } from './linkedEditing'
import {
  buildMdxFormattingEdits,
  formatActiveEditorMdxMarkup,
} from './mdxFormatting'
import { registerTemplateAutoClose } from './templateAutoClose'
import { registerTemplateDiagnostics } from './templateDiagnostics'
import {
  buildTemplateFormattingEdits,
  formatActiveEditorTemplates,
  isOffsetInsideSupportedTaggedTemplate,
} from './templateFormatting'

const COMPONENT_TAG_PATTERN = /[A-Za-z][A-Za-z0-9-]*/
const COMPONENT_NAME_PATTERN = /^[A-Za-z][A-Za-z0-9-]*$/
const ATTRIBUTE_NAME_PATTERN = /[@.:]?[A-Za-z][A-Za-z0-9:-]*/

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
    vscode.languages.registerCompletionItemProvider(
      SUPPORTED_SELECTORS,
      new ComponentCompletionProvider(),
      ' ',
      '-',
      '"',
      "'",
      '=',
    ),
    vscode.languages.registerHoverProvider(
      SUPPORTED_SELECTORS,
      new ComponentHoverProvider(),
    ),
    registerFrontmatterSupport(),
    registerLinkedEditingProvider(),
    vscode.workspace.onWillSaveTextDocument((event) => {
      if (event.document.languageId === 'typescript') {
        event.waitUntil(
          buildTemplateFormattingEdits(event.document, {
            requireFormatOnSave: true,
          }),
        )
        return
      }

      if (event.document.languageId !== 'mdx') return

      event.waitUntil(
        buildMdxFormattingEdits(event.document, {
          requireFormatOnSave: true,
        }),
      )
    }),
    vscode.commands.registerCommand(
      'purestackComponentTools.formatHtmlTemplates',
      async () => {
        const editor = vscode.window.activeTextEditor
        if (!editor) return

        if (editor.document.languageId === 'typescript') {
          await formatActiveEditorTemplates(editor)
          return
        }

        if (editor.document.languageId === 'mdx') {
          await formatActiveEditorMdxMarkup(editor)
        }
      },
    ),
    vscode.commands.registerCommand(
      'purestackComponentTools.formatDocumentWithHtmlTemplates',
      async () => {
        const editor = vscode.window.activeTextEditor
        if (!editor) return
        if (
          editor.document.languageId !== 'typescript' &&
          editor.document.languageId !== 'mdx'
        ) {
          return
        }

        await vscode.commands.executeCommand('editor.action.formatDocument')
        if (editor.document.languageId === 'typescript') {
          await formatActiveEditorTemplates(editor)
          return
        }

        await formatActiveEditorMdxMarkup(editor)
      },
    ),
    ...registerComponentResolverWatchers(),
    registerTemplateAutoClose(),
    registerTemplateDiagnostics(),
  )
}

export function deactivate() {}

function registerComponentResolverWatchers() {
  const subscriptions: vscode.Disposable[] = []

  for (const folder of vscode.workspace.workspaceFolders ?? []) {
    const workspaceRoot = folder.uri.fsPath
    const invalidateResolverCaches = () => {
      clearComponentResolverCaches(workspaceRoot)
      clearComponentMetadataCache()
    }

    const sourceWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(folder, '**/*.ts'),
    )
    sourceWatcher.onDidCreate(invalidateResolverCaches)
    sourceWatcher.onDidChange(invalidateResolverCaches)
    sourceWatcher.onDidDelete(invalidateResolverCaches)

    const dependencyManifestWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(folder, '**/node_modules/**/package.json'),
    )
    dependencyManifestWatcher.onDidCreate(invalidateResolverCaches)
    dependencyManifestWatcher.onDidChange(invalidateResolverCaches)
    dependencyManifestWatcher.onDidDelete(invalidateResolverCaches)

    subscriptions.push(sourceWatcher, dependencyManifestWatcher)
  }

  subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      clearComponentResolverCaches()
      clearComponentMetadataCache()
    }),
  )

  return subscriptions
}

class ComponentDefinitionProvider implements vscode.DefinitionProvider {
  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.Location | undefined {
    const tagContext = getComponentTagContextAtPosition(document, position)
    if (!tagContext) return undefined

    const workspaceRoot = resolveWorkspaceRoot(document.uri.fsPath)
    if (!workspaceRoot) return undefined

    const target = resolveComponentTarget(
      workspaceRoot,
      tagContext.componentName,
      document.uri.fsPath,
    )
    if (!target) return undefined

    const metadata = getComponentMetadata(
      target.filePath,
      tagContext.componentName,
    )
    if (!metadata) {
      return new vscode.Location(
        vscode.Uri.file(target.filePath),
        new vscode.Position(target.line, 0),
      )
    }

    const attributeName = getAttributeNameAtPosition(document, position)
    if (attributeName && !tagContext.isClosingTag) {
      const normalizedAttributeName = normalizeAttributeName(
        stripAttributePrefix(attributeName),
      )
      const prop = metadata.props.find(
        (item) =>
          normalizeAttributeName(item.attributeName) ===
          normalizedAttributeName,
      )
      if (prop) {
        return new vscode.Location(
          vscode.Uri.file(target.filePath),
          new vscode.Position(prop.declarationLine, 0),
        )
      }
    }

    const componentName = getComponentNameAtPosition(document, position)
    if (!componentName) return undefined

    return new vscode.Location(
      vscode.Uri.file(target.filePath),
      new vscode.Position(metadata.declarationLine, 0),
    )
  }
}

class ComponentCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.CompletionItem[] | undefined {
    const tagContext = getComponentTagContextAtPosition(document, position)
    if (!tagContext || tagContext.isClosingTag) return undefined

    const metadata = resolveComponentMetadataForTag(
      document,
      tagContext.componentName,
    )
    if (!metadata) return undefined

    if (tagContext.activeAttributeName) {
      const activeAttributeName = normalizeAttributeName(
        tagContext.activeAttributeName,
      )
      const prop = metadata.props.find(
        (item) =>
          normalizeAttributeName(item.attributeName) === activeAttributeName,
      )
      if (!prop?.literalValues || prop.literalValues.length === 0)
        return undefined

      return prop.literalValues.map((value) => {
        const item = new vscode.CompletionItem(
          value,
          vscode.CompletionItemKind.Value,
        )
        item.insertText = value
        item.detail = `${metadata.componentName}.${prop.propName}`
        item.documentation = createDocumentationText(
          prop.signature,
          prop.documentation,
        )
        return item
      })
    }

    const existingAttributeNames = new Set(
      Array.from(tagContext.attributeNames).map(normalizeAttributeName),
    )

    return metadata.props
      .filter(
        (prop) =>
          !existingAttributeNames.has(
            normalizeAttributeName(prop.attributeName),
          ),
      )
      .map((prop) => {
        const item = new vscode.CompletionItem(
          prop.attributeName,
          vscode.CompletionItemKind.Property,
        )
        item.insertText = `${prop.attributeName}=""`
        item.detail = `${metadata.componentName}.${prop.propName}`
        item.documentation = createDocumentationText(
          prop.signature,
          prop.documentation,
        )
        return item
      })
  }
}

class ComponentHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.Hover | undefined {
    const tagContext = getComponentTagContextAtPosition(document, position)
    if (!tagContext) return undefined

    const metadata = resolveComponentMetadataForTag(
      document,
      tagContext.componentName,
    )
    if (!metadata) return undefined

    const componentName = getComponentNameAtPosition(document, position)
    if (
      componentName &&
      normalizeComponentName(componentName) ===
        normalizeComponentName(tagContext.componentName)
    ) {
      return new vscode.Hover(
        createHoverContents(metadata.signature, metadata.documentation),
      )
    }

    if (tagContext.isClosingTag) return undefined

    const attributeName = getAttributeNameAtPosition(document, position)
    if (!attributeName) return undefined

    const normalizedAttributeName = normalizeAttributeName(
      stripAttributePrefix(attributeName),
    )
    const prop = metadata.props.find(
      (item) =>
        normalizeAttributeName(item.attributeName) === normalizedAttributeName,
    )
    if (!prop) return undefined

    return new vscode.Hover(
      createHoverContents(prop.signature, prop.documentation),
    )
  }
}

function resolveComponentMetadataForTag(
  document: vscode.TextDocument,
  componentName: string,
) {
  const workspaceRoot = resolveWorkspaceRoot(document.uri.fsPath)
  if (!workspaceRoot) return undefined

  const target = resolveComponentTarget(
    workspaceRoot,
    componentName,
    document.uri.fsPath,
  )
  if (!target) return undefined

  return getComponentMetadata(target.filePath, componentName)
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

function getAttributeNameAtPosition(
  document: vscode.TextDocument,
  position: vscode.Position,
): string | undefined {
  const range = document.getWordRangeAtPosition(
    position,
    ATTRIBUTE_NAME_PATTERN,
  )
  if (!range) return undefined

  const tagContext = getComponentTagContextAtPosition(document, position)
  if (!tagContext || tagContext.isClosingTag) return undefined

  const value = document.getText(range)
  if (!value) return undefined
  if (
    normalizeComponentName(value) ===
    normalizeComponentName(tagContext.componentName)
  ) {
    return undefined
  }

  return value
}

type ComponentTagContext = {
  activeAttributeName?: string
  attributeNames: Set<string>
  componentName: string
  isClosingTag: boolean
}

function getComponentTagContextAtPosition(
  document: vscode.TextDocument,
  position: vscode.Position,
): ComponentTagContext | undefined {
  if (!isSupportedTemplateContext(document, position)) return undefined

  const offset = document.offsetAt(position)
  const documentText = document.getText()
  const tagStart = findTagStart(documentText, offset)
  if (tagStart < 0) return undefined

  const tagEnd = documentText.indexOf('>', offset)
  if (tagEnd < 0) return undefined
  if (documentText.slice(tagStart, offset).includes('>')) return undefined

  const tagText = documentText.slice(tagStart, tagEnd + 1)
  const isClosingTag = /^<\s*\//.test(tagText)
  const tagNameMatch = /^<\s*\/?\s*([A-Za-z][A-Za-z0-9-]*)/.exec(tagText)
  if (!tagNameMatch) return undefined

  const componentName = tagNameMatch[1]
  const cursorRelativeOffset = offset - tagStart

  return {
    activeAttributeName: isClosingTag
      ? undefined
      : getActiveAttributeName(tagText, cursorRelativeOffset),
    attributeNames: isClosingTag ? new Set() : getAttributeNames(tagText),
    componentName,
    isClosingTag,
  }
}

function findTagStart(documentText: string, offset: number) {
  for (let index = offset - 1; index >= 0; index--) {
    const currentCharacter = documentText[index]
    if (currentCharacter === '<') return index
    if (currentCharacter === '>') return -1
  }

  return -1
}

function getAttributeNames(tagText: string) {
  const attributeNames = new Set<string>()
  const pattern =
    /([:@.]?[A-Za-z][A-Za-z0-9:-]*)\s*=\s*(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^\s>]+)/g

  for (;;) {
    const match = pattern.exec(tagText)
    if (!match) return attributeNames

    attributeNames.add(stripAttributePrefix(match[1]))
  }
}

function getActiveAttributeName(tagText: string, cursorRelativeOffset: number) {
  const textBeforeCursor = tagText.slice(0, cursorRelativeOffset)
  const quotedValueMatch =
    /([:@.]?[A-Za-z][A-Za-z0-9:-]*)\s*=\s*(?:"[^"]*$|'[^']*$)/.exec(
      textBeforeCursor,
    )
  if (quotedValueMatch) return stripAttributePrefix(quotedValueMatch[1])

  return undefined
}

function stripAttributePrefix(value: string) {
  if (value.startsWith('r-bind:')) return value.slice('r-bind:'.length)
  if (value.startsWith(':') || value.startsWith('.')) return value.slice(1)
  return value
}

function normalizeAttributeName(value: string) {
  return value.replace(/[-_\s]+/g, '').toLowerCase()
}

function normalizeComponentName(value: string) {
  return value.replace(/[-_\s]+/g, '').toLowerCase()
}

function createDocumentationText(signature?: string, documentation?: string) {
  const parts = createHoverContents(signature, documentation)
  return parts.join('\n\n')
}

function createHoverContents(signature?: string, documentation?: string) {
  const contents: string[] = []
  if (signature) {
    contents.push(`\`\`\`ts\n${signature}\n\`\`\``)
  }

  if (documentation) {
    contents.push(documentation)
  }

  return contents.length > 0 ? contents : ['Component']
}

function isSupportedTemplateContext(
  document: vscode.TextDocument,
  position: vscode.Position,
): boolean {
  if (document.languageId === 'typescript') {
    return isHtmlTemplatePosition(document, position)
  }

  return document.languageId === 'markdown' || document.languageId === 'mdx'
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

  return isHtmlTemplatePosition(document, position)
}

function isHtmlTemplatePosition(
  document: vscode.TextDocument,
  position: vscode.Position,
): boolean {
  const offset = document.offsetAt(position)
  const sourceFile = ts.createSourceFile(
    document.uri.fsPath,
    document.getText(),
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  )

  return isOffsetInsideSupportedTaggedTemplate(sourceFile, offset)
}

function resolveWorkspaceRoot(documentPath: string): string | undefined {
  const folders = vscode.workspace.workspaceFolders
  if (!folders || folders.length === 0) return undefined

  for (const folder of folders) {
    if (documentPath.startsWith(folder.uri.fsPath)) return folder.uri.fsPath
  }

  return folders[0]?.uri.fsPath
}
