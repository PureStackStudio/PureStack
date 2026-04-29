import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { describe, expect, it } from 'vitest'
import { defineComponents } from '../../defineComponents'
import { createTestContext } from '../../test/testContext'

describe('Landing components rendering', () => {
  it('renders landing band shaped edges with horizontal slant start coordinates', () => {
    const cleanup = ensureDomGlobals()
    const html = renderApp(
      `<LandingBand
        topEdge="slant-down"
        topEdgeStart="200px"
        bottomEdge="slant-up"
        bottomEdgeStart="50%"
        edgeSize="3rem"
      >
        <p>Shaped band</p>
      </LandingBand>`,
      {
        components: defineComponents(getSvgIcon),
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('Shaped band')
    expect(html).toContain(
      'clip-path: polygon(0 0, 200px 0, 100% 3rem, 100% calc(100% - 3rem), 50% 100%, 0 100%)',
    )
    expect(html).toContain('padding-top: calc(1em + 3rem)')
    expect(html).toContain('padding-bottom: calc(1em + 3rem)')
  })

  it('renders the landing section, metrics, feature card, and CTA actions', () => {
    const cleanup = ensureDomGlobals()
    const html = renderApp(
      `<LandingSection
        eyebrow="Product"
        title="A better page"
        subtitle="Composed from semantic landing primitives."
        tone="accent"
      >
        <MetricStrip>
          <MetricItem
            label="Runtime"
            value="Headless"
            detail="Runs inside services"
            icon="lucide:server"/>
        </MetricStrip>
        <FeatureCard
          title="Deterministic"
          summary="Same input, same result."
          icon="lucide:calculator"
          tone="success"/>
        <CtaSection
          title="Start now"
          primaryLabel="Read docs"
          primaryHref="/getting-started/"
          primaryIcon="lucide:arrow-right"/>
      </LandingSection>`,
      {
        components: defineComponents(getSvgIcon),
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('A better page')
    expect(html).toContain('Headless')
    expect(html).toContain('Deterministic')
    expect(html).toContain('href="/getting-started/"')
  })

  it('renders code showcase result and comparison columns', () => {
    const cleanup = ensureDomGlobals()
    const html = renderApp(
      `<CodeShowcase
        title="Pricing model"
        language="C#"
        resultTitle="Output"
        resultMeta="Stable"
      >
        <pre><code>return total;</code></pre>
        <template #result>
          <p>price.final = 214.08</p>
        </template>
      </CodeShowcase>
      <ComparisonTable title="Compare">
        <ComparisonColumn
          title="CalcCore"
          summary="Backend runtime."
          icon="lucide:calculator"
          variant="surfaceAlt">
          <ComparisonFeature>Deterministic execution</ComparisonFeature>
        </ComparisonColumn>
      </ComparisonTable>`,
      {
        components: defineComponents(getSvgIcon),
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('Pricing model')
    expect(html).toContain('price.final = 214.08')
    expect(html).toContain('tone-fill-surface-alt')
    expect(html).toContain('Deterministic execution')
  })
})
