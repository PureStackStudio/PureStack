import { existsSync } from 'node:fs'
import { mkdir, mkdtemp, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { preparePackageManager, runYarn } from './package-manager'
import * as processes from './process'
import type { TaskRunner } from './tasks'

vi.mock('node:fs', async (importOriginal) => {
  const original = await importOriginal<typeof import('node:fs')>()
  return { ...original, existsSync: vi.fn(original.existsSync) }
})

let temporary: string

beforeEach(async () => {
  // Child processes report resolved paths, e.g. /private/var on macOS.
  temporary = await realpath(
    await mkdtemp(path.join(tmpdir(), 'purestack-yarn-runner-')),
  )
  vi.stubEnv('COREPACK_ROOT', undefined)
  vi.stubEnv('npm_execpath', undefined)
  vi.stubEnv('PATH', '')
  vi.mocked(existsSync).mockReturnValue(false)
})

afterEach(async () => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
  await rm(temporary, { recursive: true, force: true })
})

async function runner(relative: string) {
  const file = path.join(temporary, relative)
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(
    file,
    'console.log(JSON.stringify({ args: process.argv.slice(2), cwd: process.cwd() }))',
  )
  vi.mocked(existsSync).mockImplementation((candidate) => candidate === file)
  return file
}

describe('Yarn process lookup', () => {
  it('uses COREPACK_ROOT when npm_execpath is a temporary Yarn launcher', async () => {
    const file = await runner('user npm/node_modules/corepack/dist/corepack.js')
    vi.stubEnv('COREPACK_ROOT', path.dirname(path.dirname(file)))
    vi.stubEnv('npm_execpath', path.join(temporary, 'xfs/yarn'))
    const output = await runYarn(['install'], temporary, { capture: true })
    expect(JSON.parse(output)).toEqual({
      args: ['yarn', 'install'],
      cwd: temporary,
    })
  })

  it('locates a user npm installation of Corepack through PATH', async () => {
    await runner('user npm/node_modules/corepack/dist/corepack.js')
    vi.stubEnv('PATH', path.join(temporary, 'user npm'))
    const output = await runYarn(['install'], temporary, { capture: true })
    expect(JSON.parse(output).args).toEqual(['yarn', 'install'])
  })

  it('reuses an active JavaScript Yarn CLI without Corepack', async () => {
    const file = await runner('releases/yarn-4.18.1.cjs')
    vi.stubEnv('npm_execpath', file)
    const output = await runYarn(['install', '--mode=skip-build'], temporary, {
      capture: true,
    })
    expect(JSON.parse(output).args).toEqual(['install', '--mode=skip-build'])
  })

  it('locates standalone Yarn installed in a user npm prefix', async () => {
    await runner('user npm/node_modules/yarn/bin/yarn.js')
    vi.stubEnv('PATH', path.join(temporary, 'user npm'))
    const output = await runYarn(['--version'], temporary, { capture: true })
    expect(JSON.parse(output).args).toEqual(['--version'])
  })

  it.each(['corepack', 'standalone'])(
    'labels failed Yarn commands using %s',
    async (launcher) => {
      const file = await runner(
        launcher === 'corepack'
          ? 'user npm/node_modules/corepack/dist/corepack.js'
          : 'releases/yarn-4.18.1.cjs',
      )
      if (launcher === 'corepack')
        vi.stubEnv('COREPACK_ROOT', path.dirname(path.dirname(file)))
      else vi.stubEnv('npm_execpath', file)
      await writeFile(
        file,
        'process.stderr.write("Registry unavailable\\n"); process.exitCode = 1',
      )
      await expect(
        runYarn(['install'], temporary, { capture: true }),
      ).rejects.toThrow('yarn install failed (1).\nRegistry unavailable')
    },
  )

  it.runIf(process.platform === 'win32')(
    'reports missing Yarn without duplicating retry instructions',
    () => {
      expect(() => runYarn(['install'], temporary, { capture: true })).toThrow(
        'Ensure Yarn or Corepack is available on PATH.',
      )
      expect(() =>
        runYarn(['install'], temporary, { capture: true }),
      ).not.toThrow('retry yarn install')
    },
  )
})

describe('package manager setup', () => {
  it('installs Corepack, enables Yarn, and prepares the project-pinned version on a fresh machine', async () => {
    const prefix = path.join(temporary, 'npm-global')
    const root = path.join(prefix, 'node_modules')
    const corepack = path.join(root, 'corepack/dist/corepack.js')
    const bin = process.platform === 'win32' ? prefix : path.join(prefix, 'bin')
    let installed = false
    vi.mocked(existsSync).mockImplementation(
      (file) => installed && file === corepack,
    )
    const npm = vi
      .spyOn(processes, 'runNpm')
      .mockImplementation(async (args) => {
        if (args[0] === 'install') {
          installed = true
          return ''
        }
        if (args[0] === 'root') return root
        if (args[0] === 'prefix') return prefix
        throw new Error('Unexpected npm command')
      })
    const run = vi.spyOn(processes, 'runProcess').mockResolvedValue('')
    const stages: string[] = []
    const task: TaskRunner = (label, action) => {
      stages.push(label)
      return action()
    }
    await preparePackageManager('yarn', temporary, task)
    expect(stages).toEqual(['Install Corepack', 'Enable Yarn', 'Prepare Yarn'])
    expect(npm).toHaveBeenCalledWith(
      ['install', '--global', 'corepack@latest', '--no-audit', '--no-fund'],
      temporary,
      { capture: true, signal: undefined },
    )
    expect(run.mock.calls.map((call) => call[1])).toEqual([
      [corepack, 'enable', 'yarn', '--install-directory', bin],
      [corepack, 'install'],
    ])
    await runYarn(['install'], temporary, { capture: true })
    expect(run).toHaveBeenLastCalledWith(
      process.execPath,
      [corepack, 'yarn', 'install'],
      temporary,
      { capture: true, label: 'yarn install' },
    )
  })

  it('reuses Corepack and enabled Yarn without reinstalling them', async () => {
    const file = await runner('corepack/dist/corepack.js')
    const bin = path.join(temporary, 'bin')
    vi.stubEnv('COREPACK_ROOT', path.dirname(path.dirname(file)))
    vi.stubEnv('PATH', bin)
    vi.mocked(existsSync).mockImplementation(
      (entry) =>
        entry === file ||
        entry ===
          path.join(bin, process.platform === 'win32' ? 'yarn.cmd' : 'yarn'),
    )
    const npm = vi.spyOn(processes, 'runNpm')
    const run = vi.spyOn(processes, 'runProcess').mockResolvedValue('')
    await preparePackageManager('yarn', temporary, (_label, action) => action())
    expect(npm).not.toHaveBeenCalled()
    expect(run).toHaveBeenCalledExactlyOnceWith(
      process.execPath,
      [file, 'install'],
      temporary,
      { capture: true, label: 'corepack install' },
    )
  })

  it('enables missing Yarn shims without reinstalling existing Corepack', async () => {
    const file = await runner('corepack/dist/corepack.js')
    vi.stubEnv('COREPACK_ROOT', path.dirname(path.dirname(file)))
    const npm = vi.spyOn(processes, 'runNpm').mockResolvedValue(temporary)
    const run = vi.spyOn(processes, 'runProcess').mockResolvedValue('')
    await preparePackageManager('yarn', temporary, (_label, action) => action())
    expect(npm).toHaveBeenCalledExactlyOnceWith(
      ['prefix', '--global'],
      temporary,
      { capture: true },
    )
    expect(run.mock.calls.map((call) => call[1][1])).toEqual([
      'enable',
      'install',
    ])
  })

  it('reuses standalone Yarn when it matches the project pin', async () => {
    const file = await runner('releases/yarn-4.18.1.cjs')
    vi.stubEnv('npm_execpath', file)
    await writeFile(
      path.join(temporary, 'package.json'),
      JSON.stringify({ packageManager: 'yarn@4.18.1' }),
    )
    const npm = vi.spyOn(processes, 'runNpm')
    vi.spyOn(processes, 'runProcess').mockResolvedValue('4.18.1\n')
    await preparePackageManager('yarn', temporary, (_label, action) => action())
    expect(npm).not.toHaveBeenCalled()
  })

  it('stops setup when Corepack installation fails', async () => {
    vi.spyOn(processes, 'runNpm').mockRejectedValue(new Error('offline'))
    const run = vi.spyOn(processes, 'runProcess')
    await expect(
      preparePackageManager('yarn', temporary, (_label, action) => action()),
    ).rejects.toThrow('offline')
    expect(run).not.toHaveBeenCalled()
  })

  it('does not install tools for npm projects or cancelled operations', async () => {
    const npm = vi.spyOn(processes, 'runNpm')
    const task: TaskRunner = (_label, action) => action()
    await preparePackageManager('npm', temporary, task)
    const abort = new AbortController()
    abort.abort()
    await expect(
      preparePackageManager('yarn', temporary, task, abort.signal),
    ).rejects.toMatchObject({ name: 'AbortError' })
    expect(npm).not.toHaveBeenCalled()
  })
})
