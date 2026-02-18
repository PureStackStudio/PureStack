import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { resolveSiteConfig } from './config'
import { builtInSkins } from '../style/skins'

describe('resolveSiteConfig sitemap', () => {
  it('resolves siteConfig outDir relative to contentDir', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ts-ssg-config-'))
    try {
      const rootDir = path.join(tempRoot, 'repo-root')
      const contentDir = path.join(rootDir, 'apps', 'admin', 'content')
      fs.mkdirSync(contentDir, { recursive: true })
      fs.writeFileSync(
        path.join(contentDir, 'siteConfig.json'),
        JSON.stringify({ outDir: '../dist' }),
      )

      const config = resolveSiteConfig({ rootDir, contentDir })
      expect(config.outDir).toBe(path.resolve(contentDir, '../dist'))
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('applies theme skin from siteConfig.json', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ts-ssg-config-'))
    try {
      const rootDir = path.join(tempRoot, 'repo-root')
      const contentDir = path.join(rootDir, 'content')
      fs.mkdirSync(contentDir, { recursive: true })
      fs.writeFileSync(
        path.join(contentDir, 'siteConfig.json'),
        JSON.stringify({ theme: { skin: 'pastel' } }),
      )

      const config = resolveSiteConfig({ rootDir, contentDir })
      expect(config.theme.colors.light).toEqual(builtInSkins.pastel.light)
      expect(config.theme.colors.dark).toEqual(builtInSkins.pastel.dark)
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('provides logo defaults', () => {
    const config = resolveSiteConfig({ rootDir: process.cwd() })
    expect(config.logo).toEqual({
      wordOne: 'Pure',
      wordTwo: 'Stack',
      subtitle: undefined,
      subtitleAlign: undefined,
      href: '/',
      iconSvg: undefined,
      iconSize: undefined,
      wordFontSize: undefined,
      subtitleFontSize: undefined,
    })
  })

  it('resolves logo overrides from input config', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      logo: {
        wordOne: 'Calc',
        wordTwo: 'Core',
        subtitle: 'backend-native engine',
        subtitleAlign: 'end',
        href: '/home',
        iconSvg: '<svg viewBox="0 0 24 24"><path d="M4 12h16"/></svg>',
        iconSize: '28px',
        wordFontSize: '22px',
        subtitleFontSize: '10px',
      },
    })
    expect(config.logo).toEqual({
      wordOne: 'Calc',
      wordTwo: 'Core',
      subtitle: 'backend-native engine',
      subtitleAlign: 'end',
      href: '/home',
      iconSvg: '<svg viewBox="0 0 24 24"><path d="M4 12h16"/></svg>',
      iconSize: '28px',
      wordFontSize: '22px',
      subtitleFontSize: '10px',
    })
  })

  it('provides sitemap defaults', () => {
    const config = resolveSiteConfig({ rootDir: process.cwd() })
    expect(config.sitemap).toEqual({
      enabled: false,
      baseUrl: '',
      fileName: 'sitemap.xml',
      robots: {
        enabled: true,
        fileName: 'robots.txt',
        userAgent: '*',
        allow: ['/'],
        disallow: [],
        crawlDelay: undefined,
        host: undefined,
        additionalSitemaps: [],
        customDirectives: [],
      },
    })
  })

  it('normalizes sitemap base url and validates enabled mode', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      sitemap: {
        enabled: true,
        baseUrl: 'https://docs.example.com///',
      },
    })
    expect(config.sitemap.baseUrl).toBe('https://docs.example.com')
    expect(config.sitemap.robots.allow).toEqual(['/'])
  })

  it('resolves robots directives from sitemap config', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      sitemap: {
        enabled: true,
        baseUrl: 'https://docs.example.com',
        robots: {
          fileName: 'seo/robots.txt',
          userAgent: 'Googlebot',
          allow: [' / ', '/docs/'],
          disallow: ['/private/'],
          crawlDelay: 1.5,
          host: 'docs.example.com',
          additionalSitemaps: ['https://docs.example.com/news-sitemap.xml'],
          customDirectives: ['# robots config'],
        },
      },
    })
    expect(config.sitemap.robots.fileName).toBe('seo/robots.txt')
    expect(config.sitemap.robots.userAgent).toBe('Googlebot')
    expect(config.sitemap.robots.allow).toEqual(['/', '/docs/'])
    expect(config.sitemap.robots.disallow).toEqual(['/private/'])
    expect(config.sitemap.robots.crawlDelay).toBe(1.5)
    expect(config.sitemap.robots.host).toBe('docs.example.com')
    expect(config.sitemap.robots.additionalSitemaps).toEqual([
      'https://docs.example.com/news-sitemap.xml',
    ])
    expect(config.sitemap.robots.customDirectives).toEqual(['# robots config'])
  })

  it('throws when sitemap is enabled without baseUrl', () => {
    expect(() =>
      resolveSiteConfig({
        rootDir: process.cwd(),
        sitemap: { enabled: true, baseUrl: '' },
      }),
    ).toThrowError(/baseUrl/)
  })

  it('provides consent defaults', () => {
    const config = resolveSiteConfig({ rootDir: process.cwd() })
    expect(config.consent.enabled).toBe(false)
    expect(config.consent.storageKey).toBe('ts-ssg-consent')
    expect(config.consent.policyVersion).toBe('1')
    expect(config.consent.categories[0]).toMatchObject({
      id: 'necessary',
      required: true,
    })
    expect(config.consent.services).toEqual([])
  })

  it('resolves consent overrides and validates service categories', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      consent: {
        enabled: true,
        policyVersion: '2026-02-12',
        categories: [
          { id: 'necessary', label: 'Necessary', required: true },
          { id: 'analytics', label: 'Analytics' },
        ],
        services: [
          {
            id: 'ga4',
            category: 'analytics',
            scripts: [
              {
                src: 'https://www.googletagmanager.com/gtag/js?id=G-TEST',
                async: true,
              },
              { content: 'window.dataLayer = window.dataLayer || [];' },
            ],
          },
        ],
      },
    })
    expect(config.consent.enabled).toBe(true)
    expect(config.consent.policyVersion).toBe('2026-02-12')
    expect(config.consent.services).toHaveLength(1)
    expect(config.consent.services[0]?.category).toBe('analytics')
    expect(config.consent.services[0]?.scripts).toHaveLength(2)
  })

  it('throws when consent service points to an unknown category', () => {
    expect(() =>
      resolveSiteConfig({
        rootDir: process.cwd(),
        consent: {
          categories: [{ id: 'necessary', required: true }],
          services: [
            {
              id: 'ga4',
              category: 'analytics',
              scripts: [{ src: 'https://example.com/a.js' }],
            },
          ],
        },
      }),
    ).toThrowError(/unknown category/)
  })

  it('normalizes pagefind exclude paths', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      pagefind: {
        excludePaths: ['privacy', '/imprint', '/terms/', ' /privacy/ '],
      },
    })
    expect(config.pagefind.excludePaths).toEqual([
      '/privacy/',
      '/imprint/',
      '/terms/',
    ])
  })

  it('provides analytics defaults', () => {
    const config = resolveSiteConfig({ rootDir: process.cwd() })
    expect(config.analytics.ga4.enabled).toBe(false)
    expect(config.analytics.ga4.measurementId).toBeUndefined()
    expect(config.analytics.ga4.serviceId).toBe('ga4')
    expect(config.analytics.ga4.consentCategory).toBe('analytics')
  })

  it('enables ga4 when measurement id is configured', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      analytics: {
        ga4: {
          measurementId: 'g-test1234',
        },
      },
    })
    expect(config.analytics.ga4.enabled).toBe(true)
    expect(config.analytics.ga4.measurementId).toBe('G-TEST1234')
  })

  it('auto-registers ga4 as a consent service when consent is enabled', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      consent: {
        enabled: true,
      },
      analytics: {
        ga4: {
          measurementId: 'G-TEST1234',
        },
      },
    })
    const ga4Service = config.consent.services.find(
      (entry) => entry.id === 'ga4',
    )
    expect(ga4Service).toBeDefined()
    expect(ga4Service?.category).toBe('analytics')
    expect(ga4Service?.scripts).toHaveLength(2)
  })

  it('throws when ga4 is enabled without measurement id', () => {
    expect(() =>
      resolveSiteConfig({
        rootDir: process.cwd(),
        analytics: {
          ga4: {
            enabled: true,
          },
        },
      }),
    ).toThrowError(/measurementId/)
  })

  it('applies built-in theme skin from input', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      theme: {
        skin: 'ocean',
      },
    })
    expect(config.theme.colors.light).toEqual(builtInSkins.ocean.light)
    expect(config.theme.colors.dark).toEqual(builtInSkins.ocean.dark)
  })

  it('throws when theme skin is unknown', () => {
    expect(() =>
      resolveSiteConfig({
        rootDir: process.cwd(),
        theme: {
          skin: 'unknown' as never,
        },
      }),
    ).toThrowError(/Unknown theme skin/)
  })
})
