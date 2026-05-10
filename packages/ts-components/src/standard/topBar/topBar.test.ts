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
    const html = renderApp(`<TopBar />`, {
      components,
      context: createTestContext({
        site: {
          logo: {
            brand: 'Calc Core',
            letterColors: '00001111',
            subtitleLetterColors: '1111111111111111111',
            colors: ['#111111', '#ff0066'],
            logoBackground: 1,
            logoForeground: 0,
            brandSize: '3rem',
            brandSizeMd: '4rem',
            subtitleSize: '0.5rem',
            subtitleSizeLg: '0.65rem',
            iconSize: '2.25rem',
            iconSizeSm: '2.5rem',
            subtitleInset: '1px',
            subtitleInsetXl: '2px',
            subtitle: 'backend-native engine',
            href: '/docs/',
            icon: 'iconoir:cube',
          },
          auth: {
            enabled: true,
          },
        },
      }),
    })
    cleanup()

    expect((html.match(/site-logo__brand-letter/g) ?? []).length).toBe(
      'Calc Core'.length,
    )
    expect(html).toContain(
      'background-image: #111111; background-color: #111111',
    )
    expect(html).toContain('class="site-logo__glyph"')
    expect(html).toContain('--ps-logo-glyph-background: #ff0066')
    expect(html).toContain('--ps-logo-glyph-foreground: #111111')
    expect(html).toContain('--ps-logo-brand-size: 3rem')
    expect(html).toContain('--ps-logo-brand-size-md: 4rem')
    expect(html).toContain('--ps-logo-subtitle-size: 0.5rem')
    expect(html).toContain('--ps-logo-subtitle-size-lg: 0.65rem')
    expect(html).toContain('--ps-logo-icon-size: 2.25rem')
    expect(html).toContain('--ps-logo-icon-size-sm: 2.5rem')
    expect(html).toContain('--ps-logo-subtitle-inset: 1px')
    expect(html).toContain('--ps-logo-subtitle-inset-xl: 2px')
    expect(html).toContain(
      'background-image: #ff0066; background-color: #ff0066',
    )
    expect((html.match(/site-logo__subtitle-letter/g) ?? []).length).toBe(
      'backend-native engine'.length,
    )
    expect(
      (
        html.match(/background-image: #ff0066; background-color: #ff0066/g) ??
        []
      ).length,
    ).toBeGreaterThan(1)
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
