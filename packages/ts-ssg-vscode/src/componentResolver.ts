import * as fs from 'node:fs'
import * as path from 'node:path'

const COMPONENT_FILE_EXTENSION = '.ts'
const DEFINE_COMPONENT_TOKEN = 'defineComponent'
const MANIFEST_FILE_NAME = 'package.json'
const NODE_MODULES_DIRECTORY_NAME = 'node_modules'
const IGNORED_DIRECTORY_NAMES = new Set([
  '.git',
  '.hg',
  '.svn',
  '.yarn',
  'coverage',
  'dist',
])
const EXPORTED_COMPONENT_PATTERN =
  /^\s*export\s+(?:declare\s+)?(?:abstract\s+)?(interface|type|class)\s+([A-Za-z][A-Za-z0-9]*)\b/
const LOCAL_COMPONENT_PATTERN =
  /^\s*(?:export\s+)?(?:declare\s+)?(?:abstract\s+)?(interface|type|class)\s+([A-Za-z][A-Za-z0-9]*)\b/

const workspaceComponentFilesCache = new Map<string, string[]>()
const dependencyPackageCache = new Map<string, DependencyComponentPackage[]>()

export type ResolvedComponentTarget = {
  filePath: string
  line: number
}

type DependencyComponentPackage = {
  componentNames: Set<string>
  files: string[]
}

export function resolveComponentTarget(
  workspaceRoot: string,
  componentName: string,
  preferredLocalFilePath?: string,
): ResolvedComponentTarget | undefined {
  const normalizedComponentName = normalizeComponentName(componentName)
  const workspaceTarget = resolveWorkspaceComponentTarget(
    workspaceRoot,
    normalizedComponentName,
    preferredLocalFilePath,
  )
  if (workspaceTarget) return workspaceTarget

  return resolveDependencyComponentTarget(
    workspaceRoot,
    normalizedComponentName,
  )
}

export function clearComponentResolverCaches(workspaceRoot?: string) {
  if (!workspaceRoot) {
    workspaceComponentFilesCache.clear()
    dependencyPackageCache.clear()
    return
  }

  workspaceComponentFilesCache.delete(workspaceRoot)
  dependencyPackageCache.delete(workspaceRoot)
}

function resolveWorkspaceComponentTarget(
  workspaceRoot: string,
  normalizedComponentName: string,
  preferredLocalFilePath?: string,
) {
  const candidateFiles = prioritizePreferredFile(
    getWorkspaceComponentFiles(workspaceRoot),
    preferredLocalFilePath,
  )

  for (const filePath of candidateFiles) {
    const definition = findComponentDefinitionInFile(
      filePath,
      normalizedComponentName,
      filePath === preferredLocalFilePath,
    )
    if (!definition) continue

    return {
      filePath,
      line: definition.line,
    }
  }

  return undefined
}

function resolveDependencyComponentTarget(
  workspaceRoot: string,
  normalizedComponentName: string,
) {
  const dependencyPackages = getDependencyComponentPackages(workspaceRoot)

  for (const dependencyPackage of dependencyPackages) {
    if (!dependencyPackage.componentNames.has(normalizedComponentName)) continue

    for (const filePath of dependencyPackage.files) {
      const exportedDefinition = findComponentDefinitionInFile(
        filePath,
        normalizedComponentName,
      )
      if (!exportedDefinition) continue

      return {
        filePath,
        line: exportedDefinition.line,
      }
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

    if (isTraversableDirectoryEntry(entry, entryPath)) {
      if (IGNORED_DIRECTORY_NAMES.has(entry.name)) continue
      if (entry.name === NODE_MODULES_DIRECTORY_NAME) continue

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

function getDependencyComponentPackages(workspaceRoot: string) {
  const cachedPackages = dependencyPackageCache.get(workspaceRoot)
  if (cachedPackages) return cachedPackages

  const dependencyPackages: DependencyComponentPackage[] = []
  collectDependencyComponentPackages(
    path.join(workspaceRoot, NODE_MODULES_DIRECTORY_NAME),
    dependencyPackages,
  )
  dependencyPackageCache.set(workspaceRoot, dependencyPackages)

  return dependencyPackages
}

function collectDependencyComponentPackages(
  nodeModulesPath: string,
  dependencyPackages: DependencyComponentPackage[],
) {
  if (!fs.existsSync(nodeModulesPath)) return

  for (const entry of fs.readdirSync(nodeModulesPath, {
    withFileTypes: true,
  })) {
    const entryPath = path.join(nodeModulesPath, entry.name)
    if (!isTraversableDirectoryEntry(entry, entryPath)) continue

    if (entry.name.startsWith('@')) {
      collectDependencyComponentPackages(entryPath, dependencyPackages)
      continue
    }

    collectDependencyComponentPackage(entryPath, dependencyPackages)
  }
}

function collectDependencyComponentPackage(
  packageRoot: string,
  dependencyPackages: DependencyComponentPackage[],
) {
  const manifestPath = path.join(packageRoot, MANIFEST_FILE_NAME)
  const nestedNodeModulesPath = path.join(
    packageRoot,
    NODE_MODULES_DIRECTORY_NAME,
  )
  if (!fs.existsSync(manifestPath)) {
    collectDependencyComponentPackages(
      nestedNodeModulesPath,
      dependencyPackages,
    )
    return
  }

  const componentNames = readDependencyComponentNames(manifestPath)
  if (componentNames && componentNames.length > 0) {
    const files: string[] = []
    collectDependencyComponentFiles(packageRoot, files)
    if (files.length > 0) {
      dependencyPackages.push({
        componentNames: new Set(componentNames.map(normalizeComponentName)),
        files,
      })
    }
  }

  collectDependencyComponentPackages(nestedNodeModulesPath, dependencyPackages)
}

function readDependencyComponentNames(manifestPath: string) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as {
      regorComponents?: unknown
    }
    if (!Array.isArray(manifest.regorComponents)) return undefined

    return manifest.regorComponents.filter(
      (value): value is string => typeof value === 'string' && value.length > 0,
    )
  } catch {
    return undefined
  }
}

function collectDependencyComponentFiles(
  directoryPath: string,
  componentFiles: string[],
) {
  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const entryPath = path.join(directoryPath, entry.name)

    if (isTraversableDirectoryEntry(entry, entryPath)) {
      if (
        IGNORED_DIRECTORY_NAMES.has(entry.name) &&
        entry.name !== NODE_MODULES_DIRECTORY_NAME
      ) {
        continue
      }

      if (entry.name === NODE_MODULES_DIRECTORY_NAME) continue

      collectDependencyComponentFiles(entryPath, componentFiles)
      continue
    }

    if (!entry.isFile()) continue
    if (!entry.name.endsWith(COMPONENT_FILE_EXTENSION)) {
      continue
    }

    componentFiles.push(entryPath)
  }
}

function findComponentDefinitionInFile(
  filePath: string,
  normalizedComponentName: string,
  includeLocalDefinitions = false,
) {
  const source = fs.readFileSync(filePath, 'utf8')
  const lines = source.split(/\r?\n/)
  const pattern = includeLocalDefinitions
    ? LOCAL_COMPONENT_PATTERN
    : EXPORTED_COMPONENT_PATTERN

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const declaration = getComponentDeclarationFromLine(lines[lineIndex], pattern)
    if (!declaration) continue
    if (normalizeComponentName(declaration.name) !== normalizedComponentName) {
      continue
    }

    return {
      line: lineIndex,
    }
  }

  return undefined
}

function getComponentDeclarationFromLine(line: string, pattern: RegExp) {
  const match = pattern.exec(line)
  if (!match) return undefined

  const kind = match[1]
  const name = match[2]
  const suffix = line.slice(match[0].length).trimStart()
  if (!hasValidDeclarationSuffix(kind, suffix)) return undefined

  return { kind, name }
}

function hasValidDeclarationSuffix(kind: string, suffix: string) {
  if (suffix.startsWith('<')) return true

  switch (kind) {
    case 'interface':
      return suffix.startsWith('{') || suffix.startsWith('extends ')
    case 'type':
      return suffix.startsWith('=')
    case 'class':
      return (
        suffix.startsWith('{') ||
        suffix.startsWith('extends ') ||
        suffix.startsWith('implements ')
      )
    default:
      return false
  }
}

function prioritizePreferredFile(
  candidateFiles: string[],
  preferredLocalFilePath?: string,
) {
  if (!preferredLocalFilePath) return candidateFiles

  const matchingFiles = candidateFiles.filter(
    (filePath) => filePath === preferredLocalFilePath,
  )
  if (matchingFiles.length === 0) return candidateFiles

  return [
    ...matchingFiles,
    ...candidateFiles.filter((filePath) => filePath !== preferredLocalFilePath),
  ]
}

function normalizeComponentName(value: string) {
  return value.replace(/[-_\s]+/g, '').toLowerCase()
}

function isTraversableDirectoryEntry(entry: fs.Dirent, entryPath: string) {
  if (entry.isDirectory()) return true
  if (!entry.isSymbolicLink()) return false

  try {
    return fs.statSync(entryPath).isDirectory()
  } catch {
    return false
  }
}
