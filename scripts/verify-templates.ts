import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
  type PackageManager,
  runPackageManager,
} from '../packages/purestack/src/init/package-manager'
import { runProcess } from '../packages/purestack/src/init/process'
import { resolveCoreSiteConfig } from '../packages/ts-ssg/src/config/core-config'
import { workspaceManifestPaths } from './workspaces'

const root = process.cwd()
const packages = workspaceManifestPaths(root).map((file) => {
  const directory = path.resolve(root, path.dirname(file))
  const manifest = JSON.parse(readFileSync(path.join(root, file), 'utf8')) as {
    name: string
    version: string
    private?: boolean
    exports?: unknown
    purestackTemplate?: boolean
  }
  return { directory, manifest, archive: path.join(directory, 'package.tgz') }
})
const framework =
  packages.find((pkg) => pkg.manifest.name === 'purestack') ??
  (() => {
    throw new Error('Missing purestack package.')
  })()
const requested = process.argv.slice(2)
const templates = packages.filter(
  (pkg) =>
    pkg.manifest.purestackTemplate &&
    (!requested.length ||
      requested.includes(pkg.manifest.name) ||
      requested.includes(
        pkg.manifest.name.replace('@purestack/template-', ''),
      )),
)
assert(templates.length > 0, 'Missing template packages.')
const overrides = Object.fromEntries(
  packages
    .filter(
      (pkg) =>
        !pkg.manifest.private && pkg.manifest.exports && pkg !== framework,
    )
    .map((pkg) => [
      pkg.manifest.name,
      `file:${pkg.archive.replaceAll('\\', '/')}`,
    ]),
)

async function main() {
  // The project must not inherit workspace packages through parent node_modules.
  const temporary = await mkdtemp(
    path.join(tmpdir(), 'purestack-template-verification-'),
  )
  try {
    for (const template of templates) {
      const directory = path.join(
        temporary,
        template.manifest.name.split('/').at(-1) ?? 'site',
      )
      console.log(
        `\nVerifying ${template.manifest.name}@${template.manifest.version} outside the monorepo...`,
      )
      await runProcess(
        process.execPath,
        [
          path.join(framework.directory, 'dist/cli.mjs'),
          'init',
          directory,
          '--template',
          template.archive,
          '--yes',
          '--title',
          'Template verification',
        ],
        temporary,
      )
      const packageFile = path.join(directory, 'package.json')
      const project = JSON.parse(await readFile(packageFile, 'utf8'))
      assert.equal(project.dependencies.purestack, 'latest')
      assert(
        !Object.keys(project.dependencies).some((name) =>
          name.includes('template-'),
        ),
      )
      // Exercise unpublished framework tarballs while resolving all third-party
      // dependencies normally. No source directories or workspace links are used.
      project.dependencies.purestack = `file:${framework.archive.replaceAll('\\', '/')}`
      const manager: PackageManager = project.packageManager?.startsWith(
        'yarn@',
      )
        ? 'yarn'
        : 'npm'
      if (manager === 'yarn') project.resolutions = overrides
      else project.overrides = overrides
      await writeFile(packageFile, `${JSON.stringify(project, null, 2)}\n`)
      if (manager === 'yarn') {
        // Keep verification caches within the disposable project, too.
        const yarnConfig = path.join(directory, '.yarnrc.yml')
        await writeFile(
          yarnConfig,
          `${await readFile(yarnConfig, 'utf8')}\nenableGlobalCache: false\nglobalFolder: ${JSON.stringify(path.join(temporary, 'yarn-global'))}\n`,
        )
      }
      await runPackageManager(
        manager,
        // Like createSite: the first install writes the lockfile despite CI immutability.
        manager === 'yarn'
          ? ['install', '--no-immutable']
          : ['install', '--no-audit', '--no-fund'],
        directory,
      )
      for (const script of ['check', 'test:ci', 'build', 'publish']) {
        if (typeof project.scripts?.[script] === 'string')
          await runPackageManager(manager, ['run', script], directory)
      }
      // Each template chooses its output folders; resolve them as the build does.
      const { outDir, publishDir } = resolveCoreSiteConfig({
        rootDir: directory,
        contentDir: path.join(directory, 'content'),
      })
      for (const output of [outDir, publishDir]) {
        const html = await readFile(path.join(output, 'index.html'), 'utf8')
        assert(
          html.includes('Template verification'),
          `${path.relative(directory, output)} is missing the customized title.`,
        )
      }
      console.log(`Verified ${template.manifest.name}.`)
    }
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
