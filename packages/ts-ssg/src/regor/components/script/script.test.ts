import type { Component } from 'regor'
import { describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../../../config/config'
import { normalizeFrontmatter } from '../../../frontmatter/frontmatter'
import { ensureDomGlobals } from '../../registerDomGlobals'
import { renderApp } from '../../renderApp'
import { createScriptComponents } from './script'

describe('PageScript rendering', () => {
  it('maps local .ts src to emitted .js path and defaults to module', () => {
    const cleanup = ensureDomGlobals()
    const components = createScriptComponents() as Record<
      string,
      Component<unknown>
    >
    const site = resolveSiteConfig()
    const pageInfo = {
      relPath: 'login.mdx',
      urlPath: '/login/',
      frontmatter: normalizeFrontmatter({}),
    }

    const html = renderApp('<PageScript src="./login.ts" />', {
      components,
      context: { site, theme: site.theme, pageInfo },
    })
    cleanup()

    expect(html).toContain('<script')
    expect(html).toContain('src="/login/login.js"')
    expect(html).toContain('type="module"')
  })

  it('resolves nested relative paths and keeps query/hash suffix', () => {
    const cleanup = ensureDomGlobals()
    const components = createScriptComponents() as Record<
      string,
      Component<unknown>
    >
    const site = resolveSiteConfig()
    const pageInfo = {
      relPath: 'security/policies.mdx',
      urlPath: '/security/policies/',
      frontmatter: normalizeFrontmatter({}),
    }

    const html = renderApp(
      '<PageScript src="../scripts/policies.ts?mode=prod#boot" />',
      {
        components,
        context: { site, theme: site.theme, pageInfo },
      },
    )
    cleanup()

    expect(html).toContain('src="/scripts/policies/policies.js?mode=prod#boot"')
    expect(html).toContain('type="module"')
  })
})
