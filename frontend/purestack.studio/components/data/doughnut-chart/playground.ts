import {
  type DoughnutChartSegment,
  defineButtonComponents,
  defineDoughnutChartComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormInputField,
  defineGridComponents,
} from '@purestack/ts-components'

import {
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

export interface DoughnutChartExample {
  chartSegments: SRef<DoughnutChartSegment[]>
  centerCaption: ComputedRef<string>
  ringThickness: Ref<number | string>
  segmentGap: Ref<number | string>
  startRotation: Ref<number | string>
  restore: () => void
  clear: () => void
}

const doughnutChartExampleTemplate = html`<Flex direction="column">
  <Grid columns="1" columnsSm="2" alignItems="center">
    <DoughnutChart
      :segments="chartSegments"
      title="Example task distribution"
      :centerLabel="centerCaption"
      :thickness="ringThickness"
      :gap="segmentGap"
      :startAngle="startRotation"
      :animated="false"
    />
    <ul>
      <li r-for="entry in chartSegments">
        {{ entry.label }}: {{ entry.value }} tasks
      </li>
    </ul>
  </Grid>
  <Grid columns="1" columnsSm="3">
    <FormInputField
      id="ring-thickness"
      label="Thickness (2–40)"
      type="number"
      min="2"
      max="40"
      :model="ringThickness"
    />
    <FormInputField
      id="ring-gap"
      label="Gap (0–24)"
      type="number"
      min="0"
      max="24"
      :model="segmentGap"
    />
    <FormInputField
      id="ring-angle"
      label="Start angle"
      type="number"
      step="15"
      :model="startRotation"
    />
  </Grid>
  <Flex wrap="true">
    <Btn @click="restore">Restore segments</Btn>
    <Btn variant="outline" @click="clear">Empty data</Btn>
  </Flex>
</Flex>`

function createDoughnutChartExample(): DoughnutChartExample {
  const initial: DoughnutChartSegment[] = [
    { label: 'Complete', value: 18 },
    { label: 'In review', value: 7 },
    { label: 'Planned', value: 5 },
  ]
  const chartSegments = sref(initial)
  return {
    chartSegments,
    centerCaption: computed<string>(() =>
      chartSegments().length ? 'Tasks' : '',
    ),
    ringThickness: ref<number | string>(14),
    segmentGap: ref<number | string>(2),
    startRotation: ref<number | string>(-90),
    restore: () => chartSegments([...initial]),
    clear: () => chartSegments([]),
  }
}

const component = defineComponent<DoughnutChartExample>(
  doughnutChartExampleTemplate,
  {
    context: createDoughnutChartExample,
  },
)

createApp(
  {
    components: {
      DoughnutChartExample: component,

      ...defineFlexComponents(),
      ...defineGridComponents(),
      ...defineFormComponents(),
      ...defineButtonComponents(),
      ...defineFormInputField(),
      ...defineDoughnutChartComponents(),
    },
  },
  {
    selector: 'app#doughnut-chart-demo',
    template: html`<DoughnutChartExample />`,
  },
)
