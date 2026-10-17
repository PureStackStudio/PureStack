import fs from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'
import { h } from '@purestack/ts-html'
import { registerSkin, themeSkins } from '@purestack/ts-style'
import { disableLogger, getLogger, type Logger } from 'logpot'
import { defineComponent, html } from 'regor'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { resolveMdxBuildOptions } from '../build/incremental/support'
import { buildSite } from '../build/site'
import { resolveSiteConfig } from '../config/config'
import { makeRepoTempDir } from '../test/repoTempDir'
import {
  assertValidPlugins,
  composeDevMiddleware,
  composePluginHooks,
  definePlugin,
  type PureStackPlugin,
  resolvePluginComponents,
  resolvePluginHighlighter,
  resolvePluginTemplates,
  withPluginSkins,
} from './plugin'

const standardSkin = {
  create: () => themeSkins.standard.create(),
}

describe('plugins', () => {
  let logger: Logger | undefined

  beforeAll(() => {
    disableLogger()
    logger = getLogger()
  })

  afterAll(async () => {
    await logger?.close()
  })

  it('returns the plugin it defines', () => {
    const plugin = { name: 'docs' }

    expect(definePlugin(plugin)).toBe(plugin)
  })

  it('awaits resolver initialization and supports sync and async rendering callbacks', async () => {
    const fallback = {
      codeToHtml: (code: string) => `<pre><code>${code}</code></pre>`,
    }
    expect(resolvePluginHighlighter([], fallback)).toBe(fallback)
    const highlighter = resolvePluginHighlighter(
      [
        {
          name: 'custom',
          markdown: {
            resolveHighlighter: async (lang) => {
              if (lang.startsWith('diagram-'))
                return async (code) => `<figure>${code}</figure>`
              if (lang === 'custom') return (code) => `<div>${code}</div>`
              return null
            },
          },
        },
      ],
      fallback,
    )
    if (!highlighter) throw new Error('Expected a composed highlighter.')
    expect(await highlighter.codeToHtml('graph', ' DIAGRAM-FLOW ')).toBe(
      '<figure>graph</figure>',
    )
    expect(await highlighter.codeToHtml('source', 'custom')).toBe(
      '<div>source</div>',
    )
    expect(await highlighter.codeToHtml('source', 'ts')).toBe(
      '<pre><code>source</code></pre>',
    )
  })

  it('keeps custom languages working when default highlighting is disabled and escapes unmatched source', async () => {
    const options = await resolveMdxBuildOptions({ disableHighlighter: true }, [
      {
        name: 'custom',
        markdown: {
          createHighlighter: () => {
            throw new Error('Highlighter creation is disabled.')
          },
          resolveHighlighter: (lang) =>
            lang === 'diagram' ? async () => '<figure>rendered</figure>' : null,
        },
      },
    ])
    const highlighter = options.highlighter
    if (!highlighter) throw new Error('Expected custom language handling.')
    expect(await highlighter.codeToHtml('graph', 'diagram')).toBe(
      '<figure>rendered</figure>',
    )
    expect(
      await highlighter.codeToHtml('<script>source</script>', 'html'),
    ).toBe(
      '<pre><code class="language-html">&lt;script&gt;source&lt;/script&gt;</code></pre>',
    )
    expect(
      (await resolveMdxBuildOptions({ disableHighlighter: true })).highlighter,
    ).toBeUndefined()
  })

  it('tries sync and async resolvers in plugin order and stops at the first callback', async () => {
    const calls: string[] = []
    const highlighter = resolvePluginHighlighter(
      ['first', 'second', 'third'].map<PureStackPlugin>((name) => ({
        name,
        markdown: {
          resolveHighlighter: (lang) => {
            calls.push(`${name}:${lang}`)
            if (name === 'first') return Promise.resolve(null)
            if (lang === 'diagram') return () => `<figure>${name}</figure>`
            if (lang === 'hidden') return () => ''
            return null
          },
        },
      })),
      {
        codeToHtml: () => {
          calls.push('default')
          return '<pre>default</pre>'
        },
      },
    )
    if (!highlighter) throw new Error('Expected a composed highlighter.')
    expect(await highlighter.codeToHtml('graph', 'diagram')).toBe(
      '<figure>second</figure>',
    )
    expect(calls).toEqual(['first:diagram', 'second:diagram'])
    calls.length = 0
    expect(await highlighter.codeToHtml('source', 'hidden')).toBe('')
    expect(calls).toEqual(['first:hidden', 'second:hidden'])
    calls.length = 0
    expect(await highlighter.codeToHtml('source')).toBe('<pre>default</pre>')
    expect(calls).toEqual(['first:', 'second:', 'third:', 'default'])
  })

  it('propagates asynchronous resolver failures without falling back', async () => {
    let fallbackCalled = false
    const highlighter = resolvePluginHighlighter(
      [
        {
          name: 'failing',
          markdown: {
            resolveHighlighter: async () => {
              throw new Error('Could not initialize highlighter.')
            },
          },
        },
      ],
      {
        codeToHtml: () => {
          fallbackCalled = true
          return '<pre>default</pre>'
        },
      },
    )
    if (!highlighter) throw new Error('Expected a composed highlighter.')
    await expect(highlighter.codeToHtml('source', 'custom')).rejects.toThrow(
      'Could not initialize highlighter.',
    )
    expect(fallbackCalled).toBe(false)
  })

  it.each(['resolveHighlighter', 'createHighlighter'])(
    'validates markdown.%s declarations',
    (field) => {
      for (const value of [[], {}, 42, null]) {
        expect(() =>
          assertValidPlugins([
            { name: 'bad', markdown: { [field]: value } } as never,
          ]),
        ).toThrow(`Plugin "bad" needs \`markdown.${field}\` to be a function.`)
      }
    },
  )

  describe('highlighter providers', () => {
    it('rejects competing providers before creating either', async () => {
      const plugins = ['first', 'second'].map((name) => ({
        name,
        markdown: {
          createHighlighter: () => {
            throw new Error('Must not create an instance.')
          },
        },
      }))
      await expect(resolveMdxBuildOptions({}, plugins)).rejects.toThrow(
        'Plugins "first" and "second" both define markdown.createHighlighter.',
      )
    })

    it('lets an ordinary provider replace a default without initializing it', async () => {
      const options = await resolveMdxBuildOptions({}, [
        {
          name: 'default',
          defaults: true,
          markdown: {
            createHighlighter: () => {
              throw new Error('Unused default.')
            },
          },
        },
        {
          name: 'custom',
          markdown: {
            createHighlighter: () => ({
              codeToHtml: (code) => `<pre>${code}</pre>`,
            }),
          },
        },
      ])
      expect(await options.highlighter?.codeToHtml('source')).toBe(
        '<pre>source</pre>',
      )
    })

    it('attributes asynchronous provider failures to the plugin', async () => {
      await expect(
        resolveMdxBuildOptions({}, [
          {
            name: 'failing',
            markdown: {
              createHighlighter: async () => {
                throw new Error('Creation failed.')
              },
            },
          },
        ]),
      ).rejects.toThrow(
        'Plugin "failing" failed in markdown.createHighlighter: Creation failed.',
      )
    })

    it('rejects invalid provider results', async () => {
      await expect(
        resolveMdxBuildOptions({}, [
          {
            name: 'invalid',
            markdown: { createHighlighter: () => ({}) as never },
          },
        ]),
      ).rejects.toThrow('must return a code highlighter')
    })

    it('leaves code unhighlighted when no provider is present', async () => {
      expect((await resolveMdxBuildOptions({})).highlighter).toBeUndefined()
    })
  })

  describe('hooks', () => {
    it('runs every plugin handler in plugin order, one after another', async () => {
      const calls: string[] = []
      const hooks = composePluginHooks([
        {
          name: 'first',
          hooks: {
            onBuildComplete: async () => {
              await new Promise((resolve) => setTimeout(resolve, 10))
              calls.push('first')
            },
          },
        },
        { name: 'quiet' },
        {
          name: 'second',
          hooks: { onBuildComplete: () => void calls.push('second') },
        },
      ])

      await hooks.onBuildComplete?.({} as never, { outDir: '', pages: 0 })

      expect(calls).toEqual(['first', 'second'])
      expect(hooks.onPageStart).toBeUndefined()
    })

    it('calls each hook as a method of its plugin hooks', async () => {
      let receiver: unknown
      const pluginHooks: PureStackPlugin['hooks'] = {
        onBuildComplete() {
          receiver = this
        },
      }
      const hooks = composePluginHooks([
        { name: 'methods', hooks: pluginHooks },
      ])

      await hooks.onBuildComplete?.({} as never, { outDir: '', pages: 0 })

      expect(receiver).toBe(pluginHooks)
    })

    it('names the plugin whose hook failed and keeps the cause', async () => {
      const failure = new Error('boom')
      const hooks = composePluginHooks([
        { name: 'ok', hooks: { onPageRendered: () => {} } },
        {
          name: 'broken',
          hooks: {
            onPageRendered: () => {
              throw failure
            },
          },
        },
      ])

      const error = await Promise.resolve(
        hooks.onPageRendered?.({} as never, {} as never),
      ).catch((caught: unknown) => caught)

      expect(error).toBeInstanceOf(Error)
      expect((error as Error).message).toBe(
        'Plugin "broken" failed in onPageRendered: boom',
      )
      expect((error as Error).cause).toBe(failure)
    })
  })

  describe('dev middleware', () => {
    const respondWhenEnded = () => {
      const response = { headersSent: false, writableEnded: false }
      return {
        response: response as unknown as ServerResponse,
        end: () => {
          response.writableEnded = true
        },
      }
    }
    const request = {} as IncomingMessage

    it('runs each plugin in order until one responds', async () => {
      const calls: string[] = []
      const { response, end } = respondWhenEnded()
      const handle = composeDevMiddleware([
        { name: 'first', devMiddleware: () => void calls.push('first') },
        { name: 'quiet' },
        {
          name: 'second',
          devMiddleware: async () => {
            await new Promise((resolve) => setTimeout(resolve, 10))
            calls.push('second')
            end()
          },
        },
        { name: 'third', devMiddleware: () => void calls.push('third') },
      ])

      expect(await handle(request, response)).toBe(true)
      expect(calls).toEqual(['first', 'second'])
    })

    it('reports a request no plugin responded to', async () => {
      const handle = composeDevMiddleware([
        { name: 'quiet', devMiddleware: () => {} },
      ])

      expect(await handle(request, respondWhenEnded().response)).toBe(false)
    })

    it('names the plugin whose middleware failed and keeps the cause', async () => {
      const failure = new Error('boom')
      const handle = composeDevMiddleware([
        {
          name: 'broken',
          devMiddleware: () => {
            throw failure
          },
        },
      ])

      const error = await handle(request, respondWhenEnded().response).catch(
        (caught: unknown) => caught,
      )

      expect((error as Error).message).toBe(
        'Plugin "broken" failed in devMiddleware: boom',
      )
      expect((error as Error).cause).toBe(failure)
    })
  })

  describe('merging by name', () => {
    it('builds components from the resolved site config', () => {
      const config = resolveSiteConfig({
        rootDir: process.cwd(),
        siteTitle: 'Docs',
      })
      const components = resolvePluginComponents(
        [
          {
            name: 'titled',
            components: (siteConfig) => ({
              siteTitle: { title: siteConfig.siteTitle },
            }),
          },
          { name: 'other', components: () => ({ badge: {} }) },
        ],
        config,
      )

      expect(components).toEqual({ siteTitle: { title: 'Docs' }, badge: {} })
    })

    it.each([
      [
        'skin',
        (plugins: PureStackPlugin[]) => withPluginSkins(plugins, () => {}),
        { skins: { shared: standardSkin } },
      ],
      [
        'component',
        (plugins: PureStackPlugin[]) =>
          resolvePluginComponents(
            plugins,
            resolveSiteConfig({ rootDir: process.cwd() }),
          ),
        { components: () => ({ shared: {} }) },
      ],
      [
        'template',
        (plugins: PureStackPlugin[]) => resolvePluginTemplates(plugins),
        { templates: { shared: () => h('html') } },
      ],
    ])('rejects two plugins defining the same %s', (kind, resolve, fields) => {
      expect(() =>
        resolve([
          { name: 'alpha', ...fields },
          { name: 'beta', ...fields },
        ]),
      ).toThrow(`Plugins "alpha" and "beta" both define the ${kind} "shared".`)
    })

    it('rejects a components function that returns something else', () => {
      expect(() =>
        resolvePluginComponents(
          [{ name: 'broken', components: () => [] as never }],
          resolveSiteConfig({ rootDir: process.cwd() }),
        ),
      ).toThrow(
        'Plugin "broken" needs `components` to return an object of components.',
      )
    })
  })

  describe('validation', () => {
    const check = (plugins: unknown) => () =>
      assertValidPlugins(plugins as PureStackPlugin[])

    it('accepts a complete plugin', () => {
      expect(
        check([
          {
            name: 'complete',
            skins: { complete: standardSkin },
            components: () => ({}),
            templates: { landing: () => h('html') },
            hooks: { onBuildComplete: () => {} },
          },
        ]),
      ).not.toThrow()
    })

    it('accepts a hook turned off with undefined, but still checks its name', () => {
      expect(
        check([{ name: 'conditional', hooks: { onPageRendered: undefined } }]),
      ).not.toThrow()
      expect(
        check([{ name: 'conditional', hooks: { onPageRender: undefined } }]),
      ).toThrow('Plugin "conditional" has an unknown hook "onPageRender".')
    })

    it.each([
      [{}, 'Plugin 1 needs a name.'],
      [{ name: ' ' }, 'Plugin 1 needs a name.'],
      [null, 'Plugin 1 must be an object.'],
      [
        { name: 'typo', hook: {} },
        'Plugin "typo" has an unknown field "hook". Plugin fields: name, defaults, skins, components, templates, head, headConfig, styles, search, markdown, pages, devMiddleware, hooks.',
      ],
      [
        { name: 'typo', hooks: { onPageRender: () => {} } },
        'Plugin "typo" has an unknown hook "onPageRender". Hooks: onConfigResolved, onContentDiscovered, onNavigationBuilt, onPageStart, onPageDocument, onPageRendered, onPageWritten, onStylesWritten, onBuildComplete.',
      ],
      [
        { name: 'bad', hooks: { onBuildComplete: 'later' } },
        'Plugin "bad" needs the hook "onBuildComplete" to be a function.',
      ],
      [
        { name: 'bad', hooks: [] },
        'Plugin "bad" needs `hooks` to be an object of hooks.',
      ],
      [
        { name: 'bad', components: { card: {} } },
        'Plugin "bad" needs `components` to be a function that returns components.',
      ],
      [
        { name: 'bad', defaults: 'yes' },
        'Plugin "bad" needs `defaults` to be a boolean.',
      ],
      [
        { name: 'bad', head: {} },
        'Plugin "bad" needs `head` to be a head template.',
      ],
      [
        { name: 'bad', headConfig: {} },
        'Plugin "bad" needs `headConfig` to be a head configuration template.',
      ],
      [
        { name: 'bad', styles: {} },
        'Plugin "bad" needs `styles` to be a stylesheet provider.',
      ],
      [
        { name: 'bad', templates: { landing: '<html>' } },
        'Plugin "bad" needs the template "landing" to be a function.',
      ],
      [
        { name: 'bad', skins: { brand: {} } },
        'Plugin "bad" needs the skin "brand" to have a create() function.',
      ],
      [
        { name: 'bad', pages: [] },
        'Plugin "bad" needs `pages` to be a function that returns pages.',
      ],
      [
        { name: 'bad', devMiddleware: {} },
        'Plugin "bad" needs `devMiddleware` to be a function that handles requests.',
      ],
      [
        { name: 'bad', markdown: [] },
        'Plugin "bad" needs `markdown` to be an object of remark and rehype plugins.',
      ],
      [
        { name: 'typo', markdown: { remark: [] } },
        'Plugin "typo" has an unknown markdown field "remark". Markdown fields: remarkPlugins, rehypePlugins, rehypePostPlugins, resolveHighlighter, createHighlighter.',
      ],
      [
        { name: 'bad', markdown: { rehypePlugins: () => {} } },
        'Plugin "bad" needs `markdown.rehypePlugins` to be a list of plugins.',
      ],
      [
        { name: 'bad', markdown: { rehypePostPlugins: () => {} } },
        'Plugin "bad" needs `markdown.rehypePostPlugins` to be a list of plugins.',
      ],
      [
        { name: 'brand', skins: { standard: standardSkin } },
        'Plugin "brand" cannot replace the built-in skin "standard". Give its skin another name.',
      ],
    ])('rejects %j', (plugin, message) => {
      expect(check([plugin])).toThrow(message)
    })

    it('rejects a plugin list that is not an array', () => {
      expect(check({ name: 'docs' })).toThrow(
        '`plugins` must be an array of plugins.',
      )
    })

    it('rejects repeated plugins', () => {
      expect(check([{ name: 'docs' }, { name: 'docs' }])).toThrow(
        'The plugin "docs" is listed more than once.',
      )
    })
  })

  describe('skins', () => {
    it('registers plugin skins only while the site config resolves', () => {
      const plugin = { name: 'temp', skins: { 'temp-skin': standardSkin } }

      const registered = withPluginSkins(
        [plugin],
        () => 'temp-skin' in themeSkins,
      )

      expect(registered).toBe(true)
      expect('temp-skin' in themeSkins).toBe(false)
    })

    it('restores a same-named skin registered outside plugins, even after a failure', () => {
      const outside = { create: () => themeSkins.standard.create() }
      registerSkin('shared-skin', outside)
      try {
        const plugin = {
          name: 'shadow',
          skins: { 'shared-skin': standardSkin },
        }

        expect(() =>
          withPluginSkins([plugin], () => {
            expect(themeSkins['shared-skin']).toBe(standardSkin)
            throw new Error('Resolution failed.')
          }),
        ).toThrow('Resolution failed.')
        expect(themeSkins['shared-skin']).toBe(outside)
      } finally {
        delete themeSkins['shared-skin']
      }
    })
  })

  it('builds a site from every kind of plugin extension', async () => {
    const root = await makeRepoTempDir('.tmp-ts-ssg-plugin-')
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await fs.mkdir(contentDir, { recursive: true })
      await fs.writeFile(
        path.join(contentDir, 'index.mdx'),
        [
          '---',
          'template: landing',
          '---',
          '<Greeting name="Ada" />',
          '',
          'Page note.',
          '',
          '```diagram',
          'custom block',
          '```',
          '',
          '<Panel>',
          '```diagram',
          'nested block',
          '```',
          '</Panel>',
          '',
          '```ts',
          'const answer = 42',
          '```',
        ].join('\n'),
      )
      await fs.writeFile(path.join(contentDir, 'header.mdx'), 'Header note.')
      const markParagraphs =
        () =>
        (tree: { children?: unknown[] }): void => {
          const visit = (node: {
            tagName?: string
            properties?: object
            children?: unknown[]
          }) => {
            if (node.tagName === 'p') node.properties = { className: ['noted'] }
            for (const child of node.children ?? []) visit(child as never)
          }
          visit(tree)
        }
      const calls: string[] = []
      const plugin = definePlugin({
        name: 'landing',
        skins: { 'plugin-skin': standardSkin },
        components: () => ({
          greeting: defineComponent<{ name?: string }>(
            html`<p class="greeting">Hello {{ name }}</p>`,
            { props: ['name'] },
          ),
        }),
        templates: {
          landing: ({ head, bodyHtml, headerHtml }) =>
            h('html').push(
              head,
              h('body')
                .attr({ class: 'landing' })
                .push(h('').raw(headerHtml ?? ''))
                .raw(bodyHtml),
            ),
        },
        markdown: {
          rehypePlugins: [markParagraphs],
          resolveHighlighter: async (lang) =>
            lang === 'diagram'
              ? async (code) => `<figure r-pre>${code}</figure>`
              : null,
        },
        hooks: {
          onConfigResolved: () => {
            calls.push('config')
          },
          onPageWritten: (_context, page) => {
            calls.push(`written:${page.urlPath}`)
          },
        },
      })

      await buildSite({
        siteConfig: {
          rootDir: root,
          contentDir,
          outDir,
          style: { theme: { skin: 'plugin-skin' } },
        },
        options: { plugins: [plugin] },
      })

      const pageHtml = await fs.readFile(
        path.join(outDir, 'index.html'),
        'utf8',
      )
      expect(pageHtml).toContain('<body class="landing">')
      expect(pageHtml).toContain('Hello Ada')
      expect(pageHtml).toContain('<figure r-pre>custom block</figure>')
      expect(pageHtml).toContain('<figure r-pre>nested block</figure>')
      expect(pageHtml).toContain('language-typescript')
      // Content plugins reach pages and shared partials alike.
      expect(pageHtml).toContain('<p class="noted">Page note.</p>')
      expect(pageHtml).toContain('<p class="noted">Header note.</p>')
      // An unknown skin would have failed config resolution before this point.
      expect(calls).toEqual(['config', 'written:/'])
      // The skin belonged to that build; a later one cannot select it.
      expect(() =>
        resolveSiteConfig({
          rootDir: root,
          style: { theme: { skin: 'plugin-skin' } },
        }),
      ).toThrow('Unknown theme skin "plugin-skin"')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })
})
