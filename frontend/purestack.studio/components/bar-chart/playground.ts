import {
  type BarChartItem,
  defineBarChartComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormInputField,
  defineGridComponents,
} from '@purestack/ts-components'

import {
  createApp,
  defineComponent,
  html,
  type Ref,
  ref,
  type SRef,
  sref,
} from 'regor'

export interface BarChartExample {
  chartItems: SRef<BarChartItem[]>
  valuesVisible: Ref<boolean>
  axisVisible: Ref<boolean>
  labelsVisible: Ref<boolean>
  motionEnabled: Ref<boolean>
  restore: () => void
  clear: () => void
}

const barChartExampleTemplate = html`<Flex direction="column">
  <BarChart
    :items="chartItems"
    title="Example weekly balance"
    description="Illustrative values include a negative day."
    ariaLabel="Weekly balance in credits; values are listed below"
    valueSuffix=" cr"
    :showValues="valuesVisible"
    :showAxis="axisVisible"
    :showLabels="labelsVisible"
    :animated="motionEnabled"
  />
  <Flex wrap="true">
    <FormCheck id="bar-values" label="Values" :checked="valuesVisible" />
    <FormCheck id="bar-axis" label="Axis" :checked="axisVisible" />
    <FormCheck id="bar-labels" label="Labels" :checked="labelsVisible" />
    <FormCheck id="bar-motion" label="Animation" :checked="motionEnabled" />
  </Flex>
  <Flex wrap="true">
    <Btn @click="restore">Restore data</Btn>
    <Btn variant="outline" @click="clear">Empty data</Btn>
  </Flex>
  <ul>
    <li r-for="entry in chartItems">
      {{ entry.label }}: {{ entry.value }} credits
    </li>
  </ul>
</Flex>`

function createBarChartExample(): BarChartExample {
  const initial: BarChartItem[] = [
    { label: 'Mon', value: 24 },
    { label: 'Tue', value: 38 },
    { label: 'Wed', value: -12 },
    { label: 'Thu', value: 46 },
    { label: 'Fri', value: 32 },
  ]
  const chartItems = sref(initial)
  return {
    chartItems,
    valuesVisible: ref(true),
    axisVisible: ref(true),
    labelsVisible: ref(true),
    motionEnabled: ref(false),
    restore: () => chartItems([...initial]),
    clear: () => chartItems([]),
  }
}

const component = defineComponent<BarChartExample>(barChartExampleTemplate, {
  context: createBarChartExample,
})

createApp(
  {
    components: {
      BarChartExample: component,

      ...defineFlexComponents(),
      ...defineGridComponents(),
      ...defineFormComponents(),
      ...defineButtonComponents(),
      ...defineFormInputField(),
      ...defineBarChartComponents(),
    },
  },
  { selector: 'app#bar-chart-demo', template: html`<BarChartExample />` },
)
