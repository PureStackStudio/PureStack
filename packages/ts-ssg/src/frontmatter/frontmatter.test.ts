import { describe, expect, it } from 'vitest'

import { normalizeFrontmatter, parseFrontmatterSource } from './frontmatter'

describe('frontmatter', () => {
  it('normalizes known frontmatter keys case-insensitively', () => {
    const normalized = normalizeFrontmatter({
      TITLE: 'Hello',
      Description: 'World',
      TEMPLATE: 'splash',
      ORDER: 4,
      HIDDEN: true,
      DRAFT: true,
      NAV: {
        TITLE: 'Navigation title',
        ORDER: 2,
        HIDDEN: true,
      },
      LAYOUT: {
        NAVMODE: 'drawer',
        FULLWIDTH: true,
        SHOWTOC: true,
        TOCCOLLAPSED: true,
        SHOWFOOTER: false,
      },
    })

    expect(normalized.title).toBe('Hello')
    expect(normalized.description).toBe('World')
    expect(normalized.template).toBe('splash')
    expect(normalized.order).toBe(4)
    expect(normalized.hidden).toBe(true)
    expect(normalized.draft).toBe(true)
    expect(normalized.nav.title).toBe('Navigation title')
    expect(normalized.nav.order).toBe(2)
    expect(normalized.nav.hidden).toBe(true)
    expect(normalized.layout.navMode).toBe('drawer')
    expect(normalized.layout.fullWidth).toBe(true)
    expect(normalized.layout.showToc).toBe(true)
    expect(normalized.layout.tocCollapsed).toBe(true)
    expect(normalized.layout.showFooter).toBe(false)
  })

  it('parses frontmatter source with mixed-case keys', () => {
    const source = [
      '---',
      'TITLE: Mixed Case Title',
      'Template: splash',
      'Nav:',
      '  Title: Docs',
      'Layout:',
      '  ShowToc: true',
      '---',
      '# Heading',
    ].join('\n')

    const parsed = parseFrontmatterSource(source)
    expect(parsed.frontmatter.title).toBe('Mixed Case Title')
    expect(parsed.frontmatter.template).toBe('splash')
    expect(parsed.frontmatter.nav.title).toBe('Docs')
    expect(parsed.frontmatter.layout.showToc).toBe(true)
    expect(parsed.body).toContain('# Heading')
  })

  it('normalizes embed.tabs as head/body', () => {
    const head = normalizeFrontmatter({ embed: { tabs: 'head' } })
    const body = normalizeFrontmatter({ embed: { tabs: 'body' } })

    expect(head.embed?.tabs).toBe('head')
    expect(body.embed?.tabs).toBe('body')
  })

  it('throws for invalid embed.tabs value', () => {
    expect(() =>
      normalizeFrontmatter(
        {
          embed: { tabs: true },
        },
        'index.mdx',
      ),
    ).toThrow(
      'Invalid frontmatter.embed.tabs in index.mdx: expected "head" or "body"',
    )
  })
})
