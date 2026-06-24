import { execFile } from 'node:child_process'
import { existsSync, globSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const projectRoot = process.cwd()
const npmInvocation =
  process.platform === 'win32'
    ? {
        command: process.execPath,
        args: [
          path.join(
            path.dirname(process.execPath),
            'node_modules',
            'npm',
            'bin',
            'npm-cli.js',
          ),
        ],
      }
    : { command: 'npm', args: [] }

interface PackageJson {
  name: string
  private?: boolean
  version?: string
  exports?: Record<string, unknown>
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

interface PackageInfo {
  packageDir: string
  packageJsonPath: string
  packageTarballPath: string
  packageJson: PackageJson
}

interface PublishOptions {
  publish: boolean
  registry: string
  tag: string
  provenance: boolean
}

const options = parseArgs(process.argv.slice(2))
const publishablePackages = sortByWorkspaceDependencies(
  discoverPublishablePackages(),
)

async function npmJson(args: string[]) {
  return execFileAsync(
    npmInvocation.command,
    [...npmInvocation.args, ...args, '--json'],
    {
      cwd: projectRoot,
      maxBuffer: 1024 * 1024,
    },
  )
}

async function npm(args: string[]) {
  return execFileAsync(
    npmInvocation.command,
    [...npmInvocation.args, ...args],
    {
      cwd: projectRoot,
      maxBuffer: 1024 * 1024,
    },
  )
}

async function packageExists(packageName: string) {
  try {
    await npmJson([
      'view',
      packageName,
      'version',
      '--registry',
      options.registry,
    ])
    return true
  } catch (error) {
    if (isNpmNotFound(error)) return false
    throw error
  }
}

async function packageVersionExists(packageName: string, version: string) {
  try {
    await npmJson([
      'view',
      `${packageName}@${version}`,
      'version',
      '--registry',
      options.registry,
    ])
    return true
  } catch (error) {
    if (isNpmNotFound(error)) return false
    throw error
  }
}

function isNpmNotFound(error: unknown) {
  if (!isExecError(error)) return false
  return (
    error.stderr.includes('E404') ||
    error.stdout.includes('E404') ||
    error.stderr.includes('404 Not Found') ||
    error.stdout.includes('404 Not Found')
  )
}

function isExecError(error: unknown): error is {
  stdout: string
  stderr: string
} {
  return (
    typeof error === 'object' &&
    error !== null &&
    'stdout' in error &&
    'stderr' in error
  )
}

function discoverPublishablePackages() {
  return globSync('packages/*/package.json')
    .sort()
    .map(readPackage)
    .filter(
      (pkg) =>
        !pkg.packageJson.private &&
        isPureStackPackageName(pkg.packageJson.name) &&
        Boolean(pkg.packageJson.exports),
    )
}

function isPureStackPackageName(name: string) {
  return name === 'purestack' || name.startsWith('@purestack/')
}

function readPackage(packageJsonPath: string): PackageInfo {
  const fullPath = path.join(projectRoot, packageJsonPath)
  const packageDir = path.dirname(fullPath)
  return {
    packageDir,
    packageJsonPath,
    packageTarballPath: path.join(packageDir, 'package.tgz'),
    packageJson: JSON.parse(readFileSync(fullPath, 'utf8')) as PackageJson,
  }
}

function sortByWorkspaceDependencies(packages: PackageInfo[]) {
  const byName = new Map(packages.map((pkg) => [pkg.packageJson.name, pkg]))
  const sorted: PackageInfo[] = []
  const visiting = new Set<string>()
  const visited = new Set<string>()

  function visit(pkg: PackageInfo) {
    const name = pkg.packageJson.name
    if (visited.has(name)) return
    if (visiting.has(name)) {
      throw new Error(`Circular workspace dependency detected at ${name}.`)
    }

    visiting.add(name)
    for (const depName of getWorkspaceDependencyNames(pkg.packageJson)) {
      const dep = byName.get(depName)
      if (dep) visit(dep)
    }
    visiting.delete(name)
    visited.add(name)
    sorted.push(pkg)
  }

  for (const pkg of packages) visit(pkg)
  return sorted
}

function getWorkspaceDependencyNames(pkg: PackageJson) {
  return [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
    ...Object.keys(pkg.optionalDependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
  ].filter(isPureStackPackageName)
}

function parseArgs(args: string[]): PublishOptions {
  const options: PublishOptions = {
    publish: false,
    registry: 'https://registry.npmjs.org',
    tag: 'latest',
    provenance: true,
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    switch (arg) {
      case '--publish':
        options.publish = true
        break
      case '--registry':
        options.registry = requireArg(args, index)
        index += 1
        break
      case '--tag':
        options.tag = requireArg(args, index)
        index += 1
        break
      case '--no-provenance':
        options.provenance = false
        break
      case '--help':
        printHelp()
        process.exit(0)
        break
      default:
        throw new Error(`Unknown argument: ${arg}`)
    }
  }

  return options
}

function requireArg(args: string[], index: number) {
  const value = args[index + 1]
  if (!value) throw new Error(`${args[index]} requires a value.`)
  return value
}

function printHelp() {
  console.log(`Publish PureStack package versions that do not exist on npm yet.

Usage:
  yarn publish-new-packages              Dry-run registry check
  yarn publish-new-packages --publish    Publish missing package versions

Run yarn bundle && yarn package before --publish.

Options:
  --registry <url>     npm registry URL. Defaults to https://registry.npmjs.org
  --tag <tag>          npm dist-tag. Defaults to latest
  --no-provenance      Do not pass npm --provenance
`)
}

async function publishPackage(pkg: PackageInfo) {
  if (!existsSync(pkg.packageTarballPath)) {
    throw new Error(
      `${pkg.packageJson.name} is missing ${path.relative(projectRoot, pkg.packageTarballPath)}. Run yarn package first.`,
    )
  }

  const args = [
    'publish',
    pkg.packageTarballPath,
    '--access',
    'public',
    '--tag',
    options.tag,
    '--registry',
    options.registry,
  ]

  if (options.provenance) args.push('--provenance')

  await npm(args)
}

async function main() {
  if (publishablePackages.length === 0) {
    throw new Error('No publishable PureStack packages found.')
  }

  console.log(
    `${options.publish ? 'Publishing' : 'Dry-run checking'} ${publishablePackages.length} packages against ${options.registry}.`,
  )

  const missingPackages: PackageInfo[] = []

  for (const pkg of publishablePackages) {
    if (!pkg.packageJson.version) {
      throw new Error(`${pkg.packageJson.name} is missing version.`)
    }

    const nameExists = await packageExists(pkg.packageJson.name)
    const versionExists =
      nameExists &&
      (await packageVersionExists(
        pkg.packageJson.name,
        pkg.packageJson.version,
      ))
    if (versionExists) {
      console.log(
        `skip existing ${pkg.packageJson.name}@${pkg.packageJson.version}`,
      )
      continue
    }

    missingPackages.push(pkg)
    console.log(`missing ${pkg.packageJson.name}@${pkg.packageJson.version}`)
  }

  if (!options.publish) {
    console.log(
      `Dry run complete. ${missingPackages.length} package version(s) would be published.`,
    )
    return
  }

  for (const pkg of missingPackages) {
    console.log(`publishing ${pkg.packageJson.name}@${pkg.packageJson.version}`)
    await publishPackage(pkg)
  }

  console.log(`Published ${missingPackages.length} new package(s).`)
}

main().catch((error) => {
  console.error('Publish-new-packages failed:', error)
  process.exit(1)
})
