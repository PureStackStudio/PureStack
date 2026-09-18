import {
  defineBadgeComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineVirtualListComponents,
} from '@purestack/ts-components'

import {
  createApp,
  defineComponent,
  html,
  type RefOrValue,
  type SRef,
  sref,
} from 'regor'

export interface ExampleRecord {
  id: number
  title: string
  state: string
  detail: string
}
export interface VariableVirtualListRow {
  item: RefOrValue<ExampleRecord>
  index: RefOrValue<number>
}
const rowTemplate = html`<div class="px-3 py-2 bb-1 b-subtle">
  <Flex align="center" justify="between">
    <strong>{{ item.title }}</strong>
    <Badge tone="info">{{ item.state }}</Badge>
  </Flex>
  <p class="mb-0">{{ item.detail }}</p>
</div>`
const rowComponent = defineComponent<VariableVirtualListRow>(rowTemplate, {
  props: ['item', 'index'],
})

export interface VariableVirtualListExample {
  records: SRef<ExampleRecord[]>
  restore: () => void
  clear: () => void
}

const variableVirtualListExampleTemplate = html`<Flex direction="column">
  <Flex wrap="true">
    <Btn @click="restore">Load 1,000 records</Btn>
    <Btn variant="outline" @click="clear">Empty list</Btn>
    <span role="status">{{ records.length }} records</span>
  </Flex>
  <VariableVirtualList
    :items="records"
    height="320"
    estimateHeight="88"
    overscan="4"
    rowComponent="VariableVirtualListRow"
    tabindex="0"
    aria-label="Example change history"
  />
  <FormStatus r-if="records.length === 0">
    No records. Load the example data to continue.
  </FormStatus>
</Flex>`

function createVariableVirtualListExample(): VariableVirtualListExample {
  const initial: ExampleRecord[] = Array.from({ length: 1000 }, (_, index) => ({
    id: index + 1,
    title: `Change ${index + 1}`,
    state: index % 3 === 0 ? 'In review' : 'Ready',
    detail:
      index % 3 === 0
        ? 'This change includes a longer explanation of the component behavior, its theme treatment and the verification needed before release.'
        : 'A focused improvement to the documentation.',
  }))
  const records = sref(initial)
  return {
    records,
    restore: () => records([...initial]),
    clear: () => records([]),
  }
}

const component = defineComponent<VariableVirtualListExample>(
  variableVirtualListExampleTemplate,
  {
    context: createVariableVirtualListExample,
  },
)

createApp(
  {
    components: {
      VariableVirtualListExample: component,
      VariableVirtualListRow: rowComponent,
      ...defineVirtualListComponents(),
      ...defineFlexComponents(),
      ...defineBadgeComponents(),
      ...defineButtonComponents(),
      ...defineFormComponents(),
    },
  },
  {
    selector: 'app#variable-virtual-list-demo',
    template: html`<VariableVirtualListExample />`,
  },
)
