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

export interface ReleaseRow {
  item: RefOrValue<ReleaseRecord>
  index: RefOrValue<number>
}

const releaseRowTemplate = html`<Flex
  align="center" justify="between" class="px-3 bb-1 b-subtle"
  style="height: 100%; box-sizing: border-box; overflow: hidden"
  role="listitem" :aria-posinset="index + 1" :data-index="index"
>
  <strong class="min-w-0 ws-nowrap overflow-hidden text-ellipsis" :title="item.title">{{ item.title }}</strong>
  <Badge :tone="item.tone" variant="surface" style="flex-shrink: 0">{{ item.state }}</Badge>
</Flex>`

const releaseRow = defineComponent<ReleaseRow>(releaseRowTemplate, {
  props: ['item', 'index'],
})

export interface VirtualListPlayground {
  records: SRef<ReleaseRecord[]>
  filtered: ComputedRef<ReleaseRecord[]>
  count: Ref<string>
  query: Ref<string>
  state: Ref<string>
  height: Ref<string>
  rowHeight: Ref<string>
  overscan: Ref<string>
  target: Ref<number | string>
  mountedRows: Ref<number>
  mountedRange: Ref<string>
  scrollOffset: Ref<number>
  counts: FormSelectOption[]
  states: FormSelectOption[]
  heights: FormSelectOption[]
  densities: FormSelectOption[]
  buffers: FormSelectOption[]
  load: () => void
  clear: () => void
  reset: () => void
  jump: () => void
  first: () => void
  last: () => void
}

const virtualListPlaygroundTemplate = html`<Flex direction="column">
  <Grid columns="1" columnsMd="3">
    <FormSelectField id="list-count" label="Dataset size" :model="count" :options="counts" @change="load" />
    <FormInputField id="list-search" label="Find a release" placeholder="Try Release 42" :model="query" />
    <FormSelectField id="list-state" label="Status filter" :model="state" :options="states" />
  </Grid>
  <Panel variant="surfaceAlt" bodyClass="p-3 min-w-0">
    <Flex justify="between" align="center" wrap="true">
      <p class="text-eyebrow m-0">LIVE PREVIEW · RELEASE QUEUE</p>
      <Badge tone="accent" variant="surface">{{ filtered.length }} matching records</Badge>
    </Flex>
    <Grid columns="1" columnsSm="3" class="my-3">
      <div><p class="text-muted m-0">Rows mounted</p><strong id="list-mounted">{{ mountedRows }}</strong></div>
      <div><p class="text-muted m-0">Mounted positions</p><strong id="list-range">{{ mountedRange }}</strong></div>
      <div><p class="text-muted m-0">Scroll offset</p><strong id="list-offset">{{ scrollOffset }} px</strong></div>
    </Grid>
    <VirtualList
      id="release-viewport"
      :items="filtered"
      :height="height"
      :itemHeight="rowHeight"
      :overscan="overscan"
      rowComponent="ReleaseRow"
      tabindex="0"
      role="list"
      aria-label="Filtered release queue"
      aria-describedby="list-keyboard-help"
      class="b-1 b-subtle rounded-md"
    />
    <FormStatus r-if="!filtered.length" role="status">
      {{ records.length ? 'No releases match. Clear the search or choose another status.' : 'The queue is empty. Load a dataset or reset the playground.' }}
    </FormStatus>
    <p id="list-keyboard-help" class="mb-0 text-muted">Focus the list and use Arrow keys or Page Up / Page Down to scroll. Counters show real mounted rows, including the overscan buffer.</p>
  </Panel>
  <Grid columns="1" columnsMd="3">
    <FormSelectField id="list-height" label="Viewport height" :model="height" :options="heights" />
    <FormSelectField id="list-row-height" label="Row height" :model="rowHeight" :options="densities" />
    <FormSelectField id="list-overscan" label="Overscan" :model="overscan" :options="buffers" />
  </Grid>
  <p class="m-0 text-muted">Increasing the viewport or overscan mounts more rows. Changing the row height also changes the scroll distance. Each row fills its fixed-height wrapper, so the geometry stays aligned.</p>
  <Grid columns="1" columnsMd="2" alignItems="end">
    <FormInputField id="list-target" label="Jump to matching position (1-based)" type="number" min="1" :model="target" />
    <Flex wrap="true">
      <Btn tone="accent" :disabled="!filtered.length" @click="jump">Jump to row</Btn>
      <Btn variant="outline" :disabled="!filtered.length" @click="first">First</Btn>
      <Btn variant="outline" :disabled="!filtered.length" @click="last">Last</Btn>
    </Flex>
  </Grid>
  <Flex wrap="true">
    <Btn variant="outline" @click="load">Reload dataset</Btn>
    <Btn variant="outline" @click="clear">Empty list</Btn>
    <Btn tone="accent" variant="surface" @click="reset">Reset playground</Btn>
  </Flex>
</Flex>`

function createRecords(count: number): ReleaseRecord[] {
  const states = ['Ready', 'Review', 'Queued']
  const tones: SemanticTone[] = ['success', 'warning', 'info']
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `Release ${index + 1}`,
    state: states[index % 3],
    tone: tones[index % 3],
  }))
}

function createVirtualListPlayground(): VirtualListPlayground {
  const count = ref('10000')
  const records = sref(createRecords(Number(count())))
  const query = ref('')
  const state = ref('all')
  const height = ref('336')
  const rowHeight = ref('56')
  const overscan = ref('4')
  const target = ref<number | string>(5000)
  const mountedRows = ref(0)
  const mountedRange = ref('—')
  const scrollOffset = ref(0)
  const filtered = computed(() => {
    const search = query().trim().toLowerCase()
    return records().filter(
      (item) =>
        (state() === 'all' || item.state === state()) &&
        item.title.toLowerCase().includes(search),
    )
  })
  const viewport = () =>
    document.querySelector<HTMLElement>('#release-viewport')
  const scrollToPosition = (position: number) => {
    const element = viewport()
    if (!element) return
    const index = Math.max(0, Math.min(filtered().length - 1, position - 1))
    element.scrollTop = index * Number(rowHeight())
    element.dispatchEvent(new Event('scroll'))
  }
  const stopFiltering = observe(filtered, () => scrollToPosition(1))
  let observer: MutationObserver | undefined
  let element: HTMLElement | null = null
  const measure = () => {
    if (!element) return
    const rows = element.querySelectorAll<HTMLElement>('[data-index]')
    mountedRows(rows.length)
    mountedRange(
      rows.length
        ? `${Number(rows[0].dataset.index) + 1}–${Number(rows[rows.length - 1].dataset.index) + 1}`
        : '—',
    )
    scrollOffset(Math.round(element.scrollTop))
  }
  onMounted(() => {
    element = viewport()
    if (!element) return
    observer = new MutationObserver(measure)
    observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-index', 'style'],
    })
    element.addEventListener('scroll', measure)
    measure()
  })
  onUnmounted(() => {
    stopFiltering()
    observer?.disconnect()
    element?.removeEventListener('scroll', measure)
  })
  return {
    records,
    filtered,
    count,
    query,
    state,
    height,
    rowHeight,
    overscan,
    target,
    mountedRows,
    mountedRange,
    scrollOffset,
    counts: [100, 1000, 10000, 50000].map((value) => ({
      label: `${value.toLocaleString('en-US')} records`,
      value: String(value),
    })),
    states: [
      { label: 'All statuses', value: 'all' },
      ...['Ready', 'Review', 'Queued'].map((value) => ({
        label: value,
        value,
      })),
    ],
    heights: [224, 336, 448].map((value) => ({
      label: `${value} px`,
      value: String(value),
    })),
    densities: [
      { label: 'Compact · 44 px', value: '44' },
      { label: 'Comfortable · 56 px', value: '56' },
      { label: 'Spacious · 72 px', value: '72' },
    ],
    buffers: [1, 4, 12, 24].map((value) => ({
      label: `${value} rows`,
      value: String(value),
    })),
    load: () => records(createRecords(Number(count()))),
    clear: () => records([]),
    first: () => scrollToPosition(1),
    last: () => scrollToPosition(filtered().length),
    jump: () =>
      scrollToPosition(
        Number.isFinite(Number(target())) ? Math.trunc(Number(target())) : 1,
      ),
    reset: () =>
      batch(() => {
        count('10000')
        query('')
        state('all')
        height('336')
        rowHeight('56')
        overscan('4')
        target(5000)
        records(createRecords(10000))
      }),
  }
}

const virtualListPlayground = defineComponent<VirtualListPlayground>(
  virtualListPlaygroundTemplate,
  { context: createVirtualListPlayground },
)
const icons: Record<string, string> = {
  'lucide:chevron-down': lucide_chevron_down,
}

createApp(
  {
    components: {
      VirtualListPlayground: virtualListPlayground,
      ReleaseRow: releaseRow,
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
    selector: 'app#virtual-list-demo',
    template: html`<VirtualListPlayground />`,
  },
)
