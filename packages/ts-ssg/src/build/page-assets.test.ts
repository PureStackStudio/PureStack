import fs from 'node:fs/promises'
import path from 'node:path'
import { parseHtml } from '@purestack/ts-minidom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resolveSiteConfig } from '../config/config'
import { makeRepoTempDir } from '../test/repoTempDir'
import { ContentRouteIndex } from './content-urls'
import type { BuildContext } from './page'
import { PageAssetManager } from './page-assets'

const document = () =>
  parseHtml('<html><body><img src="photo.png"></body></html>')
    .document as unknown as Document

describe('page asset source tracking', () => {
  let root: string
  let context: BuildContext
  beforeEach(async () => {
    root = await makeRepoTempDir('.tmp-asset-sources-')
    context = {
      config: resolveSiteConfig(
        { rootDir: root, contentDir: root },
        { defaultPlugins: false },
      ),
      contentRoutes: new ContentRouteIndex([], ['photo.png', 'other.png']),
    }
    await fs.writeFile(path.join(root, 'photo.png'), 'Photo')
    await fs.writeFile(path.join(root, 'other.png'), 'Other')
  })
  afterEach(async () => {
    vi.restoreAllMocks()
    await fs.rm(root, { recursive: true, force: true })
  })

  it('matches pending and restored dependencies with platform path semantics', async () => {
    const manager = new PageAssetManager(context, {
      'restored.md': { dependencies: ['Images/Missing.png'], outputs: [] },
    })
    manager.setProcessors([
      {
        namespace: 'test',
        processPage(input) {
          input.dependOn('Images/Missing.png')
        },
      },
    ])
    const session = manager.session('pending.md')
    await session?.process(document())
    expect(manager.dependents('Images\\Missing.png')).toEqual([
      'restored.md',
      'pending.md',
    ])
    expect(manager.dependents('images/missing.png')).toEqual(
      process.platform === 'win32' ? ['restored.md', 'pending.md'] : [],
    )
    await session?.abort()
    expect(manager.dependents('Images/Missing.png')).toEqual(['restored.md'])
  })

  it('shares concurrent content-root resolution and refreshes it at the next build', async () => {
    const manager = new PageAssetManager(context)
    const realpath = vi.spyOn(fs, 'realpath')
    manager.setProcessors([
      {
        namespace: 'test',
        async processPage(input) {
          const image = input.document.querySelector('img')
          if (!image) throw new Error('Expected image')
          const sources = await Promise.all(
            ['photo.png', 'other.png'].map((url) =>
              input.resolveSource(image, url),
            ),
          )
          expect(
            sources.every((source) => source?.absPath.startsWith(root)),
          ).toBe(true)
        },
      },
    ])
    const processPage = async (name: string) => {
      const session = manager.session(name)
      await session?.process(document())
      await session?.abort()
    }
    await Promise.all([processPage('first.md'), processPage('second.md')])
    expect(
      realpath.mock.calls.filter(([value]) => value === root),
    ).toHaveLength(1)
    // Each source still gets its own canonical-path containment check.
    expect(
      realpath.mock.calls.filter(([value]) => value !== root),
    ).toHaveLength(4)
    manager.resetWrites()
    await processPage('third.md')
    expect(
      realpath.mock.calls.filter(([value]) => value === root),
    ).toHaveLength(2)
  })

  it('retries a failed root lookup instead of retaining a rejected promise', async () => {
    const manager = new PageAssetManager(context)
    const original = fs.realpath.bind(fs)
    vi.spyOn(fs, 'realpath')
      .mockRejectedValueOnce(new Error('Temporary root failure'))
      .mockImplementation(original)
    manager.setProcessors([
      {
        namespace: 'test',
        async processPage(input) {
          const image = input.document.querySelector('img')
          if (!image) throw new Error('Expected image')
          await input.resolveSource(image, 'photo.png')
        },
      },
    ])
    const first = manager.session('first.md')
    await expect(first?.process(document())).rejects.toThrow(
      'Temporary root failure',
    )
    await first?.abort()
    const second = manager.session('second.md')
    await expect(second?.process(document())).resolves.toBeUndefined()
    await second?.abort()
  })
})
