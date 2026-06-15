import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import type { ContentFile } from '../discover/content'
import { discoverContent } from '../discover/content'
import { buildNavigation, resolvePageNavigation } from './navigation'

async function withTempDir<T>(worker: (dir: string) => Promise<T>) {
  const base = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-nav-'))
  try {
    return await worker(base)
  } finally {
    await fs.rm(base, { recursive: true, force: true })
  }
}

describe('navigation', () => {
  let logger: Logger | undefined

  beforeAll(async () => {
    disableLogger()
    logger = getLogger()
  })

  afterAll(async () => {
    await logger?.close()
  })

  it('builds auto navigation with nested folders', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      await fs.mkdir(path.join(contentDir, 'guide'), { recursive: true })
      await fs.writeFile(
        path.join(contentDir, 'index.mdx'),
        `---\ntitle: Home\n---\n# Home\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'guide', 'index.mdx'),
        `---\ntitle: Guide\n---\n# Guide\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'guide', 'basics.mdx'),
        `---\ntitle: Basics\norder: 1\n---\n# Basics\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'guide', 'advanced.mdx'),
        `---\ntitle: Advanced\norder: 2\n---\n# Advanced\n`,
        'utf8',
      )

      const files = await discoverContent(contentDir)
      const nav = await buildNavigation(contentDir, files, { maxDepth: 2 })
      expect(nav).toBeTruthy()
      const rootItems = nav?.byFolder[''] ?? []
      expect(rootItems.map((item) => item.title)).toEqual(['Home', 'Guide'])
      const guide = rootItems.find((item) => item.title === 'Guide')
      expect(guide?.children?.map((item) => item.title)).toEqual([
        'Basics',
        'Advanced',
      ])
    })
  })

  it('applies custom navigation overrides', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      await fs.mkdir(contentDir, { recursive: true })
      await fs.writeFile(
        path.join(contentDir, 'index.mdx'),
        `---\ntitle: Home\n---\n# Home\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, '_nav.json'),
        JSON.stringify(
          {
            mode: 'override',
            items: [
              { title: 'Start', url: '/' },
              { title: 'Docs', url: '/guide/' },
            ],
          },
          null,
          2,
        ),
        'utf8',
      )

      const files = await discoverContent(contentDir)
      const nav = await buildNavigation(contentDir, files, { mode: 'hybrid' })
      const rootItems = nav?.byFolder[''] ?? []
      expect(rootItems.map((item) => item.title)).toEqual(['Start', 'Docs'])
    })
  })

  it('treats missing order as zero so negatives rise and positives sink', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      await fs.mkdir(contentDir, { recursive: true })
      await fs.writeFile(
        path.join(contentDir, 'top.mdx'),
        `---\ntitle: Top\nnav:\n  order: -1\n---\n# Top\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'middle-a.mdx'),
        `---\ntitle: Middle A\n---\n# Middle A\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'middle-b.mdx'),
        `---\ntitle: Middle B\n---\n# Middle B\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'bottom.mdx'),
        `---\ntitle: Bottom\nnav:\n  order: 1\n---\n# Bottom\n`,
        'utf8',
      )

      const files = await discoverContent(contentDir)
      const nav = await buildNavigation(contentDir, files)
      const rootItems = nav?.byFolder[''] ?? []

      expect(rootItems.map((item) => item.title)).toEqual([
        'Top',
        'Middle A',
        'Middle B',
        'Bottom',
      ])
    })
  })

  it('adds frontmatter nav badge and icon to generated items', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      await fs.mkdir(contentDir, { recursive: true })
      await fs.writeFile(
        path.join(contentDir, 'account.mdx'),
        [
          '---',
          'title: Account',
          'nav:',
          '  badge: Beta',
          '  icon: iconoir:user',
          '---',
          '# Account',
        ].join('\n'),
        'utf8',
      )

      const files = await discoverContent(contentDir)
      const nav = await buildNavigation(contentDir, files)
      const rootItems = nav?.byFolder[''] ?? []

      expect(rootItems).toEqual([
        {
          title: 'Account',
          url: '/account/',
          badge: 'Beta',
          icon: 'iconoir:user',
        },
      ])
    })
  })

  it('uses same-name folder pages as folder index navigation items', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      await fs.mkdir(path.join(contentDir, 'account'), { recursive: true })
      await fs.writeFile(
        path.join(contentDir, 'account', 'account.mdx'),
        `---\ntitle: Account\n---\n# Account\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'account', 'settings.mdx'),
        `---\ntitle: Settings\n---\n# Settings\n`,
        'utf8',
      )

      const files = await discoverContent(contentDir)
      const nav = await buildNavigation(contentDir, files, { maxDepth: 2 })
      const rootItems = nav?.byFolder[''] ?? []

      expect(rootItems).toEqual([
        {
          title: 'Account',
          url: '/account/',
          children: [{ title: 'Settings', url: '/account/settings/' }],
        },
      ])
    })
  })

  it('uses configured navigation roots for descendant pages', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      await fs.mkdir(path.join(contentDir, 'docs', 'usage'), {
        recursive: true,
      })
      await fs.writeFile(
        path.join(contentDir, 'index.mdx'),
        `---\ntitle: Home\n---\n# Home\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'docs', 'index.mdx'),
        `---\ntitle: Docs\n---\n# Docs\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'docs', 'getting-started.mdx'),
        `---\ntitle: Getting Started\n---\n# Getting Started\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'docs', 'usage', 'opening-a-tree.mdx'),
        `---\ntitle: Opening a Tree\n---\n# Opening a Tree\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'docs', 'usage', 'reads-and-writes.mdx'),
        `---\ntitle: Reads and Writes\n---\n# Reads and Writes\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'docs', 'usage', 'transactions.mdx'),
        `---\ntitle: Transactions\n---\n# Transactions\n`,
        'utf8',
      )

      const files = await discoverContent(contentDir)
      const nav = await buildNavigation(contentDir, files, {
        maxDepth: 20,
        roots: ['docs'],
      })
      const transactions = findContentFile(files, 'docs/usage/transactions.mdx')
      const pageNav = resolvePageNavigation(nav, transactions)

      expect(pageNav?.folder).toBe('docs/usage')
      expect(pageNav?.root).toBe('docs')
      expect(pageNav?.items.map((item) => item.title)).toEqual([
        'Docs',
        'Getting Started',
        'Usage',
      ])
      expect(pageNav?.items.find((item) => item.title === 'Usage')).toEqual({
        title: 'Usage',
        children: [
          { title: 'Opening a Tree', url: '/docs/usage/opening-a-tree/' },
          { title: 'Reads and Writes', url: '/docs/usage/reads-and-writes/' },
          { title: 'Transactions', url: '/docs/usage/transactions/' },
        ],
      })
    })
  })

  it('uses root navigation for descendant pages when no navigation roots are configured', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      await fs.mkdir(path.join(contentDir, 'guide'), { recursive: true })
      await fs.writeFile(
        path.join(contentDir, 'index.mdx'),
        `---\ntitle: Home\n---\n# Home\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'guide', 'index.mdx'),
        `---\ntitle: Guide\n---\n# Guide\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'guide', 'button-sample.mdx'),
        `---\ntitle: Button Sample\n---\n# Button Sample\n`,
        'utf8',
      )

      const files = await discoverContent(contentDir)
      const nav = await buildNavigation(contentDir, files, { maxDepth: 20 })
      const buttonSample = findContentFile(files, 'guide/button-sample.mdx')
      const pageNav = resolvePageNavigation(nav, buttonSample)

      expect(pageNav?.folder).toBe('guide')
      expect(pageNav?.root).toBe('')
      expect(pageNav?.items.map((item) => item.title)).toEqual([
        'Home',
        'Guide',
      ])
      expect(pageNav?.items.find((item) => item.title === 'Guide')).toEqual({
        title: 'Guide',
        url: '/guide/',
        children: [{ title: 'Button Sample', url: '/guide/button-sample/' }],
      })
    })
  })

  it('applies nav file sequence to mixed auto and custom items', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      await fs.mkdir(path.join(contentDir, 'docs', 'usage'), {
        recursive: true,
      })
      await fs.writeFile(
        path.join(contentDir, 'docs', 'index.mdx'),
        `---\ntitle: Docs\n---\n# Docs\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'docs', 'getting-started.mdx'),
        `---\ntitle: Getting Started\n---\n# Getting Started\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'docs', 'usage', 'opening-a-tree.mdx'),
        `---\ntitle: Opening a Tree\n---\n# Opening a Tree\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'docs', 'usage', 'reads-and-writes.mdx'),
        `---\ntitle: Reads and Writes\n---\n# Reads and Writes\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'docs', 'usage', 'transactions.mdx'),
        `---\ntitle: Transactions\n---\n# Transactions\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'docs', '_nav.json'),
        JSON.stringify(
          {
            mode: 'merge',
            sequence: [
              'index.md',
              'github',
              'usage/',
              'usage/reads-and-writes.md',
              'usage/opening-a-tree.md',
              'usage/transactions.md',
              'missing.md',
            ],
            items: [
              {
                id: 'github',
                title: 'GitHub',
                url: 'https://github.com/koculu/ZoneTree',
              },
            ],
          },
          null,
          2,
        ),
        'utf8',
      )

      const files = await discoverContent(contentDir)
      const nav = await buildNavigation(contentDir, files, {
        mode: 'hybrid',
        maxDepth: 20,
      })
      const items = nav?.byFolder['docs'] ?? []

      expect(items.map((item) => item.title)).toEqual([
        'Docs',
        'GitHub',
        'Usage',
        'Getting Started',
      ])
      expect(items[1]).toEqual({
        id: 'github',
        title: 'GitHub',
        url: 'https://github.com/koculu/ZoneTree',
      })
      expect(items[2]).toEqual({
        title: 'Usage',
        children: [
          { title: 'Reads and Writes', url: '/docs/usage/reads-and-writes/' },
          { title: 'Opening a Tree', url: '/docs/usage/opening-a-tree/' },
          { title: 'Transactions', url: '/docs/usage/transactions/' },
        ],
      })
    })
  })

  it('applies nav file icons to mixed auto and custom items', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      await fs.mkdir(path.join(contentDir, 'docs', 'usage'), {
        recursive: true,
      })
      await fs.writeFile(
        path.join(contentDir, 'docs', 'index.mdx'),
        `---\ntitle: Docs\n---\n# Docs\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'docs', 'usage', 'transactions.mdx'),
        `---\ntitle: Transactions\n---\n# Transactions\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'docs', '_nav.json'),
        JSON.stringify(
          {
            mode: 'merge',
            icons: {
              'index.md': 'iconoir:home',
              'usage/': 'iconoir:book',
              'usage/transactions.md': 'iconoir:database',
              github: 'iconoir:github',
            },
            items: [
              {
                id: 'github',
                title: 'GitHub',
                url: 'https://github.com/example/project',
              },
            ],
          },
          null,
          2,
        ),
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'docs', 'usage', '_nav.json'),
        JSON.stringify(
          {
            icons: {
              'transactions.md': 'iconoir:rocket',
            },
          },
          null,
          2,
        ),
        'utf8',
      )

      const files = await discoverContent(contentDir)
      const nav = await buildNavigation(contentDir, files, {
        mode: 'hybrid',
        maxDepth: 20,
      })
      const docsItems = nav?.byFolder['docs'] ?? []
      const usageItems = nav?.byFolder['docs/usage'] ?? []

      expect(docsItems.find((item) => item.title === 'Docs')?.icon).toBe(
        'iconoir:home',
      )
      expect(docsItems.find((item) => item.title === 'GitHub')?.icon).toBe(
        'iconoir:github',
      )
      expect(docsItems.find((item) => item.title === 'Usage')?.icon).toBe(
        'iconoir:book',
      )
      expect(
        usageItems.find((item) => item.title === 'Transactions')?.icon,
      ).toBe('iconoir:rocket')
    })
  })

  it('skips non-page nav items when resolving previous and next page links', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      await fs.mkdir(path.join(contentDir, 'docs'), { recursive: true })
      await fs.writeFile(
        path.join(contentDir, 'docs', 'index.mdx'),
        `---\ntitle: Docs\n---\n# Docs\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'docs', 'intro.mdx'),
        `---\ntitle: Intro\n---\n# Intro\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'docs', 'tutorial.mdx'),
        `---\ntitle: Tutorial\n---\n# Tutorial\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'docs', '_nav.json'),
        JSON.stringify(
          {
            mode: 'override',
            pageLinks: true,
            items: [
              { title: 'Docs', url: './' },
              { title: 'Intro', url: 'intro#top' },
              { title: 'Tutorial', url: 'tutorial?tab=reference' },
              { title: 'Download', url: '/assets/manual.pdf' },
              { title: 'GitHub', url: 'https://github.com/example/project' },
            ],
          },
          null,
          2,
        ),
        'utf8',
      )

      const files = await discoverContent(contentDir)
      const nav = await buildNavigation(contentDir, files, {
        mode: 'hybrid',
        maxDepth: 20,
        roots: ['docs'],
      })
      const intro = findContentFile(files, 'docs/intro.mdx')
      const pageNav = resolvePageNavigation(nav, intro)

      expect(pageNav?.pageLinks).toEqual({
        previous: { title: 'Docs', url: '/docs/' },
        next: { title: 'Tutorial', url: '/docs/tutorial/' },
      })
    })
  })
})

function findContentFile(files: ContentFile[], relPath: string): ContentFile {
  const file = files.find(
    (entry) => entry.relPath.replaceAll('\\', '/') === relPath,
  )
  if (!file) throw new Error(`Missing content file: ${relPath}`)
  return file
}
