import { describe, expect, it } from 'vitest'
import { resolvePreviewConfig } from './preview'

describe('social preview defaults', () => {
  it.each([
    ['  https://example.com///  ', 'https://example.com/guide/'],
    [`https://example.com/${'/'.repeat(20_000)}`, 'https://example.com/guide/'],
    [
      `https://example.com/${'/'.repeat(20_000)}tail`,
      'https://example.com/guide/',
    ],
    ['/'.repeat(20_000), undefined],
    ['   ', undefined],
  ])(
    'normalizes base URLs with whitespace and repeated slashes (%#)',
    (baseUrl, expected) => {
      expect(
        resolvePreviewConfig({}, { baseUrl, urlPath: '/guide/' }).canonicalUrl,
      ).toBe(expected)
    },
  )

  it('preserves title fallbacks, absolute URLs, image dimensions, and Twitter defaults', () => {
    const head = resolvePreviewConfig(
      { title: 'Getting Started', description: 'Build your first thing.' },
      {
        siteTitle: 'Acme Docs',
        sitePreview: {
          title: 'Acme',
          description: 'Acme documentation.',
          image: 'assets/preview.png',
          imageAlt: 'Acme preview image',
          imageWidth: 1200,
          imageHeight: 630,
          siteName: 'Acme',
          twitterCard: 'summary_large_image',
          twitterSite: '@acme',
        },
        basePath: '/docs',
        baseUrl: 'https://example.com',
        urlPath: '/guide/',
      },
    )
    expect(head.canonicalUrl).toBe('https://example.com/docs/guide/')
    expect(head.openGraph).toEqual({
      title: 'Getting Started',
      description: 'Build your first thing.',
      url: 'https://example.com/docs/guide/',
      image: 'https://example.com/docs/assets/preview.png',
      imageAlt: 'Acme preview image',
      imageWidth: 1200,
      imageHeight: 630,
      type: 'website',
      siteName: 'Acme',
    })
    expect(head.twitter).toEqual({
      cardType: 'summary_large_image',
      site: '@acme',
      title: 'Getting Started',
      description: 'Build your first thing.',
      image: 'https://example.com/docs/assets/preview.png',
      imageAlt: 'Acme preview image',
    })
  })

  it('gives page preview fields precedence over site defaults', () => {
    const head = resolvePreviewConfig(
      {
        title: 'Usage',
        description: 'Page description.',
        preview: {
          title: 'Usage Preview',
          description: 'Preview description.',
          image: '/usage.png',
          imageAlt: 'Usage preview',
          imageWidth: 640,
          imageHeight: 320,
          type: 'article',
          twitterCreator: '@writer',
        },
      },
      {
        siteTitle: 'Acme Docs',
        sitePreview: {
          title: 'Acme',
          image: '/site.png',
          imageWidth: 1200,
          imageHeight: 630,
          twitterCreator: '@site',
        },
        baseUrl: 'https://example.com',
        urlPath: '/usage/',
      },
    )
    expect(head.openGraph).toMatchObject({
      title: 'Usage Preview',
      description: 'Preview description.',
      image: 'https://example.com/usage.png',
      imageAlt: 'Usage preview',
      imageWidth: 640,
      imageHeight: 320,
      type: 'article',
    })
    expect(head.twitter).toMatchObject({
      creator: '@writer',
      title: 'Usage Preview',
      description: 'Preview description.',
      image: 'https://example.com/usage.png',
    })
  })

  it('does not reuse site dimensions for a page-specific image', () => {
    const head = resolvePreviewConfig(
      { title: 'Usage', preview: { image: '/page.png' } },
      {
        sitePreview: { image: '/site.png', imageWidth: 1200, imageHeight: 630 },
        baseUrl: 'https://example.com',
        urlPath: '/usage/',
      },
    )
    expect(head.openGraph?.image).toBe('https://example.com/page.png')
    expect(head.openGraph?.imageWidth).toBeUndefined()
    expect(head.openGraph?.imageHeight).toBeUndefined()
  })

  it('keeps absolute images unchanged and supports relative images without a base URL', () => {
    const absolute = resolvePreviewConfig(
      { preview: { image: 'https://cdn.example.com/home.png' } },
      { basePath: '/docs' },
    )
    expect(absolute.openGraph?.image).toBe('https://cdn.example.com/home.png')
    const relative = resolvePreviewConfig(
      { preview: { image: 'preview.png' } },
      { basePath: '/docs', urlPath: '/usage/' },
    )
    expect(relative.openGraph?.image).toBe('/docs/preview.png')
    expect(relative.canonicalUrl).toBeUndefined()
  })

  it('preserves localized alternates and suppresses duplicate-only alternates', () => {
    const options = {
      baseUrl: 'https://example.com',
      basePath: '/docs',
      translations: [
        { locale: 'en', urlPath: '/en/guide/', relPath: 'en/guide.mdx' },
        { locale: 'de', urlPath: '/de/guide/', relPath: 'de/guide.mdx' },
      ],
    }
    expect(resolvePreviewConfig({}, options).alternates).toEqual([
      { hrefLang: 'en', href: 'https://example.com/docs/en/guide/' },
      { hrefLang: 'de', href: 'https://example.com/docs/de/guide/' },
    ])
    expect(
      resolvePreviewConfig(
        {},
        { ...options, translations: options.translations.slice(0, 1) },
      ).alternates,
    ).toBeUndefined()
  })
})
