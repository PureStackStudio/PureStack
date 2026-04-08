import * as fs from 'node:fs'
import * as path from 'node:path'
import * as vscode from 'vscode'

const COMPONENT_TAG_PATTERN = /[A-Za-z][A-Za-z0-9]*/
const COMPONENT_NAME_PATTERN = /^[A-Z][A-Za-z0-9]*$/
const COMPONENT_INDEX_PATH = path.join(
  'packages',
  'ts-components',
  'src',
  'index.ts',
)

const MARKDOWN_SELECTORS: vscode.DocumentSelector = [
  { language: 'markdown', scheme: 'file' },
  { language: 'mdx', scheme: 'file' },
]

type ResolvedComponentTarget = {
  filePath: string
  line: number
}

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

function resolveComponentTarget(
  workspaceRoot: string,
  componentName: string,
): ResolvedComponentTarget | undefined {
  const componentMap = loadComponentMap(workspaceRoot)
  const relativePath = componentMap.get(componentName)
  if (!relativePath) return undefined

  const filePath = path.resolve(
    workspaceRoot,
    'packages',
    'ts-components',
    'src',
    `${relativePath}.ts`,
  )
  if (!fs.existsSync(filePath)) return undefined

  return {
    filePath,
    line: findBestDefinitionLine(filePath, componentName),
  }
}

function loadComponentMap(workspaceRoot: string): Map<string, string> {
  const indexFilePath = path.resolve(workspaceRoot, COMPONENT_INDEX_PATH)
  const source = fs.readFileSync(indexFilePath, 'utf8')
  const componentMap = new Map<string, string>()

  for (const entry of parseTypeExports(source)) {
    for (const exportName of entry.exportNames) {
      componentMap.set(exportName, normalizeExportPath(entry.exportPath))
    }
  }

  for (const entry of parseValueExports(source)) {
    const inferredName = inferComponentNameFromCreateExport(entry.exportNames)
    if (!inferredName || componentMap.has(inferredName)) continue

    componentMap.set(inferredName, normalizeExportPath(entry.exportPath))
  }

  addStandardFileFallbacks(workspaceRoot, componentMap)

  return componentMap
}

function parseTypeExports(source: string) {
  const pattern = /export\s+type\s*\{([\s\S]*?)\}\s+from\s+'([^']+)'/g
  return parseNamedExportMatches(source, pattern)
}

function parseValueExports(source: string) {
  const pattern = /export\s*\{([\s\S]*?)\}\s+from\s+'([^']+)'/g
  return parseNamedExportMatches(source, pattern)
}

function parseNamedExportMatches(source: string, pattern: RegExp) {
  const matches: Array<{ exportNames: string[]; exportPath: string }> = []
  let match: RegExpExecArray | null

  while ((match = pattern.exec(source))) {
    const exportNames = match[1]
      .split(',')
      .map((entry) => parseNamedExport(entry))
      .filter((entry): entry is string => !!entry)

    matches.push({
      exportNames,
      exportPath: match[2],
    })
  }

  return matches
}

function parseNamedExport(value: string): string | undefined {
  const normalized = value.trim()
  if (!normalized) return undefined

  const aliasMatch =
    /^([A-Za-z0-9_]+)(?:\s+as\s+([A-Za-z0-9_]+))?$/.exec(normalized)

  return aliasMatch?.[2] ?? aliasMatch?.[1]
}

function inferComponentNameFromCreateExport(
  exportNames: string[],
): string | undefined {
  for (const exportName of exportNames) {
    const match = /^create([A-Z][A-Za-z0-9]+)Components$/.exec(exportName)
    if (match) return match[1]
  }

  return undefined
}

function normalizeExportPath(exportPath: string) {
  return exportPath.replace(/^\.\//, '')
}

function addStandardFileFallbacks(
  workspaceRoot: string,
  componentMap: Map<string, string>,
) {
  const standardRoot = path.resolve(
    workspaceRoot,
    'packages',
    'ts-components',
    'src',
    'standard',
  )
  if (!fs.existsSync(standardRoot)) return

  for (const entry of fs.readdirSync(standardRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue

    const fileName = `${entry.name}.ts`
    const filePath = path.join(standardRoot, entry.name, fileName)
    if (!fs.existsSync(filePath)) continue

    const componentName = toPascalCase(entry.name)
    if (!componentMap.has(componentName)) {
      componentMap.set(componentName, path.join('standard', entry.name, entry.name))
    }
  }
}

function toPascalCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function findBestDefinitionLine(filePath: string, componentName: string): number {
  const source = fs.readFileSync(filePath, 'utf8')
  const lines = source.split(/\r?\n/)
  const patterns = [
    new RegExp(`export\\s+interface\\s+${componentName}\\b`),
    new RegExp(`export\\s+type\\s+${componentName}\\b`),
    new RegExp(`function\\s+create${componentName}Component\\b`),
    new RegExp(`defineComponent<${componentName}>`),
  ]

  for (const pattern of patterns) {
    const lineIndex = lines.findIndex((line) => pattern.test(line))
    if (lineIndex >= 0) return lineIndex
  }

  return 0
}
