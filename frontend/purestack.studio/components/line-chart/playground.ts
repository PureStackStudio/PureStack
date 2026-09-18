import {
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormInputField,
  defineFormSelectField,
  defineGridComponents,
  defineIconComponents,
  defineLineChartComponents,
  type FormSelectOption,
  type LineChartCurve,
  type LineChartSeries,
} from '@purestack/ts-components'
import { lucide_chevron_down } from '@purestack/ts-svg-icons'
import {
  createApp,
  defineComponent,
  html,
  type Ref,
  ref,
  type SRef,
  sref,
} from 'regor'

export interface LineChartExample {
  chartSeries: SRef<LineChartSeries[]>
  lineCurve: Ref<LineChartCurve>
  curveOptions: FormSelectOption[]
  areaVisible: Ref<boolean>
  pointsVisible: Ref<boolean>
  valuesVisible: Ref<boolean>
  restore: () => void
  clear: () => void
}

const lineChartExampleTemplate = html`<Flex direction="column">
  <LineChart
    :series="chartSeries"
    title="Example build duration"
    description="Two illustrative runs across four revisions."
    valueSuffix=" s"
    :curve="lineCurve"
    :showArea="areaVisible"
    :showPoints="pointsVisible"
    :showValues="valuesVisible"
    :animated="false"
  />
  <FormSelectField
    id="line-curve"
    label="Curve"
    :model="lineCurve"
    :options="curveOptions"
  />
  <Flex wrap="true">
    <FormCheck id="line-area" label="Area" :checked="areaVisible" />
    <FormCheck id="line-points" label="Points" :checked="pointsVisible" />
    <FormCheck id="line-values" label="Values" :checked="valuesVisible" />
  </Flex>
  <Flex wrap="true">
    <Btn @click="restore">Restore series</Btn>
    <Btn variant="outline" @click="clear">Empty data</Btn>
  </Flex>
  <div r-for="entry in chartSeries">
    <strong>{{ entry.label }}</strong>
    <ul>
      <li r-for="point in entry.points">
        {{ point.label }}: {{ point.value }} seconds
      </li>
    </ul>
  </div>
</Flex>`

function createLineChartExample(): LineChartExample {
  const initial: LineChartSeries[] = [
    {
      label: 'Full build',
      points: [
        { label: 'r1', value: 4.2 },
        { label: 'r2', value: 3.5 },
        { label: 'r3', value: 3.8 },
        { label: 'r4', value: 2.9 },
      ],
    },
    {
      label: 'Incremental',
      points: [
        { label: 'r1', value: 1.2 },
        { label: 'r2', value: 0.9 },
        { label: 'r3', value: 1.1 },
        { label: 'r4', value: 0.7 },
      ],
    },
  ]
  const chartSeries = sref(initial)
  return {
    chartSeries,
    lineCurve: ref<LineChartCurve>('smooth'),
    curveOptions: [
      { label: 'Smooth', value: 'smooth' },
      { label: 'Linear', value: 'linear' },
    ],
    areaVisible: ref(false),
    pointsVisible: ref(true),
    valuesVisible: ref(false),
    restore: () => chartSeries([...initial]),
    clear: () => chartSeries([]),
  }
}

const component = defineComponent<LineChartExample>(lineChartExampleTemplate, {
  context: createLineChartExample,
})
const icons: Record<string, string> = {
  'lucide:chevron-down': lucide_chevron_down,
}

createApp(
  {
    components: {
      LineChartExample: component,

      ...defineFlexComponents(),
      ...defineGridComponents(),
      ...defineFormComponents(),
      ...defineButtonComponents(),
      ...defineFormInputField(),
      ...defineLineChartComponents(),
      ...defineFormSelectField(),
      ...defineIconComponents((name) => icons[name] ?? ''),
    },
  },
  { selector: 'app#line-chart-demo', template: html`<LineChartExample />` },
)
