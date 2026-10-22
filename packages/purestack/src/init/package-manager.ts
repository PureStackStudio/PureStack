import { existsSync, realpathSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { type ProcessOptions, runNpm, runProcess } from './process'
import type { TaskRunner } from './tasks'

export type PackageManager = 'npm' | 'yarn'

function searchDirectories() {
  return (process.env.PATH ?? '').split(path.delimiter).filter(Boolean)
}

function findCorepack() {
  const corepackRoots = [
    process.env.COREPACK_ROOT,
    path.join(path.dirname(process.execPath), 'node_modules/corepack'),
    ...searchDirectories().map((directory) =>
      path.join(directory, 'node_modules/corepack'),
    ),
  ]
  const corepackCli = corepackRoots
    .filter((root): root is string => Boolean(root))
    .map((root) => path.join(root, 'dist/corepack.js'))
    .find((file) => existsSync(file))
  if (corepackCli) return corepackCli
  if (process.platform !== 'win32') {
    for (const directory of searchDirectories()) {
      const executable = path.join(directory, 'corepack')
      if (existsSync(executable)) return realpathSync(executable)
    }
  }
  return undefined
}

function findYarn() {
  return [
    process.env.npm_execpath,
    ...searchDirectories().map((directory) =>
      path.join(directory, 'node_modules/yarn/bin/yarn.js'),
    ),
  ].find(
    (file) =>
      file && /\byarn(?:-[\d.]+)?\.(?:c?js)$/i.test(file) && existsSync(file),
  )
}

/** Corepack selects the Yarn version pinned by the generated project. */
export function runYarn(
  args: string[],
  cwd: string,
  options: ProcessOptions = {},
) {
  const run = { ...options, label: ['yarn', args[0]].filter(Boolean).join(' ') }
  const corepack = findCorepack()
  if (corepack)
    return runProcess(process.execPath, [corepack, 'yarn', ...args], cwd, run)
  const yarnCli = findYarn()
  if (yarnCli) return runProcess(process.execPath, [yarnCli, ...args], cwd, run)
  if (process.platform === 'win32')
    throw new Error(
      'Cannot locate Yarn. Ensure Yarn or Corepack is available on PATH.',
    )
  return runProcess('corepack', ['yarn', ...args], cwd, run)
}

/** Called only for an explicitly requested dependency install. */
export async function preparePackageManager(
  manager: PackageManager,
  cwd: string,
  task: TaskRunner,
  signal?: AbortSignal,
) {
  if (manager !== 'yarn') return
  signal?.throwIfAborted()
  let corepack = findCorepack()
  if (!corepack && findYarn()) {
    const manifest: unknown = JSON.parse(
      await readFile(path.join(cwd, 'package.json'), 'utf8'),
    )
    const pinned =
      manifest &&
      typeof manifest === 'object' &&
      'packageManager' in manifest &&
      typeof manifest.packageManager === 'string'
        ? manifest.packageManager.slice('yarn@'.length)
        : undefined
    const version = await runYarn(['--version'], cwd, { capture: true, signal })
    if (version.trim() === pinned) return
  }
  let installed = false
  if (!corepack) {
    corepack = await task('Install Corepack', async () => {
      await runNpm(
        ['install', '--global', 'corepack@latest', '--no-audit', '--no-fund'],
        cwd,
        { capture: true, signal },
      )
      const root = (
        await runNpm(['root', '--global'], cwd, { capture: true, signal })
      ).trim()
      if (!path.isAbsolute(root))
        throw new Error('npm returned an invalid global package directory.')
      const entry = path.join(root, 'corepack/dist/corepack.js')
      if (!existsSync(entry))
        throw new Error('Corepack installation did not create its launcher.')
      process.env.COREPACK_ROOT = path.dirname(path.dirname(entry))
      return entry
    })
    installed = true
  }
  const corepackCli = corepack
  const hasYarnLauncher = searchDirectories().some((directory) =>
    existsSync(
      path.join(directory, process.platform === 'win32' ? 'yarn.cmd' : 'yarn'),
    ),
  )
  if (installed || !hasYarnLauncher) {
    await task('Enable Yarn', async () => {
      const prefix = (
        await runNpm(['prefix', '--global'], cwd, { capture: true, signal })
      ).trim()
      if (!path.isAbsolute(prefix))
        throw new Error('npm returned an invalid global installation prefix.')
      const bin =
        process.platform === 'win32' ? prefix : path.join(prefix, 'bin')
      await runProcess(
        process.execPath,
        [corepackCli, 'enable', 'yarn', '--install-directory', bin],
        cwd,
        { capture: true, signal, label: 'corepack enable yarn' },
      )
      if (!searchDirectories().includes(bin))
        process.env.PATH = [bin, ...searchDirectories()].join(path.delimiter)
    })
  }
  await task('Prepare Yarn', () =>
    runProcess(process.execPath, [corepackCli, 'install'], cwd, {
      capture: true,
      signal,
      label: 'corepack install',
    }),
  )
}

export function runPackageManager(
  manager: PackageManager,
  args: string[],
  cwd: string,
  options: ProcessOptions = {},
) {
  return manager === 'yarn'
    ? runYarn(args, cwd, options)
    : runNpm(args, cwd, options)
}
