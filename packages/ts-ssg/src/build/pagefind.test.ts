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
})
