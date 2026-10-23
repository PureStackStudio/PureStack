import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { formatFiles } from './files'

describe('formatFiles', () => {
  it('checks without writing, saves once, and reports a clean second pass', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'purestack-format-'))
    try {
      const source =
        'const  keep = 1;\nconst view = html`<Panel><Badge /></Panel>`'
      await writeFile(path.join(cwd, 'app.ts'), source)
      await mkdir(path.join(cwd, 'node_modules'))
      await writeFile(path.join(cwd, 'node_modules', 'ignored.ts'), source)
      const check = await formatFiles(['.'], { cwd })
      expect(check.errors).toEqual([])
      expect(check.checked).toBe(1)
      expect(check.changed).toEqual([path.join(cwd, 'app.ts')])
      expect(await readFile(path.join(cwd, 'app.ts'), 'utf8')).toBe(source)
      expect(
        (await formatFiles(['.'], { cwd, write: true })).changed,
      ).toHaveLength(1)
      expect(await readFile(path.join(cwd, 'app.ts'), 'utf8')).toContain(
        'const  keep = 1;',
      )
      expect((await formatFiles(['.'], { cwd })).changed).toEqual([])
    } finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it('honors Git ignores and exclusions while collecting errors and formatting other files', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'purestack-format-'))
    try {
      execFileSync('git', ['init', cwd], { stdio: 'ignore' })
      await writeFile(path.join(cwd, '.gitignore'), 'ignored.mdx\n')
      await writeFile(path.join(cwd, 'ignored.mdx'), '<Panel><Badge /></Panel>')
      await writeFile(
        path.join(cwd, 'excluded.mdx'),
        '<Panel><Badge /></Panel>',
      )
      await writeFile(path.join(cwd, 'good.mdx'), '<Panel><Badge /></Panel>')
      await writeFile(
        path.join(cwd, 'bad.mdx'),
        '<Panel title="broken></Panel>',
      )
      const result = await formatFiles(['.', 'missing.mdx'], {
        cwd,
        write: true,
        exclude: ['excluded.mdx'],
      })
      expect(result.checked).toBe(2)
      expect(result.changed).toEqual([path.join(cwd, 'good.mdx')])
      expect(
        result.errors.map((error) => path.basename(error.filePath)).sort(),
      ).toEqual(['bad.mdx', 'missing.mdx'])
      expect(await readFile(path.join(cwd, 'bad.mdx'), 'utf8')).toBe(
        '<Panel title="broken></Panel>',
      )
      expect(await readFile(path.join(cwd, 'ignored.mdx'), 'utf8')).toBe(
        '<Panel><Badge /></Panel>',
      )
    } finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })
})
