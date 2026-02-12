import type { Component } from 'regor'
import { describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../../config/config'
import { normalizeFrontmatter } from '../../frontmatter/frontmatter'
import { ensureDomGlobals } from '../registerDomGlobals'
import { renderApp } from '../renderApp'
import { createNavigationComponents } from './navMenu/navMenu'

describe('NavMenu rendering', () => {
  it('evaluates r-else branches for leaf items', () => {
    const cleanup = ensureDomGlobals()
    const components = createNavigationComponents() as Record<
      string,
      Component<unknown>
    >
    const site = resolveSiteConfig()
    const pageInfo = {
      relPath: 'index.md',
      urlPath: '/',
      frontmatter: normalizeFrontmatter({}),
    }
    const html = renderApp(
      `<NavMenu
        :items="[
          { title: 'Home', url: '/home/' },
          { title: 'Group', children: [{ title: 'Child', url: '/child/' }] }
        ]"
      ></NavMenu>`,
      { components, context: { site, theme: site.theme, pageInfo } },
    )
    cleanup()

    expect(html).toContain('Home')
    expect(html).toContain('Group')
    expect(html).toContain('Child')
    expect(html).not.toContain('r-else=')
  })
})
