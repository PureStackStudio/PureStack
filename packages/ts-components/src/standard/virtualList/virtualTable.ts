import {
  type ComponentHead,
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  ref,
  unref,
} from 'regor'
import type { VirtualListRow } from './virtualList'

export interface VirtualTable {
  items?: RefOrValue<unknown[]>
  height?: RefOrValue<number | string>
  itemHeight?: RefOrValue<number | string>
  overscan?: RefOrValue<number | string>
  rowComponent?: RefOrValue<string>
  colGroupComponent?: RefOrValue<string>
  headerComponent?: RefOrValue<string>
  footerComponent?: RefOrValue<string>
  tableLayout?: RefOrValue<'auto' | 'fixed'>
  scrollTop?: ReturnType<typeof ref<number>>
  visibleRows?: ComputedRef<VirtualListRow[]>
  viewportStyle?: ComputedRef<Record<string, string>>
  tableStyle?: ComputedRef<Record<string, string>>
  topSpacerStyle?: ComputedRef<Record<string, string>>
  bottomSpacerStyle?: ComputedRef<Record<string, string>>
  handleScroll?: (event: Event) => void
  hasColGroupComponent?: ComputedRef<boolean>
  hasHeaderComponent?: ComputedRef<boolean>
  hasFooterComponent?: ComputedRef<boolean>
}

const virtualTableTemplate = html`<div class="virtual-table" :style="viewportStyle" @scroll="handleScroll">
  <table class="virtual-table__table" :style="tableStyle">
    <colgroup :is="colGroupComponent" r-if="hasColGroupComponent"></colgroup>
    <thead :is="headerComponent" r-if="hasHeaderComponent"></thead>
    <tbody>
      <tr class="virtual-table__spacer-row">
        <td :style="topSpacerStyle"></td>
      </tr>
      <tr
        :is="rowComponent"
        :item="row.item"
        :index="row.index"
        style="height: var(--virtual-table-item-height) !important;"
        r-for="row in visibleRows"
      ></tr>
      <tr class="virtual-table__spacer-row">
        <td :style="bottomSpacerStyle"></td>
      </tr>
    </tbody>
    <tfoot :is="footerComponent" r-if="hasFooterComponent"></tfoot>
  </table>
</div>`

function defineVirtualTableComponent() {
  return defineComponent<VirtualTable>(virtualTableTemplate, {
    props: [
      'items',
      'height',
      'itemHeight',
      'overscan',
      'rowComponent',
      'colGroupComponent',
      'headerComponent',
      'footerComponent',
      'tableLayout',
    ],
    context: (head) => resolveVirtualTable(head),
  })
}

export function defineVirtualTableComponents() {
  return {
    virtualTable: defineVirtualTableComponent(),
  }
}

function resolveVirtualTable(head: ComponentHead<VirtualTable>) {
  const props = head.props
  const window = resolveFixedVirtualWindow(props)
  const endIndex = computed(() => {
    const rows = window.visibleRows()
    const last = rows[rows.length - 1]
    return last ? last.index + 1 : window.startIndex()
  })

  return {
    ...props,
    scrollTop: window.scrollTop,
    visibleRows: window.visibleRows,
    viewportStyle: computed<Record<string, string>>(() => ({
      height: `${window.height()}px`,
      overflow: 'auto',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      minWidth: '0',
    })),
    tableStyle: computed<Record<string, string>>(() => {
      const fixed = unref(props.tableLayout) === 'fixed'
      return {
        '--virtual-table-item-height': `${window.itemHeight()}px`,
        width: fixed ? '100%' : 'max-content',
        minWidth: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0',
        tableLayout: fixed ? 'fixed' : 'auto',
      }
    }),
    topSpacerStyle: computed<Record<string, string>>(() => ({
      height: `${window.startIndex() * window.itemHeight()}px`,
      padding: '0',
      border: '0',
    })),
    bottomSpacerStyle: computed<Record<string, string>>(() => ({
      height: `${Math.max(0, window.items().length - endIndex()) * window.itemHeight()}px`,
      padding: '0',
      border: '0',
    })),
    hasColGroupComponent: computed(() => !!unref(props.colGroupComponent)),
    hasHeaderComponent: computed(() => !!unref(props.headerComponent)),
    hasFooterComponent: computed(() => !!unref(props.footerComponent)),
    handleScroll: window.handleScroll,
  }
}

function resolveFixedVirtualWindow(props: VirtualTable) {
  const scrollTop = ref(0)
  const itemHeight = computed(() => resolvePositiveNumber(props.itemHeight, 44))
  const height = computed(() => resolvePositiveNumber(props.height, 560))
  const overscan = computed(() =>
    Math.trunc(resolvePositiveNumber(props.overscan, 6)),
  )
  const items = computed(() => {
    const value = unref(props.items)
    return Array.isArray(value) ? value : []
  })
  const startIndex = computed(() =>
    Math.max(0, Math.floor(scrollTop() / itemHeight()) - overscan()),
  )
  const visibleCount = computed(
    () => Math.ceil(height() / itemHeight()) + overscan() * 2,
  )
  const visibleRows = computed(() => {
    const source = items()
    const start = startIndex()
    const end = Math.min(source.length, start + visibleCount())
    const rows: VirtualListRow[] = []
    for (let index = start; index < end; index += 1)
      rows.push({ index, item: source[index] })

    return rows
  })

  return {
    scrollTop,
    itemHeight,
    height,
    items,
    startIndex,
    visibleRows,
    handleScroll: (event: Event) => {
      const target = event.currentTarget
      if (target instanceof HTMLElement) scrollTop(target.scrollTop)
    },
  }
}

function resolvePositiveNumber(
  value: RefOrValue<number | string> | undefined,
  fallback: number,
) {
  const raw = unref(value)
  const parsed = typeof raw === 'number' ? raw : Number.parseFloat(String(raw))
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}
