import {
  defineBadgeComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormInputField,
  defineFormSelectField,
  defineGridComponents,
  defineIconComponents,
  definePanelComponents,
  defineVirtualTableComponents,
  type FormSelectOption,
} from '@purestack/ts-components'
import type { SemanticTone } from '@purestack/ts-style'
import { lucide_chevron_down } from '@purestack/ts-svg-icons'
import {
  batch,
  type ComputedRef,
  computed,
  createApp,
  defineComponent,
  html,
  observe,
  onMounted,
  onUnmounted,
  type Ref,
  type RefOrValue,
  ref,
  type SRef,
  sref,
} from 'regor'

export interface ReleaseRecord {
  id: number
  title: string
  state: string
  tone: SemanticTone
}
export interface ReleaseTableRow {
  item: RefOrValue<ReleaseRecord>
  index: RefOrValue<number>
}
export interface ReleaseTableHeader {}
export interface ReleaseTableFooter {}
export interface ReleaseTableColumns {}

const releaseTableRowTemplate = html`<tr :data-row="index">
  <td class="px-3 py-0 bb-1 b-subtle ws-nowrap">{{ item.id }}</td>
  <td
    class="px-3 py-0 bb-1 b-subtle ws-nowrap overflow-hidden text-ellipsis"
    :title="item.title"
  >
    {{ item.title }}
  </td>
  <td class="px-3 py-0 bb-1 b-subtle ws-nowrap">
    <Badge :tone="item.tone" variant="surface"
      >{{ item.state }}</Badge
    >
  </td>
</tr>`
const releaseTableHeaderTemplate = html`<thead>
  <tr>
    <th scope="col" class="px-3 py-2 tone-fill-surface">ID</th>
    <th scope="col" class="px-3 py-2 tone-fill-surface">Release</th>
    <th scope="col" class="px-3 py-2 tone-fill-surface">Status</th>
  </tr>
</thead>`
const releaseTableFooterTemplate = html`<tfoot>
  <tr>
    <td
      colspan="3"
      class="px-3 py-2 tone-fill-surface ws-nowrap overflow-hidden text-ellipsis"
    >
      Release queue · illustrative data
    </td>
  </tr>
</tfoot>`
const releaseTableColumnsTemplate = html`<colgroup>
  <col style="width: 15%"/>
  <col style="width: 55%"/>
  <col style="width: 30%"/>
</colgroup>`

const releaseTableRow = defineComponent<ReleaseTableRow>(
  releaseTableRowTemplate,
  { props: ['item', 'index'] },
)
const releaseTableHeader = defineComponent<ReleaseTableHeader>(
  releaseTableHeaderTemplate,
)
const releaseTableFooter = defineComponent<ReleaseTableFooter>(
  releaseTableFooterTemplate,
)
const releaseTableColumns = defineComponent<ReleaseTableColumns>(
  releaseTableColumnsTemplate,
)

export interface VirtualTablePlayground {
  records: SRef<ReleaseRecord[]>
  filtered: ComputedRef<ReleaseRecord[]>
  query: Ref<string>
  count: Ref<string>
  state: Ref<string>
  sort: Ref<string>
  height: Ref<string>
  rowHeight: Ref<string>
  overscan: Ref<string>
  layout: Ref<'auto' | 'fixed'>
  header: Ref<boolean>
  footer: Ref<boolean>
  columns: Ref<boolean>
  target: Ref<number | string>
  mountedRows: Ref<number>
  rowRange: Ref<string>
  scrollOffset: Ref<number>
  counts: FormSelectOption[]
  states: FormSelectOption[]
  sorts: FormSelectOption[]
  heights: FormSelectOption[]
  densities: FormSelectOption[]
  buffers: FormSelectOption[]
  layouts: FormSelectOption[]
  load: () => void
  clear: () => void
  reset: () => void
  first: () => void
  last: () => void
  jump: () => void
}

const virtualTablePlaygroundTemplate = html`<Flex direction="column">
  <Grid columns="1" columnsMd="2">
    <FormSelectField
      id="table-count"
      label="Dataset size"
      :model="count"
      :options="counts"
      @change="load"/>
    <FormInputField
      id="table-search"
      label="Find a release"
      placeholder="Try Release 42"
      :model="query"/>
    <FormSelectField
      id="table-state"
      label="Status filter"
      :model="state"
      :options="states"/>
    <FormSelectField
      id="table-sort"
      label="Sort by ID"
      :model="sort"
      :options="sorts"/>
  </Grid>
  <Panel variant="surfaceAlt" bodyClass="p-3 min-w-0">
    <Flex justify="between" align="center" wrap="true">
      <p class="text-eyebrow m-0">LIVE PREVIEW · RELEASE TABLE</p>
      <Badge tone="accent" variant="surface"
        >{{ filtered.length }} matching records</Badge
      >
    </Flex>
    <Grid columns="1" columnsSm="3" class="my-3">
      <div>
        <p class="m-0 text-muted">Data rows mounted</p>
        <strong id="table-mounted">{{ mountedRows }}</strong>
      </div>
      <div>
        <p class="m-0 text-muted">Positions</p>
        <strong>{{ rowRange }}</strong>
      </div>
      <div>
        <p class="m-0 text-muted">Scroll offset</p>
        <strong>{{ scrollOffset }} px</strong>
      </div>
    </Grid>
    <VirtualTable
      id="release-table-viewport"
      :items="filtered"
      :height="height"
      :itemHeight="rowHeight"
      :overscan="overscan"
      rowComponent="ReleaseTableRow"
      :headerComponent="header ? 'ReleaseTableHeader' : ''"
      :footerComponent="footer ? 'ReleaseTableFooter' : ''"
      :colGroupComponent="columns ? 'ReleaseTableColumns' : ''"
      :tableLayout="layout"
      tabindex="0"
      role="region"
      aria-label="Scrollable release table"
      class="b-1 b-subtle rounded-md"/>
    <FormStatus r-if="!filtered.length" role="status"
      >{{ records.length ? 'No releases match. Clear the search or change the status.' : 'The table is empty. Reload a dataset to continue.' }}</FormStatus
    >
    <p class="mb-0 text-muted">
      The header and footer stay visible while data rows scroll. Focus the
      region for keyboard scrolling; wide content scrolls horizontally inside
      it.
    </p>
  </Panel>
  <Grid columns="1" columnsMd="2">
    <FormSelectField
      id="table-height"
      label="Viewport height"
      :model="height"
      :options="heights"/>
    <FormSelectField
      id="table-row-height"
      label="Row height"
      :model="rowHeight"
      :options="densities"/>
    <FormSelectField
      id="table-overscan"
      label="Overscan"
      :model="overscan"
      :options="buffers"/>
    <FormSelectField
      id="table-layout"
      label="Table layout"
      :model="layout"
      :options="layouts"/>
  </Grid>
  <Flex wrap="true">
    <FormCheck id="table-header" label="Header" :checked="header"/>
    <FormCheck id="table-footer" label="Footer" :checked="footer"/>
    <FormCheck id="table-columns" label="Column widths" :checked="columns"/>
  </Flex>
  <p class="m-0 text-muted">
    Fixed layout uses the viewport width and the column group. Auto layout
    follows content width. Cell content stays on one line so each data row fits
    its configured height.
  </p>
  <Grid columns="1" columnsMd="2" alignItems="end">
    <FormInputField
      id="table-target"
      label="Jump to matching position (1-based)"
      type="number"
      min="1"
      :model="target"/>
    <Flex wrap="true"
      ><Btn tone="accent" :disabled="!filtered.length" @click="jump"
        >Jump to row</Btn
      ><Btn variant="outline" :disabled="!filtered.length" @click="first"
        >First</Btn
      ><Btn variant="outline" :disabled="!filtered.length" @click="last"
        >Last</Btn
      ></Flex
    >
  </Grid>
  <Flex wrap="true"
    ><Btn variant="outline" @click="load">Reload dataset</Btn
    ><Btn variant="outline" @click="clear">Empty table</Btn
    ><Btn tone="accent" variant="surface" @click="reset"
      >Reset playground</Btn
    ></Flex
  >
</Flex>`

function createReleases(count: number): ReleaseRecord[] {
  const states = ['Ready', 'Review', 'Queued']
  const tones: SemanticTone[] = ['success', 'warning', 'info']
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `Release ${index + 1} · ${index % 2 ? 'Component documentation' : 'Framework improvements'}`,
    state: states[index % 3],
    tone: tones[index % 3],
  }))
}

function createVirtualTablePlayground(): VirtualTablePlayground {
  const records = sref(createReleases(10000))
  const query = ref(''),
    count = ref('10000'),
    state = ref('all'),
    sort = ref('asc')
  const height = ref('360'),
    rowHeight = ref('48'),
    overscan = ref('4'),
    layout = ref<'auto' | 'fixed'>('fixed')
  const header = ref(true),
    footer = ref(true),
    columns = ref(true),
    target = ref<number | string>(5000)
  const mountedRows = ref(0),
    rowRange = ref('-'),
    scrollOffset = ref(0)
  const filtered = computed(() => {
    const result = records().filter(
      (item) =>
        (state() === 'all' || state() === item.state) &&
        item.title.toLowerCase().includes(query().trim().toLowerCase()),
    )
    return sort() === 'desc' ? result.reverse() : result
  })
  const viewport = () =>
    document.querySelector<HTMLElement>('#release-table-viewport')
  const scrollToPosition = (position: number) => {
    const element = viewport()
    if (!element) return
    const index = Math.max(0, Math.min(filtered().length - 1, position - 1))
    element.scrollTop = index * Number(rowHeight())
    element.dispatchEvent(new Event('scroll'))
  }
  const stop = observe(filtered, () => scrollToPosition(1))
  let observer: MutationObserver | undefined
  let element: HTMLElement | null = null
  const measure = () => {
    const rows = Array.from(
      element?.querySelectorAll<HTMLElement>('[data-row]') ?? [],
    )
    mountedRows(rows.length)
    rowRange(
      rows.length
        ? `${Number(rows[0].dataset.row) + 1}–${Number(rows.at(-1)?.dataset.row) + 1}`
        : '-',
    )
    scrollOffset(Math.round(element?.scrollTop ?? 0))
  }
  onMounted(() => {
    element = viewport()
    if (!element) return
    observer = new MutationObserver(measure)
    observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'data-row'],
    })
    element.addEventListener('scroll', measure)
    measure()
  })
  onUnmounted(() => {
    stop()
    observer?.disconnect()
    element?.removeEventListener('scroll', measure)
  })
  return {
    records,
    filtered,
    query,
    count,
    state,
    sort,
    height,
    rowHeight,
    overscan,
    layout,
    header,
    footer,
    columns,
    target,
    mountedRows,
    rowRange,
    scrollOffset,
    counts: [100, 1000, 10000, 50000].map((n) => ({
      label: `${n.toLocaleString('en-US')} records`,
      value: String(n),
    })),
    states: [
      { label: 'All statuses', value: 'all' },
      ...['Ready', 'Review', 'Queued'].map((value) => ({
        label: value,
        value,
      })),
    ],
    sorts: [
      { label: 'Oldest first', value: 'asc' },
      { label: 'Newest first', value: 'desc' },
    ],
    heights: [240, 360, 480].map((n) => ({
      label: `${n} px`,
      value: String(n),
    })),
    densities: [48, 60, 72].map((n) => ({
      label: `${n} px`,
      value: String(n),
    })),
    buffers: [1, 4, 12].map((n) => ({ label: `${n} rows`, value: String(n) })),
    layouts: [
      { label: 'Fixed · fit the viewport', value: 'fixed' },
      { label: 'Auto · fit the content', value: 'auto' },
    ],
    load: () => records(createReleases(Number(count()))),
    clear: () => records([]),
    first: () => scrollToPosition(1),
    last: () => scrollToPosition(filtered().length),
    jump: () =>
      scrollToPosition(
        Number.isFinite(Number(target())) ? Math.trunc(Number(target())) : 1,
      ),
    reset: () =>
      batch(() => {
        query('')
        count('10000')
        state('all')
        sort('asc')
        height('360')
        rowHeight('48')
        overscan('4')
        layout('fixed')
        header(true)
        footer(true)
        columns(true)
        target(5000)
        records(createReleases(10000))
      }),
  }
}
const virtualTablePlayground = defineComponent<VirtualTablePlayground>(
  virtualTablePlaygroundTemplate,
  { context: createVirtualTablePlayground },
)
const icons: Record<string, string> = {
  'lucide:chevron-down': lucide_chevron_down,
}
createApp(
  {
    components: {
      VirtualTablePlayground: virtualTablePlayground,
      ReleaseTableRow: releaseTableRow,
      ReleaseTableHeader: releaseTableHeader,
      ReleaseTableFooter: releaseTableFooter,
      ReleaseTableColumns: releaseTableColumns,
      ...defineBadgeComponents(),
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineFormComponents(),
      ...defineFormInputField(),
      ...defineFormSelectField(),
      ...defineGridComponents(),
      ...defineIconComponents((name) => icons[name] ?? ''),
      ...definePanelComponents(),
      ...defineVirtualTableComponents(),
    },
  },
  {
    selector: 'app#virtual-table-demo',
    template: html`<VirtualTablePlayground/>`,
  },
)
