import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { buildSitemapXml, writeSitemap } from './sitemap'

async function withTempDir<T>(worker: (dir: string) => Promise<T>) {
  const base = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-'))
  try {
    return await worker(base)
  } finally {
    await fs.rm(base, { recursive: true, force: true })
  }
}

describe('sitemap', () => {
  it('builds xml with sorted urls and lastmod tags', () => {
    const xml = buildSitemapXml('https://docs.example.com', [
      { urlPath: '/guide/', lastModifiedMs: 1_717_171_717_000 },
      { urlPath: '/' },
    ])
    expect(xml.indexOf('<loc>https://docs.example.com/</loc>')).toBeLessThan(
      xml.indexOf('<loc>https://docs.example.com/guide/</loc>'),
    )
    expect(xml).toContain('<lastmod>')
  })

  it('builds xml with a public base path', () => {
    const xml = buildSitemapXml(
      'https://docs.example.com',
      [{ urlPath: '/' }, { urlPath: '/api/' }],
      '/admin-panel',
    )
    expect(xml).toContain('<loc>https://docs.example.com/admin-panel/</loc>')
    expect(xml).toContain(
      '<loc>https://docs.example.com/admin-panel/api/</loc>',
    )
  })

  it('deduplicates repeated public URLs', () => {
    const xml = buildSitemapXml('https://docs.example.com', [
      { urlPath: '/docs/' },
      { urlPath: '/docs/' },
    ])

    expect(
      xml.match(/<loc>https:\/\/docs\.example\.com\/docs\/<\/loc>/g),
    ).toHaveLength(1)
  })

  it('writes sitemap.xml when enabled', async () => {
    await withTempDir(async (dir) => {
      const result = await writeSitemap(
        dir,
        {
          enabled: true,
          baseUrl: 'https://docs.example.com',
          fileName: 'sitemap.xml',
          robots: {
            enabled: true,
            fileName: 'robots.txt',
            userAgent: '*',
            allow: ['/'],
            disallow: ['/private/'],
            crawlDelay: 2,
            host: 'docs.example.com',
            additionalSitemaps: ['https://docs.example.com/news-sitemap.xml'],
            customDirectives: ['# generated'],
          },
        },
        [{ urlPath: '/' }, { urlPath: '/api/' }],
      )
      expect(result).not.toBeNull()
      expect(result?.robotsOutPath).toBe(path.join(dir, 'robots.txt'))
      const xml = await fs.readFile(path.join(dir, 'sitemap.xml'), 'utf8')
      expect(xml).toContain('<loc>https://docs.example.com/</loc>')
      expect(xml).toContain('<loc>https://docs.example.com/api/</loc>')
      const robots = await fs.readFile(path.join(dir, 'robots.txt'), 'utf8')
      expect(robots).toContain('User-agent: *')
      expect(robots).toContain('Allow: /')
      expect(robots).toContain('Disallow: /private/')
      expect(robots).toContain('Crawl-delay: 2')
      expect(robots).toContain('Host: docs.example.com')
      expect(robots).toContain('Sitemap: https://docs.example.com/sitemap.xml')
      expect(robots).toContain(
        'Sitemap: https://docs.example.com/news-sitemap.xml',
      )
      expect(robots).toContain('# generated')
    })
  })

  it('writes robots sitemap URL with a public base path', async () => {
    await withTempDir(async (dir) => {
      await writeSitemap(
        dir,
        {
          enabled: true,
          baseUrl: 'https://docs.example.com',
          fileName: 'sitemap.xml',
          robots: {
            enabled: true,
            fileName: 'robots.txt',
            userAgent: '*',
            allow: ['/'],
            disallow: [],
            additionalSitemaps: [],
            customDirectives: [],
          },
        },
        [{ urlPath: '/' }],
        '/admin-panel',
      )
      const robots = await fs.readFile(path.join(dir, 'robots.txt'), 'utf8')
      expect(robots).toContain(
        'Sitemap: https://docs.example.com/admin-panel/sitemap.xml',
      )
    })
  })

  it('skips writing sitemap when disabled', async () => {
    await withTempDir(async (dir) => {
      const result = await writeSitemap(
        dir,
        {
          enabled: false,
          baseUrl: 'https://docs.example.com',
          fileName: 'sitemap.xml',
          robots: {
            enabled: true,
            fileName: 'robots.txt',
            userAgent: '*',
            allow: ['/'],
            disallow: [],
            additionalSitemaps: [],
            customDirectives: [],
          },
        },
        [{ urlPath: '/' }],
      )
      expect(result).toBeNull()
    })
  })

  it('skips writing robots.txt when robots are disabled', async () => {
    await withTempDir(async (dir) => {
      const result = await writeSitemap(
        dir,
        {
          enabled: true,
          baseUrl: 'https://docs.example.com',
          fileName: 'sitemap.xml',
          robots: {
            enabled: false,
            fileName: 'robots.txt',
            userAgent: '*',
            allow: ['/'],
            disallow: [],
            additionalSitemaps: [],
            customDirectives: [],
          },
        },
        [{ urlPath: '/' }],
      )
      expect(result?.robotsOutPath).toBeUndefined()
    })
  })
})
