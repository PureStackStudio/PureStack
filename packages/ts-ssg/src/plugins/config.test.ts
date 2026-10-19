import fs from 'node:fs/promises'
import path from 'node:path'
import { h } from '@purestack/ts-html'
import { imagesPlugin } from '@purestack/ts-images'
import { analyticsPlugin } from '@purestack/ts-page-scripts'
import { disableLogger, getLogger } from 'logpot'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { resolveBuildSiteConfig } from '../build/build-config'
import { type BuildInput, buildSite } from '../build/site'
import { resolveSiteConfig } from '../config/config'
import { makeRepoTempDir } from '../test/repoTempDir'
import { resolveBuildPlugins } from './default-plugins'
import type { PureStackPlugin } from './plugin'

declare module '@purestack/ts-common' {
  interface SiteExtensions {
    brand?: { text: string }
  }
}

function resolveTestConfig(input: BuildInput) {
  return resolveBuildSiteConfig(input, resolveBuildPlugins(input.options))
}

describe('plugin configuration', () => {
  it('exposes partial plugin input during resolution and normalized settings during finalization', () => {
    const observations: unknown[] = []
    resolveSiteConfig(
      { extensions: { images: { widths: [64] } } },
      {
        defaultPlugins: false,
        plugins: [
          imagesPlugin(),
          {
            name: 'phase-observer',
            config: {
              resolve({ config }) {
                observations.push(config.extensions.images?.quality)
                return {}
              },
              normalize({ config }) {
                // This normalizer follows the image owner's normalizer.
                observations.push(config.extensions.images?.quality?.webp)
                return {}
              },
              finalize({ config }) {
                observations.push(config.extensions.images?.presets.hero.widths)
                return {}
              },
            },
          },
        ],
      },
    )
    expect(observations).toEqual([undefined, 80, [960, 1440, 1920]])
  })
  let root: string | undefined
  beforeAll(() => disableLogger())
  afterAll(async () => getLogger().close())
  afterEach(async () => {
    if (root) await fs.rm(root, { recursive: true, force: true })
  })

  it('lets an ordinary provider own a custom backend identifier with defaults installed', async () => {
    root = await makeRepoTempDir('.tmp-plugin-backend-')
    const contentDir = path.join(root, 'content'),
      outDir = path.join(root, 'out')
    await fs.mkdir(contentDir)
    await fs.writeFile(
      path.join(contentDir, 'index.md'),
      '```ts\nconst answer = 42\n```',
    )
    let calls = 0
    await buildSite({
      siteConfig: {
        rootDir: root,
        contentDir,
        outDir,
        pagefind: { enabled: false },
        mdx: { highlighter: 'custom-engine' },
      },
      options: {
        plugins: [
          {
            name: 'custom-engine',
            markdown: {
              createHighlighter(config) {
                calls++
                expect(config.mdx.highlighter).toBe('custom-engine')
                expect(config.cache).toBe(true)
                return {
                  codeToHtml: () =>
                    '<pre class="custom-engine"><code>Custom output</code></pre>',
                }
              },
            },
          },
        ],
      },
    })
    expect(calls).toBe(1)
    expect(
      await fs.readFile(path.join(outDir, 'index.html'), 'utf8'),
    ).toContain('Custom output')
  })

  it('owns mutable extension input and contributed settings across independent resolutions', () => {
    const input = {
      rootDir: process.cwd(),
      extensions: { brand: { text: 'Input' } },
    }
    const first = resolveTestConfig({
      siteConfig: input,
      options: { defaultPlugins: false },
    })
    const second = resolveTestConfig({
      siteConfig: input,
      options: { defaultPlugins: false },
    })
    if (!first.extensions.brand) throw new Error('Expected brand settings')
    first.extensions.brand.text = 'Changed'
    expect(second.extensions.brand?.text).toBe('Input')
    expect(input.extensions.brand.text).toBe('Input')
    const contribution = { extensions: { brand: { text: 'Contributed' } } }
    const configured = resolveTestConfig({
      options: {
        defaultPlugins: false,
        plugins: [{ name: 'brand', config: { resolve: () => contribution } }],
      },
    })
    if (!configured.extensions.brand)
      throw new Error('Expected contributed brand')
    configured.extensions.brand.text = 'Changed'
    expect(contribution.extensions.brand.text).toBe('Contributed')
  })

  it('resolves typed custom site configuration and derived consent services before every factory', async () => {
    root = await makeRepoTempDir('.tmp-plugin-config-')
    const contentDir = path.join(root, 'content')
    await fs.mkdir(contentDir)
    await fs.writeFile(path.join(contentDir, 'index.md'), '# Home')
    await fs.writeFile(
      path.join(contentDir, 'siteConfig.json'),
      JSON.stringify({
        extensions: {
          brand: { text: 'From file' },
          otherPlugin: { preserved: true },
        },
      }),
    )
    const calls: string[] = []
    const plugin: PureStackPlugin = {
      name: 'brand',
      config: {
        resolve({ config, input, file }) {
          calls.push('config')
          expect(config.consent?.services).toHaveLength(0)
          return {
            extensions: {
              brand: {
                text:
                  input.extensions?.brand?.text ??
                  file.extensions?.brand?.text ??
                  'Default',
              },
            },
          }
        },
        finalize({ config }) {
          calls.push('finalize')
          expect(config.consent?.services).toHaveLength(1)
          expect(config.extensions.brand?.text).toBe('From input')
          return {}
        },
      },
      styles(config) {
        calls.push('styles')
        expect(config.consent?.services).toHaveLength(1)
        expect(config.extensions.brand?.text).toBe('From input')
        expect(config.extensions.otherPlugin).toEqual({ preserved: true })
        return {
          revision: 0,
          links: () => [],
          write: async () => ({
            revision: 0,
            outPath: '',
            outputs: [],
            signature: '',
          }),
        }
      },
      components(config) {
        calls.push('components')
        expect(config.consent?.services).toHaveLength(1)
        expect(config.extensions.brand?.text).toBe('From input')
        return {}
      },
      templates: {
        doc: ({ head, bodyHtml }) =>
          h('html').push(head, h('body').raw(bodyHtml)),
      },
      hooks: {
        onConfigResolved({ config, components, templates }) {
          calls.push('hook')
          expect(config.extensions.brand?.text).toBe('From input')
          expect(config.consent?.services).toHaveLength(1)
          expect(components).toEqual({})
          expect(templates?.doc).toBeTypeOf('function')
        },
      },
    }
    await buildSite({
      siteConfig: {
        rootDir: root,
        contentDir,
        outDir: path.join(root, 'out'),
        extensions: { brand: { text: 'From input' } },
        consent: { enabled: true },
        analytics: { ga4: { measurementId: 'G-TEST1234' } },
      },
      options: { defaultPlugins: false, plugins: [analyticsPlugin(), plugin] },
    })
    expect(calls).toEqual([
      'config',
      'finalize',
      'styles',
      'components',
      'hook',
    ])
  })

  it('composes configuration in plugin order and retains publish output overrides', () => {
    const calls: string[] = []
    const config = resolveTestConfig({
      siteConfig: {
        rootDir: process.cwd(),
        siteTitle: 'Input',
        publishDir: path.join(process.cwd(), '.tmp', 'publish-review'),
      },
      options: {
        defaultPlugins: false,
        plugins: [
          {
            name: 'first',
            config: {
              resolve({ config }) {
                calls.push(config.siteTitle)
                return { siteTitle: 'First', html: { minify: false } }
              },
              finalize({ config }) {
                calls.push(config.siteTitle)
                return { extensions: { derivedTitle: config.siteTitle } }
              },
            },
          },
          {
            name: 'second',
            config: {
              resolve({ config }) {
                calls.push(config.siteTitle)
                return { siteTitle: 'Second' }
              },
            },
          },
        ],
      },
      publish: { enabled: true },
    })
    expect(calls).toEqual(['Input', 'First', 'Second'])
    expect(config.extensions.derivedTitle).toBe('Second')
    expect(config.siteTitle).toBe('Second')
    expect(config.html.minify).toBe(true)
    expect(config.outDir).toBe(config.publishDir)
  })

  it.each([null, [], 42, Promise.resolve({})])(
    'attributes invalid config results to their plugin (%j)',
    (value) => {
      expect(() =>
        resolveTestConfig({
          options: {
            defaultPlugins: false,
            plugins: [
              { name: 'invalid', config: { resolve: () => value } } as never,
            ],
          },
        }),
      ).toThrow(
        'Plugin "invalid" failed in config.resolve: config.resolve must return a configuration object synchronously.',
      )
    },
  )

  it.each([null, [], 42, Promise.resolve({})])(
    'attributes invalid config finalizers (%j)',
    (value) => {
      expect(() =>
        resolveTestConfig({
          options: {
            defaultPlugins: false,
            plugins: [
              { name: 'invalid', config: { finalize: () => value } } as never,
            ],
          },
        }),
      ).toThrow(
        'Plugin "invalid" failed in config.finalize: config.finalize must return a configuration object synchronously.',
      )
    },
  )

  it.each([
    {
      name: 'measurement override',
      original: 'G-ORIGINAL',
      initialConsent: true,
      finalConsent: true,
      enabled: true,
    },
    {
      name: 'analytics enabled by a resolver',
      original: undefined,
      initialConsent: true,
      finalConsent: true,
      enabled: true,
    },
    {
      name: 'consent enabled by a resolver',
      original: 'G-ORIGINAL',
      initialConsent: false,
      finalConsent: true,
      enabled: true,
    },
    {
      name: 'analytics disabled by a resolver',
      original: 'G-ORIGINAL',
      initialConsent: true,
      finalConsent: true,
      enabled: false,
    },
    {
      name: 'consent disabled by a resolver',
      original: 'G-ORIGINAL',
      initialConsent: true,
      finalConsent: false,
      enabled: true,
    },
  ])(
    'uses final analytics configuration in rendered pages: $name',
    async ({ original, initialConsent, finalConsent, enabled }) => {
      root = await makeRepoTempDir('.tmp-final-analytics-')
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await fs.mkdir(contentDir)
      await fs.writeFile(path.join(contentDir, 'index.md'), '# Home')
      let observed = false
      await buildSite({
        siteConfig: {
          rootDir: root,
          contentDir,
          outDir,
          mdx: { disableHighlighter: true },
          pagefind: { enabled: false },
          consent: { enabled: initialConsent },
          analytics: { ga4: { measurementId: original } },
        },
        options: {
          plugins: [
            {
              name: 'environment',
              config: {
                resolve: () => ({
                  consent: { enabled: finalConsent },
                  analytics: { ga4: { enabled, measurementId: 'G-OVERRIDE' } },
                }),
              },
              components(config) {
                observed = true
                const services = config.consent?.services ?? []
                expect(services).toHaveLength(enabled && finalConsent ? 1 : 0)
                if (enabled && finalConsent)
                  expect(services[0].ga4MeasurementId).toBe('G-OVERRIDE')
                return {}
              },
            },
          ],
        },
      })
      expect(observed).toBe(true)
      const html = await fs.readFile(path.join(outDir, 'index.html'), 'utf8')
      expect(html).not.toContain('G-ORIGINAL')
      expect(html.includes('G-OVERRIDE')).toBe(enabled)
      expect(
        html.includes(
          '<script async="true" src="https://www.googletagmanager.com',
        ),
      ).toBe(enabled && !finalConsent)
    },
  )

  it('honors consent categories and explicit services supplied by later resolvers', () => {
    const config = resolveTestConfig({
      siteConfig: {
        rootDir: process.cwd(),
        consent: { enabled: true },
        analytics: {
          ga4: { measurementId: 'G-TEST1234', consentCategory: 'custom' },
        },
      },
      options: {
        plugins: [
          {
            name: 'custom-category',
            config: {
              resolve: ({ config }) => ({
                consent: {
                  categories: [
                    ...(config.consent?.categories ?? []),
                    {
                      id: 'custom',
                      label: 'Custom',
                      description: '',
                      required: false,
                    },
                  ],
                },
              }),
            },
          },
        ],
      },
    })
    expect(config.consent?.services[0].category).toBe('custom')
    const manual = resolveTestConfig({
      siteConfig: {
        rootDir: process.cwd(),
        consent: { enabled: true },
        analytics: { ga4: { measurementId: 'G-TEST1234' } },
      },
      options: {
        plugins: [
          {
            name: 'manual',
            config: {
              resolve: () => ({
                consent: {
                  services: [
                    {
                      id: 'ga4',
                      category: 'necessary',
                      label: 'Manual',
                      scripts: [{ content: 'window.custom = true' }],
                    },
                  ],
                },
              }),
            },
          },
        ],
      },
    })
    expect(manual.consent?.services).toHaveLength(1)
    expect(manual.consent?.services[0].label).toBe('Manual')
    expect(manual.consent?.services[0].ga4MeasurementId).toBeUndefined()
  })

  it.each([null, [], 42])(
    'rejects malformed extension containers (%j)',
    (extensions) => {
      expect(() =>
        resolveTestConfig({
          siteConfig: { extensions } as never,
          options: { defaultPlugins: false },
        }),
      ).toThrow('extensions must be an object of plugin settings.')
    },
  )
})
