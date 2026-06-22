import { describe, expect, it } from 'vitest'
import { normalizeFrontmatter } from '../frontmatter/frontmatter'
import { resolveHeadConfig } from './head-config'

describe('resolveHeadConfig', () => {
  it('generates canonical, Open Graph, and Twitter metadata from site preview defaults', () => {
    const frontmatter = normalizeFrontmatter({
      title: 'Getting Started',
      description: 'Build your first thing.',
    })

    const head = resolveHeadConfig(frontmatter, {
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
    })

    expect(head.title).toBe('Acme Docs | Getting Started')
    expect(head.description).toBe('Build your first thing.')
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

  it('lets page preview fields override site preview defaults', () => {
    const frontmatter = normalizeFrontmatter({
      title: 'Usage',
      description: 'Site description.',
      preview: {
        title: 'Usage Preview',
        description: 'Page-specific description.',
        image: '/usage.png',
        imageAlt: 'Usage preview',
        imageWidth: 640,
        imageHeight: 320,
        type: 'article',
        twitterCreator: '@writer',
      },
    })

    const head = resolveHeadConfig(frontmatter, {
      siteTitle: 'Acme Docs',
      sitePreview: {
        title: 'Acme',
        description: 'Acme documentation.',
        image: '/site.png',
        imageAlt: 'Site preview',
        imageWidth: 1200,
        imageHeight: 630,
        twitterCreator: '@site',
      },
      baseUrl: 'https://example.com',
      urlPath: '/usage/',
    })

    expect(head.openGraph).toMatchObject({
      title: 'Usage Preview',
      description: 'Page-specific description.',
      image: 'https://example.com/usage.png',
      imageAlt: 'Usage preview',
      imageWidth: 640,
      imageHeight: 320,
      type: 'article',
    })
    expect(head.twitter).toMatchObject({
      creator: '@writer',
      title: 'Usage Preview',
      description: 'Page-specific description.',
      image: 'https://example.com/usage.png',
      imageAlt: 'Usage preview',
    })
  })

  it('does not reuse site image dimensions when a page overrides the preview image', () => {
    const frontmatter = normalizeFrontmatter({
      title: 'Usage',
      preview: {
        image: '/page.png',
      },
    })

    const head = resolveHeadConfig(frontmatter, {
      siteTitle: 'Acme Docs',
      sitePreview: {
        image: '/site.png',
        imageWidth: 1200,
        imageHeight: 630,
      },
      baseUrl: 'https://example.com',
      urlPath: '/usage/',
    })

    expect(head.openGraph?.image).toBe('https://example.com/page.png')
    expect(head.openGraph?.imageWidth).toBeUndefined()
    expect(head.openGraph?.imageHeight).toBeUndefined()
  })

  it('keeps absolute preview image URLs untouched', () => {
    const frontmatter = normalizeFrontmatter({
      title: 'Home',
      preview: {
        image: 'https://cdn.example.com/social/home.png',
      },
    })

    const head = resolveHeadConfig(frontmatter, {
      siteTitle: 'Acme Docs',
      basePath: '/docs',
      baseUrl: 'https://example.com',
      urlPath: '/',
    })

    expect(head.openGraph?.image).toBe(
      'https://cdn.example.com/social/home.png',
    )
    expect(head.twitter?.image).toBe('https://cdn.example.com/social/home.png')
  })

  it('allows explicit head frontmatter to override generated preview metadata', () => {
    const frontmatter = normalizeFrontmatter({
      title: 'Generated Title',
      head: {
        canonicalUrl: 'https://canonical.example.com/page',
        openGraph: {
          title: 'Explicit OG Title',
        },
      },
    })

    const head = resolveHeadConfig(frontmatter, {
      siteTitle: 'Acme Docs',
      baseUrl: 'https://example.com',
      urlPath: '/',
    })

    expect(head.canonicalUrl).toBe('https://canonical.example.com/page')
    expect(head.openGraph?.title).toBe('Explicit OG Title')
    expect(head.openGraph?.url).toBe('https://example.com/')
  })
})
