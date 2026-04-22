import { describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../config/config'
import { normalizeFrontmatter } from '../frontmatter/frontmatter'
import { renderPage } from './renderer'

describe('renderPage consent integration', () => {
  it('injects nav menu runtime for doc pages', async () => {
    const site = resolveSiteConfig({ rootDir: process.cwd() })
    const html = await renderPage({
      bodyHtml: '<p>Hello</p>',
      pageInfo: {
        relPath: 'index.md',
        urlPath: '/',
        frontmatter: normalizeFrontmatter({}),
      },
      site,
    })
    expect(html).toContain('ts-ssg:nav-collapsed')
  })

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
      site,
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
      site,
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
      site,
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
      site,
      consent: site.consent,
      analytics: site.analytics,
    })
    expect(html).toContain('googletagmanager.com/gtag/js?id=G-TEST1234')
    expect(html).toMatch(
      /gtag\(\s*(?:['"]|&#39;|&quot;)config(?:['"]|&#39;|&quot;)\s*,\s*(?:['"]|&#39;|&quot;)G-TEST1234(?:['"]|&#39;|&quot;)\s*\)/,
    )
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
      site,
      consent: site.consent,
      analytics: site.analytics,
    })
    expect(html).not.toMatch(
      /<script[^>]*\bsrc="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-TEST1234"/,
    )
    expect(html).not.toMatch(
      /<script[^>]*\bsrc='https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-TEST1234'/,
    )
    expect(html).toContain('window.tsSsgConsent')
    expect(html).toContain('G-TEST1234')
  })

  it('renders footer html when provided by content', async () => {
    const site = resolveSiteConfig({ rootDir: process.cwd() })
    const html = await renderPage({
      bodyHtml: '<p>Hello</p>',
      pageInfo: {
        relPath: 'index.md',
        urlPath: '/',
        frontmatter: normalizeFrontmatter({}),
      },
      site,
      footerHtml:
        '<site-footer eyebrow="Ops"><template #status><span>Ready</span></template></site-footer>',
      consent: site.consent,
      analytics: site.analytics,
    })
    expect(html).toContain('<site-footer eyebrow="Ops"')
    expect(html).toContain('<span>Ready</span>')
  })

  it('renders header html when provided by content', async () => {
    const site = resolveSiteConfig({ rootDir: process.cwd() })
    const html = await renderPage({
      bodyHtml: '<p>Hello</p>',
      pageInfo: {
        relPath: 'index.md',
        urlPath: '/',
        frontmatter: normalizeFrontmatter({}),
      },
      site,
      headerHtml: '<top-bar></top-bar>',
      consent: site.consent,
      analytics: site.analytics,
    })
    expect(html).toContain('<top-bar></top-bar>')
  })

  it('does not render toc shell when toc is enabled but outline is empty', async () => {
    const site = resolveSiteConfig({ rootDir: process.cwd() })
    const html = await renderPage({
      bodyHtml: '<p>Hello</p>',
      pageInfo: {
        relPath: 'index.md',
        urlPath: '/',
        frontmatter: normalizeFrontmatter({
          layout: {
            showToc: true,
          },
        }),
      },
      outline: [],
      site,
      consent: site.consent,
      analytics: site.analytics,
    })
    expect(html).not.toContain('class="doc-toc"')
    expect(html).not.toContain('doc-shell--toc')
    expect(html).not.toContain('page-toc')
  })
})
