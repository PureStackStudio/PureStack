import {
  type DoughnutChartSegment,
  defineButtonComponents,
  defineDoughnutChartComponents,
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

export type DoughnutPreset =
  | 'tasks'
  | 'equal'
  | 'dominant'
  | 'tiny'
  | 'single'
  | 'zero'
export type DoughnutCenterMode = 'total' | 'largest' | 'custom'

export interface DoughnutEditorSegment {
  id: string
  label: Ref<string>
  value: Ref<number | string>
  enabled: Ref<boolean>
  color: string
}

export interface DoughnutLegendEntry {
  label: string
  value: number
  color: string
  share: string
}

export interface DoughnutChartPlayground extends ChartAppearanceState {
  editorSegments: SRef<DoughnutEditorSegment[]>
  chartSegments: ComputedRef<DoughnutChartSegment[]>
  legend: ComputedRef<DoughnutLegendEntry[]>
  total: ComputedRef<number>
  summary: ComputedRef<string>
  centerValue: ComputedRef<string>
  centerLabel: ComputedRef<string>
  replayDisabled: ComputedRef<boolean>
  preset: Ref<DoughnutPreset>
  centerMode: Ref<DoughnutCenterMode>
  customValue: Ref<string>
  caption: Ref<string>
  suffix: Ref<string>
  thickness: Ref<number | string>
  gap: Ref<number | string>
  angle: Ref<number | string>
  size: Ref<number | string>
  valueSize: Ref<number | string>
  labelSize: Ref<number | string>
  animated: Ref<boolean>
  presets: FormSelectOption[]
  centerModes: FormSelectOption[]
  units: FormSelectOption[]
  applyPreset: (event: Event) => void
  replay: () => void
  clear: () => void
  reset: () => void
}

const doughnutChartPlaygroundTemplate = html`<Flex direction="column">
  <Grid columns="1" columnsMd="2">
    <FormSelectField id="ring-preset" label="Distribution" :model="preset" :options="presets" @change="applyPreset" />
    <FormSelectField id="ring-unit" label="Value suffix" :model="suffix" :options="units" />
  </Grid>
  <ChartAppearanceControls prefix="doughnut-chart-appearance" :tone="chartTone" :variant="chartVariant" :variantMode="chartVariantMode" :width="chartWidth" :showWidth="false"/>
  <Panel variant="surfaceAlt" bodyClass="p-3 min-w-0">
    <Flex justify="between" align="center" wrap="true">
      <p class="text-eyebrow m-0">LIVE PREVIEW · PARTS OF A WHOLE</p>
      <Btn variant="outline" size="sm" :disabled="replayDisabled" @click="replay">Replay animation</Btn>
    </Flex>
    <Grid columns="1" columnsMd="2" alignItems="center" class="my-3">
      <DoughnutChart
        :tone="chartTone" :variant="chartVariant" :variantMode="chartVariantMode"
        :segments="chartSegments"
        title="Illustrative distribution"
        description="Positive values form the ring. The adjacent legend lists exact values and shares."
        :ariaLabel="summary"
        :centerValue="centerValue"
        :centerLabel="centerLabel"
        :centerValueSize="valueSize"
        :centerLabelSize="labelSize"
        :valueSuffix="suffix"
        emptyLabel="No data"
        :thickness="thickness"
        :gap="gap"
        :startAngle="angle"
        :size="size"
        :animated="animated"
        class="mx-auto"
        style="max-width: 100%; height: auto"
      />
      <Flex direction="column" aria-label="Segment values and shares">
        <Flex r-for="entry in legend" justify="between" align="center" wrap="true">
          <Flex align="center">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="5" :fill="entry.color" /></svg>
            <span>{{ entry.label }}</span>
          </Flex>
          <strong>{{ entry.value }}{{ suffix }} · {{ entry.share }}%</strong>
        </Flex>
        <p r-if="!total" class="m-0 text-muted">Enable a positive segment or choose another distribution.</p>
        <FormStatus>{{ summary }}</FormStatus>
      </Flex>
    </Grid>
  </Panel>
  <Flex justify="between" align="center" wrap="true">
    <h3 class="m-0">Edit the distribution</h3>
    <Flex wrap="true">
      <Btn variant="outline" @click="clear">Empty data</Btn>
      <Btn tone="accent" variant="surface" @click="reset">Reset playground</Btn>
    </Flex>
  </Flex>
  <Panel r-for="entry in editorSegments" tone="neutral" variant="surface" bodyClass="p-3 min-w-0">
    <Grid columns="1" columnsMd="3" alignItems="center">
      <FormInputField :id="'ring-name-' + entry.id" label="Segment name" :model="entry.label" />
      <FormInputField :id="'ring-value-' + entry.id" label="Value" type="number" step="0.1" :model="entry.value" />
      <FormCheck :id="'ring-enabled-' + entry.id" label="Include segment" :checked="entry.enabled" />
    </Grid>
  </Panel>
  <p class="m-0 text-muted">Only finite, positive values contribute. Hide a segment to recalculate the total and shares; its color stays attached when restored.</p>
  <h3 class="m-0">Ring geometry</h3>
  <Grid columns="2" columnsMd="4">
    <FormInputField id="ring-thickness" label="Thickness (2–40)" type="number" min="2" :model="thickness" />
    <FormInputField id="ring-gap" label="Gap (0–24)" type="number" min="0" :model="gap" />
    <FormInputField id="ring-angle" label="Start angle (°)" type="number" step="15" :model="angle" />
    <FormInputField id="ring-size" label="Size (px)" type="number" min="100" step="20" :model="size" />
  </Grid>
  <p class="m-0 text-muted">Thickness and gap use the 100-unit SVG canvas and are clamped to the ranges above. Gaps shrink around tiny slices. Size fits the available preview width.</p>
  <h3 class="m-0">Center content</h3>
  <Grid columns="1" columnsMd="2">
    <FormSelectField id="ring-center" label="Center value" :model="centerMode" :options="centerModes" />
    <FormInputField r-if="centerMode === 'custom'" id="ring-custom" label="Custom value" :model="customValue" />
    <FormInputField r-if="centerMode !== 'largest'" id="ring-caption" label="Center label" :model="caption" />
  </Grid>
  <Grid columns="2">
    <FormInputField id="ring-value-size" label="Value font size" type="number" min="1" :model="valueSize" />
    <FormInputField id="ring-label-size" label="Label font size" type="number" min="1" :model="labelSize" />
  </Grid>
  <p class="m-0 text-muted">Largest share is calculated from the visible values. Custom copy changes only the text. Font sizes scale with the SVG; thick rings and long labels need smaller type. This demo clears center copy when the total is zero.</p>
  <FormCheck id="ring-motion" label="Entrance animation" :checked="animated" />
</Flex>`

const presetValues: Record<DoughnutPreset, number[]> = {
  tasks: [18, 7, 5],
  equal: [10, 10, 10],
  dominant: [27, 2, 1],
  tiny: [99.5, 0.4, 0.1],
  single: [30, 0, 0],
  zero: [0, 0, 0],
}

function createSegments(preset: DoughnutPreset): DoughnutEditorSegment[] {
  const colors = [
    getThemePaletteVar('semanticTone.accent.button.hover.bgcolor'),
    getThemePaletteVar('semanticTone.feature.button.hover.bgcolor'),
    getThemePaletteVar('semanticTone.info.button.hover.bgcolor'),
  ]
  return presetValues[preset].map((value, index) => ({
    id: String(index),
    label: ref(['Complete', 'In review', 'Planned'][index]),
    value: ref<number | string>(value),
    enabled: ref(true),
    color: colors[index],
  }))
}

function createDoughnutChartPlayground(): DoughnutChartPlayground {
  const appearance = createChartAppearanceState()
  const editorSegments = sref(createSegments('tasks'))
  const preset = ref<DoughnutPreset>('tasks')
  const centerMode = ref<DoughnutCenterMode>('total')
  const customValue = ref('Ready')
  const caption = ref('Tasks')
  const suffix = ref('')
  const thickness = ref<number | string>(14)
  const gap = ref<number | string>(2)
  const angle = ref<number | string>(-90)
  const size = ref<number | string>(280)
  const valueSize = ref<number | string>(16)
  const labelSize = ref<number | string>(5)
  const animated = ref(true)
  const visible = computed(() =>
    editorSegments()
      .filter((entry) => entry.enabled())
      .map((entry) => ({
        label: entry.label().trim() || `Segment ${Number(entry.id) + 1}`,
        value: Number(entry.value()),
        color: entry.color,
      }))
      .filter((entry) => Number.isFinite(entry.value) && entry.value > 0),
  )
  const total = computed(() =>
    visible().reduce((sum, entry) => sum + entry.value, 0),
  )
  const legend = computed(() =>
    visible().map((entry) => ({
      ...entry,
      share: String(Number(((entry.value / total()) * 100).toFixed(1))),
    })),
  )
  const largest = computed(() =>
    legend().reduce<DoughnutLegendEntry | undefined>(
      (best, entry) => (!best || entry.value > best.value ? entry : best),
      undefined,
    ),
  )
  return {
    ...appearance,
    editorSegments,
    chartSegments: computed<DoughnutChartSegment[]>(() => visible()),
    legend,
    total,
    summary: computed(() =>
      total()
        ? `${visible().length} segments · Total ${Number(total().toFixed(3))}${suffix()}`
        : 'No positive values',
    ),
    centerValue: computed(() =>
      !total()
        ? ''
        : centerMode() === 'largest'
          ? `${largest()?.share}%`
          : centerMode() === 'custom'
            ? customValue()
            : '',
    ),
    centerLabel: computed(() =>
      !total()
        ? ''
        : centerMode() === 'largest'
          ? (largest()?.label ?? '')
          : caption(),
    ),
    replayDisabled: computed(() => !animated() || !total()),
    preset,
    centerMode,
    customValue,
    caption,
    suffix,
    thickness,
    gap,
    angle,
    size,
    valueSize,
    labelSize,
    animated,
    presets: [
      { label: 'Task distribution', value: 'tasks' },
      { label: 'Equal shares', value: 'equal' },
      { label: 'Dominant segment', value: 'dominant' },
      { label: 'Tiny slices', value: 'tiny' },
      { label: 'One positive segment', value: 'single' },
      { label: 'All zero', value: 'zero' },
    ],
    centerModes: [
      { label: 'Automatic total', value: 'total' },
      { label: 'Largest share', value: 'largest' },
      { label: 'Custom text', value: 'custom' },
    ],
    units: [
      { label: 'No suffix', value: '' },
      { label: 'Percent (%)', value: '%' },
      { label: 'Gigabytes (GB)', value: 'GB' },
    ],
    applyPreset: (event) =>
      editorSegments(
        createSegments(
          (event.target as HTMLSelectElement).value as DoughnutPreset,
        ),
      ),
    replay: () => {
      for (const animation of document.querySelectorAll<SVGAnimationElement>(
        '#doughnut-chart-demo .doughnut-chart animate, #doughnut-chart-demo .doughnut-chart animateTransform',
      ))
        animation.beginElement()
    },
    clear: () => editorSegments([]),
    reset: () =>
      batch(() => {
        appearance.resetAppearance()
        preset('tasks')
        centerMode('total')
        customValue('Ready')
        caption('Tasks')
        suffix('')
        thickness(14)
        gap(2)
        angle(-90)
        size(280)
        valueSize(16)
        labelSize(5)
        animated(true)
        editorSegments(createSegments('tasks'))
      }),
  }
}

const doughnutChartPlayground = defineComponent<DoughnutChartPlayground>(
  doughnutChartPlaygroundTemplate,
  { context: createDoughnutChartPlayground },
)
const icons: Record<string, string> = {
  'lucide:chevron-down': lucide_chevron_down,
}

createApp(
  {
    components: {
      ChartAppearanceControls: defineChartAppearanceControls(),
      DoughnutChartPlayground: doughnutChartPlayground,
      ...defineButtonComponents(),
      ...defineDoughnutChartComponents(),
      ...defineFlexComponents(),
      ...defineFormComponents(),
      ...defineFormInputField(),
      ...defineFormSelectField(),
      ...defineGridComponents(),
      ...defineIconComponents((name) => icons[name] ?? ''),
      ...definePanelComponents(),
    },
  },
  {
    selector: 'app#doughnut-chart-demo',
    template: html`<DoughnutChartPlayground />`,
  },
)
