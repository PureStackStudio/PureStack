import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { resolveSiteConfig } from '../config/config'
import type { ContentFile } from '../discover/content'
import { discoverContent } from '../discover/content'
import { buildNavigation } from '../navigation/navigation'
import { initBuiltinComponents } from '../regor/initBuiltinComponents'
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
        { config },
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
        { config },
        toContentFile(contentDir, 'index.md'),
      )

      expect(page.bodyHtml).toContain('&#x3C;Badge tone="accent" />')
      expect(page.bodyHtml).not.toContain('<Badge tone="accent" />')
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
        { config },
        toContentFile(contentDir, 'index.md'),
      )

      expect(page.frontmatter.layout.showToc).toBe(true)
      expect(page.html).toContain('class="doc-toc"')
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

      const config = resolveSiteConfig({ rootDir: root, contentDir, outDir })
      const page = await renderPageFromFile(
        { config },
        toContentFile(contentDir, path.join('docs', 'getting-started.md')),
      )

      expect(page.bodyHtml).toContain('href="/docs/usage/reads-and-writes/"')
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
        { config },
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
        { config },
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
      expect(page.html).toContain(
        'property="og:title" content="Docs Preview"',
      )
      expect(page.html).toContain(
        'property="og:image" content="https://example.com/product/assets/docs-preview.png"',
      )
      expect(page.html).toContain(
        'property="og:image:width" content="640"',
      )
      expect(page.html).toContain(
        'property="og:image:height" content="320"',
      )
      expect(page.html).toContain(
        'name="twitter:card" content="summary_large_image"',
      )
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
        { config, navigation },
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

function toContentFile(contentDir: string, relPath: string): ContentFile {
  return {
    absPath: path.join(contentDir, relPath),
    relPath,
    ext: path.extname(relPath),
  }
}
