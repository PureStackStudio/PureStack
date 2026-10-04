import path from 'node:path'
import type { SiteConfig } from '@purestack/ts-common'
import { describe, expect, it } from 'vitest'
import { resolveSiteConfig } from '../config/config'
import { resolveContentFiles } from '../i18n/content'
import { ContentRouteIndex, resolveContentHref } from './content-hrefs'

function indexPages(relPaths: string[], config = createConfig()) {
  return new ContentRouteIndex(
    resolveContentFiles(
      config,
      relPaths.map((relPath) => ({
        absPath: relPath,
        relPath,
        ext: path.extname(relPath),
      })),
    ),
  )
}

function createConfig(i18n?: Partial<SiteConfig['i18n']>) {
  return resolveSiteConfig({
    rootDir: process.cwd(),
    ...(i18n ? { i18n } : {}),
  })
}

function resolverFor(relPaths: string[], config = createConfig()) {
  const routes = indexPages(relPaths, config)
  return (href: string, sourceRelPath: string) =>
    resolveContentHref(href, sourceRelPath, routes, config)
}

describe('resolveContentHref', () => {
  describe('relative to the source file across folder pages and leaf pages', () => {
    const resolve = resolverFor([
      'a/a.mdx',
      'a/b.mdx',
      'a/c/c.mdx',
      'a/c/d.mdx',
    ])

    it.each([
      ['./b', '/a/b/'],
      ['./c', '/a/c/'],
      ['./c/d', '/a/c/d/'],
      ['./a', '/a/'],
      ['./', '/a/'],
      ['.', '/a/'],
    ])('from the folder page a/a.mdx: %s -> %s', (href, expected) => {
      expect(resolve(href, 'a/a.mdx')).toBe(expected)
    })

    it.each([
      ['./a', '/a/'],
      ['./c', '/a/c/'],
      ['./c/d', '/a/c/d/'],
      ['c', '/a/c/'],
      ['./b', '/a/b/'],
      ['./', '/a/'],
    ])('from the leaf page a/b.mdx: %s -> %s', (href, expected) => {
      expect(resolve(href, 'a/b.mdx')).toBe(expected)
    })

    it.each([
      ['./d', '/a/c/d/'],
      ['./c', '/a/c/'],
      ['../b', '/a/b/'],
      ['../a', '/a/'],
      ['../', '/a/'],
    ])('from the folder page a/c/c.mdx: %s -> %s', (href, expected) => {
      expect(resolve(href, 'a/c/c.mdx')).toBe(expected)
    })

    it.each([
      ['./c', '/a/c/'],
      ['./', '/a/c/'],
      ['../b', '/a/b/'],
      ['../a', '/a/'],
      ['..', '/a/'],
      ['../c/d', '/a/c/d/'],
    ])('from the leaf page a/c/d.mdx: %s -> %s', (href, expected) => {
      expect(resolve(href, 'a/c/d.mdx')).toBe(expected)
    })

    it.each([
      ['./b.mdx', 'a/a.mdx', '/a/b/'],
      ['./c/c.mdx', 'a/a.mdx', '/a/c/'],
      ['./c.mdx', 'a/c/d.mdx', '/a/c/'],
      ['../a.mdx', 'a/c/d.mdx', '/a/'],
    ])(
      'with a content extension: %s from %s -> %s',
      (href, source, expected) => {
        expect(resolve(href, source)).toBe(expected)
      },
    )
  })

  it('resolves the semantic tones link to its sibling guide', () => {
    const resolve = resolverFor([
      'guides/index.mdx',
      'guides/semantic-tones.mdx',
      'guides/themes.mdx',
    ])

    expect(resolve('./themes', 'guides/semantic-tones.mdx')).toBe(
      '/guides/themes/',
    )
    expect(resolve('themes', 'guides/semantic-tones.mdx')).toBe(
      '/guides/themes/',
    )
    expect(resolve('./themes/', 'guides/semantic-tones.mdx')).toBe(
      '/guides/themes/',
    )
    expect(resolve('./themes.mdx', 'guides/semantic-tones.mdx')).toBe(
      '/guides/themes/',
    )
  })

  it('resolves index folder pages and the content root', () => {
    const resolve = resolverFor([
      'index.mdx',
      'docs/index.md',
      'docs/usage/index.md',
      'docs/usage/opening.md',
    ])

    expect(resolve('./index.md', 'docs/usage/opening.md')).toBe('/docs/usage/')
    expect(resolve('./index', 'docs/usage/opening.md')).toBe('/docs/usage/')
    expect(resolve('./', 'docs/usage/opening.md')).toBe('/docs/usage/')
    expect(resolve('../', 'docs/usage/opening.md')).toBe('/docs/')
    expect(resolve('../../', 'docs/usage/opening.md')).toBe('/')
    expect(resolve('./', 'index.mdx')).toBe('/')
    expect(resolve('.', 'index.mdx')).toBe('/')
    expect(resolve('./docs/usage/opening', 'index.mdx')).toBe(
      '/docs/usage/opening/',
    )
  })

  it('prefers the file without a trailing slash and the folder with one', () => {
    const resolve = resolverFor(['a/c/c.mdx', 'a/c/d.mdx', 'a/c/c/index.mdx'])

    expect(resolve('./c', 'a/c/d.mdx')).toBe('/a/c/')
    expect(resolve('./c/', 'a/c/d.mdx')).toBe('/a/c/c/')
  })

  it('finds .md, .mdx and .rmdx pages without an extension', () => {
    const resolve = resolverFor([
      'docs/plain.md',
      'docs/regor.mdx',
      'docs/rich.rmdx',
      'docs/index.mdx',
    ])

    expect(resolve('./plain', 'docs/index.mdx')).toBe('/docs/plain/')
    expect(resolve('./regor', 'docs/index.mdx')).toBe('/docs/regor/')
    expect(resolve('./rich', 'docs/index.mdx')).toBe('/docs/rich/')
    expect(resolve('./rich.rmdx', 'docs/index.mdx')).toBe('/docs/rich/')
  })

  it('preserves query and hash suffixes', () => {
    const resolve = resolverFor([
      'guides/index.mdx',
      'guides/semantic-tones.mdx',
      'guides/themes.mdx',
    ])

    expect(resolve('./themes#palette', 'guides/semantic-tones.mdx')).toBe(
      '/guides/themes/#palette',
    )
    expect(resolve('./themes?tab=api#x', 'guides/semantic-tones.mdx')).toBe(
      '/guides/themes/?tab=api#x',
    )
    expect(resolve('./themes.mdx#palette', 'guides/semantic-tones.mdx')).toBe(
      '/guides/themes/#palette',
    )
    expect(resolve('./#top', 'guides/semantic-tones.mdx')).toBe('/guides/#top')
  })

  it('treats a dotted page name as a page before an asset', () => {
    const resolve = resolverFor(['guides/release-1.0.mdx', 'guides/index.mdx'])

    expect(resolve('./release-1.0', 'guides/index.mdx')).toBe(
      '/guides/release-1.0/',
    )
  })

  it('decodes percent-encoded paths before matching', () => {
    const resolve = resolverFor(['guides/über uns.mdx', 'guides/index.mdx'])

    expect(resolve('./%C3%BCber%20uns', 'guides/index.mdx')).toBe(
      '/guides/über uns/',
    )
  })

  it('accepts Windows separators in source paths, page paths and links', () => {
    const resolve = resolverFor([
      'guides\\semantic-tones.mdx',
      'guides\\themes.mdx',
    ])

    expect(resolve('./themes', 'guides\\semantic-tones.mdx')).toBe(
      '/guides/themes/',
    )
    expect(resolve('.\\themes', 'guides/semantic-tones.mdx')).toBe(
      '/guides/themes/',
    )
  })

  it('matches extensions case-insensitively and paths exactly', () => {
    const resolve = resolverFor(['guides/Readme.MDX', 'guides/themes.mdx'])

    expect(resolve('./Readme', 'guides/themes.mdx')).toBe('/guides/Readme/')
    expect(resolve('./themes.MDX', 'guides/Readme.MDX')).toBe('/guides/themes/')
    expect(() => resolve('./Themes', 'guides/Readme.MDX')).toThrow(
      'does not match any page',
    )
  })

  it('resolves root-absolute content file links', () => {
    const resolve = resolverFor(['index.mdx', 'guides/themes.mdx'])

    expect(resolve('/guides/themes.mdx', 'index.mdx')).toBe('/guides/themes/')
    expect(resolve('/index.mdx#top', 'guides/themes.mdx')).toBe('/#top')
  })

  it.each([
    ['#intro'],
    ['?q=abc'],
    ['https://example.com/docs'],
    ['//cdn.example.com/app.js'],
    ['mailto:team@example.com'],
    ['tel:+123'],
    ['javascript:void(0)'],
    ['/blog/'],
    ['/blog/first-post/'],
    ['/blog'],
    ['/guides/themes/'],
    ['/'],
    [''],
    [' ./themes'],
    ['./diagram.svg'],
    ['../assets/logo.png'],
    ['../../../../outside.png'],
  ])('leaves %j unchanged', (href) => {
    const resolve = resolverFor(['index.mdx', 'guides/themes.mdx'])

    expect(resolve(href, 'guides/themes.mdx')).toBe(href)
  })

  it('fails with a hint when a relative link matches no page', () => {
    const resolve = resolverFor([
      'guides/semantic-tones.mdx',
      'guides/themes.mdx',
    ])

    expect(() => resolve('./themse', 'guides/semantic-tones.mdx')).toThrow(
      'Content link "./themse" in "guides/semantic-tones.mdx" does not match any page. Write a root-absolute URL such as "/blog/" for pages outside this content folder.',
    )
    expect(() => resolve('../blog/', 'guides/semantic-tones.mdx')).toThrow(
      'does not match any page',
    )
  })

  it('fails when a linked content file is missing', () => {
    const resolve = resolverFor(['index.mdx', 'guides/themes.mdx'])

    expect(() => resolve('./missing.mdx', 'guides/themes.mdx')).toThrow(
      'Content link "./missing.mdx" in "guides/themes.mdx" points to a missing file "guides/missing.mdx".',
    )
    expect(() => resolve('./themes.md', 'guides/themes.mdx')).toThrow(
      'points to a missing file "guides/themes.md"',
    )
    expect(() => resolve('/guides/missing.mdx', 'index.mdx')).toThrow(
      'points to a missing file "guides/missing.mdx"',
    )
  })

  it('fails when a link names a header, footer or other non-page file', () => {
    const resolve = resolverFor(['guides/index.mdx'])

    expect(() => resolve('./header', 'guides/index.mdx')).toThrow(
      'does not match any page',
    )
  })

  it('fails when a content link escapes the content root', () => {
    const resolve = resolverFor(['docs/usage/opening.md'])

    expect(() =>
      resolve('../../../outside.md', 'docs/usage/opening.md'),
    ).toThrow(
      'Content link "../../../outside.md" in "docs/usage/opening.md" escapes the content root.',
    )
    expect(() => resolve('../../../outside', 'docs/usage/opening.md')).toThrow(
      'escapes the content root',
    )
    expect(() => resolve('/../outside.md', 'docs/usage/opening.md')).toThrow(
      'escapes the content root',
    )
  })

  describe('with i18n', () => {
    it('resolves hidden locale links to clean public routes', () => {
      const config = createConfig({
        defaultLocale: 'en',
        locales: ['en', 'de'],
        urlStrategy: 'hidden',
      })
      const resolve = resolverFor(
        ['en/docs/getting-started.md', 'en/docs/usage/reads-and-writes.md'],
        config,
      )

      expect(
        resolve('usage/reads-and-writes.md', 'en/docs/getting-started.md'),
      ).toBe('/docs/usage/reads-and-writes/')
      expect(
        resolve('./usage/reads-and-writes', 'en/docs/getting-started.md'),
      ).toBe('/docs/usage/reads-and-writes/')
    })

    it('resolves root-absolute content links inside the current locale', () => {
      const config = createConfig({
        defaultLocale: 'en',
        locales: ['en', 'tr'],
        urlStrategy: 'prefix-all',
      })
      const resolve = resolverFor(
        ['en/index.mdx', 'en/docs/index.md', 'docs/index.md', 'index.mdx'],
        config,
      )

      expect(resolve('/docs/index.md', 'en/index.mdx')).toBe('/en/docs/')
      expect(resolve('/docs/index.md', 'index.mdx')).toBe('/docs/')
    })

    it('keeps explicit locale folders in root-absolute content links', () => {
      const config = createConfig({
        defaultLocale: 'en',
        locales: ['en', 'tr'],
        urlStrategy: 'hidden',
      })
      const resolve = resolverFor(['en/index.mdx', 'tr/docs/index.md'], config)

      expect(resolve('/tr/docs/index.md', 'en/index.mdx')).toBe('/docs/')
    })

    it('falls back to the default locale for untranslated pages', () => {
      const config = createConfig({
        defaultLocale: 'en',
        locales: ['en', 'tr'],
        urlStrategy: 'prefix-all',
      })
      const resolve = resolverFor(
        ['en/docs/a.mdx', 'en/docs/b.mdx', 'tr/docs/a.mdx', 'en/index.mdx'],
        config,
      )

      expect(resolve('./a', 'tr/docs/a.mdx')).toBe('/tr/docs/a/')
      expect(resolve('./b', 'tr/docs/a.mdx')).toBe('/en/docs/b/')
      expect(resolve('./b.mdx', 'tr/docs/a.mdx')).toBe('/en/docs/b/')
      expect(resolve('/docs/b.mdx', 'tr/docs/a.mdx')).toBe('/en/docs/b/')
      expect(resolve('../', 'tr/docs/a.mdx')).toBe('/en/')
    })

    it('does not fall back for links into another locale or missing pages', () => {
      const config = createConfig({
        defaultLocale: 'en',
        locales: ['en', 'tr'],
        urlStrategy: 'prefix-all',
      })
      const resolve = resolverFor(['en/docs/a.mdx', 'en/docs/b.mdx'], config)

      expect(() => resolve('../../tr/docs/b', 'en/docs/a.mdx')).toThrow(
        'does not match any page',
      )
      expect(() => resolve('./missing', 'en/docs/a.mdx')).toThrow(
        'does not match any page',
      )
    })
  })
})

describe('ContentRouteIndex', () => {
  it('compares page sets regardless of order', () => {
    const pages = indexPages(['a.mdx', 'b/index.mdx'])

    expect(pages.hasSamePages(indexPages(['b/index.mdx', 'a.mdx']))).toBe(true)
    expect(pages.hasSamePages(indexPages(['a.mdx']))).toBe(false)
    expect(
      pages.hasSamePages(indexPages(['a.mdx', 'b/index.mdx', 'c.mdx'])),
    ).toBe(false)
    expect(pages.hasSamePages(indexPages(['a.mdx', 'b/b.mdx']))).toBe(false)
    expect(pages.hasSamePages(undefined)).toBe(false)
  })
})
