import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import type { SiteConfig } from '@purestack/ts-common'
import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { resolveSiteConfig } from '../config/config'
import { discoverContent, discoverStaticAssets } from '../discover/content'
import {
  buildTranslationsByKey,
  type ResolvedContentFile,
  resolveContentFile,
  resolveContentFiles,
  resolvePlainContentFile,
} from '../i18n/content'
import { buildNavigation } from '../navigation/navigation'
import { initBuiltinComponents } from '../regor/initBuiltinComponents'
import { ContentRouteIndex } from './content-urls'
import { renderPageFromFile } from './page'

async function writeFile(filePath: string, contents = '') {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, contents)
}

describe('page content compilation', () => {
  let logger: Logger | undefined

  beforeAll(() => {
    disableLogger()
    logger = getLogger()
    initBuiltinComponents()
  })

  afterAll(async () => {
    await logger?.close()
  })

  it('compiles markdown pages through the MDX content pipeline', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-page-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'index.md'),
        ['# Home', '', '<Badge tone="accent" />'].join('\n'),
      )

      const config = resolveSiteConfig({ rootDir: root, contentDir, outDir })
      const page = await renderPageFromFile(
        { config, contentRoutes: await indexContent(config) },
        toContentFile(contentDir, 'index.md'),
      )

      expect(page.bodyHtml).toContain('<Badge tone="accent" />')
      expect(page.bodyHtml).not.toContain('&#x3C;Badge tone="accent" />')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('keeps the markdown compiler route when compileMdAsMdx is false', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-page-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'index.md'),
        ['# Home', '', '<Badge tone="accent" />'].join('\n'),
      )

      const config = resolveSiteConfig({
        rootDir: root,
        contentDir,
        outDir,
        mdx: {
          compileMdAsMdx: false,
        },
      })
      const page = await renderPageFromFile(
        { config, contentRoutes: await indexContent(config) },
        toContentFile(contentDir, 'index.md'),
      )

      expect(page.bodyHtml).toContain('&#x3C;Badge tone="accent" />')
      expect(page.bodyHtml).not.toContain('<Badge tone="accent" />')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('compiles .rmdx pages as Regor MDX even when markdown stays plain', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-page-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'index.rmdx'),
        ['# Home', '', '<Badge tone="accent" />'].join('\n'),
      )

      const config = resolveSiteConfig({
        rootDir: root,
        contentDir,
        outDir,
        mdx: {
          compileMdAsMdx: false,
        },
      })
      const page = await renderPageFromFile(
        { config, contentRoutes: await indexContent(config) },
        toContentFile(contentDir, 'index.rmdx'),
      )

      expect(page.bodyHtml).toContain('<Badge tone="accent" />')
      expect(page.bodyHtml).not.toContain('&#x3C;Badge tone="accent" />')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('uses pageToc.enabled as the default toc behavior', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-page-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'index.md'),
        ['# Home', '', '## Section'].join('\n'),
      )

      const config = resolveSiteConfig({ rootDir: root, contentDir, outDir })
      const page = await renderPageFromFile(
        { config, contentRoutes: await indexContent(config) },
        toContentFile(contentDir, 'index.md'),
      )

      expect(page.frontmatter.layout.showToc).toBe(true)
      expect(page.html).toContain('class="doc-toc"')
      expect(page.html).toContain('href="#section"')
      expect(page.html).not.toContain('href="#home"')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('uses the first compiled heading as the page title when frontmatter has no title', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-page-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'getting-started.md'),
        ['# Getting Started', '', '## Install'].join('\n'),
      )

      const config = resolveSiteConfig({
        rootDir: root,
        contentDir,
        outDir,
        siteTitle: 'Docs',
      })
      const page = await renderPageFromFile(
        { config, contentRoutes: await indexContent(config) },
        toContentFile(contentDir, 'getting-started.md'),
      )

      expect(page.frontmatter.title).toBe('Getting Started')
      expect(page.pageInfo.frontmatter.title).toBe('Getting Started')
      expect(page.headConfig.title).toBe('Docs | Getting Started')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('does not render a toc shell when the only outline item is the page h1', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-page-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(path.join(contentDir, 'index.md'), '# Home')

      const config = resolveSiteConfig({ rootDir: root, contentDir, outDir })
      const page = await renderPageFromFile(
        { config, contentRoutes: await indexContent(config) },
        toContentFile(contentDir, 'index.md'),
      )

      expect(page.outline).toEqual([
        {
          id: 'home',
          title: 'Home',
          depth: 1,
        },
      ])
      expect(page.html).not.toContain('class="doc-toc"')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('keeps a single h2 as a visible toc item when the page has no h1', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-page-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(path.join(contentDir, 'index.md'), '## Section')

      const config = resolveSiteConfig({ rootDir: root, contentDir, outDir })
      const page = await renderPageFromFile(
        { config, contentRoutes: await indexContent(config) },
        toContentFile(contentDir, 'index.md'),
      )

      expect(page.outline).toEqual([
        {
          id: 'section',
          title: 'Section',
          depth: 2,
        },
      ])
      expect(page.html).toContain('class="doc-toc"')
      expect(page.html).toContain('href="#section"')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('rewrites raw markdown page links during page rendering', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-page-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'docs', 'getting-started.md'),
        '<a href="usage/reads-and-writes.md">read and write API</a>',
      )
      await writeFile(
        path.join(contentDir, 'docs', 'usage', 'reads-and-writes.md'),
        '# Reads and Writes',
      )

      const config = resolveSiteConfig({ rootDir: root, contentDir, outDir })
      const page = await renderPageFromFile(
        { config, contentRoutes: await indexContent(config) },
        toContentFile(contentDir, path.join('docs', 'getting-started.md')),
      )

      expect(page.html).toContain('href="/docs/usage/reads-and-writes/"')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('resolves every content link after Regor renders the page', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-page-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'guides', 'semantic-tones.mdx'),
        [
          '# Semantic tones',
          '',
          'Read [themes](./themes) and [palettes][palette].',
          '',
          '[palette]: ./themes#palette',
          '',
          '<a href="../">Home</a>',
          '',
          '<BtnLink href="./themes">Static button</BtnLink>',
          '',
          `<BtnLink :href="'./themes' + '#create-a-skin'">Computed button</BtnLink>`,
          '',
          '![Palette diagram](./images/palette.svg)',
          '',
          '```md',
          '[Missing](./missing)',
          '![Missing](./missing.png)',
          '```',
        ].join('\n'),
      )
      await writeFile(path.join(contentDir, 'guides', 'themes.mdx'), '# Themes')
      await writeFile(
        path.join(contentDir, 'guides', 'images', 'palette.svg'),
        '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
      )
      await writeFile(path.join(contentDir, 'index.mdx'), '# Home')

      const config = resolveSiteConfig({ rootDir: root, contentDir, outDir })
      const page = await renderPageFromFile(
        { config, contentRoutes: await indexContent(config) },
        toContentFile(contentDir, path.join('guides', 'semantic-tones.mdx')),
      )

      expect(page.html).toContain('<a href="/guides/themes/">themes</a>')
      expect(page.html).toContain('<a href="/guides/themes/#palette">')
      expect(page.html).toContain('<a href="/">Home</a>')
      expect(page.html).toMatch(/<a[^>]*href="\/guides\/themes\/"[^>]*>/)
      expect(page.html).toContain('href="/guides/themes/#create-a-skin"')
      expect(page.html).toContain(
        '<img src="/guides/images/palette.svg" alt="Palette diagram">',
      )
      expect(page.html).toContain('[Missing](./missing)')
      expect(page.html).toContain('![Missing](./missing.png)')
      expect(page.html).not.toMatch(/(href|src)="\.{1,2}\//)
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('resolves links on the plain markdown route', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-page-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(path.join(contentDir, 'index.md'), '[Docs](./docs/)')
      await writeFile(path.join(contentDir, 'docs', 'index.md'), '# Docs')

      const config = resolveSiteConfig({
        rootDir: root,
        contentDir,
        outDir,
        mdx: { compileMdAsMdx: false },
      })
      const page = await renderPageFromFile(
        { config, contentRoutes: await indexContent(config) },
        toContentFile(contentDir, 'index.md'),
      )

      expect(page.html).toContain('<a href="/docs/">Docs</a>')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('fails the page render when a content link matches no page', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-page-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'index.mdx'),
        '<BtnLink href="./themse">Themes</BtnLink>',
      )

      const config = resolveSiteConfig({ rootDir: root, contentDir, outDir })
      await expect(
        renderPageFromFile(
          { config, contentRoutes: await indexContent(config) },
          toContentFile(contentDir, 'index.mdx'),
        ),
      ).rejects.toThrow(
        'Content link "./themse" in "index.mdx" does not match any page or file.',
      )
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('applies basePath to rendered public URLs without changing logical routes', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-page-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'index.mdx'),
        [
          '<a href="/docs/">Docs</a>',
          '<a href="#local">Local anchor</a>',
          '<img src="/assets/logo.png" srcset="/assets/logo.png 1x, https://cdn.example.com/logo.png 2x"/>',
          '<BtnLink href="/signin/">Sign in</BtnLink>',
          '<PageScript src="./app.ts" />',
          '<PageScript src="/root-app.ts" />',
        ].join('\n'),
      )

      const config = resolveSiteConfig({
        rootDir: root,
        contentDir,
        outDir,
        basePath: '/admin-panel/',
      })
      const page = await renderPageFromFile(
        { config, contentRoutes: await indexContent(config) },
        toContentFile(contentDir, 'index.mdx'),
      )

      expect(page.urlPath).toBe('/')
      expect(page.outPath).toBe(path.join(outDir, 'index.html'))
      expect(page.html).toContain('href="/admin-panel/docs/"')
      expect(page.html).toContain('href="#local"')
      expect(page.html).toContain('src="/admin-panel/assets/logo.png"')
      expect(page.html).toContain('/admin-panel/assets/logo.png 1x')
      expect(page.html).toContain('https://cdn.example.com/logo.png 2x')
      expect(page.html).toContain('href="/admin-panel/signin/"')
      expect(page.html).toContain('src="/admin-panel/app.js"')
      expect(page.html).toContain('src="/admin-panel/root-app.js"')
      expect(page.scriptEntrypoints).toEqual(['app.ts', 'root-app.ts'])
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('renders social preview metadata from site and page config', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-page-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'docs', 'index.mdx'),
        [
          '---',
          'title: Docs Home',
          'description: Page description.',
          'preview:',
          '  title: Docs Preview',
          '  image: /assets/docs-preview.png',
          '  imageWidth: 640',
          '  imageHeight: 320',
          '---',
          '# Docs',
        ].join('\n'),
      )

      const config = resolveSiteConfig({
        rootDir: root,
        contentDir,
        outDir,
        basePath: '/product',
        sitemap: {
          enabled: true,
          baseUrl: 'https://example.com',
        },
        preview: {
          title: 'Site Preview',
          description: 'Site description.',
          image: '/assets/site-preview.png',
          imageAlt: 'Site preview image',
          imageWidth: 1200,
          imageHeight: 630,
          siteName: 'Example Docs',
          twitterCard: 'summary_large_image',
        },
      })
      const page = await renderPageFromFile(
        { config, contentRoutes: await indexContent(config) },
        toContentFile(contentDir, path.join('docs', 'index.mdx')),
      )

      expect(page.headConfig.canonicalUrl).toBe(
        'https://example.com/product/docs/',
      )
      expect(page.headConfig.openGraph).toMatchObject({
        title: 'Docs Preview',
        description: 'Page description.',
        url: 'https://example.com/product/docs/',
        image: 'https://example.com/product/assets/docs-preview.png',
        imageAlt: 'Site preview image',
        imageWidth: 640,
        imageHeight: 320,
        siteName: 'Example Docs',
      })
      expect(page.html).toContain(
        'rel="canonical" href="https://example.com/product/docs/"',
      )
      expect(page.html).toContain('property="og:title" content="Docs Preview"')
      expect(page.html).toContain(
        'property="og:image" content="https://example.com/product/assets/docs-preview.png"',
      )
      expect(page.html).toContain('property="og:image:width" content="640"')
      expect(page.html).toContain('property="og:image:height" content="320"')
      expect(page.html).toContain(
        'name="twitter:card" content="summary_large_image"',
      )
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('renders localized pages with lang and hreflang metadata for prefixed i18n', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-page-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'en', 'index.mdx'),
        ['---', 'title: Home', '---', '[Docs](docs/index.md)'].join('\n'),
      )
      await writeFile(
        path.join(contentDir, 'tr', 'index.mdx'),
        ['---', 'title: Ana Sayfa', '---', '[Docs](docs/index.md)'].join('\n'),
      )
      await writeFile(path.join(contentDir, 'en', 'docs', 'index.md'), '# Docs')

      const config = resolveSiteConfig({
        rootDir: root,
        contentDir,
        outDir,
        sitemap: {
          enabled: true,
          baseUrl: 'https://example.com',
        },
        i18n: {
          defaultLocale: 'en',
          locales: ['en', 'tr'],
          urlStrategy: 'prefix-all',
        },
      })
      const files = resolveContentFiles(
        config,
        await discoverContent(contentDir),
      )
      const page = await renderPageFromFile(
        {
          config,
          contentRoutes: await indexContent(config),
          translationsByKey: buildTranslationsByKey(files),
        },
        files.find((file) => file.relPath === 'en/index.mdx') ??
          resolveContentFile(
            config,
            toRawContentFile(contentDir, path.join('en', 'index.mdx')),
          ),
      )

      expect(page.urlPath).toBe('/en/')
      expect(page.outPath).toBe(path.join(outDir, 'en', 'index.html'))
      expect(page.pageInfo.locale).toBe('en')
      expect(page.pageInfo.translations).toEqual([
        { locale: 'en', relPath: 'en/index.mdx', urlPath: '/en/' },
        { locale: 'tr', relPath: 'tr/index.mdx', urlPath: '/tr/' },
      ])
      expect(page.html).toContain('<html lang="en">')
      expect(page.html).toContain('href="/en/docs/"')
      expect(page.html).toContain(
        'rel="alternate" hreflang="tr" href="https://example.com/tr/"',
      )
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('renders global root content normally when i18n is enabled', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-page-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'index.mdx'),
        [
          '---',
          'title: Language chooser',
          '---',
          '[Docs](/docs/index.md)',
        ].join('\n'),
      )
      await writeFile(path.join(contentDir, 'docs', 'index.md'), '# Docs')

      const config = resolveSiteConfig({
        rootDir: root,
        contentDir,
        outDir,
        sitemap: {
          enabled: true,
          baseUrl: 'https://example.com',
        },
        i18n: {
          defaultLocale: 'en',
          locales: ['en', 'tr'],
          urlStrategy: 'prefix-all',
        },
      })
      const page = await renderPageFromFile(
        { config, contentRoutes: await indexContent(config) },
        resolveContentFile(config, toRawContentFile(contentDir, 'index.mdx')),
      )

      expect(page.urlPath).toBe('/')
      expect(page.outPath).toBe(path.join(outDir, 'index.html'))
      expect(page.pageInfo.locale).toBeUndefined()
      expect(page.pageInfo.translationKey).toBeUndefined()
      expect(page.pageInfo.translations).toBeUndefined()
      expect(page.html).toContain('<html>')
      expect(page.html).toContain('href="/docs/"')
      expect(page.html).toContain('rel="canonical" href="https://example.com/"')
      expect(page.html).not.toContain('hreflang=')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('writes hidden i18n pages under locale folders while keeping public routes clean', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-page-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(path.join(contentDir, 'en', 'docs', 'index.md'), '# Docs')
      await writeFile(
        path.join(contentDir, 'tr', 'docs', 'index.md'),
        '# Belgeler',
      )

      const config = resolveSiteConfig({
        rootDir: root,
        contentDir,
        outDir,
        i18n: {
          defaultLocale: 'en',
          locales: ['en', 'tr'],
          urlStrategy: 'hidden',
        },
      })
      const files = resolveContentFiles(
        config,
        await discoverContent(contentDir),
      )
      const page = await renderPageFromFile(
        {
          config,
          contentRoutes: await indexContent(config),
          translationsByKey: buildTranslationsByKey(files),
        },
        files.find((file) => file.relPath === 'tr/docs/index.md') ??
          resolveContentFile(
            config,
            toRawContentFile(contentDir, path.join('tr', 'docs', 'index.md')),
          ),
      )

      expect(page.urlPath).toBe('/docs/')
      expect(page.outPath).toBe(path.join(outDir, 'tr', 'docs', 'index.html'))
      expect(page.html).toContain('<html lang="tr">')
      expect(page.html).not.toContain('rel="alternate"')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('renders previous and next page links when nav file enables pageLinks', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-page-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(path.join(contentDir, 'docs', 'index.md'), '# Docs')
      await writeFile(
        path.join(contentDir, 'docs', 'getting-started.md'),
        '# Getting Started',
      )
      await writeFile(
        path.join(contentDir, 'docs', 'usage', 'reads-and-writes.md'),
        '# Reads and Writes',
      )
      await writeFile(
        path.join(contentDir, 'docs', '_nav.json'),
        JSON.stringify(
          {
            pageLinks: true,
            sequence: [
              'index.md',
              'getting-started.md',
              'usage/reads-and-writes.md',
            ],
          },
          null,
          2,
        ),
      )

      const config = resolveSiteConfig({
        rootDir: root,
        contentDir,
        outDir,
        navigation: {
          mode: 'hybrid',
          maxDepth: 20,
          roots: ['docs'],
        },
      })
      const files = await discoverContent(contentDir)
      const navigation = await buildNavigation(contentDir, files, {
        mode: 'hybrid',
        maxDepth: 20,
        roots: ['docs'],
      })
      const page = await renderPageFromFile(
        { config, contentRoutes: await indexContent(config), navigation },
        toContentFile(contentDir, path.join('docs', 'getting-started.md')),
      )

      expect(page.navigation?.pageLinks).toEqual({
        previous: { title: 'Docs', url: '/docs/' },
        next: {
          title: 'Reads and Writes',
          url: '/docs/usage/reads-and-writes/',
        },
      })
      expect(page.html).toContain('rel="prev"')
      expect(page.html).toContain('href="/docs/"')
      expect(page.html).toContain('rel="next"')
      expect(page.html).toContain('href="/docs/usage/reads-and-writes/"')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })
})

async function indexContent(config: SiteConfig) {
  return new ContentRouteIndex(
    resolveContentFiles(config, await discoverContent(config.contentDir)),
    (await discoverStaticAssets(config.contentDir)).map((file) => file.relPath),
  )
}

function toContentFile(
  contentDir: string,
  relPath: string,
): ResolvedContentFile {
  return resolvePlainContentFile(toRawContentFile(contentDir, relPath))
}

function toRawContentFile(contentDir: string, relPath: string) {
  return {
    absPath: path.join(contentDir, relPath),
    relPath,
    ext: path.extname(relPath),
  }
}
