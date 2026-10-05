import fs from 'node:fs/promises'
import path from 'node:path'
import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { readManifest } from '../build/manifest'
import { buildSite } from '../build/site'
import { resolveSiteConfig } from '../config/config'
import { readContentSource } from '../discover/content-source'
import { parseFrontmatterSource } from '../frontmatter/frontmatter'
import { resolveContentFiles } from '../i18n/content'
import { makeRepoTempDir } from '../test/repoTempDir'
import { generatePluginPages } from './generated-pages'
import { definePlugin, type PureStackPlugin } from './plugin'

const config = resolveSiteConfig({ rootDir: process.cwd() })
const files = resolveContentFiles(config, [
  { absPath: '', relPath: 'blog/first.mdx', ext: '.mdx' },
])

function generate(...plugins: PureStackPlugin[]) {
  return generatePluginPages(plugins, config, files)
}

/** Builds one page per tag found in the blog's frontmatter. */
const tagPagesPlugin = definePlugin({
  name: 'tags',
  async pages({ files: contentFiles }) {
    const posts = new Map<string, string[]>()
    for (const file of contentFiles) {
      if (!file.relPath.replaceAll('\\', '/').startsWith('blog/')) continue
      const source = await fs.readFile(file.absPath, 'utf8')
      const { frontmatter } = parseFrontmatterSource(source, file.relPath)
      for (const tag of (frontmatter.tags as string[] | undefined) ?? []) {
        posts.set(tag, [...(posts.get(tag) ?? []), String(frontmatter.title)])
      }
    }
    return [...posts].map(([tag, titles]) => ({
      path: `tags/${tag}.mdx`,
      source: [
        '---',
        `title: ${tag}`,
        '---',
        ...titles.map((t) => `- ${t}`),
      ].join('\n'),
    }))
  },
})

describe('generated pages', () => {
  let logger: Logger | undefined

  beforeAll(() => {
    disableLogger()
    logger = getLogger()
  })

  afterAll(async () => {
    await logger?.close()
  })

  it('turns generated pages into content files with their source', async () => {
    const generated = await generate({
      name: 'index',
      pages: ({ files: contentFiles }) => [
        { path: 'blog/index.mdx', source: `${contentFiles.length} posts` },
      ],
    })

    expect(generated).toEqual([
      {
        absPath: path.join(config.contentDir, 'blog', 'index.mdx'),
        relPath: path.join('blog', 'index.mdx'),
        ext: '.mdx',
        source: '1 posts',
      },
    ])
  })

  it.each([
    [() => 'nope', 'Plugin "bad" needs `pages` to return a list of pages.'],
    [
      () => ['page.mdx'],
      'Plugin "bad" needs each generated page to be an object with path and source.',
    ],
    [
      () => [{ path: 'a.mdx', source: '', title: 'A' }],
      'Plugin "bad" has an unknown generated page field "title". Page fields: path, source.',
    ],
    [
      () => [{ path: ' ', source: '' }],
      'Plugin "bad" needs each generated page to have a path.',
    ],
    [
      () => [{ path: 'a.mdx' }],
      'Plugin "bad" needs the generated page "a.mdx" to have a source: its text, or a function that returns it.',
    ],
    [
      () => [{ path: '../outside.mdx', source: '' }],
      'Plugin "bad" needs the generated page "../outside.mdx" to stay inside the content folder.',
    ],
    [
      () => [{ path: '/abs.mdx', source: '' }],
      'Plugin "bad" needs the generated page "/abs.mdx" to stay inside the content folder.',
    ],
    [
      () => [{ path: 'feed.xml', source: '' }],
      'Plugin "bad" needs the generated page "feed.xml" to end in .md, .mdx, or .rmdx.',
    ],
    [
      () => [{ path: 'guides/header.mdx', source: '' }],
      'Plugin "bad" cannot generate "guides/header.mdx"; headers and footers are written as files.',
    ],
    [
      () => [{ path: 'blog/first.mdx', source: '' }],
      'Plugin "bad" generates "blog/first.mdx", which is already a content file.',
    ],
    [
      () => {
        throw new Error('Feed unavailable.')
      },
      'Plugin "bad" failed in pages: Feed unavailable.',
    ],
  ])(
    'rejects a generator that returns or throws %#',
    async (pages, message) => {
      await expect(
        generate({
          name: 'bad',
          pages: pages as unknown as PureStackPlugin['pages'],
        }),
      ).rejects.toThrow(message)
    },
  )

  it('keeps a source function and calls it only when the text is read', async () => {
    let calls = 0
    const [page] = await generate({
      name: 'lazy',
      pages: () => [
        {
          path: 'status.mdx',
          source: async () => {
            calls += 1
            return '# Status'
          },
        },
      ],
    })

    expect(calls).toBe(0)
    expect(await readContentSource(page)).toBe('# Status')
    expect(calls).toBe(1)
  })

  it.each([
    [
      () => {
        throw new Error('Store offline.')
      },
      'Plugin "bad" failed in the source of "status.mdx": Store offline.',
    ],
    [
      () => 42,
      'Plugin "bad" needs the source of "status.mdx" to return a string.',
    ],
  ])(
    'names the plugin when a source function fails %#',
    async (source, message) => {
      const [page] = await generate({
        name: 'bad',
        pages: () => [
          { path: 'status.mdx', source: source as unknown as () => string },
        ],
      })

      await expect(readContentSource(page)).rejects.toThrow(message)
    },
  )

  it('generates once per build and reads a source function only for navigation and rendering', async () => {
    const root = await makeRepoTempDir('.tmp-ts-ssg-generated-')
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await fs.mkdir(contentDir, { recursive: true })
      await fs.writeFile(path.join(contentDir, 'index.mdx'), '# Home')
      const reads: string[] = []
      let generations = 0
      const statusPlugin = definePlugin({
        name: 'status',
        pages: () => {
          generations += 1
          return [
            {
              path: 'status.mdx',
              source: () => {
                reads.push('status')
                return ['---', 'title: Status', '---', 'All systems go.'].join(
                  '\n',
                )
              },
            },
          ]
        },
      })

      const build = (mode: 'none' | 'auto') =>
        buildSite({
          siteConfig: {
            rootDir: root,
            contentDir,
            outDir,
            navigation: { mode },
          },
          options: { plugins: [statusPlugin] },
        })

      // Without navigation, only rendering needs the text.
      await build('none')
      expect(generations).toBe(1)
      expect(reads).toHaveLength(1)
      const statusHtml = await fs.readFile(
        path.join(outDir, 'status', 'index.html'),
        'utf8',
      )
      expect(statusHtml).toContain('All systems go.')

      // Navigation reads the page's frontmatter from the same function.
      generations = 0
      reads.length = 0
      await build('auto')
      expect(generations).toBe(1)
      expect(reads).toHaveLength(2)
      const homeHtml = await fs.readFile(
        path.join(outDir, 'index.html'),
        'utf8',
      )
      expect(homeHtml).toMatch(/<a [^>]*href="\/status\/"[^>]*>[\s\S]*?Status/)
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('rejects two plugins generating the same page', async () => {
    const page = { path: 'about.mdx', source: '' }

    await expect(
      generate(
        { name: 'first', pages: () => [page] },
        { name: 'second', pages: () => [page] },
      ),
    ).rejects.toThrow('Plugins "first" and "second" both generate "about.mdx".')
  })

  it('builds generated pages like files, with links, navigation, and a manifest entry', async () => {
    const root = await makeRepoTempDir('.tmp-ts-ssg-generated-')
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await fs.mkdir(path.join(contentDir, 'blog'), { recursive: true })
      await fs.writeFile(
        path.join(contentDir, 'blog', 'first.mdx'),
        [
          '---',
          'title: First post',
          'tags: [regor]',
          '---',
          '[More on Regor](../tags/regor)',
        ].join('\n'),
      )
      await fs.writeFile(path.join(contentDir, 'index.mdx'), '# Home')

      await buildSite({
        siteConfig: { rootDir: root, contentDir, outDir },
        options: { plugins: [tagPagesPlugin] },
      })

      const tagHtml = await fs.readFile(
        path.join(outDir, 'tags', 'regor', 'index.html'),
        'utf8',
      )
      expect(tagHtml).toContain('<li>First post</li>')
      const postHtml = await fs.readFile(
        path.join(outDir, 'blog', 'first', 'index.html'),
        'utf8',
      )
      expect(postHtml).toContain('href="/tags/regor/"')
      const manifest = await readManifest(outDir)
      expect(manifest?.content[path.join('tags', 'regor.mdx')]?.outPath).toBe(
        path.join(outDir, 'tags', 'regor', 'index.html'),
      )
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })
})
