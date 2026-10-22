import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, realpath, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { changeDirectoryCommand } from './commands'

let temporary: string
beforeAll(async () => {
  temporary = await mkdtemp(path.join(tmpdir(), 'purestack-shell-'))
})
afterAll(async () => {
  expect(path.dirname(path.resolve(temporary))).toBe(path.resolve(tmpdir()))
  expect(path.basename(temporary)).toMatch(/^purestack-shell-/)
  await rm(temporary, { recursive: true, force: true })
})

describe('copyable directory commands', () => {
  it('uses cmd drive switching and POSIX literal quoting', () => {
    expect(changeDirectoryCommand('my-site', 'windows')).toBe('cd my-site')
    expect(changeDirectoryCommand('my$site', 'windows')).toBe('cd "my$site"')
    expect(changeDirectoryCommand('D:/sites/my-site', 'windows')).toBe(
      'cd /d "D:/sites/my-site"',
    )
    expect(changeDirectoryCommand('my$site', 'posix')).toBe("cd 'my$site'")
    expect(changeDirectoryCommand('my`site', 'posix')).toBe("cd 'my`site'")
    expect(changeDirectoryCommand('-site', 'posix')).toBe('cd ./-site')
  })

  it.each([
    'my$site',
    'my`site',
    "team's site",
    'space & (more)^',
    'my%PURESTACK_QUOTE_TEST%site',
    'my!site',
    '-site',
  ])(
    'changes to the literal directory %s in the platform shell',
    async (name) => {
      const target = path.join(temporary, name)
      await mkdir(target)
      const windows = process.platform === 'win32'
      const command = changeDirectoryCommand(
        name,
        windows ? 'windows' : 'posix',
      )
      const result = windows
        ? spawnSync('cmd.exe', ['/d', '/v:off', '/c', `${command} && cd`], {
            cwd: temporary,
            encoding: 'utf8',
            windowsVerbatimArguments: true,
            env: {
              ...process.env,
              PURESTACK_QUOTE_TEST: 'unexpected expansion',
            },
          })
        : spawnSync('/bin/sh', ['-c', `${command} && pwd -P`], {
            cwd: temporary,
            encoding: 'utf8',
            env: { ...process.env, site: 'unexpected expansion' },
          })
      expect(result.error).toBeUndefined()
      expect(result.stderr).toBe('')
      expect(result.status).toBe(0)
      const expected = await realpath(target)
      expect(
        windows ? result.stdout.trim().toLowerCase() : result.stdout.trim(),
      ).toBe(windows ? expected.toLowerCase() : expected)
    },
  )
})
