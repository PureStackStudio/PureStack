import { describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../../config/config'
import { normalizeFrontmatter } from '../../frontmatter/frontmatter'
import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '../../renderApp'
import type { TsSsgContext } from '../../ts-ssg-context'
import { createHeroComponents } from './hero'

describe('HeroBanner rendering', () => {
  it('renders named slot templates into hero sections', () => {
    const cleanup = ensureDomGlobals()
    const components = createHeroComponents()
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
      { components, context: createTestContext() },
    )
    cleanup()

    expect(html).toContain('Backend-native calculation engine')
    expect(html).toContain('CalcCore')
    expect(html).toContain('Deterministic calculations for SaaS backends.')
    expect(html).toContain('Get Started')
    expect(html).toContain('href="/getting-started"')
    expect(html).toContain('logo.svg')
  })

  it('preserves external action links', () => {
    const cleanup = ensureDomGlobals()
    const components = createHeroComponents()
    const html = renderApp(
      `<HeroBanner>
        <template name="actions">
          <HeroAction href="https://example.com/docs" target="_blank">
            Docs
          </HeroAction>
        </template>
      </HeroBanner>`,
      { components, context: createTestContext() },
    )
    cleanup()

    expect(html).toContain('href="https://example.com/docs"')
    expect(html).toContain('rel="noopener noreferrer"')
  })
})

function createTestContext(): TsSsgContext {
  const site = resolveSiteConfig({ rootDir: process.cwd() })
  return {
    site,
    pageInfo: {
      relPath: 'hero.mdx',
      urlPath: '/hero',
      frontmatter: normalizeFrontmatter({}),
    },
    theme: site.style.theme,
    recordScriptEntrypoint: () => {},
    recordRuntimeEmbed: () => {},
  }
}
