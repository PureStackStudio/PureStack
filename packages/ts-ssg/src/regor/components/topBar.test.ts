import type { Component } from 'regor'
import { describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../../config/config'
import { normalizeFrontmatter } from '../../frontmatter/frontmatter'
import { ensureDomGlobals } from '../registerDomGlobals'
import { renderApp } from '../renderApp'
import { createLogoComponents } from './logo'
import { createTopBarComponents } from './topBar'

describe('TopBar rendering', () => {
  it('applies logo values from site config', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...createLogoComponents(),
      ...createTopBarComponents(),
    } as Record<string, Component<unknown>>
    const site = resolveSiteConfig({
      logo: {
        wordOne: 'Calc',
        wordTwo: 'Core',
        subtitle: 'backend-native engine',
        href: '/docs/',
        iconSvg:
          '<svg viewBox="0 0 24 24"><path d="M4 12h16" stroke="currentColor"/></svg>',
        wordFontSize: '22px',
        subtitleFontSize: '10px',
      },
    })
    const pageInfo = {
      relPath: 'index.md',
      urlPath: '/',
      frontmatter: normalizeFrontmatter({}),
    }
    const html = renderApp(`<TopBar />`, {
      components,
      context: { site, theme: site.theme, pageInfo },
    })
    cleanup()

    expect(html).toContain('Calc')
    expect(html).toContain('Core')
    expect(html).toContain('backend-native engine')
    expect(html).toContain('href="/docs/"')
    expect(html).toContain('regor-logo__glyph--custom')
    expect(html).toContain('--regor-logo-word-size: 22px')
    expect(html).toContain('--regor-logo-subtitle-size: 10px')
    expect(html).not.toContain('Pure')
    expect(html).not.toContain('Stack')
  })
})
