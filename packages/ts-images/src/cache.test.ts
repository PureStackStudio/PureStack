import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { pruneImageCache } from './cache'

describe('image cache retention', () => {
  let root: string
  const old = new Date(Date.now() - 60 * 86_400_000)
  beforeEach(async () => {
    root = await fs.mkdtemp(
      path.join(os.tmpdir(), 'purestack-cache-retention-'),
    )
  })
  afterEach(async () => {
    vi.restoreAllMocks()
    await fs.rm(root, { recursive: true, force: true })
  })
  async function entry(name: string, date = old) {
    const directory = path.join(root, name)
    await fs.mkdir(directory)
    await fs.writeFile(
      path.join(directory, 'manifest.json'),
      JSON.stringify({ version: 1, key: name, variants: [] }),
    )
    await fs.utimes(path.join(directory, 'manifest.json'), date, date)
    return directory
  }

  it('expires unused owned entries while retaining fresh, active, foreign, and symlinked paths', async () => {
    const expired = await entry('a'.repeat(64))
    await entry('b'.repeat(64), new Date())
    await entry('c'.repeat(64))
    await entry('notes')
    const foreign = await entry('d'.repeat(64))
    await fs.writeFile(
      path.join(foreign, 'manifest.json'),
      '{"key":"unrelated"}',
    )
    await fs.utimes(path.join(foreign, 'manifest.json'), old, old)
    await fs.writeFile(path.join(root, 'keep.txt'), 'Keep')
    const alias = path.join(root, 'e'.repeat(64))
    await fs.symlink(
      path.join(root, 'notes'),
      alias,
      process.platform === 'win32' ? 'junction' : 'dir',
    )
    // Two sites/processors can sweep the same shared cache concurrently.
    await Promise.all(
      Array.from({ length: 2 }, () =>
        pruneImageCache(root, 30, new Set(['c'.repeat(64)])),
      ),
    )
    await expect(fs.stat(expired)).rejects.toMatchObject({ code: 'ENOENT' })
    expect((await fs.readdir(root)).sort()).toEqual(
      [
        'b'.repeat(64),
        'c'.repeat(64),
        'd'.repeat(64),
        'e'.repeat(64),
        'keep.txt',
        'notes',
      ].sort(),
    )
    expect(await fs.readFile(path.join(root, 'keep.txt'), 'utf8')).toBe('Keep')
  })

  it('allows automatic expiry to be disabled', async () => {
    await entry('a'.repeat(64))
    await pruneImageCache(root, 0, new Set())
    expect(await fs.readdir(root)).toEqual(['a'.repeat(64)])
  })

  it('rechecks expiry after reading a manifest to respect concurrent cache hits', async () => {
    const directory = await entry('a'.repeat(64))
    const read = fs.readFile.bind(fs)
    vi.spyOn(fs, 'readFile').mockImplementation(
      async (...args: Parameters<typeof fs.readFile>) => {
        const value = await read(...args)
        const now = new Date()
        await fs.utimes(path.join(directory, 'manifest.json'), now, now)
        return value
      },
    )
    await pruneImageCache(root, 30, new Set())
    expect(await fs.readdir(root)).toEqual(['a'.repeat(64)])
  })

  it('cleans abandoned staging directories without touching fresh staging work', async () => {
    const stale = '.purestack-images-12345678-1234-1234-1234-123456789abc.tmp'
    const fresh = '.purestack-images-12345678-1234-1234-1234-123456789abd.tmp'
    const retired =
      '.purestack-images-12345678-1234-1234-1234-123456789abe.trash'
    for (const name of [stale, fresh, retired]) {
      await fs.mkdir(path.join(root, name))
      await fs.writeFile(path.join(root, name, 'partial.png'), 'Incomplete')
      if (name !== fresh) await fs.utimes(path.join(root, name), old, old)
    }
    await pruneImageCache(root, 30, new Set())
    expect(await fs.readdir(root)).toEqual([fresh])
  })
})
