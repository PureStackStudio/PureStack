import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import {
  preparePackageManager,
  runPackageManager,
  runYarn,
} from '../../packages/purestack/src/init/package-manager'
import { runProcess } from '../../packages/purestack/src/init/process'
import type { TaskRunner } from '../../packages/purestack/src/init/tasks'

async function main() {
  const root = process.argv[2]
  const npmCli = process.argv[3]
  const packageManager = process.argv[4]
  assert(
    root && path.isAbsolute(root),
    'Missing isolated installation directory.',
  )
  assert(npmCli && path.isAbsolute(npmCli), 'Missing npm launcher.')
  assert(packageManager?.startsWith('yarn@'), 'Missing pinned Yarn version.')
  const prefix = path.join(root, 'npm-global')
  const project = path.join(root, 'site')
  const nodeDirectory = path.dirname(process.execPath)
  const version = packageManager.slice('yarn@'.length).split('+')[0]
  await mkdir(project)
  await writeFile(
    path.join(project, 'package.json'),
    JSON.stringify({
      name: 'fresh-toolchain-site',
      private: true,
      packageManager,
    }),
  )
  await writeFile(path.join(project, 'yarn.lock'), '')

  delete process.env.COREPACK_ROOT
  delete process.env.NODE_PATH
  process.env.npm_execpath = npmCli
  process.env.npm_config_prefix = prefix
  process.env.npm_config_cache = path.join(root, 'npm-cache')
  process.env.COREPACK_HOME = path.join(root, 'corepack-cache')
  process.env.COREPACK_ENABLE_DOWNLOAD_PROMPT = '0'
  process.env.YARN_ENABLE_GLOBAL_CACHE = 'false'
  process.env.YARN_GLOBAL_FOLDER = path.join(root, 'yarn-global')
  process.env.PATH = nodeDirectory

  const stages: string[] = []
  const task: TaskRunner = async (label, action) => {
    stages.push(label)
    console.log(`${label}...`)
    return action()
  }
  const signal = AbortSignal.timeout(120000)
  await preparePackageManager('yarn', project, task, signal)
  assert.deepEqual(stages, ['Install Corepack', 'Enable Yarn', 'Prepare Yarn'])
  assert.equal(
    (await runYarn(['--version'], project, { capture: true, signal })).trim(),
    version,
  )
  // Like createSite: the first install writes the lockfile despite CI immutability.
  await runPackageManager(
    'yarn',
    ['install', '--no-immutable', '--mode=skip-build'],
    project,
    { signal },
  )
  assert.match(
    await readFile(path.join(project, 'yarn.lock'), 'utf8'),
    /__metadata/,
  )

  const toolBin =
    process.platform === 'win32' ? prefix : path.join(prefix, 'bin')
  assert(
    existsSync(
      path.join(toolBin, process.platform === 'win32' ? 'yarn.cmd' : 'yarn'),
    ),
  )
  // Verify the installed global launchers after discarding the bootstrap hint.
  delete process.env.COREPACK_ROOT
  assert.equal(
    (await runYarn(['--version'], project, { capture: true, signal })).trim(),
    version,
  )
  const launcherVersion =
    process.platform === 'win32'
      ? await runProcess(
          process.env.ComSpec ?? 'C:\\Windows\\System32\\cmd.exe',
          ['/d', '/s', '/c', 'yarn --version'],
          project,
          { capture: true, signal },
        )
      : await runProcess('yarn', ['--version'], project, {
          capture: true,
          signal,
        })
  assert.equal(
    launcherVersion.trim(),
    version,
    'The installed Yarn launcher must be runnable from PATH.',
  )
  const corepack = path.join(
    prefix,
    process.platform === 'win32'
      ? 'node_modules/corepack/dist/corepack.js'
      : 'lib/node_modules/corepack/dist/corepack.js',
  )
  assert.match(
    await runProcess(process.execPath, [corepack, '--version'], project, {
      capture: true,
      signal,
    }),
    /\d+\.\d+\.\d+/,
  )

  stages.length = 0
  await preparePackageManager('yarn', project, task, signal)
  assert.deepEqual(
    stages,
    ['Prepare Yarn'],
    'Second setup should reuse the installed tools.',
  )
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
