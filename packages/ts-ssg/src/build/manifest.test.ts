import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../config/config'
import {
  createEmptyManifest,
  manifestPath,
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

async function writeRawManifest(outDir: string, contents: string) {
  const filePath = manifestPath(outDir)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, contents, 'utf8')
}

describe('manifest', () => {
  let logger: Logger | undefined

  beforeAll(async () => {
    disableLogger()
    logger = getLogger()
  })

  afterAll(async () => {
    await logger?.close()
  })

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
        style: {
          fileName: 'site.css',
          href: '/assets/site.css',
        },
      })
      const manifest = createEmptyManifest(config)
      await writeManifest(outDir, manifest)
      const loaded = await readManifest(outDir)
      expect(loaded?.config).toEqual(manifest.config)
      expect(loaded?.version).toBe(manifest.version)
      expect(loaded?.content).toEqual({})
    })
  })

  it('ignores an empty manifest cache', async () => {
    await withTempDir(async (base) => {
      const outDir = path.join(base, 'out')
      await writeRawManifest(outDir, '')

      await expect(readManifest(outDir)).resolves.toBeNull()
    })
  })

  it('ignores an invalid JSON manifest cache', async () => {
    await withTempDir(async (base) => {
      const outDir = path.join(base, 'out')
      await writeRawManifest(outDir, '{')

      await expect(readManifest(outDir)).resolves.toBeNull()
    })
  })

  it('ignores a manifest cache with the wrong shape', async () => {
    await withTempDir(async (base) => {
      const outDir = path.join(base, 'out')
      await writeRawManifest(outDir, '[]')

      await expect(readManifest(outDir)).resolves.toBeNull()
    })
  })

  it('compares signatures correctly', () => {
    expect(signatureEqual(undefined, null)).toBe(false)
    expect(signatureEqual({ mtimeMs: 1, size: 2 }, null)).toBe(false)
    expect(
      signatureEqual({ mtimeMs: 1, size: 2 }, { mtimeMs: 1, size: 2 }),
    ).toBe(true)
    expect(
      signatureEqual({ mtimeMs: 1, size: 2 }, { mtimeMs: 2, size: 2 }),
    ).toBe(false)
  })
})
