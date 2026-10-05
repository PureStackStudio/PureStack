import type { ComponentVariant } from '@purestack/ts-components'
import { SEMANTIC_TONES } from '@purestack/ts-style'
import { defineComponent, html, type RefOrValue, unref } from 'regor'

const variants: ComponentVariant[] = [
  'solid',
  'surface',
  'surfaceAlt',
  'spotlight',
  'glass',
  'flat',
  'flatAlt',
  'flatSolid',
  'outlineFill',
  'outline',
  'subtle',
  'subtleBtn',
  'link',
  'sheen',
  'underline',
  'rail',
  'bracket',
  'none',
]

export interface LandingAppearanceGallery {
  component: RefOrValue<string>
  axis: RefOrValue<'tone' | 'variant' | 'mode'>
}

/** Full, simultaneously visible samples of each component's public appearance API. */
export function defineLandingAppearanceGallery() {
  return defineComponent<LandingAppearanceGallery>(
    html`<div class="component-appearance-grid landing-appearance-gallery">
      <div class="component-appearance-cell" r-for="sample in samples">
        <code>{{ sample.label }}</code>
        <div class="landing-appearance-sample" r-if="component === 'LandingBand'"><LandingBand :tone="sample.tone" :variant="sample.variant" :variantMode="sample.mode" height="9rem" edgeSize="1rem" alignItems="center"><strong>A new chapter</strong></LandingBand></div>
        <div class="landing-appearance-sample" r-if="component === 'LandingSection'"><LandingSection :tone="sample.tone" :variant="sample.variant" :variantMode="sample.mode" eyebrow="THE WORKFLOW" title="Build together" subtitle="A shared starting point." titleTag="h3" columnsLg="1"><Badge :tone="sample.tone">Ready to compose</Badge></LandingSection></div>
        <div class="landing-appearance-sample" r-if="component === 'FeatureCard'"><FeatureCard :tone="sample.tone" :variant="sample.variant" eyebrow="DESIGNED TOGETHER" title="One language" summary="Consistent from the first screen." icon="lucide:check" badge="Included"><template #actions><BtnLink href="/components/" :tone="sample.tone" variant="outline">Explore</BtnLink></template></FeatureCard></div>
        <div class="landing-appearance-sample" r-if="component === 'MetricStrip'"><MetricStrip :tone="sample.tone" :variant="sample.variant" columns="1" columnsSm="1" columnsLg="1"><MetricItem label="Components" value="48" detail="One shared design language" icon="lucide:check" :tone="sample.tone"/></MetricStrip></div>
        <div class="landing-appearance-sample" r-if="component === 'MetricItem'"><MetricItem label="Components" value="48" detail="One shared design language" icon="lucide:check" :tone="sample.tone"/></div>
        <div class="landing-appearance-sample" r-if="component === 'CodeShowcase'"><CodeShowcase :tone="sample.tone" :variant="sample.variant" title="A small building block" language="MDX" resultTitle="Result" resultMeta="Rendered"><pre><code>&lt;Badge&gt;Ready&lt;/Badge&gt;</code></pre><template #result><Badge :tone="sample.tone">Ready</Badge></template></CodeShowcase></div>
        <div class="landing-appearance-sample" r-if="component === 'ComparisonTable'"><ComparisonTable :tone="sample.tone" :variant="sample.variant" title="Choose your workflow" columns="1" columnsLg="1"><ComparisonColumn title="Shared system" summary="Less repetition." variant="none"><ul class="m-0 p-0"><ComparisonFeature :tone="sample.tone">Reusable patterns</ComparisonFeature></ul></ComparisonColumn></ComparisonTable></div>
        <div class="landing-appearance-sample" r-if="component === 'ComparisonColumn'"><ComparisonColumn :tone="sample.tone" :variant="sample.variant" title="Shared system" summary="One coherent toolkit." badge="Recommended" icon="lucide:check"><ul class="m-0 p-0"><ComparisonFeature :tone="sample.tone">Reusable patterns</ComparisonFeature></ul></ComparisonColumn></div>
        <div class="landing-appearance-sample" r-if="component === 'ComparisonFeature'"><ul class="m-0 p-0"><ComparisonFeature :tone="sample.tone"><span>One shared theme<br/><small>Across every screen.</small></span></ComparisonFeature></ul></div>
        <div class="landing-appearance-sample" r-if="component === 'CtaSection'"><CtaSection :tone="sample.tone" :variant="sample.variant" title="Make it yours" subtitle="Start with a useful pattern." primaryLabel="Explore" primaryHref="/components/" meta="Bring your own content."/></div>
        <div class="landing-appearance-sample" r-if="component === 'PricingTable'"><PricingTable :tone="sample.tone" :variant="sample.variant" :variantMode="sample.mode" title="Choose your starting point" footnote="Illustrative plans." columns="1" columnsLg="1" columnsXl="1"><PricingPlan title="Studio" price="$24" period="/ month" variant="none" :tone="sample.tone"><PricingFeature :tone="sample.tone">Theme-aware components</PricingFeature></PricingPlan></PricingTable></div>
        <div class="landing-appearance-sample" r-if="component === 'PricingPlan'"><PricingPlan :tone="sample.tone" :variant="sample.variant" :variantMode="sample.mode" title="Studio" summary="Room to build together." price="$24" period="/ month" badge="Popular" icon="lucide:check" note="Illustrative pricing." ctaLabel="Explore" ctaLink="/components/"><PricingFeature :tone="sample.tone">Theme-aware components</PricingFeature></PricingPlan></div>
        <div class="landing-appearance-sample" r-if="component === 'PricingFeature'"><ul class="m-0 p-0"><PricingFeature :tone="sample.tone" :variant="sample.variant">Theme-aware components</PricingFeature></ul></div>
      </div>
    </div>`,
    {
      props: ['component', 'axis'],
      context: (head) => {
        const axis = unref(head.props.axis)
        const values =
          axis === 'tone'
            ? SEMANTIC_TONES
            : axis === 'variant'
              ? variants
              : ['stateless', 'stateful']
        return {
          ...head.props,
          samples: values.map((value) => ({
            label: value,
            tone: axis === 'tone' ? value : 'accent',
            variant:
              axis === 'variant'
                ? value
                : axis === 'mode'
                  ? 'outlineFill'
                  : 'surface',
            mode: axis === 'mode' ? value : 'stateless',
          })),
        }
      },
    },
  )
}
