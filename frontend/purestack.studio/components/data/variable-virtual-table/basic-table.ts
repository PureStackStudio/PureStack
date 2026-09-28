import { defineVariableVirtualTableComponents } from '@purestack/ts-components'
import { createApp, defineComponent, html, type RefOrValue } from 'regor'

export interface Finding {
  id: number
  title: string
  detail: string
}
export interface FindingRow {
  item: RefOrValue<Finding>
  index: RefOrValue<number>
}
export interface FindingHeader {}
export interface FindingColumns {}
export interface FindingFooter {}

const findingRowTemplate = html`<tr :aria-rowindex="index + 2">
  <td class="px-3 py-2 bb-1 b-subtle">{{ item.id }}</td>
  <td class="px-3 py-2 bb-1 b-subtle">
    <div class="ws-normal" style="width: 24rem">
      <strong>{{ item.title }}</strong>
      <p class="mb-0">{{ item.detail }}</p>
    </div>
  </td>
</tr>`
const findingHeaderTemplate = html`<thead><tr>
  <th scope="col" class="px-3 py-2 tone-fill-surface">ID</th>
  <th scope="col" class="px-3 py-2 tone-fill-surface">Finding</th>
</tr></thead>`
const findingColumnsTemplate = html`<colgroup><col style="width: 5rem"/><col/></colgroup>`
const findingFooterTemplate = html`<tfoot><tr><td colspan="2" class="px-3 py-2 tone-fill-surface">200 illustrative review findings</td></tr></tfoot>`

const findingRow = defineComponent<FindingRow>(findingRowTemplate, {
  props: ['item', 'index'],
})
const findingHeader = defineComponent<FindingHeader>(findingHeaderTemplate)
const findingColumns = defineComponent<FindingColumns>(findingColumnsTemplate)
const findingFooter = defineComponent<FindingFooter>(findingFooterTemplate)

export interface FindingsExample {
  findings: Finding[]
}
const findingsTemplate = html`<VariableVirtualTable
  :items="findings" height="320" estimateHeight="110" overscan="3"
  rowComponent="FindingRow" headerComponent="FindingHeader"
  colGroupComponent="FindingColumns" footerComponent="FindingFooter"
  tabindex="0" role="region" aria-label="Review findings table"
  class="b-1 b-subtle rounded-md"
/>`
const findingsExample = defineComponent<FindingsExample>(findingsTemplate, {
  context: () => ({
    findings: Array.from({ length: 200 }, (_, index) => ({
      id: index + 1,
      title: `Finding ${index + 1}`,
      detail:
        index % 2
          ? 'Ready for review.'
          : 'Verify keyboard navigation, focus visibility and the empty state before release. The description wraps inside a bounded column, so the table measures a taller row for this finding.',
    })),
  }),
})
createApp(
  {
    components: {
      FindingsExample: findingsExample,
      FindingRow: findingRow,
      FindingHeader: findingHeader,
      FindingColumns: findingColumns,
      FindingFooter: findingFooter,
      ...defineVariableVirtualTableComponents(),
    },
  },
  {
    selector: 'app#variable-table-basic-demo',
    template: html`<FindingsExample />`,
  },
)
