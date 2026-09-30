import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { disableLogger } from 'logpot'
import { beforeAll, describe, expect, it } from 'vitest'
import { buildPagefindIndex } from './pagefind'

describe('buildPagefindIndex', () => {
  beforeAll(() => {
    disableLogger()
  })

  it('removes stale pagefind output when disabled', async () => {
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-pagefind-'))
    try {
      const staleDir = path.join(outDir, 'pagefind')
      await fs.mkdir(staleDir, { recursive: true })
      await fs.writeFile(path.join(staleDir, 'pagefind.js'), 'stale')

      const result = await buildPagefindIndex(outDir, {
        enabled: false,
        excludePaths: [],
      })

      await expect(fs.access(staleDir)).rejects.toThrow()
      expect(result.indexedPages).toBe(0)
      expect(result.indexedBytes).toBe(0)
      expect(result.outputPath).toBe(staleDir)
      expect(result.errors).toEqual([])
    } finally {
      await fs.rm(outDir, { recursive: true, force: true })
    }
  })

  it('replaces stale pagefind output when rebuilding the index', async () => {
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-pagefind-'))
    try {
      const staleDir = path.join(outDir, 'pagefind')
      const staleFile = path.join(staleDir, 'stale-index.pf_index')
      await fs.mkdir(staleDir, { recursive: true })
      await fs.writeFile(staleFile, 'stale')
      await fs.writeFile(
        path.join(outDir, 'index.html'),
        '<!doctype html><html lang="en"><head><title>Home</title></head><body><main data-pagefind-body>Searchable content</main></body></html>',
      )

      const result = await buildPagefindIndex(outDir, {
        enabled: true,
        excludePaths: [],
      })

      await expect(fs.access(staleFile)).rejects.toThrow()
      await expect(
        fs.access(path.join(staleDir, 'pagefind.js')),
      ).resolves.toBeUndefined()
      expect(result.indexedPages).toBe(1)
      expect(result.errors).toEqual([])
    } finally {
      await fs.rm(outDir, { recursive: true, force: true })
    }
  })
})
