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
  /export\s+(?:declare\s+)?(?:abstract\s+)?(?:interface|type|class)\s+([A-Za-z][A-Za-z0-9]*)\b/g

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
): ResolvedComponentTarget | undefined {
  const normalizedComponentName = normalizeComponentName(componentName)
  const workspaceTarget = resolveWorkspaceComponentTarget(
    workspaceRoot,
    normalizedComponentName,
  )
  if (workspaceTarget) return workspaceTarget

  return resolveDependencyComponentTarget(
    workspaceRoot,
    normalizedComponentName,
  )
}

function resolveWorkspaceComponentTarget(
  workspaceRoot: string,
  normalizedComponentName: string,
) {
  const candidateFiles = getWorkspaceComponentFiles(workspaceRoot)

  for (const filePath of candidateFiles) {
    const exportedDefinition = findExportedComponentDefinitionInFile(
      filePath,
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

function resolveDependencyComponentTarget(
  workspaceRoot: string,
  normalizedComponentName: string,
) {
  const dependencyPackages = getDependencyComponentPackages(workspaceRoot)

  for (const dependencyPackage of dependencyPackages) {
    if (!dependencyPackage.componentNames.has(normalizedComponentName)) continue

    for (const filePath of dependencyPackage.files) {
      const exportedDefinition = findExportedComponentDefinitionInFile(
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

    if (entry.isDirectory()) {
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
    if (!entry.isDirectory()) continue

    const entryPath = path.join(nodeModulesPath, entry.name)
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

    if (entry.isDirectory()) {
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

function findExportedComponentDefinitionInFile(
  filePath: string,
  normalizedComponentName: string,
) {
  const source = fs.readFileSync(filePath, 'utf8')
  const lines = source.split(/\r?\n/)

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex]
    const match = EXPORTED_COMPONENT_PATTERN.exec(line)
    EXPORTED_COMPONENT_PATTERN.lastIndex = 0

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
