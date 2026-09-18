import {
  defineBadgeComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineVariableVirtualTableComponents,
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
export interface VariableVirtualTableRow {
  item: RefOrValue<ExampleRecord>
  index: RefOrValue<number>
}
const rowTemplate = html`<tr :aria-rowindex="index + 2">
  <td class="px-3 py-2">{{ item.id }}</td>
  <td class="px-3 py-2">
    {{ item.title }}
    <p class="mb-0 ws-normal" style="max-width: 24rem">{{ item.detail }}</p>
  </td>
  <td class="px-3 py-2">{{ item.state }}</td>
</tr>`
const rowComponent = defineComponent<VariableVirtualTableRow>(rowTemplate, {
  props: ['item', 'index'],
})
export interface VariableVirtualTableHeader {}
const headerTemplate = html`<thead>
  <tr>
    <th scope="col" class="px-3 py-2 tone-fill-surface">ID</th>
    <th scope="col" class="px-3 py-2 tone-fill-surface">Change</th>
    <th scope="col" class="px-3 py-2 tone-fill-surface">Status</th>
  </tr>
</thead>`
const headerComponent =
  defineComponent<VariableVirtualTableHeader>(headerTemplate)
export interface VariableVirtualTableExample {
  records: SRef<ExampleRecord[]>
  restore: () => void
  clear: () => void
}

const variableVirtualTableExampleTemplate = html`<Flex direction="column">
  <Flex wrap="true">
    <Btn @click="restore">Load 1,000 records</Btn>
    <Btn variant="outline" @click="clear">Empty list</Btn>
    <span role="status">{{ records.length }} records</span>
  </Flex>
  <VariableVirtualTable
    :items="records"
    height="320"
    estimateHeight="88"
    overscan="4"
    rowComponent="VariableVirtualTableRow"
    headerComponent="VariableVirtualTableHeader"
    tabindex="0"
    aria-label="Example change history"
  />
  <FormStatus r-if="records.length === 0">
    No records. Load the example data to continue.
  </FormStatus>
</Flex>`

function createVariableVirtualTableExample(): VariableVirtualTableExample {
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

const component = defineComponent<VariableVirtualTableExample>(
  variableVirtualTableExampleTemplate,
  {
    context: createVariableVirtualTableExample,
  },
)

createApp(
  {
    components: {
      VariableVirtualTableExample: component,
      VariableVirtualTableRow: rowComponent,
      VariableVirtualTableHeader: headerComponent,
      ...defineVariableVirtualTableComponents(),
      ...defineFlexComponents(),
      ...defineBadgeComponents(),
      ...defineButtonComponents(),
      ...defineFormComponents(),
    },
  },
  {
    selector: 'app#variable-virtual-table-demo',
    template: html`<VariableVirtualTableExample />`,
  },
)
