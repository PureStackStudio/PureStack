import {
  defineBadgeComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormInputField,
  defineFormSelectField,
  defineGridComponents,
  defineIconComponents,
  defineLineChartComponents,
  definePanelComponents,
  type FormSelectOption,
  type LineChartCurve,
  type LineChartSeries,
} from '@purestack/ts-components'
import { getThemePaletteVar, type SemanticTone } from '@purestack/ts-style'
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

export type LineChartPreset =
  | 'growth'
  | 'crossing'
  | 'signed'
  | 'flat'
  | 'single'

export interface LineChartEditorPoint {
  id: string
  label: string
  value: Ref<number | string>
}

export interface LineChartEditorSeries {
  id: string
  label: Ref<string>
  enabled: Ref<boolean>
  tone: SemanticTone
  color: string
  points: LineChartEditorPoint[]
}

export interface LineChartPlayground {
  editorSeries: SRef<LineChartEditorSeries[]>
  chartSeries: ComputedRef<LineChartSeries[]>
  summary: ComputedRef<string>
  replayDisabled: ComputedRef<boolean>
  preset: Ref<LineChartPreset>
  curve: Ref<LineChartCurve>
  suffix: Ref<string>
  minimum: Ref<number | string>
  maximum: Ref<number | string>
  height: Ref<number | string>
  areaVisible: Ref<boolean>
  pointsVisible: Ref<boolean>
  valuesVisible: Ref<boolean>
  labelsVisible: Ref<boolean>
  axisVisible: Ref<boolean>
  motionEnabled: Ref<boolean>
  presets: FormSelectOption[]
  curves: FormSelectOption[]
  units: FormSelectOption[]
  applyPreset: (event: Event) => void
  replay: () => void
  clear: () => void
  reset: () => void
}

const lineChartPlaygroundTemplate = html`<Flex direction="column">
  <Grid columns="1" columnsMd="3">
    <FormSelectField
      id="line-preset"
      label="Dataset"
      :model="preset"
      :options="presets"
      @change="applyPreset"
    />
    <FormSelectField id="line-curve" label="Curve" :model="curve" :options="curves" />
    <FormSelectField id="line-unit" label="Value suffix" :model="suffix" :options="units" />
  </Grid>
  <Panel variant="surfaceAlt" bodyClass="p-3 min-w-0">
    <Flex justify="between" align="center" wrap="true">
      <p class="text-eyebrow m-0">LIVE PREVIEW · SERIES COMPARISON</p>
      <Btn variant="outline" size="sm" :disabled="replayDisabled" @click="replay">Replay animation</Btn>
    </Flex>
    <Flex wrap="true" class="mt-3">
      <template r-for="entry in editorSeries">
        <Badge r-if="entry.enabled" :tone="entry.tone" variant="surface">{{ entry.label }}</Badge>
      </template>
    </Flex>
    <div class="overflow-x-auto" tabindex="0" role="region" aria-label="Scrollable line chart preview">
      <LineChart
        :series="chartSeries"
        title="Illustrative series comparison"
        description="Equally spaced observations. Exact values can be edited in each series below."
        :ariaLabel="summary"
        emptyLabel="No visible series"
        :curve="curve"
        :valueSuffix="suffix"
        :minValue="minimum"
        :maxValue="maximum"
        :height="height"
        :showArea="areaVisible"
        :showPoints="pointsVisible"
        :showValues="valuesVisible"
        :showLabels="labelsVisible"
        :showAxis="axisVisible"
        :animated="motionEnabled"
        style="min-width: 440px"
      />
    </div>
    <FormStatus>{{ summary }}</FormStatus>
  </Panel>
  <Flex wrap="true">
    <FormCheck id="line-area" label="Area fill" :checked="areaVisible" />
    <FormCheck id="line-points" label="Point markers" :checked="pointsVisible" />
    <FormCheck id="line-values" label="Values" :checked="valuesVisible" />
    <FormCheck id="line-labels" label="Category labels" :checked="labelsVisible" />
    <FormCheck id="line-axis" label="Grid and zero line" :checked="axisVisible" />
    <FormCheck id="line-motion" label="Entrance animation" :checked="motionEnabled" />
  </Flex>
  <Grid columns="1" columnsMd="3">
    <FormInputField id="line-min" label="Minimum bound" type="number" placeholder="Automatic" :model="minimum" />
    <FormInputField id="line-max" label="Maximum bound" type="number" placeholder="Automatic" :model="maximum" />
    <FormInputField id="line-height" label="Chart height (px)" type="number" min="180" step="20" :model="height" />
  </Grid>
  <p class="m-0 text-muted">Blank bounds use the data range. Bounds always expand to include zero and all visible points. Scroll the preview horizontally on narrow screens.</p>
  <Flex justify="between" align="center" wrap="true">
    <h3 class="m-0">Edit the series</h3>
    <Flex wrap="true">
      <Btn variant="outline" @click="clear">Empty data</Btn>
      <Btn tone="accent" variant="surface" @click="reset">Reset playground</Btn>
    </Flex>
  </Flex>
  <Panel r-for="entry in editorSeries" tone="neutral" variant="surface" bodyClass="p-3 min-w-0" :aria-label="entry.label">
    <Flex direction="column">
      <Flex justify="between" align="center" wrap="true">
        <FormInputField :id="'line-name-' + entry.id" label="Series name" :model="entry.label" />
        <FormCheck :id="'line-enabled-' + entry.id" label="Show series" :checked="entry.enabled" />
      </Flex>
      <Grid columns="2" columnsSm="3" columnsLg="5">
        <FormInputField
          r-for="point in entry.points"
          :id="point.id"
          :label="point.label"
          type="number"
          step="1"
          :model="point.value"
        />
      </Grid>
    </Flex>
  </Panel>
</Flex>`

const presetValues: Record<LineChartPreset, [number[], number[]]> = {
  growth: [
    [18, 26, 37, 48, 64],
    [10, 18, 25, 34, 43],
  ],
  crossing: [
    [20, 38, 28, 58, 48],
    [48, 26, 50, 32, 64],
  ],
  signed: [
    [-18, -8, 12, 28, 40],
    [-32, -18, -4, 12, 22],
  ],
  flat: [
    [24, 24, 24, 24, 24],
    [12, 12, 12, 12, 12],
  ],
  single: [[24], [12]],
}

function createLineChartSeries(
  preset: LineChartPreset,
): LineChartEditorSeries[] {
  const colors = [
    getThemePaletteVar('semanticTone.accent.button.hover.bgcolor'),
    getThemePaletteVar('semanticTone.feature.button.hover.bgcolor'),
  ]
  return presetValues[preset].map((values, index) => ({
    id: String(index),
    label: ref(index === 0 ? 'Current' : 'Baseline'),
    enabled: ref(true),
    tone: index === 0 ? 'accent' : 'feature',
    color: colors[index],
    points: values.map((value, pointIndex) => ({
      id: `line-value-${index}-${pointIndex}`,
      label: `R${pointIndex + 1}`,
      value: ref<number | string>(value),
    })),
  }))
}

function createLineChartPlayground(): LineChartPlayground {
  const editorSeries = sref(createLineChartSeries('growth'))
  const preset = ref<LineChartPreset>('growth')
  const curve = ref<LineChartCurve>('smooth')
  const suffix = ref('%')
  const minimum = ref<number | string>('')
  const maximum = ref<number | string>('')
  const height = ref<number | string>(300)
  const areaVisible = ref(false)
  const pointsVisible = ref(true)
  const valuesVisible = ref(false)
  const labelsVisible = ref(true)
  const axisVisible = ref(true)
  const motionEnabled = ref(true)
  const chartSeries = computed<LineChartSeries[]>(() =>
    editorSeries()
      .filter((entry) => entry.enabled())
      .map((entry, index) => ({
        label: entry.label().trim() || `Series ${index + 1}`,
        color: entry.color,
        points: entry.points.map((point) => ({
          label: point.label,
          value: Number(point.value()),
        })),
      })),
  )
  return {
    editorSeries,
    chartSeries,
    summary: computed(() => {
      const visible = editorSeries().filter((entry) => entry.enabled())
      if (!visible.length)
        return 'No visible series. Enable a series, choose a dataset, or reset.'
      return visible
        .map((entry, index) => {
          const latest = entry.points.at(-1)
          return `${entry.label().trim() || `Series ${index + 1}`}: ${latest?.label} = ${Number(latest?.value())}${suffix()}`
        })
        .join(' · ')
    }),
    replayDisabled: computed(() => !motionEnabled() || !chartSeries().length),
    preset,
    curve,
    suffix,
    minimum,
    maximum,
    height,
    areaVisible,
    pointsVisible,
    valuesVisible,
    labelsVisible,
    axisVisible,
    motionEnabled,
    presets: [
      { label: 'Steady growth', value: 'growth' },
      { label: 'Crossing trends', value: 'crossing' },
      { label: 'Gains and losses', value: 'signed' },
      { label: 'Flat series', value: 'flat' },
      { label: 'Single observation', value: 'single' },
    ],
    curves: [
      { label: 'Smooth', value: 'smooth' },
      { label: 'Linear', value: 'linear' },
    ],
    units: [
      { label: 'Percent (%)', value: '%' },
      { label: 'Milliseconds (ms)', value: 'ms' },
      { label: 'No suffix', value: '' },
    ],
    applyPreset: (event) => {
      const next = (event.target as HTMLSelectElement).value as LineChartPreset
      editorSeries(createLineChartSeries(next))
    },
    replay: () => {
      for (const animation of document.querySelectorAll<SVGAnimationElement>(
        '#line-chart-demo .line-chart animate',
      )) {
        animation.beginElement()
      }
    },
    clear: () => editorSeries([]),
    reset: () =>
      batch(() => {
        preset('growth')
        curve('smooth')
        suffix('%')
        minimum('')
        maximum('')
        height(300)
        areaVisible(false)
        pointsVisible(true)
        valuesVisible(false)
        labelsVisible(true)
        axisVisible(true)
        motionEnabled(true)
        editorSeries(createLineChartSeries('growth'))
      }),
  }
}

const lineChartPlayground = defineComponent<LineChartPlayground>(
  lineChartPlaygroundTemplate,
  {
    context: createLineChartPlayground,
  },
)
const icons: Record<string, string> = {
  'lucide:chevron-down': lucide_chevron_down,
}

createApp(
  {
    components: {
      LineChartPlayground: lineChartPlayground,
      ...defineBadgeComponents(),
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineFormComponents(),
      ...defineFormInputField(),
      ...defineFormSelectField(),
      ...defineGridComponents(),
      ...defineIconComponents((name) => icons[name] ?? ''),
      ...defineLineChartComponents(),
      ...definePanelComponents(),
    },
  },
  { selector: 'app#line-chart-demo', template: html`<LineChartPlayground />` },
)
