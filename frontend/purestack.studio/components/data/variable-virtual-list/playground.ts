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
  defineVirtualListComponents,
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

export interface ActivityRecord {
  id: number
  title: string
  summary: string
  detail: string
  expanded: Ref<boolean>
}

export interface ActivityRow {
  item: RefOrValue<ActivityRecord>
  index: RefOrValue<number>
}

const activityRowTemplate = html`<article
  class="p-3 bb-1 b-subtle"
  role="listitem"
  :aria-posinset="index + 1"
  :data-row="index"
>
  <Flex justify="between" align="center" wrap="true">
    <strong>{{ item.title }}</strong>
    <Btn
      variant="outline"
      size="sm"
      :aria-expanded="item.expanded"
      :aria-controls="'activity-detail-' + item.id"
      @click="item.expanded = !item.expanded"
      >{{ item.expanded ? 'Less detail' : 'More detail' }}</Btn
    >
  </Flex>
  <p class="mb-0">{{ item.summary }}</p>
  <div r-if="item.expanded" :id="'activity-detail-' + item.id" class="mt-3">
    <Badge tone="info" variant="surface">Implementation notes</Badge>
    <p class="mb-0">{{ item.detail }}</p>
  </div>
</article>`
const activityRow = defineComponent<ActivityRow>(activityRowTemplate, {
  props: ['item', 'index'],
})

export interface VariableListPlayground {
  records: SRef<ActivityRecord[]>
  filtered: ComputedRef<ActivityRecord[]>
  query: Ref<string>
  count: Ref<string>
  height: Ref<string>
  estimate: Ref<string>
  overscan: Ref<string>
  narrow: Ref<boolean>
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

const variableListPlaygroundTemplate = html`<Flex direction="column">
  <Grid columns="1" columnsMd="2">
    <FormSelectField
      id="activity-count"
      label="Dataset size"
      :model="count"
      :options="counts"
      @change="load"/>
    <FormInputField
      id="activity-search"
      label="Search activity"
      placeholder="Try Change 42"
      :model="query"/>
  </Grid>
  <Panel variant="surfaceAlt" bodyClass="p-3 min-w-0">
    <Flex justify="between" align="center" wrap="true">
      <p class="text-eyebrow m-0">LIVE PREVIEW · ACTIVITY FEED</p>
      <Badge tone="accent" variant="surface"
        >{{ filtered.length }} matching records</Badge
      >
    </Flex>
    <Grid columns="2" columnsMd="4" class="my-3">
      <div>
        <p class="m-0 text-muted">Mounted rows</p>
        <strong id="activity-mounted">{{ mountedRows }}</strong>
      </div>
      <div>
        <p class="m-0 text-muted">Positions</p>
        <strong>{{ rowRange }}</strong>
      </div>
      <div>
        <p class="m-0 text-muted">Row heights</p>
        <strong id="activity-measured">{{ measuredRange }}</strong>
      </div>
      <div>
        <p class="m-0 text-muted">Scroll height</p>
        <strong>{{ scrollExtent }} px</strong>
      </div>
    </Grid>
    <div
      id="activity-host"
      class="mx-auto"
      :style="{ maxWidth: narrow ? '28rem' : '100%' }"
    >
      <VariableVirtualList
        r-if="active"
        id="activity-viewport"
        :items="filtered"
        :height="height"
        :estimateHeight="estimate"
        :overscan="overscan"
        rowComponent="ActivityRow"
        tabindex="0"
        role="list"
        aria-label="Expandable change activity"
        class="b-1 b-subtle rounded-md"/>
    </div>
    <FormStatus r-if="!filtered.length" role="status"
      >{{ records.length ? 'No matching activity. Clear the search to see the feed.' : 'The feed is empty. Reload the dataset to continue.'
      }}
    </FormStatus>
    <p class="mb-0 text-muted">
      Expand a row or narrow the feed. The row height is measured from its
      content; it is not fixed to the initial estimate.
    </p>
  </Panel>
  <Grid columns="1" columnsMd="3">
    <FormSelectField
      id="activity-height"
      label="Viewport height"
      :model="height"
      :options="heights"/>
    <FormSelectField
      id="activity-estimate"
      label="Initial height estimate"
      :model="estimate"
      :options="estimates"
      @change="restart"/>
    <FormSelectField
      id="activity-overscan"
      label="Overscan"
      :model="overscan"
      :options="buffers"/>
  </Grid>
  <FormCheck
    id="activity-narrow"
    label="Narrow feed to 28rem"
    :checked="narrow"
    @change="restart"/>
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
    unseen rows and can change as you browse. Search, dataset, width and
    estimate changes restart measurement from the top; expanded state stays on
    each record.
  </p>
  <Flex wrap="true">
    <Btn variant="outline" @click="restart">Restart measurement</Btn>
    <Btn variant="outline" @click="load">Reload dataset</Btn>
    <Btn variant="outline" @click="clear">Empty feed</Btn>
    <Btn tone="accent" variant="surface" @click="reset">Reset playground</Btn>
  </Flex>
</Flex>`

function createActivities(count: number): ActivityRecord[] {
  const summaries = [
    'Updated the component documentation.',
    'Improved keyboard navigation and focus visibility across the release workflow. The review includes both desktop and narrow layouts.',
    'Added examples for empty results, long labels and loading transitions. Each example uses the shared theme, typed component props and real application state so it can be adapted to a production screen.',
  ]
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `Change ${index + 1}`,
    summary: summaries[index % summaries.length],
    detail:
      'The implementation keeps interaction state on the record. Expand this entry, scroll until it leaves the mounted window, and return to it: the notes remain open. Content can grow without assigning a new row height. ResizeObserver measures the rendered result and updates the virtual offsets.',
    expanded: ref(false),
  }))
}

function createVariableListPlayground(): VariableListPlayground {
  const records = sref(createActivities(1000))
  const query = ref(''),
    count = ref('1000'),
    height = ref('400'),
    estimate = ref('140'),
    overscan = ref('4')
  const narrow = ref(false),
    active = ref(true)
  const mountedRows = ref(0),
    rowRange = ref('—'),
    measuredRange = ref('—'),
    scrollExtent = ref(0)
  const filtered = computed(() =>
    records().filter((item) =>
      item.title.toLowerCase().includes(query().trim().toLowerCase()),
    ),
  )
  let disposed = false
  const restart = () => {
    active(false)
    queueMicrotask(() => {
      if (!disposed) active(true)
    })
  }
  const stop = observe(filtered, restart)
  const viewport = () =>
    document.querySelector<HTMLElement>('#activity-viewport')
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
    const host = document.querySelector('#activity-host')
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
    narrow,
    active,
    mountedRows,
    rowRange,
    measuredRange,
    scrollExtent,
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
    load: () => records(createActivities(Number(count()))),
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
        narrow(false)
        records(createActivities(1000))
      }),
  }
}
const variableListPlayground = defineComponent<VariableListPlayground>(
  variableListPlaygroundTemplate,
  { context: createVariableListPlayground },
)
const icons: Record<string, string> = {
  'lucide:chevron-down': lucide_chevron_down,
}
createApp(
  {
    components: {
      VariableListPlayground: variableListPlayground,
      ActivityRow: activityRow,
      ...defineBadgeComponents(),
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineFormComponents(),
      ...defineFormInputField(),
      ...defineFormSelectField(),
      ...defineGridComponents(),
      ...defineIconComponents((name) => icons[name] ?? ''),
      ...definePanelComponents(),
      ...defineVirtualListComponents(),
    },
  },
  {
    selector: 'app#variable-virtual-list-demo',
    template: html`<VariableListPlayground/>`,
  },
)
