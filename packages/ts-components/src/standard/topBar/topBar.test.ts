import { createDom, ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { createApp, defineComponent, ref, html as template } from 'regor'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineButtonComponents } from '../btn/btn'
import { defineClassicLogoComponents } from '../classicLogo/classicLogo'
import { defineFlexComponents } from '../flex/flex'
import { defineIconComponents } from '../icon/icon'
import { defineLogoComponents } from '../logo/logo'
import { definePanelComponents } from '../panel/panel'
import { defineSearchComponents } from '../searchBox/searchBox'
import { defineSignInComponents } from '../signIn/signIn'
import { defineThemeToggleComponents } from '../themeToggle/themeToggle'
import { defineTopBarComponents } from '../topBar/topBar'

describe('TopBar rendering', () => {
  it('selects the configured logo and reactively overrides it with a registered component', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<html><body><div id="app"></div></body></html>',
    )
    const logoComponent = ref<string | null>(null)
    const app = createApp(
      {
        components: {
          ...defineTopBarComponents(),
          ...defineFlexComponents(),
          ...defineLogoComponents(),
          ...defineClassicLogoComponents(),
          ...defineIconComponents((name) => `<svg data-icon="${name}"></svg>`),
          CustomLogo: defineComponent<{ config: { brand: string } }>(
            template`<span class="custom-logo">{{ config.brand }}</span>`,
            { props: ['config'] },
          ),
        },
        tsSsgContext: createTestContext({
          site: {
            basePath: '/docs',
            logo: {
              component: 'ClassicLogo',
              brand: 'PureStack',
              subtitle: 'AI-Native Frontend',
              colors: ['#111111', '#ff0066'],
              letterColors: '000011',
              logoBackground: 1,
              brandSizeMd: '3rem',
              icon: 'tabler:device-desktop-analytics',
              href: '/',
            },
          },
        }),
        logoComponent,
      },
      {
        selector: '#app',
        template: '<TopBar :logoComponent="logoComponent"/>',
      },
    )
    try {
      expect(
        document.querySelectorAll('.classic-logo__brand-letter'),
      ).toHaveLength(9)
      expect(
        document.querySelector('.classic-logo__link')?.getAttribute('href'),
      ).toBe('/docs/')
      expect(
        document.querySelector('.classic-logo')?.getAttribute('style'),
      ).toContain('--ps-classic-logo-brand-size-md: 3rem')
      logoComponent('SiteLogo')
      expect(document.querySelector('.classic-logo')).toBeNull()
      expect(document.querySelector('.site-logo__brand')?.textContent).toBe(
        'PureStack',
      )
      logoComponent('CustomLogo')
      expect(document.querySelector('.site-logo')).toBeNull()
      expect(document.querySelector('.custom-logo')?.textContent).toBe(
        'PureStack',
      )
      logoComponent('')
      expect(document.querySelector('.custom-logo')).toBeNull()
      expect(document.querySelector('.classic-logo')).toBeNull()
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })

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
      ...defineThemeToggleComponents(),
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
