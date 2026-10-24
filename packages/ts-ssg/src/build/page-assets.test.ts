import fs from 'node:fs/promises'
import path from 'node:path'
import type { SiteAssets } from '@purestack/ts-common'
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

  async function processAssets(
    manager: PageAssetManager,
    processPage: SiteAssets['processPage'],
  ) {
    manager.setProcessors([{ namespace: 'test', processPage }])
    const session = manager.session('page.md')
    if (!session) throw new Error('Expected asset session')
    await session.process(document())
    return session
  }

  const bytes = Buffer.from('First')
  const output = (context: BuildContext) =>
    path.join(context.config.outDir, 'assets', 'test', 'shared.txt')
  async function seed(value = bytes) {
    const file = output(context)
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, value)
    return file
  }

  it('verifies unchanged warm output once per build across repeated pages', async () => {
    const file = await seed()
    const read = vi.spyOn(fs, 'readFile')
    const rename = vi.spyOn(fs, 'rename')
    const manager = new PageAssetManager(context)
    for (let page = 0; page < 3; page++)
      await processAssets(manager, async (input) => {
        await input.emit('shared.txt', bytes)
        await input.emit('shared.txt', bytes)
      })
    expect(read.mock.calls.filter(([value]) => value === file)).toHaveLength(1)
    expect(rename).not.toHaveBeenCalled()
    manager.resetWrites()
    await processAssets(manager, (input) =>
      input.emit('shared.txt', bytes).then(() => {}),
    )
    expect(read.mock.calls.filter(([value]) => value === file)).toHaveLength(2)
  })

  it('replaces different-sized output without reading its obsolete contents', async () => {
    const file = await seed(Buffer.from('Outdated larger contents'))
    const readFile = fs.readFile.bind(fs)
    const read = vi.spyOn(fs, 'readFile')
    await processAssets(new PageAssetManager(context), async (input) => {
      await input.emit('shared.txt', bytes)
    })
    expect(read).not.toHaveBeenCalled()
    expect(await readFile(file)).toEqual(bytes)
  })

  it.each(['ino', 'ctimeNs'] as const)(
    'keeps hashing when the filesystem does not expose %s',
    async (field) => {
      const file = await seed()
      const lstat = fs.lstat.bind(fs)
      vi.spyOn(fs, 'lstat').mockImplementation(
        async (...args: Parameters<typeof fs.lstat>) => {
          const stat = await lstat(...args)
          if (args[0] === file)
            Object.defineProperty(stat, field, { value: 0n })
          return stat
        },
      )
      const read = vi.spyOn(fs, 'readFile')
      await processAssets(new PageAssetManager(context), async (input) => {
        await input.emit('shared.txt', bytes)
        await input.emit('shared.txt', bytes)
      })
      expect(read.mock.calls.filter(([value]) => value === file)).toHaveLength(
        2,
      )
    },
  )

  it('reuses newly written output after successful atomic publication', async () => {
    const readFile = fs.readFile.bind(fs)
    const read = vi.spyOn(fs, 'readFile')
    const rename = vi.spyOn(fs, 'rename')
    await processAssets(new PageAssetManager(context), async (input) => {
      await input.emit('shared.txt', bytes)
      await input.emit('shared.txt', bytes)
    })
    expect(read).not.toHaveBeenCalled()
    expect(rename).toHaveBeenCalledTimes(1)
    expect(await readFile(output(context))).toEqual(bytes)
  })

  it('repairs output changed while its original bytes are being verified', async () => {
    const file = await seed()
    const readFile = fs.readFile.bind(fs)
    vi.spyOn(fs, 'readFile').mockImplementationOnce(
      async (...args: Parameters<typeof fs.readFile>) => {
        const original = await readFile(...args)
        await fs.writeFile(file, 'Other')
        await fs.utimes(file, 1_700_000_000, 1_700_000_000)
        return original
      },
    )
    await processAssets(new PageAssetManager(context), async (input) => {
      await input.emit('shared.txt', bytes)
    })
    expect(await readFile(file)).toEqual(bytes)
  })

  it.each(['rewrite', 'replace', 'delete'] as const)(
    'invalidates confirmed output after external %s',
    async (change) => {
      const file = await seed()
      const timestamp = 1_700_000_000
      await fs.utimes(file, timestamp, timestamp)
      const manager = new PageAssetManager(context)
      const emit = () =>
        processAssets(manager, async (input) => {
          await input.emit('shared.txt', bytes)
        })
      await emit()
      if (change === 'delete') await fs.rm(file)
      else if (change === 'rewrite') {
        const before = await fs.stat(file, { bigint: true })
        await fs.writeFile(file, 'Other')
        // Restoring mtime must not hide same-sized corruption: ctime also matters.
        // Windows may report one ctime for several operations in the same clock
        // tick. Establish an observable change without a fixed timing delay.
        let changed = false
        for (let attempt = 0; attempt < 100; attempt++) {
          await fs.utimes(file, timestamp, timestamp)
          if (
            (await fs.stat(file, { bigint: true })).ctimeNs !== before.ctimeNs
          ) {
            changed = true
            break
          }
        }
        expect(changed).toBe(true)
      } else {
        const replacement = path.join(root, 'replacement.txt')
        await fs.writeFile(replacement, 'Other')
        await fs.utimes(replacement, timestamp, timestamp)
        await fs.rename(replacement, file)
      }
      await emit()
      expect(await fs.readFile(file)).toEqual(bytes)
    },
  )

  it('does not confirm a failed write and can retry it without weakening hash verification', async () => {
    const file = await seed(Buffer.from('Other'))
    const readFile = fs.readFile.bind(fs)
    const read = vi.spyOn(fs, 'readFile')
    const rename = fs.rename.bind(fs)
    vi.spyOn(fs, 'rename')
      .mockRejectedValueOnce(new Error('Write interrupted'))
      .mockImplementation(rename)
    await processAssets(new PageAssetManager(context), async (input) => {
      await expect(input.emit('shared.txt', bytes)).rejects.toThrow(
        'Write interrupted',
      )
      await input.emit('shared.txt', bytes)
    })
    expect(read.mock.calls.filter(([value]) => value === file)).toHaveLength(2)
    expect(await readFile(file)).toEqual(bytes)
    expect(await fs.readdir(path.dirname(file))).toEqual(['shared.txt'])
  })

  it('coalesces concurrent emissions and forgets verification and collision reservations after pruning', async () => {
    const manager = new PageAssetManager(context)
    const rename = vi.spyOn(fs, 'rename')
    const first = await processAssets(manager, async (input) => {
      await Promise.all(
        Array.from({ length: 4 }, () => input.emit('shared.txt', bytes)),
      )
    })
    expect(rename).toHaveBeenCalledTimes(1)
    await first.abort()
    await expect(fs.stat(output(context))).rejects.toMatchObject({
      code: 'ENOENT',
    })
    await processAssets(manager, async (input) => {
      await input.emit('shared.txt', Buffer.from('Other'))
    })
    expect(await fs.readFile(output(context), 'utf8')).toBe('Other')
  })

  it('queues confirmed emissions behind an in-progress prune and restores the new page output', async () => {
    const manager = new PageAssetManager(context)
    const first = await processAssets(manager, async (input) => {
      await input.emit('shared.txt', bytes)
    })
    let release!: () => void
    let began!: () => void
    const barrier = new Promise<void>((resolve) => {
      release = resolve
    })
    const started = new Promise<void>((resolve) => {
      began = resolve
    })
    const rm = fs.rm.bind(fs)
    vi.spyOn(fs, 'rm').mockImplementation(async (file, options) => {
      if (file === output(context)) {
        began()
        await barrier
      }
      return rm(file, options)
    })
    const pruning = first.abort()
    await started
    let emitted = false
    const second = processAssets(manager, async (input) => {
      await input.emit('shared.txt', bytes)
      emitted = true
    })
    try {
      await Promise.resolve()
      expect(emitted).toBe(false)
    } finally {
      release()
    }
    await Promise.all([pruning, second])
    expect(await fs.readFile(output(context))).toEqual(bytes)
  })

  it('rechecks ancestor symlinks even for already confirmed output', async () => {
    const manager = new PageAssetManager(context)
    await processAssets(manager, async (input) => {
      await input.emit('shared.txt', bytes)
    })
    const directory = path.dirname(output(context))
    const protectedDirectory = path.join(root, 'protected')
    await fs.rename(directory, protectedDirectory)
    await fs.symlink(
      protectedDirectory,
      directory,
      process.platform === 'win32' ? 'junction' : 'dir',
    )
    await expect(
      processAssets(manager, async (input) => {
        await input.emit('shared.txt', bytes)
      }),
    ).rejects.toThrow('contains a symlink')
    expect(
      await fs.readFile(path.join(protectedDirectory, 'shared.txt')),
    ).toEqual(bytes)
  })
})
