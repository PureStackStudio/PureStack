import { globSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
if (process.argv.length > 2) {
  throw new Error('Usage: yarn bump-version (no arguments)')
}

const versionPattern = /^(0|[1-9]\d*)\.([0-9])\.([0-9])$/
const rootManifest = JSON.parse(
  readFileSync(path.join(projectRoot, 'package.json'), 'utf8'),
) as { version: string }
const currentVersion = rootManifest.version
const current = versionPattern.exec(currentVersion)
if (!current)
  throw new Error(
    `Expected a root version with single-digit minor and patch numbers, received ${currentVersion}.`,
  )

// Treat minor and patch as decimal digits, carrying into the next component.
const [major, minor, patch] = current.slice(1).map(BigInt)
const incremented = major * 100n + minor * 10n + patch + 1n
const nextVersion = `${incremented / 100n}.${(incremented / 10n) % 10n}.${incremented % 10n}`

type Update = { relativePath: string; source: string }
const updates: Update[] = []

function prepareUpdate(relativePath: string, pattern: RegExp) {
  const source = readFileSync(path.join(projectRoot, relativePath), 'utf8')
  if ([...source.matchAll(pattern)].length !== 1) {
    throw new Error(
      `Expected exactly one version declaration in ${relativePath}. No files have been changed.`,
    )
  }
  const updated = source.replace(
    pattern,
    (_match, prefix: string, _version: string, suffix: string) =>
      `${prefix}${nextVersion}${suffix}`,
  )
  if (updated !== source) updates.push({ relativePath, source: updated })
}

const manifests = [
  'package.json',
  ...globSync('packages/*/package.json', { cwd: projectRoot }).sort(),
]
for (const manifestPath of manifests) {
  const manifest = JSON.parse(
    readFileSync(path.join(projectRoot, manifestPath), 'utf8'),
  ) as { version?: string }
  if (!manifest.version || !versionPattern.test(manifest.version)) {
    throw new Error(
      `Missing or invalid version in ${manifestPath}. No files have been changed.`,
    )
  }
  prepareUpdate(manifestPath, /^(\s*"version"\s*:\s*")([^"\r\n]+)(")/gm)
}

prepareUpdate(
  'packages/purestack/src/index.ts',
  /(export\s+const\s+version(?:\s*:\s*string)?\s*=\s*['"])([^'"\r\n]+)(['"])/g,
)
prepareUpdate(
  'packages/ts-ssg/src/config/head.ts',
  /(content:\s*['"]PureStack v)([^'"\r\n]+)(['"])/g,
)

// Read and validate every target before writing; keep formatting and line endings.
for (const update of updates) {
  writeFileSync(
    path.join(projectRoot, update.relativePath),
    update.source,
    'utf8',
  )
  console.log(`Updated ${update.relativePath}`)
}
console.log(`${currentVersion} -> ${nextVersion}: ${updates.length} file(s)`)
