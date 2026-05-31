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
import type { VirtualListRow } from './virtualList'
import type { VirtualTable } from './virtualTable'
// known limitation: vertical scroll bar is not synced perfectly to the mouse pointer during scroll. eiter fix it or delete this component!
export interface VariableVirtualTable extends VirtualTable {
  estimateHeight?: RefOrValue<number | string>
  rowElementRefs?: Array<ReturnType<typeof sref<HTMLElement | null>>>
  viewportElement?: ReturnType<typeof sref<HTMLElement | null>>
  unmounted?: () => void
}

const variableVirtualTableTemplate = html`<div
  class="virtual-table variable-virtual-table"
  :style="viewportStyle"
  :ref="viewportElement"
  @scroll="handleScroll"
>
  <table class="virtual-table__table" :style="tableStyle">
    <thead :is="headerComponent" r-if="hasHeaderComponent"></thead>
    <tbody>
      <tr class="virtual-table__spacer-row">
        <td :style="topSpacerStyle"></td>
      </tr>
      <tr
        :is="rowComponent"
        :ref="rowElementRefs[row.index]"
        :item="row.item"
        :index="row.index"
        r-for="row in visibleRows"
      ></tr>
      <tr class="virtual-table__spacer-row">
        <td :style="bottomSpacerStyle"></td>
      </tr>
    </tbody>
    <tfoot r-if="hasFooterComponent">
      <tr :is="footerComponent"></tr>
    </tfoot>
  </table>
</div>`

function defineVariableVirtualTableComponent() {
  return defineComponent<VariableVirtualTable>(variableVirtualTableTemplate, {
    props: [
      'items',
      'height',
      'estimateHeight',
      'overscan',
      'rowComponent',
      'headerComponent',
      'footerComponent',
    ],
    context: (head) => resolveVariableVirtualTable(head),
  })
}

export function defineVariableVirtualTableComponents() {
  return {
    variableVirtualTable: defineVariableVirtualTableComponent(),
  }
}

class VariableVirtualTableContext implements VariableVirtualTable {
  readonly items?: RefOrValue<unknown[]>
  readonly height?: RefOrValue<number | string>
  readonly estimateHeight?: RefOrValue<number | string>
  readonly overscan?: RefOrValue<number | string>
  readonly rowComponent?: RefOrValue<string>
  readonly headerComponent?: RefOrValue<string>
  readonly footerComponent?: RefOrValue<string>
  readonly scrollTop = ref(0)
  readonly viewportElement = sref<HTMLElement | null>(null)
  readonly rowElementRefs: Array<ReturnType<typeof sref<HTMLElement | null>>> =
    []
  readonly visibleRows: ComputedRef<VirtualListRow[]>
  readonly viewportStyle: ComputedRef<Record<string, string>>
  readonly tableStyle: ComputedRef<Record<string, string>>
  readonly topSpacerStyle: ComputedRef<Record<string, string>>
  readonly bottomSpacerStyle: ComputedRef<Record<string, string>>
  readonly hasHeaderComponent: ComputedRef<boolean>
  readonly hasFooterComponent: ComputedRef<boolean>
  private readonly rowHeights: number[] = []
  private readonly rowObservers = new Map<number, ResizeObserver>()
  private readonly measurementVersion = ref(0)
  private measuredHeightTotal = 0
  private measuredRowCount = 0
  private pendingFrame = 0
  private scrollEndTimer: ReturnType<typeof setTimeout> | undefined
  private isScrolling = false
  private hasDeferredMeasurements = false
  private readonly resolvedItems: ComputedRef<unknown[]>
  private readonly resolvedHeight: ComputedRef<number>
  private readonly resolvedEstimateHeight: ComputedRef<number>
  private readonly resolvedOverscan: ComputedRef<number>
  private readonly offsets: ComputedRef<number[]>
  private readonly startIndex: ComputedRef<number>
  private readonly firstVisibleIndex: ComputedRef<number>
  private readonly endIndex: ComputedRef<number>
  private readonly pendingIndexes = new Set<number>()

  constructor(props: VariableVirtualTable) {
    this.items = props.items
    this.height = props.height
    this.estimateHeight = props.estimateHeight
    this.overscan = props.overscan
    this.rowComponent = props.rowComponent
    this.headerComponent = props.headerComponent
    this.footerComponent = props.footerComponent
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
      const source = this.resolvedItems()
      const estimate = this.currentEstimateHeight()
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
    this.endIndex = computed(() => {
      const rows = this.visibleRows()
      const last = rows[rows.length - 1]
      return last ? last.index + 1 : this.startIndex()
    })
    this.viewportStyle = computed<Record<string, string>>(() => ({
      height: `${this.resolvedHeight()}px`,
      overflow: 'auto',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      minWidth: '0',
    }))
    this.tableStyle = computed<Record<string, string>>(() => ({
      width: 'max-content',
      minWidth: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0',
    }))
    this.topSpacerStyle = computed<Record<string, string>>(() => ({
      height: `${this.offsets()[this.startIndex()] ?? 0}px`,
      padding: '0',
      border: '0',
    }))
    this.bottomSpacerStyle = computed<Record<string, string>>(() => {
      const offsets = this.offsets()
      const totalHeight = offsets[offsets.length - 1] ?? 0
      const visibleBottom = offsets[this.endIndex()] ?? totalHeight
      return {
        height: `${Math.max(0, totalHeight - visibleBottom)}px`,
        padding: '0',
        border: '0',
      }
    })
    this.hasHeaderComponent = computed(() => !!unref(props.headerComponent))
    this.hasFooterComponent = computed(() => !!unref(props.footerComponent))
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

function resolveVariableVirtualTable(
  head: ComponentHead<VariableVirtualTable>,
) {
  head.autoProps = false
  return new VariableVirtualTableContext(head.props)
}

function resolvePositiveNumber(
  value: RefOrValue<number | string> | undefined,
  fallback: number,
) {
  const raw = unref(value)
  const parsed = typeof raw === 'number' ? raw : Number.parseFloat(String(raw))
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
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
