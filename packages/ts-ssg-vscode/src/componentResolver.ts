import * as fs from 'node:fs'
import * as path from 'node:path'

const COMPONENT_FILE_EXTENSION = '.ts'
const DEFINE_COMPONENT_TOKEN = 'defineComponent'
const IGNORED_DIRECTORY_NAMES = new Set([
  '.git',
  '.hg',
  '.svn',
  '.yarn',
  'coverage',
  'dist',
  'node_modules',
])

const workspaceComponentFilesCache = new Map<string, string[]>()

export type ResolvedComponentTarget = {
  filePath: string
  line: number
}

export function resolveComponentTarget(
  workspaceRoot: string,
  componentName: string,
): ResolvedComponentTarget | undefined {
  const candidateFiles = getWorkspaceComponentFiles(workspaceRoot)
  const normalizedComponentName = normalizeComponentName(componentName)

  for (const filePath of candidateFiles) {
    const source = fs.readFileSync(filePath, 'utf8')
    const exportedDefinition = findExportedComponentDefinition(
      source,
      normalizedComponentName,
    )
    if (!exportedDefinition) continue

    return {
      filePath,
      line: exportedDefinition.line,
    }
  }

  return undefined
}

function getWorkspaceComponentFiles(workspaceRoot: string) {
  const cachedFiles = workspaceComponentFilesCache.get(workspaceRoot)
  if (cachedFiles) return cachedFiles

  const componentFiles: string[] = []
  collectComponentFiles(workspaceRoot, componentFiles)
  workspaceComponentFilesCache.set(workspaceRoot, componentFiles)

  return componentFiles
}

function collectComponentFiles(
  directoryPath: string,
  componentFiles: string[],
) {
  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const entryPath = path.join(directoryPath, entry.name)

    if (entry.isDirectory()) {
      if (IGNORED_DIRECTORY_NAMES.has(entry.name)) continue

      collectComponentFiles(entryPath, componentFiles)
      continue
    }

    if (!entry.isFile() || !entry.name.endsWith(COMPONENT_FILE_EXTENSION)) {
      continue
    }

    const source = fs.readFileSync(entryPath, 'utf8')
    if (!source.includes(DEFINE_COMPONENT_TOKEN)) continue

    componentFiles.push(entryPath)
  }
}

function findExportedComponentDefinition(
  source: string,
  normalizedComponentName: string,
) {
  const lines = source.split(/\r?\n/)
  const pattern =
    /export\s+(?:interface|type|class)\s+([A-Za-z][A-Za-z0-9]*)\b/g

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex]
    const match = pattern.exec(line)
    pattern.lastIndex = 0

    if (!match) continue
    if (normalizeComponentName(match[1]) !== normalizedComponentName) continue

    return {
      line: lineIndex,
    }
  }

  return undefined
}

function normalizeComponentName(value: string) {
  return value.replace(/[-_\s]+/g, '').toLowerCase()
}
