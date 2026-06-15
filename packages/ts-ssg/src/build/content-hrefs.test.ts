import { describe, expect, it } from 'vitest'
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
    expect(resolvePageContentHref('./account.mdx', 'account/settings.mdx')).toBe(
      '/account/',
    )
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
