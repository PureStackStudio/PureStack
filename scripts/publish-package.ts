import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { packTemplate } from './pack-templates'
import { workspaceManifestPaths } from './workspaces'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))

interface PackageJson {
  name: string
  version?: string
  private?: boolean
  exports?: Record<string, unknown>
  purestackTemplate?: boolean
}

function run(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: 'inherit',
    })
    child.once('error', reject)
    child.once('exit', (code, signal) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} failed (${signal ?? `exit ${code}`}).`))
    })
  })
}

async function main() {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Build, pack, and publish one PureStack package publicly with the latest tag.

Usage:
  yarn publish-package ts-images
  yarn publish-package @purestack/ts-images --dry-run

Log in once with npm login before publishing. --dry-run builds and packs the
package, then runs npm publish --dry-run without uploading it.
`)
    return
  }

  const dryRun = args.includes('--dry-run')
  const names = args.filter((arg) => arg !== '--dry-run')
  if (names.length !== 1 || names[0].startsWith('-'))
    throw new Error('Usage: yarn publish-package <package-name> [--dry-run]')

  const requested = names[0]
  const packageNames = new Set([requested, `@purestack/${requested}`])
  const packages = workspaceManifestPaths(projectRoot).map((file) => ({
    directory: path.dirname(path.join(projectRoot, file)),
    manifest: JSON.parse(
      readFileSync(path.join(projectRoot, file), 'utf8'),
    ) as PackageJson,
  }))
  const selected = packages.find((pkg) => packageNames.has(pkg.manifest.name))
  if (!selected) throw new Error(`Unknown workspace package: ${requested}`)
  const { directory, manifest } = selected
  if (
    manifest.private ||
    (!manifest.exports && !manifest.purestackTemplate) ||
    !manifest.version
  )
    throw new Error(`${manifest.name} is not a versioned, publishable package.`)

  // Yarn's npm_execpath can point to a shell shim. Use the Corepack entry directly.
  const corepackRoot = process.env.COREPACK_ROOT
  if (!corepackRoot)
    throw new Error('Enable Corepack, then run yarn publish-package.')
  const yarnCli = path.join(corepackRoot, 'dist', 'yarn.js')
  const yarn = (commandArgs: string[]) =>
    run(process.execPath, [yarnCli, ...commandArgs])
  const tarball = path.join(directory, 'package.tgz')
  console.log(
    `${dryRun ? 'Preparing dry run for' : 'Preparing'} ${manifest.name}@${manifest.version}`,
  )

  // Reuse the repository's bundling and verification before packing fresh output.
  if (manifest.purestackTemplate) await packTemplate(directory)
  else {
    await yarn(['bundle'])
    await yarn(['workspace', manifest.name, 'pack', '--out', tarball])
  }

  const publishArgs = [
    'publish',
    tarball,
    '--access',
    'public',
    '--tag',
    'latest',
    '--registry',
    'https://registry.npmjs.org',
  ]
  if (dryRun) publishArgs.push('--dry-run')

  // Inherit the terminal so npm's browser authentication and 2FA stay interactive.
  if (process.platform === 'win32') {
    const npmCli = path.join(
      path.dirname(process.execPath),
      'node_modules',
      'npm',
      'bin',
      'npm-cli.js',
    )
    await run(process.execPath, [npmCli, ...publishArgs])
  } else {
    await run('npm', publishArgs)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
