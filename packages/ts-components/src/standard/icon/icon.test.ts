import { describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../../../config/config'
import { normalizeFrontmatter } from '../../../frontmatter/frontmatter'
import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '../../renderApp'
import type { TsSsgContext } from '../../ts-ssg-context'
import { createIconComponents } from './icon'

describe('Icon rendering', () => {
  it('renders svg content by icon name', () => {
    const cleanup = ensureDomGlobals()
    const components = createIconComponents()
    const html = renderApp(`<Icon name="iconoir:code" />`, {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).toContain('class="icon"')
    expect(html).toContain('<svg')
    expect(html).not.toContain('style="')
    expect(html).toContain('aria-hidden="true"')
  })

  it('applies size style and accessible label', () => {
    const cleanup = ensureDomGlobals()
    const components = createIconComponents()
    const html = renderApp(
      `<Icon name="iconoir:pin" size="28px" label="Pinned" />`,
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('width: 28px')
    expect(html).toContain('height: 28px')
    expect(html).toContain('role="img"')
    expect(html).toContain('aria-label="Pinned"')
    expect(html).not.toMatch(/<span class="icon"[^>]*aria-hidden="true"/)
  })

  it('renders nothing when icon name is missing', () => {
    const cleanup = ensureDomGlobals()
    const components = createIconComponents()
    const html = renderApp(`<Icon />`, {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).not.toContain('class="icon"')
  })
})

function createTestContext(): TsSsgContext {
  const site = resolveSiteConfig({ rootDir: process.cwd() })
  return {
    site,
    pageInfo: {
      relPath: 'icon.mdx',
      urlPath: '/icon',
      frontmatter: normalizeFrontmatter({}),
    },
    theme: site.style.theme,
    recordScriptEntrypoint: () => {},
    recordRuntimeEmbed: () => {},
  }
}
