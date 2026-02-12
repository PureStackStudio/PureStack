import type { Component } from 'regor'
import { describe, expect, it } from 'vitest'

import { ensureDomGlobals } from '../registerDomGlobals'
import { renderApp } from '../renderApp'
import { createHeroComponents } from './hero/hero'

describe('HeroBanner rendering', () => {
  it('renders named slot templates into hero sections', () => {
    const cleanup = ensureDomGlobals()
    const components = createHeroComponents() as Record<
      string,
      Component<unknown>
    >
    const html = renderApp(
      `<HeroBanner>
        <template name="eyebrow"><span>Backend-native calculation engine</span></template>
        <template name="title"><span>CalcCore</span></template>
        <template name="tagline"><span>Deterministic calculations for SaaS backends.</span></template>
        <template name="actions">
          <HeroAction href="./getting-started" icon="right-arrow" variant="primary">
            Get Started
          </HeroAction>
        </template>
        <template name="media">
          <HeroMedia src="../logo.svg" alt="CalcCore logo" />
        </template>
      </HeroBanner>`,
      { components },
    )
    cleanup()

    expect(html).toContain('Backend-native calculation engine')
    expect(html).toContain('CalcCore')
    expect(html).toContain('Deterministic calculations for SaaS backends.')
    expect(html).toContain('Get Started')
    expect(html).toContain('logo.svg')
  })
})
