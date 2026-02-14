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
      analytics: site.analytics,
    })
    expect(html).not.toContain('window.tsSsgConsent')
  })

  it('injects consent runtime when enabled and services are configured', async () => {
    const site = resolveSiteConfig({
      rootDir: process.cwd(),
      consent: {
        enabled: true,
        categories: [{ id: 'necessary', required: true }, { id: 'analytics' }],
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
      analytics: site.analytics,
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
      analytics: site.analytics,
    })
    expect(html).toContain('window.tsSsgConsent')
  })

  it('injects ga4 directly when consent is disabled', async () => {
    const site = resolveSiteConfig({
      rootDir: process.cwd(),
      consent: {
        enabled: false,
      },
      analytics: {
        ga4: {
          measurementId: 'G-TEST1234',
        },
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
      analytics: site.analytics,
    })
    expect(html).toContain('googletagmanager.com/gtag/js?id=G-TEST1234')
    expect(html).toContain('gtag(\'config\', "G-TEST1234")')
  })

  it('does not inject direct ga4 script when consent is enabled', async () => {
    const site = resolveSiteConfig({
      rootDir: process.cwd(),
      consent: {
        enabled: true,
      },
      analytics: {
        ga4: {
          measurementId: 'G-TEST1234',
        },
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
      analytics: site.analytics,
    })
    expect(html).not.toContain('googletagmanager.com/gtag/js?id=G-TEST1234')
    expect(html).toContain('window.tsSsgConsent')
    expect(html).toContain('G-TEST1234')
  })
})
