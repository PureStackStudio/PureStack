import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineButtonComponents } from '../btn/btn'
import { defineIconComponents } from '../icon/icon'
import { defineHeroComponents } from './hero'

describe('HeroBanner rendering', () => {
  it('renders named slot templates into hero sections', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineIconComponents(getSvgIcon),
      ...defineButtonComponents(),
      ...defineHeroComponents(),
    }
    const html = renderApp(
      `<HeroBanner>
        <template #eyebrow><span>Backend-native calculation engine</span></template>
        <template #title><span>CalcCore</span></template>
        <template #tagline><span>Deterministic calculations for SaaS backends.</span></template>
        <template #actions>
          <BtnLink href="./getting-started" icon="iconoir:arrow-right" tone="accent">
            Get Started
          </BtnLink>
        </template>
        <template #media>
          <HeroMedia src="../logo.svg" alt="CalcCore logo" />
        </template>
      </HeroBanner>`,
      { components, context: createTestContext() },
    )
    cleanup()

    expect(html).toContain('Backend-native calculation engine')
    expect(html).toContain('CalcCore')
    expect(html).toContain('Deterministic calculations for SaaS backends.')
    expect(html).toContain('Get Started')
    expect(html).toContain('href="/getting-started"')
    expect(html).toContain('tone--accent tone-button-interactive')
    expect(html).toContain('logo.svg')
  })

  it('preserves external action links', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineIconComponents(getSvgIcon),
      ...defineButtonComponents(),
      ...defineHeroComponents(),
    }
    const html = renderApp(
      `<HeroBanner>
        <template #actions>
          <BtnLink href="https://example.com/docs" target="_blank" tone="ghost">
            Docs
          </BtnLink>
        </template>
      </HeroBanner>`,
      { components, context: createTestContext() },
    )
    cleanup()

    expect(html).toContain('href="https://example.com/docs"')
    expect(html).toContain('rel="noopener noreferrer"')
  })
})
