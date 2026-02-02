import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../config/config'
import {
  createEmptyManifest,
  readManifest,
  signatureEqual,
  writeManifest,
} from './manifest'

async function withTempDir<T>(worker: (dir: string) => Promise<T>) {
  const base = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-'))
  try {
    return await worker(base)
  } finally {
    await fs.rm(base, { recursive: true, force: true })
  }
}

describe('manifest', () => {
  it('round-trips a manifest to disk', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      const outDir = path.join(base, 'out')
      await fs.mkdir(contentDir, { recursive: true })
      const config = resolveSiteConfig({
        rootDir: base,
        contentDir,
        outDir,
        siteTitle: 'Test Site',
        styleFileName: 'site.css',
        styleHref: '/site.css',
      })
      const manifest = createEmptyManifest(config)
      await writeManifest(outDir, manifest)
      const loaded = await readManifest(outDir)
      expect(loaded?.config).toEqual(manifest.config)
      expect(loaded?.version).toBe(manifest.version)
      expect(loaded?.content).toEqual({})
    })
  })

  it('compares signatures correctly', () => {
    expect(signatureEqual(undefined, null)).toBe(false)
    expect(signatureEqual({ mtimeMs: 1, size: 2 }, null)).toBe(false)
    expect(signatureEqual({ mtimeMs: 1, size: 2 }, { mtimeMs: 1, size: 2 })).toBe(
      true,
    )
    expect(signatureEqual({ mtimeMs: 1, size: 2 }, { mtimeMs: 2, size: 2 })).toBe(
      false,
    )
  })
})
