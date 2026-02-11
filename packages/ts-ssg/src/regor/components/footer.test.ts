import type { Component } from 'regor'
import { describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../../config/config'
import { parseHtml } from '../../dom/minidom'
import { normalizeFrontmatter } from '../../frontmatter/frontmatter'
import { ensureDomGlobals } from '../registerDomGlobals'
import { renderApp } from '../renderApp'
import { createFooterComponents } from './footer'

describe('SiteFooter rendering', () => {
  it('renders footer blocks with columns, links, legal actions, and socials', () => {
    const cleanup = ensureDomGlobals()
    const components = createFooterComponents() as Record<
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
      `<SiteFooter title="Build with confidence" ctaLabel="Start free" ctaHref="/signup">
        <p>Everything your team needs to ship docs, pages, and growth loops from one stack.</p>

        <template name="status">
          <span>99.99% uptime</span>
          <span>24/7 support</span>
        </template>

        <template name="columns">
          <FooterColumn title="Product">
            <FooterLink href="/features" label="Features" />
            <FooterLink href="/pricing" label="Pricing" />
          </FooterColumn>
          <FooterColumn title="Company">
            <FooterLink href="/about" label="About" />
            <FooterLink href="/careers" label="Careers" />
          </FooterColumn>
        </template>

        <template name="legal">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </template>

        <template name="social">
          <FooterSocial href="https://github.com/purestack" label="GitHub" />
        </template>
      </SiteFooter>`,
      { components, context: { site, theme: site.theme, pageInfo } },
    )
    cleanup()

    expect(html).toContain('Build with confidence')
    expect(html).toContain('Start free')
    expect(html).toContain('99.99% uptime')
    expect(html).toContain('Features')
    expect(html).toContain('Pricing')
    expect(html).toContain('Privacy')
    expect(html).toContain('Terms')
    expect(html).toContain('GitHub')
    expect(html).toContain('/signup')
  })

  it('teleports to a custom host when teleport prop is provided', () => {
    const cleanup = ensureDomGlobals()
    const components = createFooterComponents() as Record<
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
      `<div id="teleport-target"></div>
      <SiteFooter
        title="Custom target footer"
        teleport="#teleport-target"
        newsletter="false"
      >
        <p>Footer content</p>
      </SiteFooter>`,
      { components, context: { site, theme: site.theme, pageInfo } },
    )
    cleanup()

    const parsed = parseHtml(`<!DOCTYPE html><html><body>${html}</body></html>`)
    const target = parsed.document.querySelector('#teleport-target')
    const teleportedFooter = target?.querySelector('.site-footer')

    expect(target).toBeTruthy()
    expect(teleportedFooter).toBeTruthy()
    expect(target?.textContent).toContain('Custom target footer')
    expect(html).toContain("teleported => '#teleport-target'")
  })
})
