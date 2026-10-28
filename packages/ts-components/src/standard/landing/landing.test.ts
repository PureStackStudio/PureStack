import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { describe, expect, it } from 'vitest'
import { defineComponents } from '../../defineComponents'
import { createTestContext } from '../../test/testContext'

describe('Landing components rendering', () => {
  it('renders landing band shaped edges with horizontal slant start coordinates', async () => {
    const cleanup = ensureDomGlobals()
    const html = await renderApp(
      `<LandingBand
        display="grid"
        alignItems="center"
        justifyContent="end"
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
    expect(html).toContain(' b-0"')
    expect(html).toContain('display: grid')
    expect(html).toContain('align-items: center')
    expect(html).toContain('justify-content: end')
    expect(html).toContain(
      'clip-path: polygon(0 0, 200px 0, 100% 3rem, 100% calc(100% - 3rem), 50% 100%, 0 100%)',
    )
    expect(html).toContain(
      'margin-inline-start: calc(-1 * (50vw - 50% + ((var(--ps-doc-layout-active-shell-padding-inline-start) + var(--ps-doc-layout-active-nav-width)) - (var(--ps-doc-layout-active-shell-padding-inline-end) + var(--ps-doc-layout-active-toc-width))) / 2))',
    )
    expect(html).toContain(
      'margin-inline-end: calc(-1 * (50vw - 50% + ((var(--ps-doc-layout-active-shell-padding-inline-end) + var(--ps-doc-layout-active-toc-width)) - (var(--ps-doc-layout-active-shell-padding-inline-start) + var(--ps-doc-layout-active-nav-width))) / 2))',
    )
    expect(html).toContain('padding-top: calc(1em + 3rem)')
    expect(html).toContain('padding-bottom: calc(1em + 3rem)')
  })

  it('renders the landing section, metrics, feature card, and CTA actions', async () => {
    const cleanup = ensureDomGlobals()
    const html = await renderApp(
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

  it('renders code showcase result and comparison columns', async () => {
    const cleanup = ensureDomGlobals()
    const html = await renderApp(
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

  it.each(['stacked', 'split'])(
    'keeps heading actions outside the content grid in the %s layout',
    async (layout) => {
      const cleanup = ensureDomGlobals()
      try {
        await renderApp(
          `<LandingSection id="features" title="A clear introduction" titleTag="h3"
            layout="${layout}" align="center" columns="2" columnsLg="3">
            <template #actions><BtnLink href="/guides/">Explore the guides</BtnLink></template>
            <p>First feature</p><p>Second feature</p><p>Third feature</p>
          </LandingSection>`,
          {
            components: defineComponents(getSvgIcon),
            context: createTestContext(),
            onRendered(document) {
              const section = document.querySelector('section#features')
              const header = section?.querySelector('.landing-section__header')
              const content = section?.querySelector(
                '.landing-section__content',
              )
              const outer = section?.querySelector('.landing-section__layout')
              expect(header?.classList.contains('text-center')).toBe(true)
              expect(header?.querySelector('h3')?.textContent).toBe(
                'A clear introduction',
              )
              expect(header?.querySelector('a')?.getAttribute('href')).toBe(
                '/guides/',
              )
              expect(content?.children).toHaveLength(3)
              expect(content?.querySelector('a, .section-header')).toBeNull()
              expect(content?.getAttribute('style')).toContain(
                'repeat(3, minmax(0, 1fr))',
              )
              expect(outer?.getAttribute('style')?.includes('auto-fit')).toBe(
                layout === 'split',
              )
            },
          },
        )
      } finally {
        cleanup()
      }
    },
  )

  it('omits the introduction when no heading copy is provided', async () => {
    const cleanup = ensureDomGlobals()
    try {
      await renderApp(
        '<LandingSection layout="split" columnsLg="2"><p>First</p><p>Second</p></LandingSection>',
        {
          components: defineComponents(getSvgIcon),
          context: createTestContext(),
          onRendered(document) {
            expect(
              document.querySelector('.landing-section__header'),
            ).toBeNull()
            expect(
              document.querySelector('.landing-section__content')?.children,
            ).toHaveLength(2)
            expect(
              document
                .querySelector('.landing-section__layout')
                ?.getAttribute('style'),
            ).not.toContain('auto-fit')
          },
        },
      )
    } finally {
      cleanup()
    }
  })
})
