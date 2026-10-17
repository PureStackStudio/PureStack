import fs from 'node:fs/promises'
import path from 'node:path'
import type { SiteSearch } from '@purestack/ts-common'
import { h } from '@purestack/ts-html'
import { runInDom } from '@purestack/ts-minidom'
import { styleBuilder, themes } from '@purestack/ts-style'
import { disableLogger, getLogger, type Logger } from 'logpot'
import { defineComponent, html } from 'regor'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createIncrementalBuilder } from '../build/incremental'
import { readManifest } from '../build/manifest'
import { type BuildOptions, buildSite } from '../build/site'
import { makeRepoTempDir } from '../test/repoTempDir'
import {
  authStateHintPlugin,
  componentsPlugin,
  pageScriptsPlugin,
  themePlugin,
} from './default-plugins'
import { definePlugin } from './plugin'

describe('default plugins', () => {
  let logger: Logger
  let root: string | undefined

  beforeAll(() => {
    disableLogger()
    logger = getLogger()
  })
  afterAll(async () => logger.close())
  afterEach(async () => {
    if (root) await fs.rm(root, { recursive: true, force: true })
    root = undefined
  })

  async function project(source = '# Home\n\n<Btn>Action</Btn>') {
    root = await makeRepoTempDir('.tmp-default-plugins-')
    const contentDir = path.join(root, 'content')
    await fs.mkdir(contentDir)
    await fs.writeFile(path.join(contentDir, 'index.mdx'), source)
    return {
      rootDir: root,
      contentDir,
      outDir: path.join(root, 'out'),
      basePath: '/docs',
      mdx: { disableHighlighter: true },
    }
  }

  it.each([false, true])(
    'preserves overrides and custom styles with explicit plugins %s',
    async (explicit) => {
      const siteConfig = await project()
      let replacement: object
      const extension = definePlugin({
        name: 'custom',
        components() {
          styleBuilder.select('.factory-style', 'light').color('red')
          replacement = defineComponent(
            html`<strong class="override">Custom button</strong>`,
          )
          return { btn: replacement }
        },
        templates: {
          doc: ({ head, bodyHtml }) =>
            h('html').push(
              head,
              h('body').attr({ class: 'custom-doc' }).raw(bodyHtml),
            ),
        },
        hooks: {
          onConfigResolved(context) {
            expect(context.components?.btn).toBe(replacement)
            expect(context.templates?.doc).toBe(extension.templates?.doc)
            expect(context.components?.pageScript).toBeDefined()
            styleBuilder.select('.hook-style', 'light').color('blue')
          },
          onPageDocument(_context, page) {
            expect(
              page.document.head.querySelector('link[data-theme="light"]'),
            ).not.toBeNull()
          },
        },
      })
      const options: BuildOptions = explicit
        ? {
            defaultPlugins: false,
            plugins: [themePlugin(), componentsPlugin(), extension],
          }
        : { plugins: [extension] }
      await buildSite({ siteConfig, options })
      const output = await fs.readFile(
        path.join(siteConfig.outDir, 'index.html'),
        'utf8',
      )
      expect(output).toContain('class="custom-doc"')
      expect(output).toContain(
        '<strong class="override">Custom button</strong>',
      )
      const manifest = await readManifest(siteConfig.outDir)
      expect(manifest?.styles.outputs).toHaveLength(2)
      for (const file of manifest?.styles.outputs ?? []) {
        expect(output).toContain(`/docs/assets/${path.basename(file)}`)
      }
      const light = manifest?.styles.outputs.find(
        (file) => !file.endsWith('.dark.css'),
      )
      expect(light).toBeDefined()
      const css = await fs.readFile(light ?? '', 'utf8')
      expect(css).toContain('.factory-style')
      expect(css).toContain('.hook-style')
      await runInDom(output, (document) => {
        const scripts = [...document.head.querySelectorAll('script')].map(
          (node) => node.textContent,
        )
        expect(scripts.some((text) => text?.includes('code-copy'))).toBe(
          !explicit,
        )
      })
    },
  )

  it('lets config hooks override standard components within their build', async () => {
    const siteConfig = await project()
    await buildSite({
      siteConfig,
      options: {
        plugins: [
          {
            name: 'registry',
            hooks: {
              onConfigResolved(context) {
                context.components = {
                  ...context.components,
                  btn: defineComponent(html`<b>Context override</b>`),
                }
              },
            },
          },
        ],
      },
    })
    expect(
      await fs.readFile(path.join(siteConfig.outDir, 'index.html'), 'utf8'),
    ).toContain('<b>Context override</b>')
  })

  it('keeps critical colors in sync with theme changes from config hooks', async () => {
    const siteConfig = await project('# Home')
    await buildSite({
      siteConfig,
      options: {
        plugins: [
          {
            name: 'custom-colors',
            hooks: {
              onConfigResolved() {
                const options = themes.getOptions()
                themes.setOptions({
                  ...options,
                  palette: {
                    ...options.palette,
                    light: {
                      ...options.palette.light,
                      accent: '#123456',
                      semanticTone: {
                        ...options.palette.light.semanticTone,
                        neutral: {
                          ...options.palette.light.semanticTone.neutral,
                          canvas: '#abcdef',
                        },
                      },
                    },
                  },
                })
              },
            },
          },
        ],
      },
    })
    const output = await fs.readFile(
      path.join(siteConfig.outDir, 'index.html'),
      'utf8',
    )
    await runInDom(output, (document) => {
      expect(
        document
          .querySelector('meta[name="theme-color"]')
          ?.getAttribute('content'),
      ).toBe('#123456')
      expect(document.head.querySelector('style')?.textContent).toContain(
        'background:#abcdef',
      )
    })
  })

  it.each([true, false])(
    'runs the auth hint before stylesheet loading and other scripts (theme %s)',
    async (theme) => {
      const siteConfig = await project('# Home')
      await buildSite({
        siteConfig: { ...siteConfig, auth: { enabled: true } },
        options: theme
          ? undefined
          : {
              defaultPlugins: false,
              plugins: [
                authStateHintPlugin(),
                pageScriptsPlugin(),
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
      await runInDom(output, (document) => {
        const scripts = [...document.head.querySelectorAll('script')]
        expect(scripts[0]?.textContent).toContain('signedInStorageKey')
        if (theme) {
          expect(scripts[1]?.textContent).toContain('themeSwitchThemes')
          const nodes = [...document.head.children]
          const stylesheet = document.head.querySelector(
            'link[rel="stylesheet"]',
          )
          expect(nodes.indexOf(scripts[0])).toBeLessThan(
            nodes.indexOf(stylesheet as Element),
          )
        }
      })
    },
  )

  it('builds without any default features when they are disabled', async () => {
    const siteConfig = await project()
    const options = {
      defaultPlugins: false,
      plugins: [
        definePlugin({
          name: 'plain',
          templates: {
            doc: ({ head, bodyHtml }) =>
              h('html').push(head, h('body').raw(bodyHtml)),
          },
        }),
      ],
    }
    // Start with a default build: opting out must also work after initialization.
    await buildSite({ siteConfig })
    await buildSite({ siteConfig, options })
    const output = await fs.readFile(
      path.join(siteConfig.outDir, 'index.html'),
      'utf8',
    )
    await runInDom(output, (document) => {
      expect(document.querySelector('btn')).not.toBeNull()
      expect(
        document.querySelectorAll(
          'script, style, link[rel="stylesheet"], meta[name="color-scheme"]',
        ),
      ).toHaveLength(0)
    })
    expect((await readManifest(siteConfig.outDir))?.styles).toEqual({
      signature: '',
      outputs: [],
    })
  })

  it('requires a template when the theme plugin is disabled', async () => {
    const siteConfig = await project('# Home')
    await expect(
      buildSite({ siteConfig, options: { defaultPlugins: false } }),
    ).rejects.toThrow('Unknown page template "doc"')
  })

  it('accepts an explicitly configured default plugin without initializing it twice', async () => {
    const siteConfig = await project()
    const theme = themePlugin()
    let initialized = 0
    await buildSite({
      siteConfig,
      options: {
        plugins: [
          {
            ...theme,
            styles(config) {
              initialized++
              return theme.styles(config)
            },
          },
        ],
      },
    })
    expect(initialized).toBe(1)
    const output = await fs.readFile(
      path.join(siteConfig.outDir, 'index.html'),
      'utf8',
    )
    await runInDom(output, (document) => {
      expect(document.querySelectorAll('link[data-theme]')).toHaveLength(2)
      expect(document.querySelector('button')).not.toBeNull()
    })
    const manifest = await readManifest(siteConfig.outDir)
    const css = await fs.readFile(manifest?.styles.outputs[0] ?? '', 'utf8')
    expect(css).toContain('.btn')
  })

  it('keeps default assets and runtimes working across lazy requests and content changes', async () => {
    const siteConfig = await project(
      '---\nlayout:\n  showToc: true\n---\n# Home\n\n## Section\n\n<Btn>Action</Btn>',
    )
    let outputs: string[] = []
    const builder = await createIncrementalBuilder({
      siteConfig,
      options: {
        plugins: [
          {
            name: 'observe-styles',
            hooks: {
              onStylesWritten(_context, result) {
                outputs = result.outputs
              },
            },
          },
        ],
      },
    })
    await builder.prepareForRequests()
    await builder.renderByUrlPath('/')
    await builder.preparePageAssets()
    const outputPath = path.join(siteConfig.outDir, 'index.html')
    const first = await fs.readFile(outputPath, 'utf8')
    expect(outputs).toHaveLength(2)
    for (const output of outputs) {
      expect(first).toContain(`/docs/assets/${path.basename(output)}`)
      expect((await fs.readFile(output, 'utf8')).length).toBeGreaterThan(0)
    }
    await runInDom(first, (document) => {
      expect(
        document.querySelectorAll('meta[name="color-scheme"]'),
      ).toHaveLength(1)
      expect(document.querySelectorAll('link[data-theme]')).toHaveLength(2)
      expect(document.querySelector('#doc-toc')).not.toBeNull()
    })
    const source = path.join(siteConfig.contentDir, 'index.mdx')
    await fs.writeFile(source, '# Changed\n\n<Badge>Ready</Badge>')
    await builder.applyChange(source)
    await builder.renderByUrlPath('/')
    await builder.preparePageAssets()
    const second = await fs.readFile(outputPath, 'utf8')
    expect(second).toContain('Changed')
    expect(second).toContain('Ready')
    await runInDom(second, (document) => {
      expect(document.querySelectorAll('link[data-theme]')).toHaveLength(2)
      expect(document.querySelector('#doc-toc')).toBeNull()
    })
  })

  it.each([false, true])(
    'keeps component and custom CSS with renamed plugins (reversed %s)',
    async (reversed) => {
      const siteConfig = await project()
      const theme = { ...themePlugin(), name: 'site-theme' }
      const components = { ...componentsPlugin(), name: 'site-components' }
      const calls: string[] = []
      const extension = definePlugin({
        name: 'custom',
        components() {
          styleBuilder.select('.factory-style', 'light').color('red')
          return {}
        },
        hooks: {
          onConfigResolved() {
            calls.push('custom')
          },
        },
      })
      const ordered = (
        reversed ? [components, theme] : [theme, components]
      ).map((plugin) => ({
        ...plugin,
        hooks: {
          onConfigResolved() {
            calls.push(plugin.name)
          },
        },
      }))
      await buildSite({
        siteConfig,
        options: { defaultPlugins: false, plugins: [extension, ...ordered] },
      })
      expect(calls).toEqual(['custom', ...ordered.map((plugin) => plugin.name)])
      const manifest = await readManifest(siteConfig.outDir)
      const css = await fs.readFile(manifest?.styles.outputs[0] ?? '', 'utf8')
      expect(css).toContain('.btn ')
      expect(css).toContain('.factory-style')
    },
  )

  it('keeps components isolated when builders are created before another site initializes', async () => {
    const siteConfig = await project()
    const plain = definePlugin({
      name: 'plain',
      templates: {
        doc: ({ head, bodyHtml }) =>
          h('html').push(head, h('body').raw(bodyHtml)),
      },
    })
    const bare = await createIncrementalBuilder({
      siteConfig,
      options: { defaultPlugins: false, plugins: [plain] },
    })
    const standard = await createIncrementalBuilder({
      siteConfig: {
        ...siteConfig,
        outDir: path.join(siteConfig.rootDir, 'standard'),
      },
    })
    await standard.buildAll('initialize standard components')
    await bare.buildAll('render without standard components')
    let output = await fs.readFile(
      path.join(siteConfig.outDir, 'index.html'),
      'utf8',
    )
    await runInDom(output, (document) => {
      expect(document.querySelector('btn')).not.toBeNull()
      expect(document.querySelector('button')).toBeNull()
    })
    // Creating another builder must not clear the first builder's components.
    await standard.buildAll('render standard components again')
    output = await fs.readFile(
      path.join(siteConfig.rootDir, 'standard', 'index.html'),
      'utf8',
    )
    await runInDom(output, (document) =>
      expect(document.querySelector('button')).not.toBeNull(),
    )
  })

  it('gives custom templates the completed head and preserves their edits', async () => {
    const siteConfig = await project()
    await buildSite({
      siteConfig: { ...siteConfig, auth: { enabled: true } },
      options: {
        plugins: [
          {
            name: 'nonce',
            hooks: {
              onConfigResolved(context) {
                // Template changes from config hooks also receive the completed head.
                context.templates = {
                  ...context.templates,
                  doc: ({ head, bodyHtml }) => {
                    const markup = head.toHtml()
                    expect(markup).toContain('data-theme="light"')
                    expect(markup).toContain('signedInStorageKey')
                    expect(markup).toContain('code-copy')
                    head.select('style', (node) =>
                      node.attr({ nonce: 'site-nonce' }),
                    )
                    head.select('script', (node) =>
                      node.attr({ nonce: 'site-nonce' }),
                    )
                    return h('html').push(head, h('body').raw(bodyHtml))
                  },
                }
              },
            },
          },
        ],
      },
    })
    const output = await fs.readFile(
      path.join(siteConfig.outDir, 'index.html'),
      'utf8',
    )
    await runInDom(output, (document) => {
      expect(document.head.querySelectorAll('style')).toHaveLength(1)
      expect(document.head.querySelector('style')?.getAttribute('nonce')).toBe(
        'site-nonce',
      )
      expect(document.head.querySelector('script')?.getAttribute('nonce')).toBe(
        'site-nonce',
      )
    })
  })

  it('rejects multiple stylesheet providers before either initializes', async () => {
    const siteConfig = await project()
    let calls = 0
    const styleProvider = themePlugin().styles
    const styles = (config: Parameters<typeof styleProvider>[0]) => {
      calls++
      return styleProvider(config)
    }
    await expect(
      buildSite({
        siteConfig,
        options: {
          defaultPlugins: false,
          plugins: [
            { name: 'first', styles },
            { name: 'second', styles },
          ],
        },
      }),
    ).rejects.toThrow('Plugins "first" and "second" both define styles.')
    expect(calls).toBe(0)
  })

  it('generates the theme favicon after clean output preparation, including lazy requests', async () => {
    const siteConfig = { ...(await project()), favicon: 'tabler:cloud-storm' }
    await fs.mkdir(siteConfig.outDir, { recursive: true })
    await fs.writeFile(path.join(siteConfig.outDir, 'stale.txt'), 'old')
    const builder = await createIncrementalBuilder({
      siteConfig,
      options: { cleanOutDir: true },
    })
    await builder.buildAll('clean favicon')
    await expect(
      fs.access(path.join(siteConfig.outDir, 'stale.txt')),
    ).rejects.toThrow()
    const output = path.join(siteConfig.outDir, 'assets/favicon.svg')
    expect(await fs.readFile(output, 'utf8')).toContain(
      'icon-tabler-cloud-storm',
    )
    await fs.unlink(output)
    const lazy = await createIncrementalBuilder({
      siteConfig,
      options: { cleanOutDir: true },
    })
    await lazy.prepareForRequests()
    expect(await fs.readFile(output, 'utf8')).toContain(
      'icon-tabler-cloud-storm',
    )
  })

  it('keeps runtime embedding owned by the page scripts plugin', async () => {
    const siteConfig = await project(
      '---\nembed:\n  tabs: body\n  modal: head\n---\n# Home\n\n<Tabs><TabPane id="one">One</TabPane></Tabs>\n<Modal id="dialog">Dialog</Modal>',
    )
    await buildSite({
      siteConfig,
      options: {
        defaultPlugins: false,
        plugins: [themePlugin(), componentsPlugin()],
      },
    })
    let output = await fs.readFile(
      path.join(siteConfig.outDir, 'index.html'),
      'utf8',
    )
    expect(output).not.toContain('window.tsSsgTabs')
    expect(output).not.toContain('window.tsSsgModal')
    await buildSite({
      siteConfig,
      options: {
        plugins: [
          {
            name: 'inspect-runtimes',
            hooks: {
              onPageDocument(_context, page) {
                expect(page.runtimeEmbeds.get('tabs')).toBe('head')
                expect(page.runtimeEmbeds.get('modal')).toBe('head')
                const scripts = [
                  ...page.document.head.querySelectorAll('script'),
                ].map((script) => script.textContent)
                expect(
                  scripts.some((source) => source?.includes('tsSsgTabs')),
                ).toBe(true)
                expect(
                  scripts.some((source) => source?.includes('tsSsgModal')),
                ).toBe(true)
              },
            },
          },
        ],
      },
    })
    output = await fs.readFile(
      path.join(siteConfig.outDir, 'index.html'),
      'utf8',
    )
    expect(output).toContain('tsSsgTabs')
    expect(output).toContain('tsSsgModal')
  })

  it('coordinates custom search providers for full builds and lazy revision changes', async () => {
    const siteConfig = await project('# Public')
    const hidden = path.join(siteConfig.contentDir, 'hidden.mdx')
    await fs.writeFile(hidden, '---\nindex: false\n---\n# Hidden')
    const writes: { excluded: string[]; only?: string[] }[] = []
    const search: SiteSearch = {
      ownsPath: (pathname) => pathname.startsWith('/custom-search/'),
      async write(input) {
        writes.push({
          excluded: [...input.excludeFiles],
          only: input.onlyFiles ? [...input.onlyFiles] : undefined,
        })
      },
    }
    const options = {
      plugins: [{ name: 'purestack:pagefind', search: () => search }],
    }
    await buildSite({ siteConfig, options })
    expect(writes).toHaveLength(1)
    expect(writes[0].only).toBeUndefined()
    expect(writes[0].excluded).toEqual([
      path.join(siteConfig.outDir, 'hidden/index.html'),
    ])
    writes.length = 0
    const builder = await createIncrementalBuilder({ siteConfig, options })
    await builder.prepareForRequests()
    await builder.renderByUrlPath('/')
    await builder.renderByUrlPath('/hidden/')
    expect(await builder.prepareAssetByUrlPath('/pagefind/pagefind.js')).toBe(
      false,
    )
    await Promise.all([
      builder.prepareAssetByUrlPath('/custom-search/index.js'),
      builder.prepareAssetByUrlPath('/custom-search/index.js'),
    ])
    expect(writes).toHaveLength(1)
    expect(writes[0].only?.sort()).toEqual(
      [
        path.join(siteConfig.outDir, 'hidden/index.html'),
        path.join(siteConfig.outDir, 'index.html'),
      ].sort(),
    )
    expect(writes[0].excluded).toEqual([
      path.join(siteConfig.outDir, 'hidden/index.html'),
    ])
    await fs.unlink(hidden)
    await builder.applyChange(hidden)
    await builder.prepareAssetByUrlPath('/custom-search/index.js')
    expect(writes).toHaveLength(2)
    expect(writes[1].only).toEqual([path.join(siteConfig.outDir, 'index.html')])
    expect(writes[1].excluded).toEqual([])
  })

  it('rejects competing search providers before initializing either', async () => {
    const siteConfig = await project()
    let calls = 0
    const search = (): SiteSearch => {
      calls++
      return { ownsPath: () => false, write: async () => {} }
    }
    await expect(
      buildSite({
        siteConfig,
        options: {
          defaultPlugins: false,
          plugins: [
            { name: 'first', search },
            { name: 'second', search },
          ],
        },
      }),
    ).rejects.toThrow('Plugins "first" and "second" both define search.')
    expect(calls).toBe(0)
  })
})
