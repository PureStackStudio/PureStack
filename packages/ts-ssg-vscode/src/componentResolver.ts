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

  for (const filePath of candidateFiles) {
    const source = fs.readFileSync(filePath, 'utf8')
    if (!hasExportedComponentDefinition(source, componentName)) continue

    return {
      filePath,
      line: findComponentLine(source, componentName),
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

function hasExportedComponentDefinition(source: string, componentName: string) {
  return getExportedComponentDefinitionPattern(componentName).test(source)
}

function findComponentLine(source: string, componentName: string): number {
  const lines = source.split(/\r?\n/)
  const exportedDefinitionPattern =
    getExportedComponentDefinitionPattern(componentName)

  const exportedDefinitionLineIndex = lines.findIndex((line) =>
    exportedDefinitionPattern.test(line),
  )
  if (exportedDefinitionLineIndex >= 0) return exportedDefinitionLineIndex

  return 0
}

function getExportedComponentDefinitionPattern(componentName: string) {
  return new RegExp(`export\\s+(?:interface|type|class)\\s+${componentName}\\b`)
}
