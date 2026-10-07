import { globSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { bumpVersion, versionPattern } from './version'

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
if (process.argv.length > 3) {
  throw new Error('Usage: yarn bump-version [delta] (default: 1)')
}

const delta = process.argv[2] ?? '1'
const rootManifest = JSON.parse(
  readFileSync(path.join(projectRoot, 'package.json'), 'utf8'),
) as { version: string }
const currentVersion = rootManifest.version
const nextVersion = bumpVersion(currentVersion, delta)

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
