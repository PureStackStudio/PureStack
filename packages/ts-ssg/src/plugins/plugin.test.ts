import fs from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'
import { h } from '@purestack/ts-html'
import { registerSkin, themeSkins } from '@purestack/ts-style'
import { disableLogger, getLogger, type Logger } from 'logpot'
import { defineComponent, html } from 'regor'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
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
        'Plugin "typo" has an unknown field "hook". Plugin fields: name, skins, components, templates, markdown, pages, devMiddleware, hooks.',
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
        'Plugin "typo" has an unknown markdown field "remark". Markdown fields: remarkPlugins, rehypePlugins.',
      ],
      [
        { name: 'bad', markdown: { rehypePlugins: () => {} } },
        'Plugin "bad" needs `markdown.rehypePlugins` to be a list of plugins.',
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
        markdown: { rehypePlugins: [markParagraphs] },
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
