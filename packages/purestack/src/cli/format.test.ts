import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { runFormatCli } from './format'

afterEach(() => vi.restoreAllMocks())

describe('purestack format', () => {
  it('checks by default, writes on request, and returns correct exit statuses', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    const cwd = await mkdtemp(path.join(tmpdir(), 'purestack-format-cli-'))
    try {
      const file = path.join(cwd, 'page.mdx')
      const source = '<Panel><Badge /></Panel>'
      await writeFile(file, source)
      expect(await runFormatCli([], cwd)).toBe(1)
      expect(await readFile(file, 'utf8')).toBe(source)
      expect(await runFormatCli(['page.mdx', '--write'], cwd)).toBe(0)
      expect(await readFile(file, 'utf8')).toBe('<Panel><Badge/></Panel>')
      expect(await runFormatCli(['--check'], cwd)).toBe(0)
      await expect(runFormatCli(['--write', '--check'], cwd)).rejects.toThrow(
        'Choose either',
      )
    } finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })
})
