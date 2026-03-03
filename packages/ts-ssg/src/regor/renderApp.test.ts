import { defineComponent, html } from 'regor'
import { describe, expect, it } from 'vitest'
import { resolveSiteConfig } from '../config/config'
import { normalizeFrontmatter } from '../frontmatter/frontmatter'
import { ensureDomGlobals } from '../minidom/createDom'
import { renderApp } from './renderApp'
import { resolveTsSsgContext } from './resolveTsSsgContext'
import type { TsSsgContext } from './ts-ssg-context'

describe('renderApp', () => {
  it('returns doctype-prefixed html for full document input', () => {
    const output = renderApp('<html><body><main>ok</main></body></html>', {
      components: {},
      context: createTestContext(),
    })

    expect(output.startsWith('<!DOCTYPE html><html')).toBe(true)
    expect(output).toContain('<main>ok</main>')
  })

  it('supports runtime embed position set to head', () => {
    const cleanup = ensureDomGlobals()
    try {
      const site = resolveSiteConfig({ rootDir: process.cwd() })
      const context: TsSsgContext = {
        site,
        pageInfo: {
          relPath: 'index.mdx',
          urlPath: '/',
          frontmatter: normalizeFrontmatter({}),
        },
        theme: site.style.theme,
        recordScriptEntrypoint: () => {},
        recordRuntimeEmbed: () => {},
      }

      const output = renderApp(
        '<html><head></head><body><Marker /></body></html>',
        {
          components: {
            marker: defineComponent(html`<div>marker</div>`, {
              context: (head) => {
                resolveTsSsgContext(head).recordRuntimeEmbed('tabs', 'head')
                return {}
              },
            }),
          },
          context,
        },
      )

      const tabsScriptIndex = output.indexOf('tabs__overflow-toggle')
      const headCloseIndex = output.indexOf('</head>')
      expect(tabsScriptIndex).toBeGreaterThan(0)
      expect(tabsScriptIndex).toBeLessThan(headCloseIndex)
    } finally {
      cleanup()
    }
  })
})

function createTestContext(): TsSsgContext {
  const site = resolveSiteConfig({ rootDir: process.cwd() })
  return {
    site,
    pageInfo: {
      relPath: 'index.mdx',
      urlPath: '/',
      frontmatter: normalizeFrontmatter({}),
    },
    theme: site.style.theme,
    recordScriptEntrypoint: () => {},
    recordRuntimeEmbed: () => {},
  }
}
