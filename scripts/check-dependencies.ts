import { existsSync, globSync, readFileSync, realpathSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

interface PackageJson {
  name: string
  version?: string
  workspaces?: string[]
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
  peerDependenciesMeta?: Record<string, { optional?: boolean }>
  dependencyConsistency?: { exceptions?: Record<string, string> }
}

interface Declaration {
  manifestPath: string
  workspace: string
  section: string
  range: string
  optional: boolean
}

const root = process.cwd()
const readManifest = (file: string): PackageJson =>
  JSON.parse(readFileSync(file, 'utf8'))
const rootManifestPath = path.join(root, 'package.json')
const rootManifest = readManifest(rootManifestPath)
const exceptions = rootManifest.dependencyConsistency?.exceptions ?? {}
const workspaceManifests = globSync(
  (rootManifest.workspaces ?? []).map(
    (workspace) => `${workspace}/package.json`,
  ),
  { cwd: root },
).sort()
const sections = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
] as const
const dependencies = new Map<string, Declaration[]>()

for (const manifestPath of new Set([
  rootManifestPath,
  ...workspaceManifests.map((file) => path.resolve(root, file)),
])) {
  const manifest = readManifest(manifestPath)
  for (const section of sections) {
    for (const [dependency, range] of Object.entries(manifest[section] ?? {})) {
      const declarations = dependencies.get(dependency) ?? []
      declarations.push({
        manifestPath,
        workspace: manifest.name,
        section,
        range,
        optional:
          section === 'optionalDependencies' ||
          (section === 'peerDependencies' &&
            manifest.peerDependenciesMeta?.[dependency]?.optional === true),
      })
      dependencies.set(dependency, declarations)
    }
  }
}

function resolveInstalledPackage(dependency: string, manifestPath: string) {
  const searchPaths =
    createRequire(manifestPath).resolve.paths(dependency) ?? []
  for (const searchPath of searchPaths) {
    // Inspect the package directory, including packages without a runtime entry
    // or an exported package.json (types, binaries, and import-only packages).
    const installedManifestPath = path.join(
      searchPath,
      dependency,
      'package.json',
    )
    if (!existsSync(installedManifestPath)) continue
    return {
      version: readManifest(installedManifestPath).version,
      directory: realpathSync(path.dirname(installedManifestPath)),
    }
  }
  return undefined
}

const failures: string[] = []
const skipped: string[] = []
let checked = 0

for (const [dependency, declarations] of [...dependencies].sort(([a], [b]) =>
  a.localeCompare(b),
)) {
  if (declarations.length < 2) continue
  const exception = exceptions[dependency]
  if (exception?.trim()) {
    skipped.push(`${dependency}: ${exception}`)
    continue
  }
  checked += 1
  const reasons: string[] = []
  const reports: string[] = []
  const installedDirectories = new Set<string>()
  if (new Set(declarations.map(({ range }) => range)).size > 1) {
    reasons.push('Dependency declarations do not match.')
  }
  for (const declaration of declarations) {
    const report = [
      `  ${declaration.workspace} (${path.relative(root, declaration.manifestPath)})`,
      `    ${declaration.section}: ${declaration.range}`,
    ]
    try {
      const installed = resolveInstalledPackage(
        dependency,
        declaration.manifestPath,
      )
      if (installed) {
        installedDirectories.add(installed.directory)
        report.push(
          `    installed: ${installed.version}`,
          `    directory: ${installed.directory}`,
        )
      } else {
        report.push(
          declaration.optional
            ? '    installed: absent (optional)'
            : '    installed: missing',
        )
        if (!declaration.optional) {
          reasons.push(`${declaration.workspace}: dependency is not installed.`)
        }
      }
    } catch (error) {
      reasons.push(
        `${declaration.workspace}: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
    reports.push(report.join('\n'))
  }
  if (installedDirectories.size > 1) {
    reasons.push(
      'Workspaces resolve to different installed copies, even if their versions match.',
    )
  }
  if (reasons.length > 0) {
    failures.push(`${dependency}\n${reasons.join('\n')}\n${reports.join('\n')}`)
  }
}

if (skipped.length > 0) {
  console.log(`Explicit dependency exceptions:\n${skipped.join('\n')}`)
}
if (failures.length > 0) {
  console.error(
    `Dependency consistency check failed:\n\n${failures.join('\n\n')}`,
  )
  console.error(
    '\nAlign the dependency declarations, run yarn install, and rerun yarn check-dependencies. Intentional differences require a reason in package.json dependencyConsistency.exceptions.',
  )
  process.exitCode = 1
} else {
  console.log(
    `Dependency consistency check passed: ${checked} shared dependencies have matching declarations and resolve to one installed copy.`,
  )
}
