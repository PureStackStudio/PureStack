import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

interface PackageJson {
  version?: string
}

const projectRoot = process.cwd()
const packageJsonPath = path.join(
  projectRoot,
  'packages',
  'purestack',
  'package.json',
)
const indexPath = path.join(
  projectRoot,
  'packages',
  'purestack',
  'src',
  'index.ts',
)
const versionExportPattern =
  /export\s+const\s+version(?:\s*:\s*string)?\s*=\s*['"]([^'"]+)['"]/

const packageJson = JSON.parse(
  readFileSync(packageJsonPath, 'utf8'),
) as PackageJson

if (!packageJson.version) {
  throw new Error('packages/purestack/package.json is missing version.')
}

const source = readFileSync(indexPath, 'utf8')
const match = versionExportPattern.exec(source)
if (!match) {
  throw new Error('packages/purestack/src/index.ts is missing version export.')
}

const sourceVersion = match[1]
if (sourceVersion === packageJson.version) {
  process.exit(0)
}

const nextSource = source.replace(versionExportPattern, (statement) =>
  statement.replace(/(['"])([^'"]+)(['"])$/, `$1${packageJson.version}$3`),
)

writeFileSync(indexPath, nextSource, 'utf8')
console.log(
  `purestack version export updated: ${sourceVersion} -> ${packageJson.version}`,
)
