import { describe, expect, it } from 'vitest'

import { urlNormalizer } from './urlNormalizer'

describe('urlNormalizer', () => {
  it('normalizes internal hrefs to site-root paths', () => {
    expect(urlNormalizer.normalizeHref('./getting-started')).toBe(
      '/getting-started',
    )
    expect(urlNormalizer.normalizeHref('getting-started')).toBe(
      '/getting-started',
    )
    expect(urlNormalizer.normalizeHref('/guide/')).toBe('/guide/')
  })

  it('preserves external and special hrefs', () => {
    expect(urlNormalizer.normalizeHref('https://example.com/docs')).toBe(
      'https://example.com/docs',
    )
    expect(urlNormalizer.normalizeHref('#intro')).toBe('#intro')
    expect(urlNormalizer.normalizeHref('?q=abc')).toBe('?q=abc')
    expect(urlNormalizer.normalizeHref('../changelog/')).toBe('../changelog/')
  })

  it('supports trailing slash policy options', () => {
    expect(
      urlNormalizer.normalizeHref('/getting-started', {
        trailingSlash: 'always',
      }),
    ).toBe('/getting-started/')
    expect(
      urlNormalizer.normalizeHref('/guide/', {
        trailingSlash: 'never',
      }),
    ).toBe('/guide')
    expect(
      urlNormalizer.normalizeHref('/assets/logo.svg', {
        trailingSlash: 'always',
      }),
    ).toBe('/assets/logo.svg')
  })

  it('normalizes urlPath values with trailing slash', () => {
    expect(urlNormalizer.normalizeUrlPath('/')).toBe('/')
    expect(urlNormalizer.normalizeUrlPath('guide')).toBe('/guide/')
    expect(urlNormalizer.normalizeUrlPath('/guide')).toBe('/guide/')
    expect(urlNormalizer.normalizeUrlPath('/feed.xml')).toBe('/feed.xml')
  })
})
