import fs from 'node:fs/promises'
import path from 'node:path'
import { h } from '@purestack/ts-html'
import { PersistentCache } from '@purestack/ts-util-node'
import { disableLogger, getLogger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createIncrementalBuilder } from '../build/incremental'
import { resolveMdxBuildOptions } from '../build/incremental/support'
import { buildSite } from '../build/site'
import { makeRepoTempDir } from '../test/repoTempDir'
import type { PureStackPlugin } from './plugin'

describe('highlighter flush lifecycle', () => {
  beforeAll(() => disableLogger())
  afterAll(() => getLogger().close())

  it('persists after full builds, lazy pages, and change batches through resolver composition', async () => {
    const root = await makeRepoTempDir('.tmp-highlighter-flush-')
    try {
      const contentDir = path.join(root, 'content'),
        outDir = path.join(root, 'out')
      const cacheOptions = {
        directory: root,
        namespace: 'highlight',
        version: '1',
        flushIntervalMs: 0,
      }
      await fs.mkdir(contentDir)
      const source = (value: string) =>
        `# Page\n\n\x60\x60\x60ts\n${value}\n\x60\x60\x60\n`
      const first = path.join(contentDir, 'index.md')
      const second = path.join(contentDir, 'two.md')
      await fs.writeFile(first, source('first'))
      await fs.writeFile(second, source('second'))
      let flushes = 0
      const writes: number[] = []
      const plugins: PureStackPlugin[] = [
        {
          name: 'buffered-highlighter',
          templates: {
            doc: ({ head, bodyHtml }) =>
              h('html').push(head, h('body').raw(bodyHtml)),
          },
          markdown: {
            createHighlighter({ cache: enabled }) {
              const cache = new PersistentCache<string>({
                ...cacheOptions,
                enabled,
              })
              return {
                codeToHtml: (code) =>
                  cache.getOrSetAsync(
                    code,
                    async () => `<pre><code>${code}</code></pre>`,
                  ),
                async flush() {
                  await cache.flush()
                  flushes++
                },
              }
            },
          },
          hooks: {
            onPageWritten() {
              writes.push(flushes)
            },
          },
        },
        { name: 'resolver', markdown: { resolveHighlighter: () => null } },
      ]
      const input = {
        siteConfig: { rootDir: root, contentDir, outDir },
        options: { defaultPlugins: false, plugins },
      }
      await buildSite(input)
      expect(writes).toEqual([0, 0])
      expect(flushes).toBe(1)
      expect(
        await new PersistentCache<string>(cacheOptions).get('first'),
      ).toContain('first')
      expect(
        await new PersistentCache<string>(cacheOptions).get('second'),
      ).toContain('second')

      const builder = await createIncrementalBuilder(input)
      await builder.prepareForRequests()
      await fs.writeFile(first, source('lazy'))
      await builder.applyChange(first)
      expect(await builder.renderByUrlPath('/')).toBe(true)
      expect(
        await new PersistentCache<string>(cacheOptions).get('lazy'),
      ).toContain('lazy')

      await fs.writeFile(first, source('changed-one'))
      await fs.writeFile(second, source('changed-two'))
      await builder.applyChanges([first, second])
      await builder.renderByUrlPath('/')
      await builder.renderByUrlPath('/two/')
      expect(
        await new PersistentCache<string>(cacheOptions).get('changed-one'),
      ).toContain('changed-one')
      expect(
        await new PersistentCache<string>(cacheOptions).get('changed-two'),
      ).toContain('changed-two')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('flushes after failure and preserves the render error if flushing also fails', async () => {
    const root = await makeRepoTempDir('.tmp-highlighter-failure-')
    try {
      const contentDir = path.join(root, 'content')
      await fs.mkdir(contentDir)
      await fs.writeFile(
        path.join(contentDir, 'index.md'),
        '# Page\n\n```ts\nfail\n```\n',
      )
      let flushes = 0
      await expect(
        buildSite({
          siteConfig: {
            rootDir: root,
            contentDir,
            outDir: path.join(root, 'out'),
          },
          options: {
            defaultPlugins: false,
            plugins: [
              {
                name: 'broken',
                markdown: {
                  createHighlighter: () => ({
                    codeToHtml() {
                      throw new Error('render failed')
                    },
                    flush() {
                      flushes++
                      throw new Error('flush failed')
                    },
                  }),
                },
              },
            ],
          },
        }),
      ).rejects.toThrow('render failed')
      expect(flushes).toBe(1)
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('validates flush methods and attributes failures to the highlighter provider', async () => {
    await expect(
      resolveMdxBuildOptions({}, [
        {
          name: 'invalid',
          markdown: {
            createHighlighter: () =>
              ({ codeToHtml: () => '', flush: 42 }) as never,
          },
        },
      ]),
    ).rejects.toThrow('must return a code highlighter')
    const options = await resolveMdxBuildOptions({}, [
      {
        name: 'broken',
        markdown: {
          createHighlighter: () => ({
            codeToHtml: () => '',
            async flush() {
              throw new Error('write failed')
            },
          }),
          resolveHighlighter: () => null,
        },
      },
    ])
    await expect(options.highlighter?.flush?.()).rejects.toThrow(
      'Plugin "broken" failed in markdown.createHighlighter.flush: write failed',
    )
  })
})
