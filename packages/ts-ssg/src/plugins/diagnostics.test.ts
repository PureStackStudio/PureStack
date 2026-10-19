import { h } from '@purestack/ts-html'
import type { Root } from 'mdast'
import type { Plugin, Transformer } from 'unified'
import { describe, expect, it } from 'vitest'
import { resolveSiteConfig } from '../config/config'
import { normalizeFrontmatter } from '../frontmatter/frontmatter'
import { compileMarkdown } from '../mdx/md'
import {
  resolvePluginHeadConfigTemplates,
  resolvePluginHeadTemplates,
} from './contributions'
import { resolvePluginContentProcessor } from './markdown'
import {
  createPluginHighlighter,
  resolvePluginHighlighter,
  resolvePluginSearch,
  resolvePluginStyles,
  resolvePluginTemplates,
} from './plugin'

declare module 'unified' {
  interface Settings {
    pluginTestOption?: string
  }
}

describe('plugin diagnostics and composition', () => {
  const site = resolveSiteConfig({ rootDir: process.cwd() })
  const input = {
    site,
    pageInfo: {
      relPath: 'index.md',
      urlPath: '/',
      frontmatter: normalizeFrontmatter({}),
    },
    head: h('head'),
    bodyHtml: '',
    templateName: 'doc',
  }
  const cause = new Error('integration failed')

  it.each([undefined, null, 42, [], [42]])(
    'attributes malformed Markdown plugin declarations (%j)',
    (value) => {
      expect(() =>
        resolvePluginContentProcessor([
          { name: 'invalid', markdown: { remarkPlugins: [value] as never } },
        ]),
      ).toThrow(
        'Plugin "invalid" failed in markdown.remarkPlugins: Expected a unified plugin, plugin tuple, or preset.',
      )
    },
  )

  it.each(['head', 'headConfig', 'template'] as const)(
    'attributes async %s failures and retains the original cause',
    async (kind) => {
      const fail = async () => {
        await Promise.resolve()
        throw cause
      }
      const render =
        kind === 'head'
          ? resolvePluginHeadTemplates([{ name: 'broken', head: fail }])[0]
          : kind === 'headConfig'
            ? resolvePluginHeadConfigTemplates([
                { name: 'broken', headConfig: fail },
              ])[0]
            : resolvePluginTemplates([
                { name: 'broken', templates: { doc: fail } },
              ]).doc
      await expect(render(input)).rejects.toMatchObject({
        message: `Plugin "broken" failed in ${kind === 'template' ? 'templates.doc' : kind}: integration failed`,
        cause,
      })
    },
  )

  it.each(['head', 'headConfig'] as const)(
    'rejects invalid %s results at the owning plugin',
    async (kind) => {
      const plugin = { name: 'invalid', [kind]: () => undefined } as never
      const render =
        kind === 'head'
          ? resolvePluginHeadTemplates([plugin])[0]
          : resolvePluginHeadConfigTemplates([plugin])[0]
      await expect(render(input)).rejects.toThrow(
        `Plugin "invalid" failed in ${kind}:`,
      )
    },
  )

  it.each(['remarkPlugins', 'rehypePlugins', 'rehypePostPlugins'] as const)(
    'attributes setup, synchronous, async, and callback failures in %s',
    async (field) => {
      const transforms: Plugin[] = [
        () => {
          throw cause
        },
        () => () => {
          throw cause
        },
        () => async () => {
          await Promise.resolve()
          throw cause
        },
        () => (_tree, _file, next) => {
          queueMicrotask(() => next(cause))
        },
      ]
      for (const transform of transforms) {
        const run = async () =>
          compileMarkdown('# Home', {
            contentProcessor: resolvePluginContentProcessor([
              { name: 'broken', markdown: { [field]: [transform] } },
            ]),
          })
        await expect(run()).rejects.toMatchObject({
          message: `Plugin "broken" failed in markdown.${field}: integration failed`,
          cause,
        })
      }
    },
  )

  it('preserves presets, settings, shared plugin option merging, disabled plugins, and callback success', async () => {
    let initializations = 0
    let settings: unknown
    let options: unknown
    const marker: Plugin<[{ first?: boolean; second?: boolean }], Root> =
      function (value) {
        initializations++
        settings = this.data('settings')
        options = value
        return (tree, file, next) => {
          queueMicrotask(() => {
            tree.children.push({
              type: 'paragraph',
              children: [{ type: 'text', value: 'Added by callback' }],
            })
            next(undefined, tree, file)
          })
        }
      }
    const disabled = () => {
      throw new Error('disabled plugin ran')
    }
    const processor = resolvePluginContentProcessor([
      {
        name: 'first',
        markdown: {
          remarkPlugins: [
            {
              settings: { pluginTestOption: 'present' },
              plugins: [
                [marker, { first: true }],
                [disabled, false],
              ],
            },
          ],
        },
      },
      {
        name: 'second',
        markdown: { remarkPlugins: [[marker, { second: true }]] },
      },
    ])
    const output = await compileMarkdown('# Home', {
      contentProcessor: processor,
    })
    expect(output.bodyHtml).toContain('Added by callback')
    expect(initializations).toBe(1)
    expect(options).toEqual({ first: true, second: true })
    expect(settings).toMatchObject({ pluginTestOption: 'present' })
  })

  it('preserves synchronous transformer return values', async () => {
    const transform: Transformer<Root> = (tree) => ({
      ...tree,
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'Replacement' }],
        },
      ],
    })
    const output = await compileMarkdown('# Original', {
      contentProcessor: resolvePluginContentProcessor([
        { name: 'replace', markdown: { remarkPlugins: [() => transform] } },
      ]),
    })
    expect(output.bodyHtml).toBe('<p>Replacement</p>')
  })

  it('attributes stylesheet and search operation failures, including async rejection', async () => {
    const styles = resolvePluginStyles(
      [
        {
          name: 'style-engine',
          styles: () => ({
            revision: 0,
            links: () => {
              throw cause
            },
            write: async () => {
              throw cause
            },
          }),
        },
      ],
      site,
    )
    expect(() => styles?.links()).toThrow(
      'Plugin "style-engine" failed in styles.links: integration failed',
    )
    await expect(styles?.write({ outDir: '' })).rejects.toMatchObject({
      cause,
      message:
        'Plugin "style-engine" failed in styles.write: integration failed',
    })
    const search = resolvePluginSearch(
      [
        {
          name: 'search-engine',
          search: () => ({
            ownsPath: () => {
              throw cause
            },
            write: async () => {
              throw cause
            },
          }),
        },
      ],
      site,
    )
    expect(() => search?.ownsPath('/search')).toThrow(
      'Plugin "search-engine" failed in search.ownsPath: integration failed',
    )
    await expect(
      search?.write({ outDir: '', excludeFiles: [] }),
    ).rejects.toMatchObject({
      cause,
      message:
        'Plugin "search-engine" failed in search.write: integration failed',
    })
  })

  it('attributes both custom resolver callbacks and default backend rendering failures', async () => {
    const custom = resolvePluginHighlighter(
      [
        {
          name: 'custom',
          markdown: {
            resolveHighlighter: () => async () => {
              throw cause
            },
          },
        },
      ],
      undefined,
    )
    await expect(custom?.codeToHtml('code', 'custom')).rejects.toMatchObject({
      cause,
      message:
        'Plugin "custom" failed in markdown.resolveHighlighter: integration failed',
    })
    const backend = await createPluginHighlighter(
      [
        {
          name: 'backend',
          markdown: {
            createHighlighter: () => ({
              codeToHtml: () => {
                throw cause
              },
            }),
          },
        },
      ],
      { mdx: {}, cache: true },
    )
    await expect(backend?.codeToHtml('code')).rejects.toMatchObject({
      cause,
      message:
        'Plugin "backend" failed in markdown.createHighlighter.codeToHtml: integration failed',
    })
  })
})
