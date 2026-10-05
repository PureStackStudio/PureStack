import type {
  ComponentVariant,
  ComponentVariantMode,
} from '@purestack/ts-components'
import {
  getThemePaletteVar,
  SEMANTIC_TONES,
  type SemanticTone,
} from '@purestack/ts-style'
import {
  defineComponent,
  html,
  type Ref,
  type RefOrValue,
  ref,
  unref,
} from 'regor'

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

export interface ChartAppearanceState {
  chartTone: Ref<SemanticTone>
  chartVariant: Ref<ComponentVariant>
  chartVariantMode: Ref<ComponentVariantMode>
  chartWidth: Ref<number | string>
  resetAppearance: () => void
}

export function createChartAppearanceState(): ChartAppearanceState {
  const tone = ref<SemanticTone>('neutral')
  const variant = ref<ComponentVariant>('none')
  const variantMode = ref<ComponentVariantMode>('stateless')
  const width = ref<number | string>('')
  return {
    chartTone: tone,
    chartVariant: variant,
    chartVariantMode: variantMode,
    chartWidth: width,
    resetAppearance: () => {
      tone('neutral')
      variant('none')
      variantMode('stateless')
      width('')
    },
  }
}

export interface ChartAppearanceControls {
  tone: Ref<SemanticTone>
  variant: Ref<ComponentVariant>
  variantMode: Ref<ComponentVariantMode>
  width: Ref<number | string>
  showWidth?: RefOrValue<boolean>
  prefix: RefOrValue<string>
}

export function defineChartAppearanceControls() {
  return defineComponent<ChartAppearanceControls>(
    html`<Grid columns="1" columnsMd="3">
    <FormSelectField :id="prefix + '-tone'" label="Chart tone" :model="tone" :options="tones"/>
    <FormSelectField :id="prefix + '-variant'" label="Chart variant" :model="variant" :options="variants"/>
    <FormSelectField :id="prefix + '-mode'" label="Variant mode" :model="variantMode" :options="modes"/>
    <FormInputField r-if="showWidth" :id="prefix + '-width'" label="SVG width (px; blank is responsive)" type="number" min="240" :model="width"/>
  </Grid>`,
    {
      props: ['tone', 'variant', 'variantMode', 'width', 'showWidth', 'prefix'],
      context: (head) => ({
        ...head.props,
        tones: SEMANTIC_TONES.map((value) => ({ label: value, value })),
        variants: variants.map((value) => ({ label: value, value })),
        modes: [
          { label: 'Stateless · resting appearance', value: 'stateless' },
          { label: 'Stateful · hover and active', value: 'stateful' },
        ],
      }),
    },
  )
}

export interface ChartAppearanceGallery {
  component: RefOrValue<string>
  axis: RefOrValue<'tone' | 'variant' | 'mode'>
}

export function defineChartAppearanceGallery() {
  return defineComponent<ChartAppearanceGallery>(
    html`<div class="component-appearance-grid data-chart-gallery">
    <div class="component-appearance-cell" r-for="sample in samples">
      <code>{{ sample.label }}</code>
      <BarChart r-if="component === 'BarChart'" :items="sample.items" :tone="sample.tone" :variant="sample.variant" :variantMode="sample.mode" width="100%" height="160" :animated="false" :ariaLabel="sample.label + ': Monday 24, Tuesday 38, Wednesday -12'"/>
      <LineChart r-if="component === 'LineChart'" :series="sample.series" :tone="sample.tone" :variant="sample.variant" :variantMode="sample.mode" width="100%" height="160" :showArea="true" :showPoints="true" :animated="false" :ariaLabel="sample.label + ': requests 18, 32, 25, 48'"/>
      <DoughnutChart r-if="component === 'DoughnutChart'" :segments="sample.segments" :tone="sample.tone" :variant="sample.variant" :variantMode="sample.mode" size="160" centerLabel="Tasks" centerValue="30" :animated="false" :ariaLabel="sample.label + ': complete 18, review 7, planned 5'"/>
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
          samples: values.map((label) => {
            const tone = axis === 'tone' ? label : 'accent'
            const variant =
              axis === 'variant'
                ? label
                : axis === 'mode'
                  ? 'outlineFill'
                  : 'surface'
            const color = getThemePaletteVar(
              ['solid', 'flatSolid'].includes(variant)
                ? `semanticTone.${tone}.button.rest.text`
                : ['neutral', 'ghost'].includes(tone)
                  ? `semanticTone.${tone}.text.default`
                  : `semanticTone.${tone}.button.rest.bgcolor`,
            )
            return {
              label,
              tone,
              variant,
              mode: axis === 'mode' ? label : 'stateless',
              items: [
                { label: 'Mon', value: 24, color },
                { label: 'Tue', value: 38, color },
                { label: 'Wed', value: -12, color },
              ],
              series: [
                {
                  label: 'Requests',
                  color,
                  points: [18, 32, 25, 48].map((value, index) => ({
                    label: ['Mon', 'Tue', 'Wed', 'Thu'][index],
                    value,
                  })),
                },
              ],
              segments: [
                { label: 'Complete', value: 18, color },
                { label: 'Review', value: 7 },
                { label: 'Planned', value: 5 },
              ],
            }
          }),
        }
      },
    },
  )
}
