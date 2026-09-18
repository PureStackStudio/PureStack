import {
  defineBadgeComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineVirtualTableComponents,
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
export interface VirtualTableRow {
  item: RefOrValue<ExampleRecord>
  index: RefOrValue<number>
}
const rowTemplate = html`<tr :aria-rowindex="index + 2">
  <td class="px-3 py-2">{{ item.id }}</td>
  <td class="px-3 py-2">{{ item.title }}</td>
  <td class="px-3 py-2">{{ item.state }}</td>
</tr>`
const rowComponent = defineComponent<VirtualTableRow>(rowTemplate, {
  props: ['item', 'index'],
})
export interface VirtualTableHeader {}
const headerTemplate = html`<thead>
  <tr>
    <th scope="col" class="px-3 py-2 tone-fill-surface">ID</th>
    <th scope="col" class="px-3 py-2 tone-fill-surface">Change</th>
    <th scope="col" class="px-3 py-2 tone-fill-surface">Status</th>
  </tr>
</thead>`
const headerComponent = defineComponent<VirtualTableHeader>(headerTemplate)
export interface VirtualTableExample {
  records: SRef<ExampleRecord[]>
  restore: () => void
  clear: () => void
}

const virtualTableExampleTemplate = html`<Flex direction="column">
  <Flex wrap="true">
    <Btn @click="restore">Load 1,000 records</Btn>
    <Btn variant="outline" @click="clear">Empty list</Btn>
    <span role="status">{{ records.length }} records</span>
  </Flex>
  <VirtualTable
    :items="records"
    height="320"
    itemHeight="52"
    overscan="4"
    rowComponent="VirtualTableRow"
    headerComponent="VirtualTableHeader"
    tabindex="0"
    aria-label="Example change history"
  />
  <FormStatus r-if="records.length === 0">
    No records. Load the example data to continue.
  </FormStatus>
</Flex>`

function createVirtualTableExample(): VirtualTableExample {
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

const component = defineComponent<VirtualTableExample>(
  virtualTableExampleTemplate,
  {
    context: createVirtualTableExample,
  },
)

createApp(
  {
    components: {
      VirtualTableExample: component,
      VirtualTableRow: rowComponent,
      VirtualTableHeader: headerComponent,
      ...defineVirtualTableComponents(),
      ...defineFlexComponents(),
      ...defineBadgeComponents(),
      ...defineButtonComponents(),
      ...defineFormComponents(),
    },
  },
  {
    selector: 'app#virtual-table-demo',
    template: html`<VirtualTableExample />`,
  },
)
