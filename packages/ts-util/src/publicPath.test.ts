import { describe, expect, it } from 'vitest'
import { normalizeBasePath, stripBasePath, withBasePath } from './publicPath'

describe('publicPath', () => {
  it('normalizes configured base paths', () => {
    expect(normalizeBasePath(undefined)).toBe('')
    expect(normalizeBasePath('')).toBe('')
    expect(normalizeBasePath('/')).toBe('')
    expect(normalizeBasePath('docs')).toBe('/docs')
    expect(normalizeBasePath('/docs/')).toBe('/docs')
    expect(normalizeBasePath('\\admin\\panel\\')).toBe('/admin/panel')
  })

  it('rejects non-path base paths', () => {
    expect(() => normalizeBasePath('https://example.com/docs')).toThrowError(
      /basePath/,
    )
    expect(() => normalizeBasePath('/../docs')).toThrowError(/basePath/)
    expect(() => normalizeBasePath('/docs?x=1')).toThrowError(/basePath/)
  })

  it('prefixes only root-relative public hrefs', () => {
    expect(withBasePath('/docs', '/guide/')).toBe('/docs/guide/')
    expect(withBasePath('/docs', '/')).toBe('/docs/')
    expect(withBasePath('/docs', '/guide/?q=1#top')).toBe(
      '/docs/guide/?q=1#top',
    )
    expect(withBasePath('/docs', '/docs/guide/')).toBe('/docs/guide/')
    expect(withBasePath('/docs', '#top')).toBe('#top')
    expect(withBasePath('/docs', 'guide/')).toBe('guide/')
    expect(withBasePath('/docs', 'https://example.com/guide/')).toBe(
      'https://example.com/guide/',
    )
  })

  it('strips the base path from public request paths', () => {
    expect(stripBasePath('/docs', '/docs/')).toBe('/')
    expect(stripBasePath('/docs', '/docs/guide/')).toBe('/guide/')
    expect(stripBasePath('/docs', '/other/')).toBe('/other/')
  })
})
