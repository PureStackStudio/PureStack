import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineButtonComponents } from '../btn/btn'
import { defineFlexComponents } from '../flex/flex'
import { defineIconComponents } from '../icon/icon'
import { defineLogoComponents } from '../logo/logo'
import { definePanelComponents } from '../panel/panel'
import { defineSearchComponents } from '../searchBox/searchBox'
import { defineSignInComponents } from '../signIn/signIn'
import { defineThemeSwitcherComponents } from '../themeSwitcher/themeSwitcher'
import { defineTopBarComponents } from '../topBar/topBar'

describe('TopBar rendering', () => {
  it('applies logo values from site config', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineIconComponents((name) => `<svg data-icon="${name}"></svg>`),
      ...defineLogoComponents(),
      ...definePanelComponents(),
      ...defineSearchComponents(),
      ...defineSignInComponents(),
      ...defineThemeSwitcherComponents(),
      ...defineTopBarComponents(),
    }
    const html = renderApp(`<TopBar signInEnabled="true"/>`, {
      components,
      context: createTestContext({
        site: {
          logo: {
            brand: 'Calc Core',
            subtitle: 'Backend engine',
            suffix: '.',
            href: '/docs/',
            icon: 'iconoir:cube',
            size: 'lg',
            appearance: 'badge',
            markStyle: 'solid',
            wordmarkStyle: 'gradient',
            brandColor: '#111111',
            accentColor: '#ff0066',
          },
          auth: {
            enabled: true,
          },
          pagefind: {
            enabled: true,
          },
        },
      }),
    })
    cleanup()

    expect(html).toContain('>Calc Core</span>')
    expect(html).toContain('>Backend engine</span>')
    expect(html).toContain('site-logo--badge')
    expect(html).toContain('site-logo--mark-solid')
    expect(html).toContain('site-logo--wordmark-gradient')
    expect(html).toContain('--ps-logo-brand-color: #111111')
    expect(html).toContain('--ps-logo-accent-color: #ff0066')
    expect(html).toContain('href="/docs/"')
    expect(html).toContain('name="q"')
    expect(html).toContain('class="sign-in position-relative topbar__account"')
    expect(html).toContain('data-icon="lucide:log-in"')
    expect((html.match(/class="flex/g) ?? []).length).toBeGreaterThan(1)
    expect(html).toContain('tone-fill-surface-alt')
    expect(html).toContain('tone-border-surface-alt')
    expect(html).toContain('tone-text-surface-alt')
    expect(html).not.toContain('Pure')
    expect(html).not.toContain('Stack')
  })
})
