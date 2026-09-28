import { defineVirtualListComponents } from '@purestack/ts-components'
import { createApp, defineComponent, html, type RefOrValue } from 'regor'

export interface SimpleListRow {
  item: RefOrValue<string>
  index: RefOrValue<number>
}

const simpleListRowTemplate = html`<div
  class="px-3 bb-1 b-subtle ws-nowrap overflow-hidden text-ellipsis"
  style="height: 100%; box-sizing: border-box; display: flex; align-items: center"
  role="listitem" :aria-posinset="index + 1" aria-setsize="1000"
>{{ item }}</div>`

const simpleListRow = defineComponent<SimpleListRow>(simpleListRowTemplate, {
  props: ['item', 'index'],
})

export interface BasicListExample {
  items: string[]
}

const basicListTemplate = html`<VirtualList
  :items="items"
  height="240"
  itemHeight="48"
  overscan="3"
  rowComponent="SimpleListRow"
  role="list"
  tabindex="0"
  aria-label="One thousand example records"
  class="b-1 b-subtle rounded-md"
/>`

const basicList = defineComponent<BasicListExample>(basicListTemplate, {
  context: () => ({
    items: Array.from({ length: 1000 }, (_, index) => `Record ${index + 1}`),
  }),
})

createApp(
  {
    components: {
      BasicListExample: basicList,
      SimpleListRow: simpleListRow,
      ...defineVirtualListComponents(),
    },
  },
  {
    selector: 'app#virtual-list-basic-demo',
    template: html`<BasicListExample />`,
  },
)
