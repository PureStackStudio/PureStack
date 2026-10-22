import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { runNpm, runProcess } from './process'

let temporary: string

beforeEach(async () => {
  temporary = await mkdtemp(path.join(tmpdir(), 'purestack-process-'))
})

afterEach(async () => {
  vi.unstubAllEnvs()
  expect(path.dirname(path.resolve(temporary))).toBe(path.resolve(tmpdir()))
  expect(path.basename(temporary)).toMatch(/^purestack-process-/)
  await rm(temporary, { recursive: true, force: true })
})

describe('process failure labels', () => {
  it.each([
    { args: ['install'], label: 'npm install' },
    { args: [], label: 'npm' },
  ])(
    'reports $label instead of the Node launcher path',
    async ({ args, label }) => {
      const launcher = path.join(temporary, 'npm-cli.js')
      await writeFile(
        launcher,
        'process.stderr.write("Registry unavailable\\n"); process.exitCode = 1',
      )
      vi.stubEnv('npm_execpath', launcher)
      await expect(runNpm(args, temporary, { capture: true })).rejects.toThrow(
        `${label} failed (1).\nRegistry unavailable`,
      )
    },
  )

  it('retains stderr and exit status when a caller supplies a command label', async () => {
    await expect(
      runProcess(
        process.execPath,
        [
          '-e',
          'process.stderr.write("Permission denied\\n"); process.exitCode = 7',
        ],
        temporary,
        { capture: true, label: 'corepack enable yarn' },
      ),
    ).rejects.toThrow('corepack enable yarn failed (7).\nPermission denied')
  })
})
