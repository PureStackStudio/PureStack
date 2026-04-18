import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
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
        wordOne="Calc"
        wordTwo="Core"
        subtitle="backend-native engine"
        href="/"
      />`,
      { components, context: createTestContext() },
    )
    cleanup()

    expect((html.match(/site-logo__brand-letter/g) ?? []).length).toBe(
      'Calc Core'.length,
    )
    expect((html.match(/site-logo__subtitle-letter/g) ?? []).length).toBe(
      'backend-native engine'.length,
    )
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

  it('renders the shared icon component when an icon name is provided', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineIconComponents(getSvgIcon),
      ...defineLogoComponents(),
    }
    const html = renderApp(
      `<SiteLogo
        wordOne="Calc"
        wordTwo="Core"
        subtitle="backend-native engine"
        icon="iconoir:cube"
      />`,
      { components, context: createTestContext() },
    )
    cleanup()

    expect(html).toContain('site-logo__icon')
    expect(html).toContain(
      '<svg viewbox="0 0 24 24"><path d="M4 12h16"></path></svg>',
    )
    expect(html).not.toContain('site-logo__glyph-mark')
  })
})
