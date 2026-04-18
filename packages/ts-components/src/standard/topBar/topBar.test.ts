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
            wordOne: 'Calc',
            wordTwo: 'Core',
            subtitle: 'backend-native engine',
            href: '/docs/',
            icon: 'iconoir:cube',
          },
        },
      }),
    })
    cleanup()

    expect(html).toContain('Calc')
    expect(html).toContain('Core')
    expect((html.match(/site-logo__subtitle-letter/g) ?? []).length).toBe(
      'backend-native engine'.length,
    )
    expect(html).toContain('href="/docs/"')
    expect(html).toContain('site-logo__icon')
    expect(html).toContain('name="q"')
    expect(html).not.toContain('Pure')
    expect(html).not.toContain('Stack')
  })
})
