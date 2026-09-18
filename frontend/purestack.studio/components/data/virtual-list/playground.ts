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
export interface VirtualListRow {
  item: RefOrValue<ExampleRecord>
  index: RefOrValue<number>
}
const rowTemplate = html`<div class="px-3 py-2 bb-1 b-subtle" style="height: 52px; box-sizing: border-box">
  <Flex align="center" justify="between">
    <strong>{{ item.title }}</strong>
    <Badge tone="info">{{ item.state }}</Badge>
  </Flex>
</div>`
const rowComponent = defineComponent<VirtualListRow>(rowTemplate, {
  props: ['item', 'index'],
})

export interface VirtualListExample {
  records: SRef<ExampleRecord[]>
  restore: () => void
  clear: () => void
}

const virtualListExampleTemplate = html`<Flex direction="column">
  <Flex wrap="true">
    <Btn @click="restore">Load 1,000 records</Btn>
    <Btn variant="outline" @click="clear">Empty list</Btn>
    <span role="status">{{ records.length }} records</span>
  </Flex>
  <VirtualList
    :items="records"
    height="320"
    itemHeight="52"
    overscan="4"
    rowComponent="VirtualListRow"
    tabindex="0"
    aria-label="Example change history"
  />
  <FormStatus r-if="records.length === 0">
    No records. Load the example data to continue.
  </FormStatus>
</Flex>`

function createVirtualListExample(): VirtualListExample {
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

const component = defineComponent<VirtualListExample>(
  virtualListExampleTemplate,
  {
    context: createVirtualListExample,
  },
)

createApp(
  {
    components: {
      VirtualListExample: component,
      VirtualListRow: rowComponent,
      ...defineVirtualListComponents(),
      ...defineFlexComponents(),
      ...defineBadgeComponents(),
      ...defineButtonComponents(),
      ...defineFormComponents(),
    },
  },
  { selector: 'app#virtual-list-demo', template: html`<VirtualListExample />` },
)
