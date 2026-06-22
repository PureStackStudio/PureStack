import { describe, expect, it } from 'vitest'
import { getHeadConfig } from './getHeadConfig'

describe('getHeadConfig', () => {
  it('emits social image alt metadata', () => {
    const head = getHeadConfig({
      openGraph: {
        image: 'https://example.com/preview.png',
        imageAlt: 'Preview image',
        imageWidth: 1200,
        imageHeight: 630,
      },
      twitter: {
        image: 'https://example.com/preview.png',
        imageAlt: 'Preview image',
      },
    })

    expect(head.propertyMetas).toContainEqual({
      property: 'og:image:alt',
      content: 'Preview image',
    })
    expect(head.propertyMetas).toContainEqual({
      property: 'og:image:width',
      content: '1200',
    })
    expect(head.propertyMetas).toContainEqual({
      property: 'og:image:height',
      content: '630',
    })
    expect(head.nameMetas).toContainEqual({
      name: 'twitter:image:alt',
      content: 'Preview image',
    })
  })

  it('emits alternate localized links', () => {
    const head = getHeadConfig({
      alternates: [
        { hrefLang: 'en', href: 'https://example.com/en/' },
        { hrefLang: 'tr', href: 'https://example.com/tr/' },
      ],
    })

    expect(head.links).toContainEqual({
      rel: 'alternate',
      hreflang: 'tr',
      href: 'https://example.com/tr/',
    })
  })
})
