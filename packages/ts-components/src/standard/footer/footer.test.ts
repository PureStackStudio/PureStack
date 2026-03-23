import { createDom } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { createButtonComponents } from '../btn/btn'
import { createIconComponents } from '../icon/icon'
import { createFooterComponents } from './footer'

function withDom<T>(html: string, run: () => T): T {
  const cleanup = createDom(html)
  try {
    return run()
  } finally {
    cleanup()
  }
}

describe('SiteFooter rendering', () => {
  it('renders footer blocks with columns, links, legal actions, and socials', () => {
    const html = withDom('<html><body></body></html>', () => {
      const components = {
        ...createButtonComponents(),
        ...createIconComponents(),
        ...createFooterComponents(),
      }
      return renderApp(
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
        {
          components,
          context: createTestContext(),
        },
      )
    })

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
    const html = withDom('<html><body></body></html>', () => {
      const components = {
        ...createButtonComponents(),
        ...createIconComponents(),
        ...createFooterComponents(),
      }
      return renderApp(
        `<div id="teleport-target"></div>
      <SiteFooter
        title="Custom target footer"
        teleport="#teleport-target"
        newsletter="false"
      >
        <p>Footer content</p>
      </SiteFooter>`,
        {
          components,
          context: createTestContext(),
        },
      )
    })

    withDom(`<!DOCTYPE html><html><body>${html}</body></html>`, () => {
      const target = document.querySelector('#teleport-target')
      const teleportedFooter = target?.querySelector('.site-footer')

      expect(target).toBeTruthy()
      expect(teleportedFooter).toBeTruthy()
      expect(target?.textContent).toContain('Custom target footer')
    })

    expect(html).toContain("teleported => '#teleport-target'")
  })
})
