import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineLogoComponents } from '../logo/logo'
import { defineSearchComponents } from '../searchBox/searchBox'
import { defineTopBarComponents } from '../topBar/topBar'

describe('TopBar rendering', () => {
  it('applies logo values from site config', () => {
    const cleanup = ensureDomGlobals()
    const components = {
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
      'style="background-image: #111111; background-color: #111111;"',
    )
    expect(html).toContain(
      'style="background-image: #ff0066; background-color: #ff0066;"',
    )
    expect((html.match(/site-logo__subtitle-letter/g) ?? []).length).toBe(
      'backend-native engine'.length,
    )
    expect(
      (
        html.match(
          /style="background-image: #ff0066; background-color: #ff0066;"/g,
        ) ?? []
      ).length,
    ).toBeGreaterThan(1)
    expect(html).toContain('href="/docs/"')
    expect(html).toContain('site-logo__icon')
    expect(html).toContain('name="q"')
    expect(html).not.toContain('Pure')
    expect(html).not.toContain('Stack')
  })
})
