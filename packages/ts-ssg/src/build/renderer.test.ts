import { describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../config/config'
import { normalizeFrontmatter } from '../frontmatter/frontmatter'
import { renderPage } from './renderer'

describe('renderPage consent integration', () => {
  it('does not inject consent runtime when consent is disabled', async () => {
    const site = resolveSiteConfig({
      rootDir: process.cwd(),
      consent: {
        enabled: false,
        services: [
          {
            id: 'ga4',
            category: 'analytics',
            scripts: [{ src: 'https://example.com/ga4.js' }],
          },
        ],
      },
    })
    const html = await renderPage({
      bodyHtml: '<p>Hello</p>',
      pageInfo: {
        relPath: 'index.md',
        urlPath: '/',
        frontmatter: normalizeFrontmatter({}),
      },
      siteTitle: site.siteTitle,
      consent: site.consent,
    })
    expect(html).not.toContain('window.tsSsgConsent')
  })

  it('injects consent runtime when enabled and services are configured', async () => {
    const site = resolveSiteConfig({
      rootDir: process.cwd(),
      consent: {
        enabled: true,
        categories: [
          { id: 'necessary', required: true },
          { id: 'analytics' },
        ],
        services: [
          {
            id: 'ga4',
            category: 'analytics',
            scripts: [{ src: 'https://example.com/ga4.js', async: true }],
          },
        ],
      },
    })
    const html = await renderPage({
      bodyHtml: '<p>Hello</p>',
      pageInfo: {
        relPath: 'index.md',
        urlPath: '/',
        frontmatter: normalizeFrontmatter({}),
      },
      siteTitle: site.siteTitle,
      consent: site.consent,
    })
    expect(html).toContain('window.tsSsgConsent')
    expect(html).toContain('ga4')
  })

  it('injects consent runtime when enabled even without services', async () => {
    const site = resolveSiteConfig({
      rootDir: process.cwd(),
      consent: {
        enabled: true,
        categories: [{ id: 'necessary', required: true }],
        services: [],
      },
    })
    const html = await renderPage({
      bodyHtml: '<p>Hello</p>',
      pageInfo: {
        relPath: 'index.md',
        urlPath: '/',
        frontmatter: normalizeFrontmatter({}),
      },
      siteTitle: site.siteTitle,
      consent: site.consent,
    })
    expect(html).toContain('window.tsSsgConsent')
  })
})
