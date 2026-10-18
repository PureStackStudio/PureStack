import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { PageAssetInput, SiteAssets } from '@purestack/ts-common'
import { componentsPlugin } from '@purestack/ts-components'
import { h } from '@purestack/ts-html'
import { disableLogger, getLogger } from 'logpot'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createIncrementalBuilder } from '../build/incremental'
import { readManifest } from '../build/manifest'
import { type BuildInput, buildSite } from '../build/site'
import { makeRepoTempDir } from '../test/repoTempDir'
import type { PureStackPlugin } from './types'

describe('generic page assets', () => {
  let root: string | undefined
  beforeAll(() => disableLogger())
  afterAll(() => getLogger().close())
  afterEach(async () => {
    if (root) await fs.rm(root, { recursive: true, force: true })
  })
  async function fixture(process?: SiteAssets['processPage']) {
    root = await makeRepoTempDir('.tmp-page-assets-')
    const contentDir = path.join(root, 'content'),
      outDir = path.join(root, 'out')
    await fs.mkdir(contentDir)
    const processor: PureStackPlugin = {
      name: 'files',
      assets: () => ({
        namespace: 'files',
        processPage:
          process ??
          (async (input) => {
            for (const element of input.document.querySelectorAll(
              'a[data-asset]',
            )) {
              const source = await input.resolveSource(
                element,
                element.getAttribute('href') ?? '',
              )
              if (!source) continue
              const data = await fs.readFile(source.absPath)
              const url = await input.emit(
                `${createHash('sha256').update(data).digest('hex')}.txt`,
                data,
              )
              element.setAttribute('href', url)
            }
          }),
      }),
    }
    const input: BuildInput = {
      siteConfig: {
        rootDir: root,
        contentDir,
        outDir,
        navigation: { mode: 'none' },
        mdx: { disableHighlighter: true },
      },
      options: {
        defaultPlugins: false,
        plugins: [
          {
            name: 'layout',
            templates: {
              doc: ({ head, bodyHtml }) =>
                h('html').push(head, h('body').raw(bodyHtml)),
            },
          },
          processor,
        ],
      },
    }
    await fs.writeFile(
      path.join(contentDir, 'a.md'),
      '<a data-asset href="./source.txt">A</a>',
    )
    await fs.writeFile(
      path.join(contentDir, 'b.md'),
      '<a data-asset href="./source.txt">B</a>',
    )
    await fs.writeFile(path.join(contentDir, 'source.txt'), 'First')
    return { input, contentDir, outDir }
  }

  it('records dependencies, reuses shared output, rebuilds on asset edits, and prunes only after the final reference disappears', async () => {
    const { input, contentDir, outDir } = await fixture()
    const builder = await createIncrementalBuilder(input)
    await builder.buildAll('test')
    const first = await readManifest(outDir)
    expect(first?.pageAssets?.['a.md'].dependencies).toEqual(['source.txt'])
    const file = first?.pageAssets?.['a.md'].outputs[0].path
    if (!file) throw new Error('Expected owned output')
    expect(first?.pageAssets?.['b.md'].outputs[0].path).toBe(file)
    expect(await fs.readFile(path.join(outDir, file), 'utf8')).toBe('First')
    await fs.writeFile(path.join(contentDir, 'source.txt'), 'Second')
    expect(
      (await builder.applyChange(path.join(contentDir, 'source.txt')))
        .changedPages,
    ).toBe(2)
    const second = await readManifest(outDir)
    const next = second?.pageAssets?.['a.md'].outputs[0].path
    expect(next).not.toBe(file)
    await expect(fs.stat(path.join(outDir, file))).rejects.toMatchObject({
      code: 'ENOENT',
    })
    await fs.writeFile(path.join(contentDir, 'a.md'), '# No asset')
    await builder.applyChange(path.join(contentDir, 'a.md'))
    expect(await fs.readFile(path.join(outDir, next ?? ''), 'utf8')).toBe(
      'Second',
    )
    await fs.writeFile(path.join(contentDir, 'b.md'), '# No asset')
    await builder.applyChange(path.join(contentDir, 'b.md'))
    await expect(fs.stat(path.join(outDir, next ?? ''))).rejects.toMatchObject({
      code: 'ENOENT',
    })
    expect(await fs.readFile(path.join(outDir, 'source.txt'), 'utf8')).toBe(
      'Second',
    )
  })

  it('repairs same-size corrupted output instead of trusting its content-addressed filename', async () => {
    const { input, outDir } = await fixture()
    input.options = { ...input.options, cleanOutDir: false }
    await buildSite(input)
    const manifest = await readManifest(outDir)
    const file = manifest?.pageAssets?.['a.md'].outputs[0].path
    if (!file) throw new Error('Expected generated file')
    await fs.writeFile(path.join(outDir, file), 'Other')
    await buildSite(input)
    expect(await fs.readFile(path.join(outDir, file), 'utf8')).toBe('First')
  })

  it.skipIf(process.platform !== 'win32')(
    'recovers missing dependencies after a differently cased Windows watcher event',
    async () => {
      const { input, contentDir, outDir } = await fixture()
      input.options = { ...input.options, writeErrorPages: true }
      await fs.rm(path.join(contentDir, 'source.txt'))
      const builder = await createIncrementalBuilder(input)
      await builder.prepareForRequests()
      await builder.renderByUrlPath('/a/')
      expect(
        await fs.readFile(path.join(outDir, 'a', 'index.html'), 'utf8'),
      ).toContain('missing file')
      await fs.writeFile(path.join(contentDir, 'source.txt'), 'Recovered')
      await builder.applyChange(path.join(contentDir, 'SOURCE.TXT'))
      expect(
        await builder.renderIfDirtyByOutPath(
          path.join(outDir, 'a', 'index.html'),
        ),
      ).toBe(true)
      const manifest = await readManifest(outDir)
      const file = manifest?.pageAssets?.['a.md'].outputs[0].path
      if (!file) throw new Error('Expected generated output after recovery')
      expect(await fs.readFile(path.join(outDir, file), 'utf8')).toBe(
        'Recovered',
      )
    },
  )

  it('restores dependency tracking from a manifest and cleans up when its processor is removed', async () => {
    const { input, contentDir, outDir } = await fixture()
    await fs.mkdir(path.join(contentDir, 'nested'))
    await fs.rm(path.join(contentDir, 'a.md'))
    await fs.writeFile(
      path.join(contentDir, 'nested', 'a.md'),
      '<a data-asset href="../source.txt">A</a>',
    )
    await buildSite(input)
    const manifest = await readManifest(outDir)
    const file =
      manifest?.pageAssets?.[path.join('nested', 'a.md')]?.outputs[0].path
    if (!file) throw new Error('Expected output')
    const resumed = await createIncrementalBuilder(input)
    await fs.writeFile(path.join(contentDir, 'source.txt'), 'New bytes')
    expect(
      (await resumed.applyChange(path.join(contentDir, 'source.txt')))
        .changedPages,
    ).toBe(2)
    const refreshed = await readManifest(outDir)
    const next =
      refreshed?.pageAssets?.[path.join('nested', 'a.md')]?.outputs[0].path
    const plugins = input.options?.plugins?.filter(
      (plugin) => plugin.name !== 'files',
    )
    await buildSite({ ...input, options: { defaultPlugins: false, plugins } })
    await expect(fs.stat(path.join(outDir, next ?? ''))).rejects.toMatchObject({
      code: 'ENOENT',
    })
    expect((await readManifest(outDir))?.pageAssets).toBeUndefined()
  })

  it('does not prune a shared file already emitted by an uncommitted concurrent page', async () => {
    let release: (() => void) | undefined, began: (() => void) | undefined
    const barrier = new Promise<void>((resolve) => {
      release = resolve
    })
    const started = new Promise<void>((resolve) => {
      began = resolve
    })
    const { input, contentDir, outDir } = await fixture(async (input) => {
      const element = input.document.querySelector('a')
      if (!element) return
      await input.resolveSource(element, element.getAttribute('href') ?? '')
      element.setAttribute(
        'href',
        await input.emit('shared.txt', Buffer.from('Shared')),
      )
      if (input.sourceRelPath === 'c.md') {
        began?.()
        await barrier
      }
    })
    await fs.writeFile(path.join(contentDir, 'b.md'), '# No asset')
    await fs.writeFile(path.join(contentDir, 'c.md'), '# Not rendered yet')
    const builder = await createIncrementalBuilder(input)
    await builder.buildAll('shared asset')
    await builder.prepareForRequests()
    await fs.writeFile(
      path.join(contentDir, 'c.md'),
      '<a href="./source.txt">C</a>',
    )
    await builder.applyChange(path.join(contentDir, 'c.md'))
    const pending = builder.renderByUrlPath('/c/')
    await started
    await fs.writeFile(path.join(contentDir, 'a.md'), '# Removed reference')
    await builder.applyChange(path.join(contentDir, 'a.md'))
    await builder.renderByUrlPath('/a/')
    expect(
      await fs.readFile(
        path.join(outDir, '_assets', 'files', 'shared.txt'),
        'utf8',
      ),
    ).toBe('Shared')
    release?.()
    expect(await pending).toBe(true)
    expect(
      (await readManifest(outDir))?.pageAssets?.['c.md'].outputs[0].path,
    ).toBe('_assets/files/shared.txt')
  })

  it('keeps generated files leased to concurrent renders and marks an in-flight dependent dirty', async () => {
    let release: (() => void) | undefined
    const pending = new Promise<void>((resolve) => {
      release = resolve
    })
    let began: (() => void) | undefined
    const started = new Promise<void>((resolve) => {
      began = resolve
    })
    const { input, contentDir } = await fixture(async (input) => {
      const element = input.document.querySelector('a')
      if (!element) return
      await input.resolveSource(element, './source.txt')
      began?.()
      await pending
      element.setAttribute(
        'href',
        await input.emit('shared.txt', Buffer.from('Shared')),
      )
    })
    const builder = await createIncrementalBuilder(input)
    await builder.prepareForRequests()
    const rendering = builder.renderByUrlPath('/a/')
    await started
    await fs.writeFile(
      path.join(contentDir, 'source.txt'),
      'Changed during render',
    )
    const changed = await builder.applyChange(
      path.join(contentDir, 'source.txt'),
    )
    expect(changed.markedPages).toBeGreaterThan(0)
    release?.()
    expect(await rendering).toBe(true)
    expect(
      await builder.renderIfDirtyByOutPath(
        path.join(input.siteConfig?.outDir ?? '', 'a', 'index.html'),
      ),
    ).toBe(true)
  })

  it.each(['../outside.txt', '/absolute.txt', 'folder/../../outside.txt'])(
    'rejects escaping output names (%s)',
    async (name) => {
      const { input } = await fixture(async (input) => {
        await input.emit(name, Buffer.from('No'))
      })
      await expect(buildSite(input)).rejects.toThrow(
        /Plugin "files" failed in assets.processPage.*relative file path/,
      )
    },
  )

  it('rejects conflicting bytes and attributes processor errors', async () => {
    const { input } = await fixture(async (input) => {
      await input.emit('fixed.txt', Buffer.from('One'))
      await input.emit('fixed.txt', Buffer.from('Two'))
    })
    await expect(buildSite(input)).rejects.toThrow(
      /Plugin "files" failed in assets.processPage.*different contents/,
    )
  })

  it('releases outputs from an error page while retaining its recovery dependencies', async () => {
    const { input, outDir } = await fixture(async (input) => {
      input.dependOn('source.txt')
      await input.emit('unused.txt', Buffer.from('Unused'))
      throw new Error('Cannot render')
    })
    input.options = { ...input.options, writeErrorPages: true }
    await buildSite(input)
    await expect(
      fs.stat(path.join(outDir, '_assets', 'files', 'unused.txt')),
    ).rejects.toMatchObject({ code: 'ENOENT' })
    expect((await readManifest(outDir))?.pageAssets?.['a.md']).toEqual({
      dependencies: ['source.txt'],
      outputs: [],
    })
  })

  it('releases generated files when a written-page hook fails and retains recovery dependencies', async () => {
    const { input, outDir } = await fixture()
    input.options = {
      ...input.options,
      writeErrorPages: true,
      plugins: [
        ...(input.options?.plugins ?? []),
        {
          name: 'fail-after-write',
          hooks: {
            onPageWritten() {
              throw new Error('Written hook failed')
            },
          },
        },
      ],
    }
    await buildSite(input)
    const state = (await readManifest(outDir))?.pageAssets?.['a.md']
    expect(state).toEqual({ dependencies: ['source.txt'], outputs: [] })
    expect(await fs.readdir(path.join(outDir, '_assets', 'files'))).toEqual([])
    expect(
      await fs.readFile(path.join(outDir, 'a', 'index.html'), 'utf8'),
    ).toContain('Written hook failed')
  })

  it('encodes emitted URLs and preserves a conflicting source output', async () => {
    const { input, contentDir, outDir } = await fixture(async (input) => {
      const element = input.document.querySelector('a')
      element?.setAttribute(
        'href',
        await input.emit('a #.txt', Buffer.from('Generated')),
      )
    })
    await buildSite(input)
    expect(
      await fs.readFile(path.join(outDir, 'a', 'index.html'), 'utf8'),
    ).toContain('/_assets/files/a%20%23.txt')
    await fs.mkdir(path.join(contentDir, '_assets', 'files'), {
      recursive: true,
    })
    await fs.writeFile(
      path.join(contentDir, '_assets', 'files', 'a #.txt'),
      'Source',
    )
    await expect(buildSite(input)).rejects.toThrow(
      /conflicts with (?:a source output|a generated asset)/,
    )
    expect(
      await fs.readFile(
        path.join(contentDir, '_assets', 'files', 'a #.txt'),
        'utf8',
      ),
    ).toBe('Source')
  })

  it.each([false, true])(
    'reserves actual script outputs including mixed-case extensions (cache busting: %s)',
    async (cacheBusting) => {
      let scriptUrl: string | undefined
      const { input, contentDir } = await fixture(async (input) => {
        if (!scriptUrl) throw new Error('Expected script URL')
        await input.emit(
          scriptUrl.replace('/_assets/files/', ''),
          Buffer.from('Generated'),
        )
      })
      input.siteConfig = { ...input.siteConfig, scripts: { cacheBusting } }
      input.options?.plugins?.push(componentsPlugin(), {
        name: 'observe-script',
        hooks: {
          onPageDocument(_context, { document }) {
            scriptUrl =
              document.querySelector('script[src]')?.getAttribute('src') ??
              undefined
          },
        },
      })
      await fs.writeFile(
        path.join(contentDir, 'a.md'),
        '<PageScript src="./_assets/files/script.tS"/>',
      )
      await fs.mkdir(path.join(contentDir, '_assets', 'files'), {
        recursive: true,
      })
      await fs.writeFile(
        path.join(contentDir, '_assets', 'files', 'script.tS'),
        'export const value = 1',
      )
      await expect(buildSite(input)).rejects.toThrow(
        'conflicts with a source output',
      )
    },
  )

  it('rejects a script reservation that conflicts with an already emitted output', async () => {
    const { input, contentDir, outDir } = await fixture(async (input) => {
      if (input.sourceRelPath === 'a.md')
        await input.emit('script.js', Buffer.from('Generated'))
    })
    input.siteConfig = { ...input.siteConfig, scripts: { cacheBusting: false } }
    input.options?.plugins?.push(componentsPlugin())
    await fs.mkdir(path.join(contentDir, '_assets', 'files'), {
      recursive: true,
    })
    await fs.writeFile(
      path.join(contentDir, '_assets', 'files', 'script.ts'),
      'export const value = 1',
    )
    await fs.writeFile(
      path.join(contentDir, 'b.md'),
      '<PageScript src="./_assets/files/script.ts"/>',
    )
    await expect(buildSite(input)).rejects.toThrow(
      'conflicts with a generated asset',
    )
    expect(
      await fs.readFile(
        path.join(outDir, '_assets', 'files', 'script.js'),
        'utf8',
      ),
    ).toBe('Generated')
  })

  it('keeps asset bookkeeping out of hook contexts and rendered results', async () => {
    const { input } = await fixture()
    let calls = 0
    input.options?.plugins?.push({
      name: 'public-context',
      hooks: {
        onPageRendered(context, page) {
          calls++
          expect(context).not.toHaveProperty('assets')
          expect(context).not.toHaveProperty('assetProcessors')
          expect(page).not.toHaveProperty('assetReceipt')
        },
      },
    })
    await buildSite(input)
    expect(calls).toBe(2)
  })

  it('expires input handles after each page call', async () => {
    let captured: PageAssetInput | undefined
    const { input, outDir } = await fixture(async (value) => {
      captured = value
      await value.emit('valid.txt', Buffer.from('Valid'))
    })
    await buildSite(input)
    if (!captured) throw new Error('Expected asset input')
    expect(() => captured?.dependOn('late.txt')).toThrow('input is closed')
    expect(() => captured?.emit('late.txt', Buffer.from('Late'))).toThrow(
      'input is closed',
    )
    await expect(
      fs.stat(path.join(outDir, '_assets', 'files', 'late.txt')),
    ).rejects.toMatchObject({ code: 'ENOENT' })
  })

  it('waits for detached emission before aborting and removes its output', async () => {
    const { input, outDir } = await fixture((value) => {
      void value.emit('detached.txt', Buffer.from('Detached'))
    })
    await expect(buildSite(input)).rejects.toThrow(
      'must await all source resolution and emission work',
    )
    await expect(
      fs.stat(path.join(outDir, '_assets', 'files', 'detached.txt')),
    ).rejects.toMatchObject({ code: 'ENOENT' })
  })

  it('runs processors in order without implicitly treating generated outputs as content inputs', async () => {
    const order: string[] = []
    const { input } = await fixture(async (value) => {
      order.push(`first:${value.sourceRelPath}`)
      const element = value.document.querySelector('a')
      element?.setAttribute(
        'href',
        await value.emit('shared.txt', Buffer.from('Shared')),
      )
    })
    input.options?.plugins?.push({
      name: 'second',
      assets: () => ({
        namespace: 'second',
        async processPage(value) {
          order.push(`second:${value.sourceRelPath}`)
          const element = value.document.querySelector('a')
          if (!element) throw new Error('Expected link')
          expect(
            await value.resolveSource(
              element,
              element.getAttribute('href') ?? '',
            ),
          ).toBeUndefined()
        },
      }),
    })
    await buildSite(input)
    expect(order).toEqual([
      'first:a.md',
      'second:a.md',
      'first:b.md',
      'second:b.md',
    ])
  })

  it.each([
    { namespace: '../escape', processPage: () => {} },
    { namespace: 'valid' },
  ])('rejects invalid processor contracts (%j)', async (processor) => {
    const { input } = await fixture()
    input.options?.plugins?.push({
      name: 'invalid',
      assets: () => processor as SiteAssets,
    })
    await expect(buildSite(input)).rejects.toThrow(
      /Plugin "invalid" failed in assets.*namespace and processPage/,
    )
  })

  it('rejects duplicate namespaces before rendering', async () => {
    const { input } = await fixture()
    input.options?.plugins?.push({
      name: 'other',
      assets: () => ({ namespace: 'files', processPage: () => {} }),
    })
    await expect(buildSite(input)).rejects.toThrow(
      /namespace "files".*plugin "files"/,
    )
  })

  it('ignores unsafe ownership paths from a manifest without deleting external files', async () => {
    const { input, contentDir, outDir } = await fixture()
    await buildSite(input)
    const outside = path.join(contentDir, 'important.txt')
    await fs.writeFile(outside, 'Keep')
    const manifest = await readManifest(outDir)
    if (!manifest) throw new Error('Expected manifest')
    manifest.pageAssets = {
      'gone.md': {
        dependencies: [],
        outputs: [{ namespace: 'files', path: '../content/important.txt' }],
      },
    }
    await fs.writeFile(
      path.join(outDir, '.ts-ssg', 'manifest.json'),
      JSON.stringify(manifest),
    )
    await buildSite(input)
    expect(await fs.readFile(outside, 'utf8')).toBe('Keep')
  })
})
