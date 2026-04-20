import { createDom } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineButtonComponents } from '../btn/btn'
import { defineIconComponents } from '../icon/icon'
import { defineFooterComponents } from './footer'

function withDom<T>(html: string, run: () => T): T {
  const cleanup = createDom(html)
  try {
    return run()
  } finally {
    cleanup()
  }
}

describe('SiteFooter rendering', () => {
  it('renders body content with legal links and socials in footer bottom', () => {
    const html = withDom('<html><body></body></html>', () => {
      const components = {
        ...defineButtonComponents(),
        ...defineIconComponents(getSvgIcon),
        ...defineFooterComponents(),
      }
      return renderApp(
        `<SiteFooter copyright="(c) 2026 PureStack">
          <h2>Build with confidence</h2>
          <p>Everything your team needs to ship docs, pages, and growth loops from one stack.</p>

          <template name="legal">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </template>

          <template name="social">
            <BtnLink href="https://github.com/purestack" icon="tabler:brand-github">
              GitHub
            </BtnLink>
          </template>
        </SiteFooter>`,
        {
          components,
          context: createTestContext(),
        },
      )
    })

    expect(html).toContain('Build with confidence')
    expect(html).toContain('Everything your team needs')
    expect(html).toContain('(c) 2026 PureStack')
    expect(html).toContain('Privacy')
    expect(html).toContain('Terms')
    expect(html).toContain('GitHub')
  })

  it('teleports to a custom host when teleport prop is provided', () => {
    const html = withDom('<html><body></body></html>', () => {
      const components = {
        ...defineButtonComponents(),
        ...defineIconComponents(getSvgIcon),
        ...defineFooterComponents(),
      }
      return renderApp(
        `<div id="teleport-target"></div>
      <SiteFooter
        teleport="#teleport-target"
        copyright="(c) 2026 PureStack"
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
      expect(target?.textContent).toContain('Footer content')
    })

    expect(html).toContain("teleported => '#teleport-target'")
  })
})
