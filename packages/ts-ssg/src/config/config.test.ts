import { describe, expect, it } from 'vitest'

import { resolveSiteConfig } from './config'

describe('resolveSiteConfig sitemap', () => {
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
        iconSvg:
          '<svg viewBox="0 0 24 24"><path d="M4 12h16"/></svg>',
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
})
