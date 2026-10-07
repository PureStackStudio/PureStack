import { describe, expect, it } from 'vitest'
import { resolveThemeFileName, resolveThemeStyleLinks } from './themeAssets'

describe('cache-keyed theme assets', () => {
  it('uses the same key in filenames and links while preserving URL suffixes', () => {
    const links = resolveThemeStyleLinks(
      '/assets/site.css?v=1#theme',
      ['light', 'dark'],
      'build42',
    )
    for (const link of links) {
      const fileName = resolveThemeFileName('site.css', link.theme, 'build42')
      expect(link.href).toBe(`/assets/${fileName}?v=1#theme`)
    }
    expect(links.map((link) => link.href)).toEqual([
      '/assets/site.build42.css?v=1#theme',
      '/assets/site.build42.dark.css?v=1#theme',
    ])
  })

  it('keeps unkeyed paths and omitted stylesheets unchanged', () => {
    expect(resolveThemeFileName('site.css', 'dark')).toBe('site.dark.css')
    expect(resolveThemeStyleLinks('', ['light', 'dark'], 'build42')).toEqual([])
  })
})
