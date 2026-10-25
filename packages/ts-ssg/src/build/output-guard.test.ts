import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { removeFile } from './incremental/support'
import { statOutputPath } from './output-guard'

describe('output guard', () => {
  let root: string
  let outDir: string
  beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-output-guard-'))
    outDir = path.join(root, 'out')
    await fs.mkdir(path.join(outDir, 'assets'), { recursive: true })
    await fs.writeFile(path.join(outDir, 'assets', 'site.js'), 'output')
    await fs.writeFile(path.join(root, 'victim.txt'), 'mine')
  })
  afterEach(async () => {
    await fs.rm(root, { recursive: true, force: true })
  })

  it('stats outputs and reports missing ones', async () => {
    const stat = await statOutputPath(
      outDir,
      path.join(outDir, 'assets', 'site.js'),
    )
    expect(stat?.isFile()).toBe(true)
    expect(
      await statOutputPath(outDir, path.join(outDir, 'missing', 'page.html')),
    ).toBeUndefined()
  })

  it.each([
    ['a sibling', () => path.join(root, 'victim.txt')],
    ['a traversal', () => path.join(outDir, '..', 'victim.txt')],
    ['the output itself', () => outDir],
  ])('refuses %s', async (_, output) => {
    await expect(statOutputPath(outDir, output())).rejects.toThrow(
      'lies outside the output directory',
    )
  })

  it('refuses a path through a symlinked folder', async () => {
    const linked = path.join(outDir, 'linked')
    await fs.symlink(
      root,
      linked,
      process.platform === 'win32' ? 'junction' : 'dir',
    )
    await expect(
      statOutputPath(outDir, path.join(linked, 'victim.txt')),
    ).rejects.toThrow('contains a symlink')
  })

  it.skipIf(process.platform !== 'win32')(
    'accepts an output recorded with different casing',
    async () => {
      const output = path.join(outDir, 'assets', 'site.js').toUpperCase()
      expect((await statOutputPath(outDir, output))?.isFile()).toBe(true)
    },
  )

  it('removes recorded outputs only inside the output directory', async () => {
    const victim = path.join(root, 'victim.txt')
    await expect(removeFile(outDir, victim)).rejects.toThrow(
      'lies outside the output directory',
    )
    expect(await fs.readFile(victim, 'utf8')).toBe('mine')
    await removeFile(outDir, path.join(outDir, 'assets', 'site.js'))
    expect(await fs.readdir(path.join(outDir, 'assets'))).toEqual([])
  })
})
