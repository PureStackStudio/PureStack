import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineFlexComponents } from '../flex/flex'
import { defineLogoComponents } from '../logo/logo'
import { defineSearchComponents } from '../searchBox/searchBox'
import { defineTopBarComponents } from '../topBar/topBar'

describe('TopBar rendering', () => {
  it('applies logo values from site config', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineFlexComponents(),
      ...defineLogoComponents(),
      ...defineTopBarComponents(),
      ...defineSearchComponents(),
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
    expect((html.match(/class="flex/g) ?? []).length).toBeGreaterThan(1)
    expect(html).toContain('tone-fill-surface-alt')
    expect(html).toContain('tone-border-surface-alt')
    expect(html).toContain('tone-text-surface-alt')
    expect(html).not.toContain('Pure')
    expect(html).not.toContain('Stack')
  })

  it('applies tone and variant classes to the top bar shell', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineFlexComponents(),
      ...defineLogoComponents(),
      ...defineTopBarComponents(),
      ...defineSearchComponents(),
    }
    const html = renderApp(
      `<TopBar tone="accent" variant="outline" variantMode="stateful" />`,
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('class="topbar')
    expect(html).toContain('tone--accent')
    expect(html).toContain('tone-border-button-hover')
    expect(html).toContain('tone-border-button-active')
    expect(html).toContain('tone-fill-button-active')
    expect(html).toContain('tone-text-button-active')
  })
})
