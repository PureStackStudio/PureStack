import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import {
  getCurrentThemePaletteVar,
  getThemePaletteVar,
} from '@purestack/ts-style'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineIconComponents } from '../icon/icon'
import { defineLogoComponents } from './logo'

const getSvgIcon = (name: string) =>
  name === 'iconoir:cube'
    ? '<svg viewBox="0 0 24 24"><path d="M4 12h16"/></svg>'
    : ''

describe('SiteLogo rendering', () => {
  it('renders two brand words and subtitle', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineIconComponents(getSvgIcon),
      ...defineLogoComponents(),
    }
    const html = renderApp(
      `<SiteLogo
        brand="Calc Core"
        letterColors="00001111"
        subtitleLetterColors="1111111111111111111"
        :colors="['#111111', '#ff0066']"
        :logoBackground="1"
        :logoForeground="0"
        brandSize="3rem"
        brandSizeMd="4rem"
        subtitleSize="0.5rem"
        subtitleSizeLg="0.65rem"
        iconSize="2.25rem"
        iconSizeSm="2.5rem"
        subtitleInset="1px"
        subtitleInsetXl="2px"
        subtitle="backend-native engine"
        href="/"
      />`,
      { components, context: createTestContext() },
    )
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
    expect(html).toContain('href="/"')
  })

  it('omits subtitle when not provided', () => {
    const cleanup = ensureDomGlobals()
    const components = defineLogoComponents()
    const html = renderApp(`<SiteLogo />`, {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).not.toContain('site-logo__subtitle')
  })

  it('uses default fills when letter color maps are not provided', () => {
    const cleanup = ensureDomGlobals()
    const components = defineLogoComponents()
    const html = renderApp(
      `<SiteLogo brand="Calc Core" subtitle="backend-native engine" />`,
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain(
      `background-image: ${getThemePaletteVar('semanticTone.accent.button.rest.background')}`,
    )
    expect(html).toContain(
      `background-image: ${getCurrentThemePaletteVar('textSubtle')}`,
    )
    expect(html).not.toContain('--ps-logo-glyph-background')
    expect(html).not.toContain('--ps-logo-glyph-foreground')
  })

  it('renders the shared icon component when an icon name is provided', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineIconComponents(getSvgIcon),
      ...defineLogoComponents(),
    }
    const html = renderApp(
      `<SiteLogo
        brand="Calc Core"
        letterColors="00001111"
        subtitleLetterColors="1111111111111111111"
        :colors="['#111111', '#ff0066']"
        :logoBackground="1"
        :logoForeground="0"
        brandSize="3rem"
        subtitle="backend-native engine"
        icon="iconoir:cube"
      />`,
      { components, context: createTestContext() },
    )
    cleanup()

    expect(html).toContain('class="site-logo__glyph"')
    expect(html).toContain('--ps-logo-glyph-background: #ff0066')
    expect(html).toContain('--ps-logo-glyph-foreground: #111111')
    expect(html).toContain('--ps-logo-brand-size: 3rem')
    expect(html).toContain(
      '<svg viewbox="0 0 24 24"><path d="M4 12h16"></path></svg>',
    )
    expect(html).not.toContain('site-logo__glyph-mark')
  })
})
