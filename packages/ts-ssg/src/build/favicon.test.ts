import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import type { SiteConfig } from '@purestack/ts-common'
import { describe, expect, it } from 'vitest'
import { writeGeneratedFavicon } from './favicon'

async function withTempDir<T>(worker: (dir: string) => Promise<T>) {
  const base = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-favicon-'))
  try {
    return await worker(base)
  } finally {
    await fs.rm(base, { recursive: true, force: true })
  }
}

function buildConfig(outDir: string) {
  return {
    favicon: 'tabler:cloud-storm',
    outDir,
    style: {
      theme: {
        palette: {
          dark: {
            accent: '#38bdf8',
          },
        },
      },
    },
  } as SiteConfig
}

describe('favicon', () => {
  it('keeps the injected viewport rect invisible when icon roots define stroke', async () => {
    await withTempDir(async (outDir) => {
      await writeGeneratedFavicon(buildConfig(outDir))

      const svg = await fs.readFile(
        path.join(outDir, 'assets', 'favicon.svg'),
        'utf8',
      )

      expect(svg).toContain(
        '<rect width="24" height="24" rx="6" fill="none" stroke="none"/>',
      )
      expect(svg).toContain('icon-tabler-cloud-storm')
      expect(svg).toContain('stroke="#38bdf8"')
    })
  })
})
