import {
  type BarChartItem,
  defineBarChartComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormInputField,
  defineFormSelectField,
  defineGridComponents,
  defineIconComponents,
  definePanelComponents,
  type FormSelectOption,
} from '@purestack/ts-components'
import { getThemePaletteVar } from '@purestack/ts-style'
import { lucide_chevron_down } from '@purestack/ts-svg-icons'
import {
  batch,
  type ComputedRef,
  computed,
  createApp,
  defineComponent,
  html,
  type Ref,
  ref,
  type SRef,
  sref,
} from 'regor'
import {
  type ChartAppearanceState,
  createChartAppearanceState,
  defineChartAppearanceControls,
} from '../../../../docs/dataGuide'

export type BarChartPreset = 'mixed' | 'positive' | 'negative' | 'zero'
export type BarChartPalette = 'balance' | 'categorical' | 'accent'

export interface BarChartEditorRow {
  id: string
  label: string
  value: Ref<number | string>
}

export interface BarChartPlayground extends ChartAppearanceState {
  rows: SRef<BarChartEditorRow[]>
  chartItems: ComputedRef<BarChartItem[]>
  summary: ComputedRef<string>
  preset: Ref<BarChartPreset>
  palette: Ref<BarChartPalette>
  suffix: Ref<string>
  minimum: Ref<number | string>
  maximum: Ref<number | string>
  height: Ref<number | string>
  valuesVisible: Ref<boolean>
  axisVisible: Ref<boolean>
  labelsVisible: Ref<boolean>
  motionEnabled: Ref<boolean>
  presets: FormSelectOption[]
  palettes: FormSelectOption[]
  units: FormSelectOption[]
  applyPreset: (event: Event) => void
  clear: () => void
  reset: () => void
}

const barChartPlaygroundTemplate = html`<Flex direction="column">
  <Grid columns="1" columnsMd="3">
    <FormSelectField id="bar-preset" label="Dataset" :model="preset" :options="presets" @change="applyPreset" />
    <FormSelectField id="bar-palette" label="Bar colors" :model="palette" :options="palettes" />
    <FormSelectField id="bar-unit" label="Value suffix" :model="suffix" :options="units" />
  </Grid>
  <ChartAppearanceControls prefix="bar-chart-appearance" :tone="chartTone" :variant="chartVariant" :variantMode="chartVariantMode" :width="chartWidth" :showWidth="true"/>
  <Panel variant="surfaceAlt" bodyClass="p-3 min-w-0">
    <p class="text-eyebrow mt-0">LIVE PREVIEW · WEEKLY BALANCE</p>
    <div class="overflow-x-auto" tabindex="0" role="region" aria-label="Scrollable chart preview">
      <BarChart
        :tone="chartTone" :variant="chartVariant" :variantMode="chartVariantMode" :width="chartWidth"
        :items="chartItems"
        title="Weekly balance"
        description="Illustrative daily changes. Edit the exact values in the fields below."
        :ariaLabel="summary"
        emptyLabel="No days to compare"
        :valueSuffix="suffix"
        :minValue="minimum"
        :maxValue="maximum"
        :height="height"
        :showValues="valuesVisible"
        :showAxis="axisVisible"
        :showLabels="labelsVisible"
        :animated="motionEnabled"
        style="min-width: 440px"
      />
    </div>
    <FormStatus>{{ summary }}</FormStatus>
  </Panel>
  <Flex wrap="true">
    <FormCheck id="bar-values" label="Values" :checked="valuesVisible" />
    <FormCheck id="bar-axis" label="Grid and zero line" :checked="axisVisible" />
    <FormCheck id="bar-labels" label="Category labels" :checked="labelsVisible" />
    <FormCheck id="bar-motion" label="Entrance animation" :checked="motionEnabled" />
  </Flex>
  <Flex justify="between" align="center" wrap="true">
    <h3 class="m-0">Edit the data</h3>
    <Flex wrap="true">
      <Btn variant="outline" @click="clear">Empty data</Btn>
      <Btn tone="accent" variant="surface" @click="reset">Reset playground</Btn>
    </Flex>
  </Flex>
  <Grid columns="2" columnsSm="3" columnsLg="5">
    <FormInputField
      r-for="row in rows"
      :id="row.id"
      :label="row.label"
      type="number"
      step="1"
      :model="row.value"
    />
  </Grid>
  <Grid columns="1" columnsMd="3">
    <FormInputField id="bar-min" label="Minimum bound" type="number" placeholder="Automatic" :model="minimum" />
    <FormInputField id="bar-max" label="Maximum bound" type="number" placeholder="Automatic" :model="maximum" />
    <FormInputField id="bar-height" label="Chart height (px)" type="number" min="180" step="20" :model="height" />
  </Grid>
  <p class="m-0 text-muted">Blank bounds use the data range. The scale always includes zero and every value. On narrow screens, scroll the preview horizontally to keep its labels readable.</p>
</Flex>`

const presetValues: Record<BarChartPreset, number[]> = {
  mixed: [24, 38, -12, 46, 32],
  positive: [18, 32, 25, 48, 60],
  negative: [-18, -32, -8, -24, -12],
  zero: [0, 0, 0, 0, 0],
}

function createBarChartRows(preset: BarChartPreset): BarChartEditorRow[] {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((label, index) => ({
    id: `bar-value-${index}`,
    label,
    value: ref<number | string>(presetValues[preset][index]),
  }))
}

function createBarChartPlayground(): BarChartPlayground {
  const appearance = createChartAppearanceState()
  const preset = ref<BarChartPreset>('mixed')
  const palette = ref<BarChartPalette>('balance')
  const suffix = ref('')
  const minimum = ref<number | string>('')
  const maximum = ref<number | string>('')
  const height = ref<number | string>(280)
  const valuesVisible = ref(true)
  const axisVisible = ref(true)
  const labelsVisible = ref(true)
  const motionEnabled = ref(true)
  const rows = sref(createBarChartRows('mixed'))
  const accent = getThemePaletteVar('semanticTone.accent.button.rest.bgcolor')
  const danger = getThemePaletteVar('semanticTone.danger.button.rest.bgcolor')
  const chartItems = computed<BarChartItem[]>(() =>
    rows().map((row) => {
      const value = Number(row.value())
      return {
        label: row.label,
        value,
        color:
          palette() === 'categorical'
            ? undefined
            : palette() === 'balance' && value < 0
              ? danger
              : accent,
      }
    }),
  )
  return {
    ...appearance,
    rows,
    chartItems,
    summary: computed(() => {
      if (!rows().length)
        return 'No data. Choose a dataset or reset the playground.'
      const values = rows().map(
        (row) => `${row.label}: ${Number(row.value())}${suffix()}`,
      )
      return values.join(' · ')
    }),
    preset,
    palette,
    suffix,
    minimum,
    maximum,
    height,
    valuesVisible,
    axisVisible,
    labelsVisible,
    motionEnabled,
    presets: [
      { label: 'Mixed gains and losses', value: 'mixed' },
      { label: 'All positive', value: 'positive' },
      { label: 'All negative', value: 'negative' },
      { label: 'All zero', value: 'zero' },
    ],
    palettes: [
      { label: 'Gains / losses', value: 'balance' },
      { label: 'One color per category', value: 'categorical' },
      { label: 'Single accent', value: 'accent' },
    ],
    units: [
      { label: 'No suffix', value: '' },
      { label: 'Percent (%)', value: '%' },
      { label: 'Milliseconds (ms)', value: 'ms' },
      { label: 'Credits (cr)', value: 'cr' },
    ],
    applyPreset: (event) => {
      const next = (event.target as HTMLSelectElement).value as BarChartPreset
      rows(createBarChartRows(next))
    },
    clear: () => rows([]),
    reset: () =>
      batch(() => {
        appearance.resetAppearance()
        preset('mixed')
        palette('balance')
        suffix('')
        minimum('')
        maximum('')
        height(280)
        valuesVisible(true)
        axisVisible(true)
        labelsVisible(true)
        motionEnabled(true)
        rows(createBarChartRows('mixed'))
      }),
  }
}

const barChartPlayground = defineComponent<BarChartPlayground>(
  barChartPlaygroundTemplate,
  { context: createBarChartPlayground },
)

const icons: Record<string, string> = {
  'lucide:chevron-down': lucide_chevron_down,
}

createApp(
  {
    components: {
      ChartAppearanceControls: defineChartAppearanceControls(),
      BarChartPlayground: barChartPlayground,
      ...defineBarChartComponents(),
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineFormComponents(),
      ...defineFormInputField(),
      ...defineFormSelectField(),
      ...defineGridComponents(),
      ...defineIconComponents((name) => icons[name] ?? ''),
      ...definePanelComponents(),
    },
  },
  { selector: 'app#bar-chart-demo', template: html`<BarChartPlayground />` },
)
