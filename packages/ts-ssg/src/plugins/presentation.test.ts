import fs from 'node:fs/promises'
import path from 'node:path'
import type { SiteConfig, SiteConfigInput } from '@purestack/ts-common'
import { h } from '@purestack/ts-html'
import { runInDom } from '@purestack/ts-minidom'
import { disableLogger, getLogger } from 'logpot'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createIncrementalBuilder } from '../build/incremental'
import { buildSite } from '../build/site'
import { makeRepoTempDir } from '../test/repoTempDir'
import { createDefaultPlugins } from './default-plugins'
import type { PureStackPlugin } from './plugin'

describe('presentation integrations', () => {
  let root: string | undefined
  beforeAll(() => disableLogger())
  afterAll(async () => getLogger().close())
  afterEach(async () => {
    if (root) await fs.rm(root, { recursive: true, force: true })
    root = undefined
  })
  async function project(source = '# Home') {
    root = await makeRepoTempDir('.tmp-presentation-')
    const contentDir = path.join(root, 'content')
    await fs.mkdir(contentDir)
    await fs.writeFile(path.join(contentDir, 'index.md'), source)
    return {
      rootDir: root,
      contentDir,
      outDir: path.join(root, 'out'),
      mdx: { disableHighlighter: true },
    }
  }
  const without = (...names: string[]) =>
    createDefaultPlugins().filter((plugin) => !names.includes(plugin.name))

  it.each([true, false])(
    'wraps tables introduced by later transforms, in both Markdown modes (%s)',
    async (compileMdAsMdx) => {
      const siteConfig = await project('| Heading |\n| --- |\n| Cell |')
      const extension: PureStackPlugin = {
        name: 'insert-table',
        markdown: {
          rehypePlugins: [
            () => (tree: { children: unknown[] }) => {
              tree.children.push({
                type: 'element',
                tagName: 'table',
                properties: { id: 'custom-table' },
                children: [],
              })
            },
          ],
        },
      }
      await buildSite({
        siteConfig: {
          ...siteConfig,
          mdx: { ...siteConfig.mdx, compileMdAsMdx },
        },
        options: { plugins: [extension] },
      })
      const output = await fs.readFile(
        path.join(siteConfig.outDir, 'index.html'),
        'utf8',
      )
      await runInDom(output, (document) => {
        expect(
          document.querySelector('#custom-table')?.parentElement?.className,
        ).toBe('table-scroll')
        expect(document.querySelectorAll('.table-scroll')).toHaveLength(2)
      })
    },
  )

  it('leaves tables unstyled and automatic social metadata absent when their plugins are omitted', async () => {
    const siteConfig = await project(
      '---\nindex: false\n---\n# Home\n\n| Heading |\n| --- |\n| Cell |',
    )
    await buildSite({
      siteConfig: { ...siteConfig, preview: { image: '/social.png' } },
      options: {
        defaultPlugins: false,
        plugins: [
          {
            name: 'plain',
            templates: {
              doc: ({ head, bodyHtml }) =>
                h('html').push(head, h('body').raw(bodyHtml)),
            },
          },
        ],
      },
    })
    const output = await fs.readFile(
      path.join(siteConfig.outDir, 'index.html'),
      'utf8',
    )
    expect(output).toContain('<table>')
    expect(output).not.toContain('table-scroll')
    expect(output).not.toContain('og:')
    expect(output).not.toContain('twitter:')
    expect(output).toContain('name="robots" content="noindex"')
  })

  it('preserves generated metadata, explicit head overrides, and template access to the completed head', async () => {
    const siteConfig = await project(
      '---\ntitle: Home\nhead:\n  openGraph:\n    title: Explicit title\n  canonicalUrl: https://explicit.example/home/\n---\n# Home',
    )
    let observed = false
    await buildSite({
      siteConfig: {
        ...siteConfig,
        basePath: '/docs',
        sitemap: { baseUrl: 'https://example.com' },
        preview: { image: '/social.png', imageWidth: 1200 },
      },
      options: {
        plugins: [
          {
            name: 'inspect',
            templates: {
              doc: (input) => {
                expect(input.headConfig?.openGraph).toMatchObject({
                  title: 'Explicit title',
                  image: 'https://example.com/docs/social.png',
                  imageWidth: 1200,
                })
                expect(input.headConfig?.canonicalUrl).toBe(
                  'https://explicit.example/home/',
                )
                expect(input.head.toHtml()).toContain(
                  'property="og:title" content="Explicit title"',
                )
                observed = true
                return h('html').push(input.head, h('body').raw(input.bodyHtml))
              },
            },
          },
        ],
      },
    })
    expect(observed).toBe(true)
  })

  it('keeps auth, consent, and analytics independently optional', async () => {
    const base = await project()
    const siteConfig: SiteConfigInput = {
      ...base,
      auth: { enabled: true },
      consent: { enabled: true },
      analytics: { ga4: { measurementId: 'G-TEST1234' } },
    }
    for (const omitted of [
      'purestack:auth-state-hint',
      'purestack:consent',
      'purestack:analytics',
    ]) {
      let config: SiteConfig | undefined
      await buildSite({
        siteConfig,
        options: {
          defaultPlugins: false,
          plugins: [
            ...without(omitted),
            {
              name: 'inspect',
              hooks: {
                onConfigResolved(context) {
                  config = context.config
                },
              },
            },
          ],
        },
      })
      const output = await fs.readFile(
        path.join(base.outDir, 'index.html'),
        'utf8',
      )
      expect(output.includes('signedInStorageKey')).toBe(
        omitted !== 'purestack:auth-state-hint',
      )
      expect(output.includes('var consentConfig=')).toBe(
        omitted !== 'purestack:consent',
      )
      expect(
        config?.consent?.services.some(
          (service) => service.ga4MeasurementId === 'G-TEST1234',
        ),
      ).toBe(omitted !== 'purestack:analytics')
      await runInDom(output, (document) => {
        expect(
          document.head.querySelector('script[src*="googletagmanager"]'),
        ).toBeNull()
      })
      if (omitted === 'purestack:analytics')
        expect(output).not.toContain('G-TEST1234')
    }
  })

  it('keeps automatic analytics registration idempotent and honors user-defined services', async () => {
    const siteConfig = await project()
    const builder = await createIncrementalBuilder({
      siteConfig: {
        ...siteConfig,
        consent: { enabled: true },
        analytics: { ga4: { measurementId: 'G-TEST1234' } },
      },
      options: {
        plugins: [
          {
            name: 'inspect',
            hooks: {
              onConfigResolved({ config }) {
                expect(
                  config.consent?.services.filter(
                    (service) => service.id === 'ga4',
                  ),
                ).toHaveLength(1)
              },
            },
          },
        ],
      },
    })
    await builder.buildAll('first')
    await builder.buildAll('second')
    await buildSite({
      siteConfig: {
        ...siteConfig,
        consent: {
          enabled: true,
          services: [
            {
              id: 'ga4',
              category: 'necessary',
              scripts: [{ content: 'window.manualAnalytics = true' }],
            },
          ],
        },
        analytics: {
          ga4: { measurementId: 'G-TEST1234', consentCategory: 'absent' },
        },
      },
      options: {
        plugins: [
          {
            name: 'inspect',
            hooks: {
              onConfigResolved({ config }) {
                expect(config.consent?.services).toHaveLength(1)
                expect(config.consent?.services[0].scripts[0].content).toBe(
                  'window.manualAnalytics = true',
                )
              },
            },
          },
        ],
      },
    })
  })
})
