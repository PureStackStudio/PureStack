import type { ClassicLogoConfig } from '@purestack/ts-common'
import { createDom, ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import {
  getCurrentThemePaletteVar,
  getThemePaletteVar,
} from '@purestack/ts-style'
import { createApp, ref, sref } from 'regor'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineIconComponents } from '../icon/icon'
import { defineClassicLogoComponents } from './classicLogo'

const getSvgIcon = (name: string) =>
  name === 'iconoir:cube'
    ? '<svg viewBox="0 0 24 24"><path d="M4 12h16"/></svg>'
    : ''

describe('ClassicLogo rendering', () => {
  it('reacts to config replacement and direct overrides without losing original letter mapping', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<html><body><div id="app"></div></body></html>',
    )
    const config = sref<ClassicLogoConfig>({
      brand: 'A B',
      subtitle: 'First',
      letterColors: '01',
      colors: ['#111111', '#ff0066'],
    })
    const brand = ref<string | undefined>(undefined)
    const app = createApp(
      { components: defineClassicLogoComponents(), config, brand },
      {
        selector: '#app',
        template: '<ClassicLogo :config="config" :brand="brand"/>',
      },
    )
    const letters = () => [
      ...document.querySelectorAll('.classic-logo__brand-letter'),
    ]
    try {
      expect(letters()).toHaveLength(3)
      expect(letters()[2].getAttribute('style')).toContain('#ff0066')
      brand('XYZ')
      expect(
        letters()
          .map((e) => e.textContent?.trim())
          .join(''),
      ).toBe('XYZ')
      expect(letters()[2].getAttribute('style')).toContain('#ff0066')
      config({
        brand: 'Next',
        subtitle: '',
        href: null,
        colors: ['#22aa44'],
        letterColors: '0',
      })
      expect(
        letters()
          .map((e) => e.textContent?.trim())
          .join(''),
      ).toBe('XYZ')
      expect(letters()[2].getAttribute('style')).toContain('#22aa44')
      expect(document.querySelector('.classic-logo__subtitle')).toBeNull()
      expect(
        document.querySelector('.classic-logo__link')?.hasAttribute('href'),
      ).toBe(false)
      brand(undefined)
      expect(
        letters()
          .map((e) => e.textContent?.trim())
          .join(''),
      ).toBe('Next')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })

  it('renders two brand words and subtitle', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineIconComponents(getSvgIcon),
      ...defineClassicLogoComponents(),
    }
    const html = renderApp(
      `<ClassicLogo
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

    expect((html.match(/classic-logo__brand-letter/g) ?? []).length).toBe(
      'Calc Core'.length,
    )
    expect(html).toContain(
      'background-image: #111111; background-color: #111111',
    )
    expect(html).toContain('class="classic-logo__glyph"')
    expect(html).toContain('--ps-classic-logo-glyph-background: #ff0066')
    expect(html).toContain('--ps-classic-logo-glyph-foreground: #111111')
    expect(html).toContain('--ps-classic-logo-brand-size: 3rem')
    expect(html).toContain('--ps-classic-logo-brand-size-md: 4rem')
    expect(html).toContain('--ps-classic-logo-subtitle-size: 0.5rem')
    expect(html).toContain('--ps-classic-logo-subtitle-size-lg: 0.65rem')
    expect(html).toContain('--ps-classic-logo-icon-size: 2.25rem')
    expect(html).toContain('--ps-classic-logo-icon-size-sm: 2.5rem')
    expect(html).toContain('--ps-classic-logo-subtitle-inset: 1px')
    expect(html).toContain('--ps-classic-logo-subtitle-inset-xl: 2px')
    expect(html).toContain(
      'background-image: #ff0066; background-color: #ff0066',
    )
    expect((html.match(/classic-logo__subtitle-letter/g) ?? []).length).toBe(
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
    const components = defineClassicLogoComponents()
    const html = renderApp(`<ClassicLogo />`, {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).not.toContain('classic-logo__subtitle')
  })

  it('uses default fills when letter color maps are not provided', () => {
    const cleanup = ensureDomGlobals()
    const components = defineClassicLogoComponents()
    const html = renderApp(
      `<ClassicLogo brand="Calc Core" subtitle="backend-native engine" />`,
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
      `background-image: ${getCurrentThemePaletteVar('text.subtle')}`,
    )
    expect(html).not.toContain('--ps-classic-logo-glyph-background')
    expect(html).not.toContain('--ps-classic-logo-glyph-foreground')
  })

  it('renders the shared icon component when an icon name is provided', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineIconComponents(getSvgIcon),
      ...defineClassicLogoComponents(),
    }
    const html = renderApp(
      `<ClassicLogo
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

    expect(html).toContain('class="classic-logo__glyph"')
    expect(html).toContain('--ps-classic-logo-glyph-background: #ff0066')
    expect(html).toContain('--ps-classic-logo-glyph-foreground: #111111')
    expect(html).toContain('--ps-classic-logo-brand-size: 3rem')
    expect(html).toContain(
      '<svg viewbox="0 0 24 24"><path d="M4 12h16"></path></svg>',
    )
    expect(html).not.toContain('classic-logo__glyph-mark')
  })
})
