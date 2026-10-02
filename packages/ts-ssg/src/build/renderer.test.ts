import { describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../config/config'
import { normalizeFrontmatter } from '../frontmatter/frontmatter'
import { renderPage } from './renderer'

describe('renderPage consent integration', () => {
  it('passes configured sidebar offsets to the documentation layout', async () => {
    const site = resolveSiteConfig({
      rootDir: process.cwd(),
      docLayout: { sidebarTop: '8rem', sidebarTopMobile: '72px' },
    })
    const html = await renderPage({
      bodyHtml: '<p>Hello</p>',
      pageInfo: {
        relPath: 'index.md',
        urlPath: '/',
        frontmatter: normalizeFrontmatter({}),
      },
      site,
    })
    expect(html).toContain('--ps-doc-layout-sidebar-top: 8rem;')
    expect(html).toContain('--ps-doc-layout-sidebar-top-mobile: 72px;')
  })
  it('injects the critical auth state hint when auth is enabled', async () => {
    const site = resolveSiteConfig({
      rootDir: process.cwd(),
      auth: {
        enabled: true,
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
    })
    expect(html).toContain('signed-in-hint')
    expect(html).toContain('signed-in')
    expect(html).toContain('localStorage.getItem')
  })

  it('does not inject the critical auth state hint when auth is disabled', async () => {
    const site = resolveSiteConfig({
      rootDir: process.cwd(),
      auth: {
        enabled: false,
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
    })
    expect(html).not.toContain('signed-in-hint')
  })

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
    expect(html).toContain('template-doc--nav-ready')
  })

  it('injects pagefind search runtime when pagefind is enabled', async () => {
    const site = resolveSiteConfig({
      rootDir: process.cwd(),
      pagefind: {
        enabled: true,
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
    })
    expect(html).toContain('/pagefind/pagefind.js')
  })

  it('does not inject pagefind search runtime when pagefind is disabled', async () => {
    const site = resolveSiteConfig({
      rootDir: process.cwd(),
      pagefind: {
        enabled: false,
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
    })
    expect(html).not.toContain('/pagefind/pagefind.js')
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

  it('passes the configured navigation variant and class to the nav menu', async () => {
    const site = resolveSiteConfig({
      rootDir: process.cwd(),
      navigation: {
        tone: 'accent',
        variant: ' glass ',
        class: 'spotlight-from-top-right',
      },
    })
    const html = await renderPage({
      bodyHtml: '<p>Hello</p>',
      pageInfo: {
        relPath: 'index.md',
        urlPath: '/',
        frontmatter: normalizeFrontmatter({}),
      },
      navigation: {
        mode: 'auto',
        folder: '',
        root: '',
        items: [{ title: 'Home', url: '/' }],
        global: [],
        tone: 'accent',
      },
      site,
    })
    expect(html).toMatch(
      /<nav-menu tone="accent" variant="glass" class="spotlight-from-top-right">/,
    )
  })

  it('leaves the nav menu on its own variant when none is configured', async () => {
    const site = resolveSiteConfig({ rootDir: process.cwd() })
    const html = await renderPage({
      bodyHtml: '<p>Hello</p>',
      pageInfo: {
        relPath: 'index.md',
        urlPath: '/',
        frontmatter: normalizeFrontmatter({}),
      },
      navigation: {
        mode: 'auto',
        folder: '',
        root: '',
        items: [{ title: 'Home', url: '/' }],
        global: [],
        tone: 'neutral',
      },
      site,
    })
    expect(html).toContain('<nav-menu tone="neutral">')
  })

  it('passes the configured page toc variant and class to the page toc', async () => {
    const site = resolveSiteConfig({
      rootDir: process.cwd(),
      pageToc: { variant: ' surfaceAlt ', class: 'spotlight-from-top-right' },
    })
    const html = await renderPage({
      bodyHtml: '<h2 id="intro">Intro</h2>',
      pageInfo: {
        relPath: 'index.md',
        urlPath: '/',
        frontmatter: normalizeFrontmatter({ layout: { showToc: true } }),
      },
      outline: [{ id: 'intro', title: 'Intro', depth: 2 }],
      site,
    })
    expect(html).toContain(
      '<page-toc tone="neutral" variant="surfaceAlt" class="spotlight-from-top-right">',
    )
  })

  it('leaves the page toc on its own variant when none is configured', async () => {
    const site = resolveSiteConfig({ rootDir: process.cwd() })
    const html = await renderPage({
      bodyHtml: '<h2 id="intro">Intro</h2>',
      pageInfo: {
        relPath: 'index.md',
        urlPath: '/',
        frontmatter: normalizeFrontmatter({ layout: { showToc: true } }),
      },
      outline: [{ id: 'intro', title: 'Intro', depth: 2 }],
      site,
    })
    expect(html).toContain('<page-toc tone="neutral">')
  })

  it('does not render navigation shell when showNav is false', async () => {
    const site = resolveSiteConfig({ rootDir: process.cwd() })
    const html = await renderPage({
      bodyHtml: '<p>Hello</p>',
      pageInfo: {
        relPath: 'index.md',
        urlPath: '/',
        frontmatter: normalizeFrontmatter({
          layout: {
            showNav: false,
          },
        }),
      },
      navigation: {
        mode: 'auto',
        folder: '',
        root: '',
        items: [{ title: 'Home', url: '/' }],
        global: [],
        tone: 'neutral',
      },
      site,
      consent: site.consent,
      analytics: site.analytics,
    })
    expect(html).not.toContain('class="doc-sidebar"')
    expect(html).toContain('<body class="template-doc"')
    expect(html).not.toContain('<nav-menu')
    expect(html).not.toContain('template-doc--nav-ready')
    expect(html).not.toContain('ts-ssg:nav-collapsed')
  })
})
