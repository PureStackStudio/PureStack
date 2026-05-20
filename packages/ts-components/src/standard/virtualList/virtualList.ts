import {
  type ComponentHead,
  type ComputedRef,
  computed,
  defineComponent,
  html,
  observe,
  type RefOrValue,
  ref,
  sref,
  unref,
} from 'regor'

export interface VirtualListRow {
  index: number
  item: unknown
}

export interface VirtualList {
  items?: RefOrValue<unknown[]>
  height?: RefOrValue<number | string>
  itemHeight?: RefOrValue<number | string>
  overscan?: RefOrValue<number | string>
  rowComponent?: RefOrValue<string>
  scrollTop?: ReturnType<typeof ref<number>>
  visibleRows?: ComputedRef<VirtualListRow[]>
  viewportStyle?: ComputedRef<Record<string, string>>
  spacerStyle?: ComputedRef<Record<string, string>>
  windowStyle?: ComputedRef<Record<string, string>>
  itemStyle?: ComputedRef<Record<string, string>>
  handleScroll?: (event: Event) => void
  resolvedRowComponent?: ComputedRef<string>
}

export interface VariableVirtualList extends VirtualList {
  estimateHeight?: RefOrValue<number | string>
  rowElementRefs?: Array<ReturnType<typeof sref<HTMLElement | null>>>
  viewportElement?: ReturnType<typeof sref<HTMLElement | null>>
  unmounted?: () => void
}

const virtualListTemplate = html`<div class="virtual-list" :style="viewportStyle" @scroll="handleScroll">
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
        ></div>
      </div>
    </div>
  </div>
</div>`

function defineVirtualListComponent() {
  return defineComponent<VirtualList>(virtualListTemplate, {
    props: ['items', 'height', 'itemHeight', 'overscan', 'rowComponent'],
    context: (head) => resolveVirtualList(head),
  })
}

const variableVirtualListTemplate = html`<div
  class="virtual-list variable-virtual-list"
  :style="viewportStyle"
  :ref="viewportElement"
  @scroll="handleScroll"
>
  <div class="virtual-list__spacer" :style="spacerStyle">
    <div class="virtual-list__window" :style="windowStyle">
      <div
        class="virtual-list__item"
        :ref="rowElementRefs[row.index]"
        r-for="row in visibleRows"
      >
        <div
          :is="resolvedRowComponent"
          :item="row.item"
          :index="row.index"
        ></div>
      </div>
    </div>
  </div>
</div>`

function defineVariableVirtualListComponent() {
  return defineComponent<VariableVirtualList>(variableVirtualListTemplate, {
    props: ['items', 'height', 'estimateHeight', 'overscan', 'rowComponent'],
    context: (head) => resolveVariableVirtualList(head),
  })
}

export function defineVirtualListComponents() {
  return {
    virtualList: defineVirtualListComponent(),
    variableVirtualList: defineVariableVirtualListComponent(),
  }
}

function resolveVirtualList(head: ComponentHead<VirtualList>) {
  const props = head.props
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

class VariableVirtualListContext {
  readonly scrollTop = ref(0)
  readonly viewportElement = sref<HTMLElement | null>(null)
  readonly rowElementRefs: Array<ReturnType<typeof sref<HTMLElement | null>>> =
    []
  readonly visibleRows: ComputedRef<VirtualListRow[]>
  readonly viewportStyle: ComputedRef<Record<string, string>>
  readonly spacerStyle: ComputedRef<Record<string, string>>
  readonly windowStyle: ComputedRef<Record<string, string>>
  readonly resolvedRowComponent: ComputedRef<string>
  private readonly rowHeights: number[] = []
  private readonly rowObservers = new Map<number, ResizeObserver>()
  private readonly measurementVersion = ref(0)
  private measuredHeightTotal = 0
  private measuredRowCount = 0
  private readonly resolvedItems: ComputedRef<unknown[]>
  private readonly resolvedHeight: ComputedRef<number>
  private readonly resolvedEstimateHeight: ComputedRef<number>
  private readonly resolvedOverscan: ComputedRef<number>
  private readonly offsets: ComputedRef<number[]>
  private readonly startIndex: ComputedRef<number>
  private readonly firstVisibleIndex: ComputedRef<number>
  private pendingIndexes = new Set<number>()
  private pendingFrame = 0
  private scrollEndTimer: ReturnType<typeof setTimeout> | undefined
  private isScrolling = false
  private hasDeferredMeasurements = false

  constructor(props: VariableVirtualList) {
    this.resolvedItems = computed(() => {
      const value = unref(props.items)
      return Array.isArray(value) ? value : []
    })
    this.resolvedHeight = computed(() =>
      resolvePositiveNumber(props.height, 560),
    )
    this.resolvedEstimateHeight = computed(() =>
      resolvePositiveNumber(props.estimateHeight ?? props.itemHeight, 56),
    )
    this.resolvedOverscan = computed(() =>
      Math.trunc(resolvePositiveNumber(props.overscan, 6)),
    )
    this.offsets = computed(() => {
      this.measurementVersion()
      const estimate = this.currentEstimateHeight()
      const source = this.resolvedItems()
      const offsets = new Array<number>(source.length + 1)
      offsets[0] = 0
      for (let index = 0; index < source.length; index += 1)
        offsets[index + 1] =
          (offsets[index] ?? 0) + (this.rowHeights[index] ?? estimate)

      return offsets
    })
    this.firstVisibleIndex = computed(() =>
      findOffsetIndex(this.offsets(), this.scrollTop()),
    )
    this.startIndex = computed(() =>
      Math.max(0, this.firstVisibleIndex() - this.resolvedOverscan()),
    )
    this.visibleRows = computed(() => this.resolveVisibleRows())
    this.viewportStyle = computed<Record<string, string>>(() => ({
      height: `${this.resolvedHeight()}px`,
    }))
    this.spacerStyle = computed<Record<string, string>>(() => {
      const offsets = this.offsets()
      return {
        height: `${offsets[offsets.length - 1] ?? 0}px`,
      }
    })
    this.windowStyle = computed<Record<string, string>>(() => ({
      transform: `translateY(${this.offsets()[this.startIndex()] ?? 0}px)`,
    }))
    this.resolvedRowComponent = computed(() => {
      const component = unref(props.rowComponent)
      return typeof component === 'string' && component.trim()
        ? component
        : 'div'
    })
  }

  handleScroll = (event: Event) => {
    const target = event.currentTarget
    if (!(target instanceof HTMLElement)) return

    this.scrollTop(target.scrollTop)
    this.isScrolling = true
    if (this.scrollEndTimer !== undefined) clearTimeout(this.scrollEndTimer)
    this.scrollEndTimer = setTimeout(() => {
      this.scrollEndTimer = undefined
      this.isScrolling = false
      if (!this.hasDeferredMeasurements) return

      this.hasDeferredMeasurements = false
      this.measurementVersion(this.measurementVersion() + 1)
    }, 120)
  }

  unmounted = () => {
    if (this.pendingFrame) cancelAnimationFrame(this.pendingFrame)
    if (this.scrollEndTimer !== undefined) clearTimeout(this.scrollEndTimer)
    for (const observer of this.rowObservers.values()) observer.disconnect()
    this.rowObservers.clear()
  }

  private resolveVisibleRows() {
    const source = this.resolvedItems()
    const offsets = this.offsets()
    const start = this.startIndex()
    const viewportBottom = this.scrollTop() + this.resolvedHeight()
    let end =
      findOffsetIndex(offsets, viewportBottom) + this.resolvedOverscan() + 1
    end = Math.min(source.length, Math.max(start, end))

    const rows: VirtualListRow[] = []
    for (let index = start; index < end; index += 1) {
      this.ensureRowRef(index)
      rows.push({ index, item: source[index] })
    }

    return rows
  }

  private ensureRowRef(index: number) {
    if (this.rowElementRefs[index]) return

    const elementRef = sref<HTMLElement | null>(null)
    this.rowElementRefs[index] = elementRef
    observe(elementRef, (element) => {
      this.observeRowElement(index, element)
    })
  }

  private observeRowElement(index: number, element: HTMLElement | null) {
    const existing = this.rowObservers.get(index)
    if (existing) {
      existing.disconnect()
      this.rowObservers.delete(index)
    }
    if (!element) return

    const observer = new ResizeObserver(() => {
      this.queueMeasurement(index)
    })
    observer.observe(element)
    this.rowObservers.set(index, observer)
    this.queueMeasurement(index)
  }

  private queueMeasurement(index: number) {
    this.pendingIndexes.add(index)
    if (this.pendingFrame) return

    this.pendingFrame = requestAnimationFrame(() => {
      this.pendingFrame = 0
      this.flushMeasurements()
    })
  }

  private flushMeasurements() {
    let changed = false

    for (const index of this.pendingIndexes) {
      const element = this.rowElementRefs[index]?.()
      if (!element) continue

      const previous = this.rowHeights[index] ?? this.currentEstimateHeight()
      const next = element.getBoundingClientRect().height
      if (!Number.isFinite(next) || next <= 0) continue
      if (Math.abs(previous - next) < 0.5) continue

      this.updateMeasuredAverage(index, next)
      this.rowHeights[index] = next
      changed = true
    }

    this.pendingIndexes.clear()
    if (!changed) return

    if (this.isScrolling) {
      this.hasDeferredMeasurements = true
      return
    }

    this.measurementVersion(this.measurementVersion() + 1)
  }

  private currentEstimateHeight() {
    if (this.measuredRowCount === 0) return this.resolvedEstimateHeight()
    return this.measuredHeightTotal / this.measuredRowCount
  }

  private updateMeasuredAverage(index: number, next: number) {
    const previous = this.rowHeights[index]
    if (previous === undefined) {
      this.measuredRowCount += 1
      this.measuredHeightTotal += next
      return
    }

    this.measuredHeightTotal += next - previous
  }
}

function resolveVariableVirtualList(head: ComponentHead<VariableVirtualList>) {
  head.autoProps = false
  return new VariableVirtualListContext(head.props) as VariableVirtualList
}

function findOffsetIndex(offsets: number[], scrollTop: number) {
  if (offsets.length <= 1) return 0

  let low = 0
  let high = offsets.length - 1
  while (low < high) {
    const middle = Math.floor((low + high) / 2)
    if ((offsets[middle] ?? 0) <= scrollTop) low = middle + 1
    else high = middle
  }

  return Math.max(0, low - 1)
}
