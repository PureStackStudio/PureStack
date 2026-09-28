import { defineVirtualTableComponents } from '@purestack/ts-components'
import { createApp, defineComponent, html, type RefOrValue } from 'regor'

export interface Build {
  id: number
  name: string
  duration: number
}
export interface BuildRow {
  item: RefOrValue<Build>
  index: RefOrValue<number>
}
export interface BuildHeader {}
export interface BuildColumns {}
export interface BuildFooter {}

const buildRowTemplate = html`<tr :aria-rowindex="index + 2">
  <td class="px-3 py-0 bb-1 b-subtle ws-nowrap">{{ item.id }}</td>
  <td class="px-3 py-0 bb-1 b-subtle ws-nowrap">{{ item.name }}</td>
  <td class="px-3 py-0 bb-1 b-subtle ws-nowrap">{{ item.duration }} ms</td>
</tr>`
const buildHeaderTemplate = html`<thead><tr>
  <th scope="col" class="px-3 py-2 tone-fill-surface">ID</th>
  <th scope="col" class="px-3 py-2 tone-fill-surface">Build</th>
  <th scope="col" class="px-3 py-2 tone-fill-surface">Duration</th>
</tr></thead>`
const buildColumnsTemplate = html`<colgroup><col style="width: 5rem"/><col style="width: 14rem"/><col style="width: 8rem"/></colgroup>`
const buildFooterTemplate = html`<tfoot><tr><td colspan="3" class="px-3 py-2 tone-fill-surface">500 illustrative build results</td></tr></tfoot>`

const buildRow = defineComponent<BuildRow>(buildRowTemplate, {
  props: ['item', 'index'],
})
const buildHeader = defineComponent<BuildHeader>(buildHeaderTemplate)
const buildColumns = defineComponent<BuildColumns>(buildColumnsTemplate)
const buildFooter = defineComponent<BuildFooter>(buildFooterTemplate)

export interface BuildTableExample {
  builds: Build[]
}
const buildTableTemplate = html`<VirtualTable
  :items="builds" height="300" itemHeight="48" overscan="4"
  rowComponent="BuildRow" headerComponent="BuildHeader"
  colGroupComponent="BuildColumns" footerComponent="BuildFooter"
  tableLayout="auto" tabindex="0" role="region" aria-label="Build results table"
  class="b-1 b-subtle rounded-md"
/>`
const buildTable = defineComponent<BuildTableExample>(buildTableTemplate, {
  context: () => ({
    builds: Array.from({ length: 500 }, (_, index) => ({
      id: index + 1,
      name: `Build ${index + 1}`,
      duration: 120 + (index % 80),
    })),
  }),
})
createApp(
  {
    components: {
      BuildTableExample: buildTable,
      BuildRow: buildRow,
      BuildHeader: buildHeader,
      BuildColumns: buildColumns,
      BuildFooter: buildFooter,
      ...defineVirtualTableComponents(),
    },
  },
  {
    selector: 'app#virtual-table-basic-demo',
    template: html`<BuildTableExample />`,
  },
)
