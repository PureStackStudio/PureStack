import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { themeSkins, themes } from '@purestack/ts-style'
import { describe, expect, it } from 'vitest'
import { resolveSiteConfig } from './config'

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

  it('resolves siteConfig publishDir relative to contentDir', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ts-ssg-config-'))
    try {
      const rootDir = path.join(tempRoot, 'repo-root')
      const contentDir = path.join(rootDir, 'apps', 'admin', 'content')
      fs.mkdirSync(contentDir, { recursive: true })
      fs.writeFileSync(
        path.join(contentDir, 'siteConfig.json'),
        JSON.stringify({ publishDir: '../publish' }),
      )

      const config = resolveSiteConfig({ rootDir, contentDir })
      expect(config.publishDir).toBe(path.resolve(contentDir, '../publish'))
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
        JSON.stringify({ style: { theme: { skin: 'standard' } } }),
      )

      const config = resolveSiteConfig({ rootDir, contentDir })
      const standard = themeSkins.standard.create()
      expect(config.style.theme.palette.light.accent).toBe(
        standard.light.accent,
      )
      expect(config.style.theme.palette.dark.accent).toBe(standard.dark.accent)
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('provides logo defaults', () => {
    const config = resolveSiteConfig({ rootDir: process.cwd() })
    expect(config.favicon).toBeUndefined()
    expect(config.logo).toEqual({
      brand: 'Pure Stack',
      letterColors: undefined,
      subtitleLetterColors: undefined,
      colors: undefined,
      logoBackground: undefined,
      logoForeground: undefined,
      brandSize: undefined,
      brandSizeSm: undefined,
      brandSizeMd: undefined,
      brandSizeLg: undefined,
      brandSizeXl: undefined,
      subtitleSize: undefined,
      subtitleSizeSm: undefined,
      subtitleSizeMd: undefined,
      subtitleSizeLg: undefined,
      subtitleSizeXl: undefined,
      iconSize: undefined,
      iconSizeSm: undefined,
      iconSizeMd: undefined,
      iconSizeLg: undefined,
      iconSizeXl: undefined,
      subtitleInset: undefined,
      subtitleInsetSm: undefined,
      subtitleInsetMd: undefined,
      subtitleInsetLg: undefined,
      subtitleInsetXl: undefined,
      subtitle: undefined,
      href: '/',
      icon: undefined,
    })
  })

  it('provides style defaults', () => {
    const config = resolveSiteConfig({ rootDir: process.cwd() })
    expect(config.publishDir).toBe(path.join(process.cwd(), 'dist', 'publish'))
    expect(config.basePath).toBe('')
    expect(config.preview).toEqual({
      title: undefined,
      description: undefined,
      image: undefined,
      imageAlt: undefined,
      imageWidth: undefined,
      imageHeight: undefined,
      siteName: undefined,
      type: undefined,
      locale: undefined,
      twitterCard: undefined,
      twitterSite: undefined,
      twitterCreator: undefined,
    })
    expect(config.i18n).toEqual({
      enabled: false,
      defaultLocale: '',
      locales: [],
      urlStrategy: 'prefix-all',
      queryParam: 'lang',
      cookieName: 'ts-ssg.lang',
    })
    expect(config.style.fileName).toBe('site.css')
    expect(config.style.href).toBe('/assets/site.css')
    expect(config.style.themes).toEqual(['light', 'dark'])
    expect(config.style.pretty).toBe(false)
  })

  it('normalizes basePath from site config and input', () => {
    expect(
      resolveSiteConfig({
        rootDir: process.cwd(),
        basePath: 'admin-panel/',
      }).basePath,
    ).toBe('/admin-panel')

    expect(
      resolveSiteConfig({
        rootDir: process.cwd(),
        basePath: '/',
      }).basePath,
    ).toBe('')
  })

  it('rejects invalid basePath values', () => {
    expect(() =>
      resolveSiteConfig({
        rootDir: process.cwd(),
        basePath: 'https://example.com/docs',
      }),
    ).toThrowError(/basePath/)
  })

  it('applies style pretty override from input', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      style: {
        pretty: true,
      },
    })
    expect(config.style.pretty).toBe(true)
  })

  it('provides html defaults', () => {
    const config = resolveSiteConfig({ rootDir: process.cwd() })
    expect(config.html.minify).toBe(false)
  })

  it('provides page toc defaults and accepts overrides', () => {
    expect(resolveSiteConfig({ rootDir: process.cwd() }).pageToc).toEqual({
      enabled: true,
      tone: 'neutral',
    })

    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      pageToc: {
        enabled: false,
        tone: 'accent',
      },
    })

    expect(config.pageToc).toEqual({
      enabled: false,
      tone: 'accent',
    })
  })

  it('provides auth defaults', () => {
    const config = resolveSiteConfig({ rootDir: process.cwd() })
    expect(config.auth).toEqual({
      enabled: false,
      signUp: true,
      signedInStorageKey: 'signed-in-hint',
    })
  })

  it('resolves auth overrides from input config', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      auth: {
        enabled: true,
        signUp: false,
        signedInStorageKey: 'site:auth:signed-in',
      },
    })
    expect(config.auth).toEqual({
      enabled: true,
      signUp: false,
      signedInStorageKey: 'site:auth:signed-in',
    })
  })

  it('applies html minify override from input', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      html: {
        minify: true,
      },
    })
    expect(config.html.minify).toBe(true)
  })

  it('enables script cache busting by default and accepts overrides', () => {
    expect(resolveSiteConfig({ rootDir: process.cwd() }).scripts).toEqual({
      cacheBusting: true,
    })

    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      scripts: {
        cacheBusting: false,
      },
    })
    expect(config.scripts.cacheBusting).toBe(false)
  })

  it('resolves logo overrides from input config', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      logo: {
        brand: 'Calc Core',
        letterColors: '00001111',
        subtitleLetterColors: '1111111111111111111',
        colors: ['#111111', '#ff0066'],
        logoBackground: 1,
        logoForeground: 0,
        brandSize: '3rem',
        brandSizeMd: '4rem',
        subtitleSize: '0.5rem',
        subtitleSizeLg: '0.65rem',
        iconSize: '2.25rem',
        iconSizeSm: '2.5rem',
        subtitleInset: '1px',
        subtitleInsetXl: '2px',
        subtitle: 'backend-native engine',
        href: '/home',
        icon: 'iconoir:cube',
      },
    })
    expect(config.logo).toEqual({
      brand: 'Calc Core',
      letterColors: '00001111',
      subtitleLetterColors: '1111111111111111111',
      colors: ['#111111', '#ff0066'],
      logoBackground: 1,
      logoForeground: 0,
      brandSize: '3rem',
      brandSizeSm: undefined,
      brandSizeMd: '4rem',
      brandSizeLg: undefined,
      brandSizeXl: undefined,
      subtitleSize: '0.5rem',
      subtitleSizeSm: undefined,
      subtitleSizeMd: undefined,
      subtitleSizeLg: '0.65rem',
      subtitleSizeXl: undefined,
      iconSize: '2.25rem',
      iconSizeSm: '2.5rem',
      iconSizeMd: undefined,
      iconSizeLg: undefined,
      iconSizeXl: undefined,
      subtitleInset: '1px',
      subtitleInsetSm: undefined,
      subtitleInsetMd: undefined,
      subtitleInsetLg: undefined,
      subtitleInsetXl: '2px',
      subtitle: 'backend-native engine',
      href: '/home',
      icon: 'iconoir:cube',
    })
  })

  it('resolves favicon icon names from config', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      favicon: 'iconoir:cube',
    })
    expect(config.favicon).toBe('iconoir:cube')
  })

  it('resolves preview defaults from siteConfig file and input config', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ts-ssg-config-'))
    try {
      const rootDir = path.join(tempRoot, 'repo-root')
      const contentDir = path.join(rootDir, 'content')
      fs.mkdirSync(contentDir, { recursive: true })
      fs.writeFileSync(
        path.join(contentDir, 'siteConfig.json'),
        JSON.stringify({
          preview: {
            title: 'File Title',
            description: 'File description.',
            image: '/file.png',
            imageAlt: 'File image',
            imageWidth: 1200,
            imageHeight: 630,
            siteName: 'File Site',
            type: 'website',
            locale: 'en_US',
            twitterCard: 'summary_large_image',
            twitterSite: '@file',
            twitterCreator: '@fileCreator',
          },
        }),
      )

      const config = resolveSiteConfig({
        rootDir,
        contentDir,
        preview: {
          title: 'Input Title',
          imageHeight: 720,
          twitterCreator: '@inputCreator',
        },
      })

      expect(config.preview).toEqual({
        title: 'Input Title',
        description: 'File description.',
        image: '/file.png',
        imageAlt: 'File image',
        imageWidth: 1200,
        imageHeight: 720,
        siteName: 'File Site',
        type: 'website',
        locale: 'en_US',
        twitterCard: 'summary_large_image',
        twitterSite: '@file',
        twitterCreator: '@inputCreator',
      })
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('resolves i18n config when locales are configured', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      i18n: {
        defaultLocale: 'en',
        locales: ['tr', 'en', 'tr'],
        urlStrategy: 'hidden',
        queryParam: 'locale',
        cookieName: 'puregate.lang',
      },
    })

    expect(config.i18n).toEqual({
      enabled: true,
      defaultLocale: 'en',
      locales: ['en', 'tr'],
      urlStrategy: 'hidden',
      queryParam: 'locale',
      cookieName: 'puregate.lang',
    })
  })

  it('throws when i18n is enabled without a default locale', () => {
    expect(() =>
      resolveSiteConfig({
        rootDir: process.cwd(),
        i18n: {
          enabled: true,
        },
      }),
    ).toThrowError(/defaultLocale/)
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
        enabled: true,
        excludePaths: ['privacy', '/imprint', '/terms/', ' /privacy/ '],
      },
    })
    expect(config.pagefind.enabled).toBe(true)
    expect(config.pagefind.excludePaths).toEqual([
      '/privacy/',
      '/imprint/',
      '/terms/',
    ])
  })

  it('enables pagefind by default', () => {
    const config = resolveSiteConfig({ rootDir: process.cwd() })
    expect(config.pagefind).toEqual({
      enabled: true,
      excludePaths: [],
    })
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
      style: {
        theme: {
          skin: 'standard',
        },
      },
    })
    const standard = themeSkins.standard.create()
    expect(config.style.theme.palette.light.accent).toBe(standard.light.accent)
    expect(config.style.theme.palette.dark.accent).toBe(standard.dark.accent)
  })

  it('accepts theme skin preset lists from input', () => {
    const presets = ['site-a', 'site-b']
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      style: {
        theme: {
          skin: 'standard',
          presets,
        },
      },
    })
    const standard = themeSkins.standard.create(presets)
    expect(config.style.theme.palette.light.accent).toBe(standard.light.accent)
    expect(config.style.theme.palette.dark.accent).toBe(standard.dark.accent)
  })

  it('applies registered theme skins with presets from siteConfig.json', () => {
    const skinName = 'test-registered-skin'
    themes.registerSkin(skinName, {
      create: (presets) => {
        const skin = themeSkins.standard.create(presets)
        const accent =
          presets?.join('|') === 'site-a|site-b' ? '#123456' : '#654321'
        return {
          light: { ...skin.light, accent },
          dark: { ...skin.dark, accent },
        }
      },
    })

    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ts-ssg-config-'))
    try {
      const rootDir = path.join(tempRoot, 'repo-root')
      const contentDir = path.join(rootDir, 'content')
      fs.mkdirSync(contentDir, { recursive: true })
      fs.writeFileSync(
        path.join(contentDir, 'siteConfig.json'),
        JSON.stringify({
          style: {
            theme: {
              skin: skinName,
              presets: ['site-a', 'site-b'],
            },
          },
        }),
      )

      const config = resolveSiteConfig({ rootDir, contentDir })
      expect(config.style.theme.palette.light.accent).toBe('#123456')
      expect(config.style.theme.palette.dark.accent).toBe('#123456')
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('throws when theme skin is unknown', () => {
    expect(() =>
      resolveSiteConfig({
        rootDir: process.cwd(),
        style: {
          theme: {
            skin: 'unknown' as never,
          },
        },
      }),
    ).toThrowError(/Unknown theme skin/)
  })

  it('resolves mdx highlighter from siteConfig file', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ts-ssg-config-'))
    try {
      const rootDir = path.join(tempRoot, 'repo-root')
      const contentDir = path.join(rootDir, 'content')
      fs.mkdirSync(contentDir, { recursive: true })
      fs.writeFileSync(
        path.join(contentDir, 'siteConfig.json'),
        JSON.stringify({
          mdx: {
            highlighter: 'highlightjs',
            disableHighlighter: false,
            compileMdAsMdx: false,
          },
        }),
      )

      const config = resolveSiteConfig({ rootDir, contentDir })
      expect(config.mdx.highlighter).toBe('highlightjs')
      expect(config.mdx.disableHighlighter).toBe(false)
      expect(config.mdx.compileMdAsMdx).toBe(false)
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('defaults mdx highlighter to highlightjs', () => {
    const config = resolveSiteConfig({ rootDir: process.cwd() })
    expect(config.mdx.highlighter).toBe('highlightjs')
    expect(config.mdx.disableHighlighter).toBe(false)
    expect(config.mdx.compileMdAsMdx).toBe(true)
  })

  it('prefers input mdx over siteConfig file', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ts-ssg-config-'))
    try {
      const rootDir = path.join(tempRoot, 'repo-root')
      const contentDir = path.join(rootDir, 'content')
      fs.mkdirSync(contentDir, { recursive: true })
      fs.writeFileSync(
        path.join(contentDir, 'siteConfig.json'),
        JSON.stringify({
          mdx: {
            highlighter: 'shiki',
            disableHighlighter: true,
            compileMdAsMdx: false,
          },
        }),
      )

      const config = resolveSiteConfig({
        rootDir,
        contentDir,
        mdx: {
          highlighter: 'highlightjs',
          disableHighlighter: false,
          compileMdAsMdx: true,
        },
      })

      expect(config.mdx.highlighter).toBe('highlightjs')
      expect(config.mdx.disableHighlighter).toBe(false)
      expect(config.mdx.compileMdAsMdx).toBe(true)
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true })
    }
  })
})
