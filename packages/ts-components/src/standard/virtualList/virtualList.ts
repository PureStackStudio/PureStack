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

export interface VirtualListRow {
  index: number
  item: unknown
}

export type VirtualListSelect = (item: unknown, index: number) => void

export interface VirtualList {
  items?: RefOrValue<unknown[]>
  height?: RefOrValue<number | string>
  itemHeight?: RefOrValue<number | string>
  overscan?: RefOrValue<number | string>
  rowComponent?: RefOrValue<string>
  select?: RefOrValue<VirtualListSelect>
  scrollTop?: ReturnType<typeof ref<number>>
  visibleRows?: ComputedRef<VirtualListRow[]>
  viewportStyle?: ComputedRef<Record<string, string>>
  spacerStyle?: ComputedRef<Record<string, string>>
  windowStyle?: ComputedRef<Record<string, string>>
  itemStyle?: ComputedRef<Record<string, string>>
  handleScroll?: (event: Event) => void
  resolvedRowComponent?: ComputedRef<string>
}

const virtualListTemplate = html`<div
  class="virtual-list"
  :style="viewportStyle"
  @scroll="handleScroll"
>
  <div class="virtual-list__spacer" :style="spacerStyle">
    <div class="virtual-list__window" :style="windowStyle">
      <div
        class="virtual-list__item"
        :style="itemStyle"
        r-for="row in visibleRows"
      >
        <div
          :is="resolvedRowComponent"
          :item="row.item"
          :index="row.index"
          :select="select"
        ></div>
      </div>
    </div>
  </div>
</div>`

function defineVirtualListComponent() {
  return defineComponent<VirtualList>(virtualListTemplate, {
    props: ['items', 'height', 'itemHeight', 'overscan', 'rowComponent', 'select'],
    context: (head) => resolveVirtualList(head),
  })
}

export function defineVirtualListComponents() {
  return {
    virtualList: defineVirtualListComponent(),
  }
}

function resolveVirtualList(head: ComponentHead<VirtualList>) {
  head.enableSwitch = true
  const props = head.props
  const scrollTop = ref(0)
  const itemHeight = computed(() =>
    resolvePositiveNumber(props.itemHeight, 44),
  )
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
    ...props,
    scrollTop,
    visibleRows,
    viewportStyle: computed<Record<string, string>>(() => ({
      height: `${height()}px`,
    })),
    spacerStyle: computed<Record<string, string>>(() => ({
      height: `${items().length * itemHeight()}px`,
    })),
    windowStyle: computed<Record<string, string>>(() => ({
      transform: `translateY(${startIndex() * itemHeight()}px)`,
    })),
    itemStyle: computed<Record<string, string>>(() => ({
      height: `${itemHeight()}px`,
    })),
    resolvedRowComponent: computed(() => {
      const component = unref(props.rowComponent)
      return typeof component === 'string' && component.trim()
        ? component
        : 'div'
    }),
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
