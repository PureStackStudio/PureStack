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
  type FormSelectOption,
} from '@purestack/ts-components'
import { BREAKPOINTS } from '@purestack/ts-style'
import { lucide_chevron_down } from '@purestack/ts-svg-icons'
import {
  batch,
  computed,
  createApp,
  defineComponent,
  html,
  onMounted,
  onUnmounted,
  ref,
} from 'regor'

const breakpoints = ['sm', 'md', 'lg', 'xl'] as const
type GridAlignment = 'stretch' | 'start' | 'center' | 'end'
const countOptions: FormSelectOption[] = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1} column${i ? 's' : ''}`,
  value: String(i + 1),
}))
const alignmentOptions: FormSelectOption[] = [
  'stretch',
  'start',
  'center',
  'end',
].map((value) => ({ label: value, value }))
const samples = [
  {
    title: 'Content',
    description: 'Write a clear starting point.',
    tone: 'accent',
  },
  {
    title: 'Components',
    description: 'Compose a consistent interface.',
    tone: 'info',
  },
  {
    title: 'Themes',
    description: 'Make room for light and dark.',
    tone: 'feature',
  },
  {
    title: 'Navigation',
    description: 'Connect the next useful step.',
    tone: 'success',
  },
  {
    title: 'Preview',
    description: 'Review the details together.',
    tone: 'warning',
  },
  {
    title: 'Publish',
    description: 'Share what you have built.',
    tone: 'neutral',
  },
]

function escapeAttribute(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function createGridPlayground() {
  const selectedPreset = ref('cards')
  const base = ref('1')
  const customTracks = ref('minmax(0, 2fr) minmax(0, 1fr)')
  const sm = ref('2')
  const md = ref('')
  const lg = ref('3')
  const xl = ref('')
  const itemAlignment = ref<GridAlignment>('stretch')
  const itemJustification = ref<GridAlignment>('stretch')
  const dense = ref(false)
  const wideItems = ref(false)
  const variedHeights = ref(true)
  const descriptions = ref(true)
  const gap = ref('3')
  const itemCount = ref('6')
  const previewWidth = ref('w-full')
  const element = ref('div')
  const browserWidth = ref(window.innerWidth)
  const measuredWidth = ref(0)
  const measuredColumns = ref(0)
  const copyLabel = ref('Copy markup')
  const trackError = computed(() =>
    base() === 'custom' &&
    (!customTracks().trim() ||
      !CSS.supports('grid-template-columns', customTracks().trim()))
      ? 'Enter a valid CSS grid-template-columns value. The preview uses one column until it is valid.'
      : '',
  )
  const columns = computed(() =>
    base() === 'custom' ? (trackError() ? '1' : customTracks().trim()) : base(),
  )
  const responsive = [sm, md, lg, xl]
  const activeBreakpoint = computed(() => {
    const width = browserWidth()
    return (
      [...breakpoints]
        .reverse()
        .find(
          (name) => width >= Number.parseInt(BREAKPOINTS[name].value, 10),
        ) ?? 'base'
    )
  })
  const activeColumns = computed(() => {
    let value = columns()
    breakpoints.forEach((name, i) => {
      if (
        browserWidth() >= Number.parseInt(BREAKPOINTS[name].value, 10) &&
        responsive[i]()
      )
        value = responsive[i]()
    })
    return value
  })
  const spanFor = (value: string) =>
    /^\d+$/.test(value) && Number(value) >= 2 ? 2 : 1
  const canSpan = computed(() =>
    [columns(), ...responsive.map((value) => value()).filter(Boolean)].every(
      (value) => spanFor(value) === 2,
    ),
  )
  const tiles = computed(() =>
    Array.from({ length: Number(itemCount()) }, (_, index) => ({
      ...samples[index % samples.length],
      index,
      label: String(index + 1).padStart(2, '0'),
    })),
  )
  const gridClass = computed(() => `gap-${gap()} p-0 m-0 list-none`)
  const widthClass = computed(() => `${previewWidth()} max-w-full mx-auto`)
  const itemClass = (index: number) =>
    `min-w-0${wideItems() && canSpan() && index < 2 ? ' layout-featured-card' : ''}`
  const cardBodyClass = (index: number) =>
    variedHeights() ? ['p-3', 'p-5', 'p-4'][index % 3] : 'p-3'
  const markup = computed(() => {
    const attrs = [`columns="${escapeAttribute(columns())}"`]
    breakpoints.forEach((name, i) => {
      if (responsive[i]())
        attrs.push(
          `columns${name[0].toUpperCase() + name.slice(1)}="${responsive[i]()}"`,
        )
    })
    if (element() !== 'div') attrs.push(`container="${element()}"`)
    attrs.push(
      `alignItems="${itemAlignment()}"`,
      `justifyItems="${itemJustification()}"`,
      `:dense="${dense()}"`,
      `class="${gridClass()}"`,
    )
    const tag = element() === 'ul' ? 'li' : 'div'
    const items = tiles()
      .map(
        (tile) =>
          `  <Flex${tag === 'div' ? '' : ` container="${tag}"`} direction="column" class="${itemClass(tile.index)}">\n    <Panel tone="${tile.tone}" variant="surface" class="flex-1 min-w-0" bodyClass="p-0">\n      <Flex direction="column" align="start" class="gap-1 ${cardBodyClass(tile.index)}">\n      <Badge tone="${tile.tone}" variant="outline">${tile.label}</Badge>\n      <h3 class="fs-h6 mt-2 mb-1 wrap-anywhere">${tile.title}</h3>${descriptions() ? `\n      <p class="text-muted mb-0 wrap-anywhere">${tile.description}</p>` : ''}\n      </Flex>\n    </Panel>\n  </Flex>`,
      )
      .join('\n')
    return `<Grid ${attrs.join('\n  ')}>\n${items}\n</Grid>`
  })
  const loadPreset = (preset: 'cards' | 'tracks' | 'auto' | 'dense') =>
    batch(() => {
      selectedPreset(preset)
      base('1')
      sm('2')
      md('')
      lg('3')
      xl('')
      itemAlignment('stretch')
      itemJustification('stretch')
      dense(false)
      wideItems(false)
      variedHeights(true)
      descriptions(true)
      gap('3')
      itemCount('6')
      previewWidth('w-full')
      element('div')
      customTracks('minmax(0, 2fr) minmax(0, 1fr)')
      if (preset === 'tracks' || preset === 'auto') {
        base('custom')
        sm('')
        lg('')
        if (preset === 'auto')
          customTracks('repeat(auto-fit, minmax(min(100%, 180px), 1fr))')
      }
      if (preset === 'dense') {
        base('3')
        sm('')
        lg('')
        dense(true)
        wideItems(true)
        variedHeights(false)
        itemCount('9')
      }
    })

  let frame = 0
  let copyTimer: ReturnType<typeof setTimeout> | undefined
  let resizeObserver: ResizeObserver | undefined
  let mutationObserver: MutationObserver | undefined
  const measure = () => {
    frame = 0
    browserWidth(window.innerWidth)
    const grid = document.getElementById('grid-lab-preview')
    if (!grid) return
    measuredWidth(Math.round(grid.getBoundingClientRect().width))
    measuredColumns(
      getComputedStyle(grid).gridTemplateColumns.match(/\d+(?:\.\d+)?px/g)
        ?.length ?? 0,
    )
  }
  const scheduleMeasure = () => {
    if (!frame) frame = requestAnimationFrame(measure)
  }
  onMounted(() => {
    const stage = document.getElementById('grid-lab-stage')
    if (!stage) return
    resizeObserver = new ResizeObserver(scheduleMeasure)
    resizeObserver.observe(stage)
    mutationObserver = new MutationObserver(scheduleMeasure)
    mutationObserver.observe(stage, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['style', 'class'],
    })
    window.addEventListener('resize', scheduleMeasure)
    scheduleMeasure()
  })
  onUnmounted(() => {
    resizeObserver?.disconnect()
    mutationObserver?.disconnect()
    window.removeEventListener('resize', scheduleMeasure)
    cancelAnimationFrame(frame)
    if (copyTimer) clearTimeout(copyTimer)
  })
  return {
    selectedPreset,
    base,
    customTracks,
    sm,
    md,
    lg,
    xl,
    columns,
    itemAlignment,
    itemJustification,
    dense,
    wideItems,
    variedHeights,
    descriptions,
    gap,
    itemCount,
    previewWidth,
    element,
    trackError,
    canSpan,
    tiles,
    gridClass,
    widthClass,
    itemClass,
    cardBodyClass,
    markup,
    browserWidth,
    measuredWidth,
    measuredColumns,
    activeBreakpoint,
    activeColumns,
    copyLabel,
    loadPreset,
    reset: () => loadPreset('cards'),
    baseOptions: [
      ...countOptions,
      { label: 'Custom CSS tracks', value: 'custom' },
    ],
    responsiveOptions: [
      { label: 'Inherit smaller breakpoint', value: '' },
      ...countOptions,
    ],
    alignmentOptions,
    gapOptions: [0, 1, 2, 3, 4, 5, 6].map((value) => ({
      label: `gap-${value}`,
      value: String(value),
    })),
    itemOptions: [3, 6, 9, 12].map((value) => ({
      label: `${value} items`,
      value: String(value),
    })),
    widthOptions: [
      { label: 'Full available width', value: 'w-full' },
      { label: 'Narrow', value: 'layout-playground-width--narrow' },
      { label: 'Medium', value: 'layout-playground-width--medium' },
      { label: 'Wide', value: 'layout-playground-width--wide' },
    ],
    containerOptions: ['div', 'section', 'ul'].map((value) => ({
      label: value,
      value,
    })),
    copy: async () => {
      if (copyTimer) clearTimeout(copyTimer)
      try {
        await navigator.clipboard.writeText(markup())
        copyLabel('Copied')
      } catch {
        copyLabel('Select the markup below to copy')
      }
      copyTimer = setTimeout(() => copyLabel('Copy markup'), 2500)
    },
  }
}

export type GridPlayground = ReturnType<typeof createGridPlayground>

const template = html`<Flex direction="column">
  <Flex justify="between" align="center" wrap="true">
    <div><p class="text-eyebrow m-0">Make space for your content</p><h3 class="mt-1 mb-0">Grid layout lab</h3></div>
    <Badge tone="accent" variant="surface">Live playground</Badge>
  </Flex>
  <Flex wrap="true" aria-label="Grid presets">
    <Btn size="sm" tone="accent" :variant="selectedPreset === 'cards' ? 'solid' : 'outline'" :aria-pressed="selectedPreset === 'cards'" @click="loadPreset('cards')">Responsive cards</Btn>
    <Btn size="sm" tone="accent" :variant="selectedPreset === 'tracks' ? 'solid' : 'outline'" :aria-pressed="selectedPreset === 'tracks'" @click="loadPreset('tracks')">Asymmetric tracks</Btn>
    <Btn size="sm" tone="accent" :variant="selectedPreset === 'auto' ? 'solid' : 'outline'" :aria-pressed="selectedPreset === 'auto'" @click="loadPreset('auto')">Auto-fit cards</Btn>
    <Btn size="sm" tone="accent" :variant="selectedPreset === 'dense' ? 'solid' : 'outline'" :aria-pressed="selectedPreset === 'dense'" @click="loadPreset('dense')">Dense board</Btn>
  </Flex>
  <Panel variant="surfaceAlt" bodyClass="p-3 min-w-0">
    <Flex justify="between" wrap="true" class="mb-3">
      <strong>Live layout</strong><span class="text-muted">{{ measuredColumns }} tracks · {{ measuredWidth }}px available</span>
    </Flex>
    <div id="grid-lab-stage" :class="widthClass">
      <Grid id="grid-lab-preview" :container="element" :columns="columns" :columnsSm="sm" :columnsMd="md" :columnsLg="lg" :columnsXl="xl"
        :alignItems="itemAlignment" :justifyItems="itemJustification" :dense="dense" :class="gridClass">
        <Flex r-for="tile in tiles" :container="element === 'ul' ? 'li' : 'div'" direction="column" :class="itemClass(tile.index)">
          <Panel :tone="tile.tone" variant="surface" class="flex-1 min-w-0" bodyClass="p-0">
            <Flex direction="column" align="start" :class="'gap-1 ' + cardBodyClass(tile.index)">
              <Badge :tone="tile.tone" variant="outline">{{ tile.label }}</Badge>
              <h3 class="fs-h6 mt-2 mb-1 wrap-anywhere">{{ tile.title }}</h3>
              <p r-if="descriptions" class="text-muted mb-0 wrap-anywhere">{{ tile.description }}</p>
            </Flex>
          </Panel>
        </Flex>
      </Grid>
    </div>
  </Panel>
  <p class="text-muted m-0">Browser: {{ browserWidth }}px · Active breakpoint: <code>{{ activeBreakpoint }}</code> · Columns: <code>{{ activeColumns }}</code></p>
  <fieldset class="b-0 p-0 m-0">
    <legend class="text-eyebrow mb-2">Columns &amp; breakpoints</legend>
    <Grid columns="1" columnsSm="2" columnsLg="3">
      <FormSelectField id="grid-lab-base" label="Base columns" :model="base" :options="baseOptions"/>
      <FormSelectField id="grid-lab-sm" label="sm · 640px and up" :model="sm" :options="responsiveOptions"/>
      <FormSelectField id="grid-lab-md" label="md · 768px and up" :model="md" :options="responsiveOptions"/>
      <FormSelectField id="grid-lab-lg" label="lg · 1024px and up" :model="lg" :options="responsiveOptions"/>
      <FormSelectField id="grid-lab-xl" label="xl · 1280px and up" :model="xl" :options="responsiveOptions"/>
      <FormSelectField id="grid-lab-container" label="Container element" :model="element" :options="containerOptions"/>
    </Grid>
    <FormInputField r-if="base === 'custom'" id="grid-lab-custom" class="mt-3" label="CSS track list" :model="customTracks" placeholder="minmax(0, 2fr) minmax(0, 1fr)"/>
    <p r-if="trackError" role="alert" class="text-muted mb-0">{{ trackError }}</p>
  </fieldset>
  <fieldset class="b-0 p-0 m-0">
    <legend class="text-eyebrow mb-2">Spacing &amp; alignment</legend>
    <Grid columns="1" columnsSm="2" columnsLg="3">
      <FormSelectField id="grid-lab-align" label="Vertical alignment" :model="itemAlignment" :options="alignmentOptions"/>
      <FormSelectField id="grid-lab-justify" label="Horizontal alignment" :model="itemJustification" :options="alignmentOptions"/>
      <FormSelectField id="grid-lab-gap" label="Gap" :model="gap" :options="gapOptions"/>
      <FormSelectField id="grid-lab-items" label="Item count" :model="itemCount" :options="itemOptions"/>
      <FormSelectField id="grid-lab-width" label="Preview width" :model="previewWidth" :options="widthOptions"/>
    </Grid>
    <Flex wrap="true" class="mt-3">
      <FormCheck id="grid-lab-dense" label="Dense packing" :checked="dense"/>
      <FormCheck id="grid-lab-wide" label="Wide first two items" :checked="wideItems" :disabled="!canSpan"/>
      <FormCheck id="grid-lab-heights" label="Vary card padding" :checked="variedHeights"/>
      <FormCheck id="grid-lab-descriptions" label="Show descriptions" :checked="descriptions"/>
    </Flex>
  </fieldset>
  <p class="text-muted m-0">Breakpoints follow the browser width. Auto-fit follows the available preview width. Wide cards use the guide's layout-featured-card class from sm onward and require numeric counts of two or more at every breakpoint; dense packing may change their visual order.</p>
  <Flex justify="between" align="center" wrap="true">
    <strong>Copyable Grid markup</strong>
    <Flex wrap="true"><Btn size="sm" variant="outline" @click="reset">Reset playground</Btn><Btn size="sm" @click="copy"><span aria-live="polite">{{ copyLabel }}</span></Btn></Flex>
  </Flex>
  <Panel variant="surfaceAlt" bodyClass="p-3 min-w-0">
    <pre class="overflow-auto max-h-inspector m-0"><code>{{ markup }}</code></pre>
  </Panel>
</Flex>`

const component = defineComponent<GridPlayground>(template, {
  context: createGridPlayground,
})
createApp(
  {
    components: {
      GridPlayground: component,
      ...defineGridComponents(),
      ...defineFlexComponents(),
      ...definePanelComponents(),
      ...defineBadgeComponents(),
      ...defineButtonComponents(),
      ...defineFormComponents(),
      ...defineFormInputField(),
      ...defineFormSelectField(),
      ...defineIconComponents((name) =>
        name === 'lucide:chevron-down' ? lucide_chevron_down : '',
      ),
    },
  },
  { selector: 'app#grid-playground', template: html`<GridPlayground/>` },
)
