import { describe, expect, it } from 'vitest'
import { resolveSiteConfig } from '../config/config'
import { resolvePageContentHref } from './content-hrefs'

describe('resolvePageContentHref', () => {
  it('resolves relative markdown page links to routed URLs', () => {
    expect(
      resolvePageContentHref(
        'usage/reads-and-writes.md',
        'docs/getting-started.md',
      ),
    ).toBe('/docs/usage/reads-and-writes/')
  })

  it('preserves query and hash suffixes', () => {
    expect(
      resolvePageContentHref(
        '../usage/transactions.md?mode=full#scope',
        'docs/concepts/storage-engine.md',
      ),
    ).toBe('/docs/usage/transactions/?mode=full#scope')
  })

  it('resolves index pages to folder routes', () => {
    expect(resolvePageContentHref('./index.md', 'docs/usage/opening.md')).toBe(
      '/docs/usage/',
    )
  })

  it('resolves same-name folder pages to folder routes', () => {
    expect(
      resolvePageContentHref('./account.mdx', 'account/settings.mdx'),
    ).toBe('/account/')
  })

  it('resolves hidden i18n content links to clean public routes', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      i18n: {
        defaultLocale: 'en',
        locales: ['en', 'de'],
        urlStrategy: 'hidden',
      },
    })

    expect(
      resolvePageContentHref(
        'usage/reads-and-writes.md',
        'en/docs/getting-started.md',
        config,
      ),
    ).toBe('/docs/usage/reads-and-writes/')
  })

  it('resolves root-absolute i18n content links inside the current locale', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      i18n: {
        defaultLocale: 'en',
        locales: ['en', 'tr'],
        urlStrategy: 'prefix-all',
      },
    })

    expect(
      resolvePageContentHref('/docs/index.md', 'en/index.mdx', config),
    ).toBe('/en/docs/')
  })

  it('keeps root-absolute i18n content links global from global content', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      i18n: {
        defaultLocale: 'en',
        locales: ['en', 'tr'],
        urlStrategy: 'prefix-all',
      },
    })

    expect(resolvePageContentHref('/docs/index.md', 'index.mdx', config)).toBe(
      '/docs/',
    )
  })

  it('preserves explicit locale folders in root-absolute i18n content links', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      i18n: {
        defaultLocale: 'en',
        locales: ['en', 'tr'],
        urlStrategy: 'hidden',
      },
    })

    expect(
      resolvePageContentHref('/tr/docs/index.md', 'en/index.mdx', config),
    ).toBe('/docs/')
  })

  it('leaves external, special, and asset links unchanged', () => {
    expect(resolvePageContentHref('#intro', 'docs/index.md')).toBe('#intro')
    expect(resolvePageContentHref('../asset.svg', 'docs/index.md')).toBe(
      '../asset.svg',
    )
    expect(resolvePageContentHref('https://example.com', 'docs/index.md')).toBe(
      'https://example.com',
    )
  })

  it('throws when markdown page links escape the content root', () => {
    expect(() =>
      resolvePageContentHref('../../../outside.md', 'docs/usage/opening.md'),
    ).toThrow(
      'Markdown content link escapes the content root: "../../../outside.md" from "docs/usage/opening.md".',
    )
  })
})
