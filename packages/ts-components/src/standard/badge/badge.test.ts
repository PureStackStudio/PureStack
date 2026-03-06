import { describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../../config/config'
import { normalizeFrontmatter } from '../../frontmatter/frontmatter'
import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '../../renderApp'
import type { TsSsgContext } from '../../ts-ssg-context'
import { createBadgeComponents } from './badge'

describe('StatusBadge rendering', () => {
  it('renders badge with status variant class', () => {
    const cleanup = ensureDomGlobals()
    const components = createBadgeComponents()
    const html = renderApp('<Badge variant="warning">pending</Badge>', {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).toContain('class="badge badge--warning"')
    expect(html).toContain('pending')
  })
})

function createTestContext(): TsSsgContext {
  const site = resolveSiteConfig({ rootDir: process.cwd() })
  return {
    site,
    pageInfo: {
      relPath: 'badge.mdx',
      urlPath: '/badge',
      frontmatter: normalizeFrontmatter({}),
    },
    theme: site.style.theme,
    recordScriptEntrypoint: () => {},
    recordRuntimeEmbed: () => {},
  }
}
