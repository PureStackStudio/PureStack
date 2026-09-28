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
  defineVariableVirtualTableComponents,
  type FormSelectOption,
} from '@purestack/ts-components'
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

export interface ReviewRecord {
  id: number
  title: string
  summary: string
  detail: string
  width: Ref<string>
  expanded: Ref<boolean>
}

export interface ReviewRow {
  item: RefOrValue<ReviewRecord>
  index: RefOrValue<number>
}

export interface ReviewHeader {}
export interface ReviewFooter {}
export interface ReviewColumns {}

const reviewRowTemplate = html`<tr :data-row="index">
  <td class="px-3 py-2 bb-1 b-subtle ws-nowrap">{{ item.id }}</td>
  <td class="px-3 py-2 bb-1 b-subtle">
    <div :style="{ width: item.width + 'rem' }" class="ws-normal">
      <Flex justify="between" align="center" wrap="true">
        <strong>{{ item.title }}</strong>
        <Btn
          variant="outline"
          size="sm"
          :aria-expanded="item.expanded"
          :aria-controls="'review-notes-' + item.id"
          @click="item.expanded = !item.expanded"
          >{{ item.expanded ? 'Less detail' : 'More detail' }}</Btn
        >
      </Flex>
      <p class="mb-0">{{ item.summary }}</p>
      <div r-if="item.expanded" :id="'review-notes-' + item.id" class="mt-3">
        <Badge tone="info" variant="surface">Review notes</Badge>
        <p class="mb-0">{{ item.detail }}</p>
      </div>
    </div>
  </td>
  <td class="px-3 py-2 bb-1 b-subtle ws-nowrap">
    <Badge tone="info" variant="surface">Open</Badge>
  </td>
</tr>`
const reviewHeaderTemplate = html`<thead>
  <tr>
    <th scope="col" class="px-3 py-2 tone-fill-surface">ID</th>
    <th scope="col" class="px-3 py-2 tone-fill-surface">Review summary</th>
    <th scope="col" class="px-3 py-2 tone-fill-surface">Status</th>
  </tr>
</thead>`
const reviewFooterTemplate = html`<tfoot>
  <tr>
    <td colspan="3" class="px-3 py-2 tone-fill-surface">
      Review queue · illustrative data
    </td>
  </tr>
</tfoot>`
const reviewColumnsTemplate = html`<colgroup>
  <col style="width: 5rem"/>
  <col/>
  <col style="width: 7rem"/>
</colgroup>`

const reviewRow = defineComponent<ReviewRow>(reviewRowTemplate, {
  props: ['item', 'index'],
})
const reviewHeader = defineComponent<ReviewHeader>(reviewHeaderTemplate)
const reviewFooter = defineComponent<ReviewFooter>(reviewFooterTemplate)
const reviewColumns = defineComponent<ReviewColumns>(reviewColumnsTemplate)

export interface VariableTablePlayground {
  records: SRef<ReviewRecord[]>
  filtered: ComputedRef<ReviewRecord[]>
  query: Ref<string>
  count: Ref<string>
  height: Ref<string>
  estimate: Ref<string>
  overscan: Ref<string>
  width: Ref<string>
  header: Ref<boolean>
  footer: Ref<boolean>
  columns: Ref<boolean>
  sort: Ref<string>
  widths: FormSelectOption[]
  sorts: FormSelectOption[]
  active: Ref<boolean>
  mountedRows: Ref<number>
  rowRange: Ref<string>
  measuredRange: Ref<string>
  scrollExtent: Ref<number>
  counts: FormSelectOption[]
  heights: FormSelectOption[]
  estimates: FormSelectOption[]
  buffers: FormSelectOption[]
  restart: () => void
  load: () => void
  clear: () => void
  reset: () => void
  first: () => void
  next: () => void
  previous: () => void
}

const variableTablePlaygroundTemplate = html`<Flex direction="column">
  <Grid columns="1" columnsMd="2">
    <FormSelectField
      id="review-table-count"
      label="Dataset size"
      :model="count"
      :options="counts"
      @change="load"/>
    <FormInputField
      id="review-table-search"
      label="Search reviews"
      placeholder="Try Review 42"
      :model="query"/>
  </Grid>
  <Panel variant="surfaceAlt" bodyClass="p-3 min-w-0">
    <Flex justify="between" align="center" wrap="true">
      <p class="text-eyebrow m-0">LIVE PREVIEW · REVIEW TABLE</p>
      <Badge tone="accent" variant="surface"
        >{{ filtered.length }} matching records</Badge
      >
    </Flex>
    <Grid columns="2" columnsMd="4" class="my-3">
      <div>
        <p class="m-0 text-muted">Mounted rows</p>
        <strong id="review-table-mounted">{{ mountedRows }}</strong>
      </div>
      <div>
        <p class="m-0 text-muted">Positions</p>
        <strong>{{ rowRange }}</strong>
      </div>
      <div>
        <p class="m-0 text-muted">Row heights</p>
        <strong id="review-table-measured">{{ measuredRange }}</strong>
      </div>
      <div>
        <p class="m-0 text-muted">Scroll height</p>
        <strong>{{ scrollExtent }} px</strong>
      </div>
    </Grid>
    <div id="review-table-host">
      <VariableVirtualTable
        r-if="active"
        id="review-table-viewport"
        :items="filtered"
        :height="height"
        :estimateHeight="estimate"
        :overscan="overscan"
        rowComponent="ReviewRow"
        :headerComponent="header ? 'ReviewHeader' : ''"
        :footerComponent="footer ? 'ReviewFooter' : ''"
        :colGroupComponent="columns ? 'ReviewColumns' : ''"
        tabindex="0"
        role="region"
        aria-label="Scrollable review table"
        class="b-1 b-subtle rounded-md"/>
    </div>
    <FormStatus r-if="!filtered.length" role="status"
      >{{ records.length ? 'No matching reviews. Clear the search to see the table.' : 'The table is empty. Reload the dataset to continue.' }}</FormStatus
    >
    <p class="mb-0 text-muted">
      Expand a review or change the summary width. Each row is measured after
      its text wraps. The header and footer stay visible; wide columns scroll
      inside this region.
    </p>
  </Panel>
  <Grid columns="1" columnsMd="3">
    <FormSelectField
      id="review-table-height"
      label="Viewport height"
      :model="height"
      :options="heights"/>
    <FormSelectField
      id="review-table-estimate"
      label="Initial height estimate"
      :model="estimate"
      :options="estimates"
      @change="restart"/>
    <FormSelectField
      id="review-table-overscan"
      label="Overscan"
      :model="overscan"
      :options="buffers"/>
  </Grid>
  <Grid columns="1" columnsMd="2">
    <FormSelectField
      id="review-table-width"
      label="Summary width"
      :model="width"
      :options="widths"
      @change="restart"/>
    <FormSelectField
      id="review-table-sort"
      label="Sort by ID"
      :model="sort"
      :options="sorts"/>
  </Grid>
  <Flex wrap="true">
    <FormCheck id="review-table-header" label="Header" :checked="header"/>
    <FormCheck id="review-table-footer" label="Footer" :checked="footer"/>
    <FormCheck
      id="review-table-columns"
      label="Column widths"
      :checked="columns"/>
  </Flex>
  <Flex wrap="true">
    <Btn variant="outline" :disabled="!filtered.length" @click="first"
      >Back to top</Btn
    >
    <Btn variant="outline" :disabled="!filtered.length" @click="previous"
      >Previous screen</Btn
    >
    <Btn
      tone="accent"
      variant="surface"
      :disabled="!filtered.length"
      @click="next"
      >Next screen</Btn
    >
  </Flex>
  <p class="m-0 text-muted">
    The counters inspect mounted rows. Scroll height includes estimates for
    unseen rows and can change as you browse. Search, sort, dataset, width and
    estimate changes restart measurement from the top; expanded state stays on
    each record.
  </p>
  <Flex wrap="true">
    <Btn variant="outline" @click="restart">Restart measurement</Btn>
    <Btn variant="outline" @click="load">Reload dataset</Btn>
    <Btn variant="outline" @click="clear">Empty table</Btn>
    <Btn tone="accent" variant="surface" @click="reset">Reset playground</Btn>
  </Flex>
</Flex>`

function createReviews(count: number, width: Ref<string>): ReviewRecord[] {
  const summaries = [
    'Updated the component documentation.',
    'Improved keyboard navigation and focus visibility across the release workflow. The review includes both desktop and narrow layouts.',
    'Added examples for empty results, long labels and loading transitions. Each example uses the shared theme, typed component props and real application state so it can be adapted to a production screen.',
  ]
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `Review ${index + 1}`,
    summary: summaries[index % summaries.length],
    detail:
      'The implementation keeps interaction state on the record. Expand this entry, scroll until it leaves the mounted window, and return to it: the notes remain open. Content can grow without assigning a new row height. ResizeObserver measures the rendered result and updates the virtual offsets.',
    width,
    expanded: ref(false),
  }))
}

function createVariableTablePlayground(): VariableTablePlayground {
  const width = ref('28')
  const header = ref(true),
    footer = ref(true),
    columns = ref(true),
    sort = ref('asc')
  const records = sref(createReviews(1000, width))
  const query = ref(''),
    count = ref('1000'),
    height = ref('400'),
    estimate = ref('140'),
    overscan = ref('4')
  const active = ref(true)
  const mountedRows = ref(0),
    rowRange = ref('—'),
    measuredRange = ref('—'),
    scrollExtent = ref(0)
  const filtered = computed(() => {
    const result = records().filter((item) =>
      item.title.toLowerCase().includes(query().trim().toLowerCase()),
    )
    return sort() === 'desc' ? result.reverse() : result
  })
  let disposed = false
  const restart = () => {
    active(false)
    queueMicrotask(() => {
      if (!disposed) active(true)
    })
  }
  const stop = observe(filtered, restart)
  const viewport = () =>
    document.querySelector<HTMLElement>('#review-table-viewport')
  const scroll = (direction: number) => {
    const element = viewport()
    if (!element) return
    element.scrollTop =
      direction === 0 ? 0 : element.scrollTop + direction * element.clientHeight
    element.dispatchEvent(new Event('scroll'))
  }
  const measure = () => {
    const element = viewport()
    const rows = Array.from(
      element?.querySelectorAll<HTMLElement>('[data-row]') ?? [],
    )
    const sizes = rows.map((row) =>
      Math.round(row.getBoundingClientRect().height),
    )
    mountedRows(rows.length)
    rowRange(
      rows.length
        ? `${Number(rows[0].dataset.row) + 1}–${Number(rows.at(-1)?.dataset.row) + 1}`
        : '—',
    )
    measuredRange(
      sizes.length ? `${Math.min(...sizes)}–${Math.max(...sizes)} px` : '—',
    )
    scrollExtent(element?.scrollHeight ?? 0)
  }
  let observer: MutationObserver | undefined
  let resize: ResizeObserver | undefined
  onMounted(() => {
    const host = document.querySelector('#review-table-host')
    if (!host) return
    observer = new MutationObserver(measure)
    observer.observe(host, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'data-row'],
    })
    resize = new ResizeObserver(measure)
    resize.observe(host)
    measure()
  })
  onUnmounted(() => {
    disposed = true
    stop()
    observer?.disconnect()
    resize?.disconnect()
  })
  return {
    records,
    filtered,
    query,
    count,
    height,
    estimate,
    overscan,
    width,
    header,
    footer,
    columns,
    sort,
    active,
    mountedRows,
    rowRange,
    measuredRange,
    scrollExtent,
    widths: [18, 28, 40].map((n) => ({ label: n + 'rem', value: String(n) })),
    sorts: [
      { label: 'Oldest first', value: 'asc' },
      { label: 'Newest first', value: 'desc' },
    ],
    counts: [100, 1000, 10000, 50000].map((n) => ({
      label: `${n.toLocaleString('en-US')} records`,
      value: String(n),
    })),
    heights: [280, 400, 520].map((n) => ({
      label: `${n} px`,
      value: String(n),
    })),
    estimates: [56, 140, 240].map((n) => ({
      label: `${n} px`,
      value: String(n),
    })),
    buffers: [1, 4, 12].map((n) => ({ label: `${n} rows`, value: String(n) })),
    restart,
    load: () => records(createReviews(Number(count()), width)),
    clear: () => records([]),
    first: () => scroll(0),
    previous: () => scroll(-1),
    next: () => scroll(1),
    reset: () =>
      batch(() => {
        query('')
        count('1000')
        height('400')
        estimate('140')
        overscan('4')
        width('28')
        header(true)
        footer(true)
        columns(true)
        sort('asc')
        records(createReviews(1000, width))
      }),
  }
}
const variableTablePlayground = defineComponent<VariableTablePlayground>(
  variableTablePlaygroundTemplate,
  { context: createVariableTablePlayground },
)
const icons: Record<string, string> = {
  'lucide:chevron-down': lucide_chevron_down,
}
createApp(
  {
    components: {
      VariableTablePlayground: variableTablePlayground,
      ReviewRow: reviewRow,
      ReviewHeader: reviewHeader,
      ReviewFooter: reviewFooter,
      ReviewColumns: reviewColumns,
      ...defineBadgeComponents(),
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineFormComponents(),
      ...defineFormInputField(),
      ...defineFormSelectField(),
      ...defineGridComponents(),
      ...defineIconComponents((name) => icons[name] ?? ''),
      ...definePanelComponents(),
      ...defineVariableVirtualTableComponents(),
    },
  },
  {
    selector: 'app#variable-virtual-table-demo',
    template: html`<VariableTablePlayground/>`,
  },
)
