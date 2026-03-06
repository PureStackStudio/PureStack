import { describe, expect, it } from 'vitest'

import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '../../renderApp'
import { createTestContext } from '../../test/testContext'
import { createLogoComponents } from './logo'

describe('SiteLogo rendering', () => {
  it('renders two brand words and subtitle', () => {
    const cleanup = ensureDomGlobals()
    const components = createLogoComponents()
    const html = renderApp(
      `<SiteLogo
        wordOne="Calc"
        wordTwo="Core"
        subtitle="backend-native engine"
        href="/"
      />`,
      { components, context: createTestContext() },
    )
    cleanup()

    expect(html).toContain('Calc')
    expect(html).toContain('Core')
    expect(html).toContain('backend-native engine')
    expect(html).toContain('href="/"')
  })

  it('uses fallback words and omits subtitle when not provided', () => {
    const cleanup = ensureDomGlobals()
    const components = createLogoComponents()
    const html = renderApp(`<SiteLogo />`, {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).toContain('Pure')
    expect(html).toContain('Stack')
    expect(html).not.toContain('site-logo__subtitle')
  })

  it('renders embedded icon svg and custom font-size styles', () => {
    const cleanup = ensureDomGlobals()
    const components = createLogoComponents()
    const html = renderApp(
      `<SiteLogo
        wordOne="Calc"
        wordTwo="Core"
        subtitle="backend-native engine"
        subtitleAlign="end"
        iconSvg='<svg viewBox="0 0 24 24"><path d="M4 12h16"/></svg>'
        iconSize="28px"
        wordFontSize="24px"
        subtitleFontSize="9px"
      />`,
      { components, context: createTestContext() },
    )
    cleanup()

    expect(html).toContain('site-logo__glyph--custom')
    expect(html).toContain(
      '<svg viewbox="0 0 24 24"><path d="M4 12h16"></path></svg>',
    )
    expect(html).toContain('width: 28px')
    expect(html).toContain('height: 28px')
    expect(html).toContain('font-size: 24px')
    expect(html).toContain('font-size: 9px')
    expect(html).toContain('text-align: end')
  })
})
