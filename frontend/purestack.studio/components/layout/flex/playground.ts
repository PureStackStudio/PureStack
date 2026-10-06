import {
  defineBadgeComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
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

const names = ['sm', 'md', 'lg', 'xl'] as const
const options = (values: string[]): FormSelectOption[] =>
  values.map((value) => ({ label: value, value }))
const directionOptions = options([
  'row',
  'row-reverse',
  'column',
  'column-reverse',
])
const alignOptions = options(['stretch', 'start', 'center', 'end', 'baseline'])
const justifyOptions = options([
  'start',
  'center',
  'end',
  'between',
  'around',
  'evenly',
  'stretch',
])
const wrapOptions = options(['nowrap', 'wrap', 'reverse'])
const inherit = (values: FormSelectOption[]) => [
  { label: 'Inherit smaller breakpoint', value: '' },
  ...values,
]
const samples = [
  { title: 'Discover', tone: 'accent' },
  { title: 'Compose', tone: 'info' },
  { title: 'Refine', tone: 'feature' },
  { title: 'Review', tone: 'success' },
  { title: 'Publish', tone: 'warning' },
  { title: 'Share', tone: 'neutral' },
]

function createFlexPlayground() {
  const selectedPreset = ref('distribute')
  const layoutDirection = ref('row')
  const itemAlignment = ref('center')
  const contentDistribution = ref('between')
  const wrapping = ref('wrap')
  const tiers = names.map((name) => ({
    name,
    label: `${name} / ${BREAKPOINTS[name].value} and up`,
    direction: ref(''),
    align: ref(''),
    justify: ref(''),
    wrap: ref(''),
  }))
  const gap = ref('3')
  const height = ref('layout-playground-frame')
  const width = ref('w-full')
  const sizing = ref('flex-none')
  const count = ref('3')
  const varied = ref(false)
  const grow = ref(false)
  const inlineLayout = ref(false)
  const element = ref('div')
  const browserWidth = ref(window.innerWidth)
  const measuredWidth = ref(0)
  const overflowing = ref(false)
  const copyLabel = ref('Copy markup')
  const active = computed(() => {
    const value = {
      direction: layoutDirection(),
      align: itemAlignment(),
      justify: contentDistribution(),
      wrap: wrapping(),
      breakpoint: 'base',
    }
    for (const tier of tiers) {
      if (browserWidth() < Number.parseInt(BREAKPOINTS[tier.name].value, 10))
        continue
      value.breakpoint = tier.name
      for (const key of ['direction', 'align', 'justify', 'wrap'] as const) {
        if (tier[key]()) value[key] = tier[key]()
      }
    }
    return value
  })
  const axes = computed(() =>
    active().direction.startsWith('column')
      ? 'Main axis: vertical / Cross axis: horizontal'
      : 'Main axis: horizontal / Cross axis: vertical',
  )
  const tiles = computed(() =>
    Array.from({ length: Number(count()) }, (_, index) => ({
      ...samples[index % samples.length],
      index,
      label: String(index + 1).padStart(2, '0'),
    })),
  )
  const layoutClass = computed(() => `gap-${gap()} p-3 m-0 min-w-0 list-none`)
  const widthClass = computed(() => `${width()} max-w-full mx-auto`)
  const frameClass = computed(() => `${height()} max-w-full`)
  const itemClass = (index: number) =>
    `${grow() && index === 0 ? 'flex-1' : sizing()} min-w-0`
  const titleClass = (index: number) =>
    `m-0 wrap-anywhere ${varied() ? ['fs-h6', 'fs-h5', 'fs-h4'][index % 3] : 'fs-h6'}`
  const cardPadding = (index: number) =>
    varied() ? ['p-3', 'p-4', 'p-5'][index % 3] : 'p-3'
  const markup = computed(() => {
    const attrs = [
      `direction="${layoutDirection()}"`,
      `align="${itemAlignment()}"`,
      `justify="${contentDistribution()}"`,
      `wrap="${wrapping()}"`,
    ]
    for (const tier of tiers) {
      for (const key of ['direction', 'align', 'justify', 'wrap'] as const) {
        if (tier[key]())
          attrs.push(
            `${key}${tier.name[0].toUpperCase() + tier.name.slice(1)}="${tier[key]()}"`,
          )
      }
    }
    if (inlineLayout()) attrs.push(':inline="true"')
    if (element() !== 'div') attrs.push(`container="${element()}"`)
    attrs.push(`class="${layoutClass()}"`)
    const tag = element() === 'ul' ? 'li' : 'div'
    return `<Flex ${attrs.join('\n  ')}>\n${tiles()
      .map(
        (tile) =>
          `  <Flex${tag === 'div' ? '' : ` container="${tag}"`} direction="column" class="${itemClass(tile.index)}">\n    <Panel tone="${tile.tone}" variant="surface" class="flex-1 min-w-0" bodyClass="p-0">\n      <Flex direction="column" align="start" class="gap-1 ${cardPadding(tile.index)}">\n      <h3 class="${titleClass(tile.index)}">${tile.title}</h3>\n      <Badge tone="${tile.tone}" variant="outline">${tile.label}</Badge>\n      </Flex>\n    </Panel>\n  </Flex>`,
      )
      .join('\n')}\n</Flex>`
  })
  const loadPreset = (
    preset: 'distribute' | 'responsive' | 'wrap' | 'baseline' | 'grow',
  ) =>
    batch(() => {
      selectedPreset(preset)
      layoutDirection('row')
      itemAlignment('center')
      contentDistribution('between')
      wrapping('wrap')
      for (const tier of tiers) {
        tier.direction('')
        tier.align('')
        tier.justify('')
        tier.wrap('')
      }
      gap('3')
      height('layout-playground-frame')
      width('w-full')
      sizing('flex-none')
      count('3')
      varied(false)
      grow(false)
      inlineLayout(false)
      element('div')
      if (preset === 'responsive') {
        layoutDirection('column')
        itemAlignment('stretch')
        contentDistribution('start')
        wrapping('nowrap')
        tiers[1].direction('row')
        tiers[1].align('center')
        tiers[1].justify('between')
        tiers[1].wrap('wrap')
        sizing('flex-none')
        height('layout-playground-frame layout-playground-frame--tall')
        varied(false)
      }
      if (preset === 'wrap') {
        width('layout-playground-width--narrow')
        count('6')
        contentDistribution('start')
        varied(false)
      }
      if (preset === 'baseline') {
        varied(true)
        itemAlignment('baseline')
        contentDistribution('start')
        wrapping('nowrap')
      }
      if (preset === 'grow') {
        grow(true)
        sizing('flex-auto')
        varied(false)
        contentDistribution('start')
      }
    })
  let frame = 0
  let copyTimer: ReturnType<typeof setTimeout> | undefined
  let resizeObserver: ResizeObserver | undefined
  let mutationObserver: MutationObserver | undefined
  const measure = () => {
    frame = 0
    browserWidth(window.innerWidth)
    const flex = document.getElementById('flex-lab-preview')
    if (!flex) return
    measuredWidth(Math.round(flex.getBoundingClientRect().width))
    overflowing(
      flex.scrollWidth > flex.clientWidth + 1 ||
        flex.scrollHeight > flex.clientHeight + 1,
    )
  }
  const scheduleMeasure = () => {
    if (!frame) frame = requestAnimationFrame(measure)
  }
  onMounted(() => {
    const stage = document.getElementById('flex-lab-stage')
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
    layoutDirection,
    itemAlignment,
    contentDistribution,
    wrapping,
    tiers,
    gap,
    height,
    width,
    sizing,
    count,
    varied,
    grow,
    inlineLayout,
    element,
    browserWidth,
    measuredWidth,
    overflowing,
    active,
    axes,
    tiles,
    layoutClass,
    widthClass,
    frameClass,
    itemClass,
    titleClass,
    cardPadding,
    markup,
    copyLabel,
    loadPreset,
    sm: tiers[0],
    md: tiers[1],
    lg: tiers[2],
    xl: tiers[3],
    directionOptions,
    alignOptions,
    justifyOptions,
    wrapOptions,
    responsiveDirectionOptions: inherit(directionOptions),
    responsiveAlignOptions: inherit(alignOptions),
    responsiveJustifyOptions: inherit(justifyOptions),
    responsiveWrapOptions: inherit(wrapOptions),
    gapOptions: options(['0', '1', '2', '3', '4', '5', '6']).map((option) => ({
      ...option,
      label: `gap-${option.value}`,
    })),
    heightOptions: [
      {
        label: 'Compact',
        value: 'layout-playground-frame layout-playground-frame--compact',
      },
      { label: 'Regular', value: 'layout-playground-frame' },
      {
        label: 'Tall',
        value: 'layout-playground-frame layout-playground-frame--tall',
      },
    ],
    sizingOptions: options(['flex-none', 'flex-auto', 'flex-fill', 'flex-1']),
    countOptions: [2, 3, 4, 6, 9].map((value) => ({
      label: `${value} items`,
      value: String(value),
    })),
    widthOptions: [
      { label: 'Full available width', value: 'w-full' },
      { label: 'Narrow', value: 'layout-playground-width--narrow' },
      { label: 'Medium', value: 'layout-playground-width--medium' },
      { label: 'Wide', value: 'layout-playground-width--wide' },
    ],
    containerOptions: options(['div', 'section', 'ul']),
    reset: () => loadPreset('distribute'),
    clearOverrides: () =>
      batch(() => {
        for (const tier of tiers) {
          tier.direction('')
          tier.align('')
          tier.justify('')
          tier.wrap('')
        }
      }),
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

const template = html`<Flex direction="column">
  <Flex justify="between" align="center" wrap="true">
    <div><p class="text-eyebrow m-0">Find your layout's rhythm</p><h3 class="mt-1 mb-0">Flex layout lab</h3></div>
    <Badge tone="accent" variant="surface">Live playground</Badge>
  </Flex>
  <Flex wrap="true" aria-label="Flex presets">
    <Btn size="sm" tone="accent" :variant="selectedPreset === 'distribute' ? 'solid' : 'outline'" :aria-pressed="selectedPreset === 'distribute'" @click="loadPreset('distribute')">Distribute items</Btn>
    <Btn size="sm" tone="accent" :variant="selectedPreset === 'responsive' ? 'solid' : 'outline'" :aria-pressed="selectedPreset === 'responsive'" @click="loadPreset('responsive')">Responsive stack</Btn>
    <Btn size="sm" tone="accent" :variant="selectedPreset === 'wrap' ? 'solid' : 'outline'" :aria-pressed="selectedPreset === 'wrap'" @click="loadPreset('wrap')">Wrapping cards</Btn>
    <Btn size="sm" tone="accent" :variant="selectedPreset === 'baseline' ? 'solid' : 'outline'" :aria-pressed="selectedPreset === 'baseline'" @click="loadPreset('baseline')">Shared baseline</Btn>
    <Btn size="sm" tone="accent" :variant="selectedPreset === 'grow' ? 'solid' : 'outline'" :aria-pressed="selectedPreset === 'grow'" @click="loadPreset('grow')">Flexible first item</Btn>
  </Flex>
  <Panel variant="surfaceAlt" bodyClass="p-3 min-w-0">
    <Flex justify="between" wrap="true" class="mb-3"><strong>Live layout</strong><span class="text-muted">{{ measuredWidth }}px wide</span></Flex>
    <div id="flex-lab-stage" class="overflow-auto">
      <div :class="widthClass">
        <div :class="frameClass">
        <span r-if="inlineLayout" class="text-muted">Before inline Flex </span>
        <Flex id="flex-lab-preview" :direction="layoutDirection" :align="itemAlignment" :justify="contentDistribution" :wrap="wrapping"
          :directionSm="sm.direction" :directionMd="md.direction" :directionLg="lg.direction" :directionXl="xl.direction"
          :alignSm="sm.align" :alignMd="md.align" :alignLg="lg.align" :alignXl="xl.align"
          :justifySm="sm.justify" :justifyMd="md.justify" :justifyLg="lg.justify" :justifyXl="xl.justify"
          :wrapSm="sm.wrap" :wrapMd="md.wrap" :wrapLg="lg.wrap" :wrapXl="xl.wrap"
          :inline="inlineLayout" :container="element" :class="layoutClass + ' h-full'">
          <Flex r-for="tile in tiles" :container="element === 'ul' ? 'li' : 'div'" direction="column" :class="itemClass(tile.index)">
            <Panel :tone="tile.tone" variant="surface" class="flex-1 min-w-0" bodyClass="p-0">
              <Flex direction="column" align="start" :class="'gap-1 ' + cardPadding(tile.index)">
              <h3 :class="titleClass(tile.index)">{{ tile.title }}</h3>
              <Badge :tone="tile.tone" variant="outline">{{ tile.label }}</Badge>
              </Flex>
            </Panel>
          </Flex>
        </Flex>
        <span r-if="inlineLayout" class="text-muted"> After inline Flex</span>
        </div>
      </div>
    </div>
  </Panel>
  <p class="text-muted m-0">{{ axes }}<br/>Browser: {{ browserWidth }}px / Breakpoint: <code>{{ active.breakpoint }}</code> / Active: <code>{{ active.direction }} / {{ active.align }} / {{ active.justify }} / {{ active.wrap }}</code></p>
  <p r-if="overflowing" role="status" class="text-muted m-0">Items exceed the preview bounds. Scroll the preview, choose flex-auto, enable wrapping, or increase its dimensions.</p>
  <fieldset class="b-0 p-0 m-0">
    <legend class="text-eyebrow mb-2">Direction &amp; alignment</legend>
    <Grid columns="1" columnsSm="2" columnsLg="3">
      <FormSelectField id="flex-lab-direction" label="Direction" :model="layoutDirection" :options="directionOptions"/>
      <FormSelectField id="flex-lab-align" label="Align items / cross axis" :model="itemAlignment" :options="alignOptions"/>
      <FormSelectField id="flex-lab-justify" label="Justify content / main axis" :model="contentDistribution" :options="justifyOptions"/>
      <FormSelectField id="flex-lab-wrap" label="Wrapping" :model="wrapping" :options="wrapOptions"/>
      <FormSelectField id="flex-lab-container" label="Container element" :model="element" :options="containerOptions"/>
    </Grid>
  </fieldset>
  <details>
    <summary class="text-eyebrow">Responsive overrides / sm / md / lg / xl</summary>
    <p class="text-muted">Overrides follow the browser viewport. Empty values inherit the smaller breakpoint independently for each property.</p>
    <fieldset r-for="tier in tiers" class="b-0 p-0 mx-0 mb-3">
      <legend class="text-eyebrow mb-2">{{ tier.label }}</legend>
      <Grid columns="1" columnsSm="2">
        <FormSelectField :id="'flex-lab-direction-' + tier.name" label="Direction" :model="tier.direction" :options="responsiveDirectionOptions"/>
        <FormSelectField :id="'flex-lab-align-' + tier.name" label="Align items" :model="tier.align" :options="responsiveAlignOptions"/>
        <FormSelectField :id="'flex-lab-justify-' + tier.name" label="Justify content" :model="tier.justify" :options="responsiveJustifyOptions"/>
        <FormSelectField :id="'flex-lab-wrap-' + tier.name" label="Wrapping" :model="tier.wrap" :options="responsiveWrapOptions"/>
      </Grid>
    </fieldset>
    <Btn size="sm" variant="outline" @click="clearOverrides">Clear responsive overrides</Btn>
  </details>
  <fieldset class="b-0 p-0 m-0">
    <legend class="text-eyebrow mb-2">Space &amp; item sizing</legend>
    <Grid columns="1" columnsSm="2" columnsLg="3">
      <FormSelectField id="flex-lab-gap" label="Gap utility" :model="gap" :options="gapOptions"/>
      <FormSelectField id="flex-lab-width" label="Preview width" :model="width" :options="widthOptions"/>
      <FormSelectField id="flex-lab-height" label="Preview height" :model="height" :options="heightOptions"/>
      <FormSelectField id="flex-lab-sizing" label="Item sizing utility" :model="sizing" :options="sizingOptions"/>
      <FormSelectField id="flex-lab-count" label="Item count" :model="count" :options="countOptions"/>
    </Grid>
    <Flex wrap="true" class="mt-3">
      <FormCheck id="flex-lab-varied" label="Vary padding &amp; typography" :checked="varied"/>
      <FormCheck id="flex-lab-grow" label="Grow first item" :checked="grow"/>
      <FormCheck id="flex-lab-inline" label="Inline Flex" :checked="inlineLayout"/>
    </Flex>
  </fieldset>
  <p class="text-muted m-0">Justify distributes space along the main axis; align positions items across it. Growing items consume available space before justify applies. In Flex, justify="stretch" behaves like start; use item growth to fill space. Reverse directions and reverse wrapping change visual placement while source order stays 01, 02, 03.</p>
  <Flex justify="between" align="center" wrap="true">
    <strong>Copyable Flex markup</strong>
    <Flex wrap="true"><Btn size="sm" variant="outline" @click="reset">Reset playground</Btn><Btn size="sm" @click="copy"><span aria-live="polite">{{ copyLabel }}</span></Btn></Flex>
  </Flex>
  <Panel variant="surfaceAlt" bodyClass="p-3 min-w-0"><pre class="overflow-auto max-h-inspector m-0"><code>{{ markup }}</code></pre></Panel>
</Flex>`

const component = defineComponent<ReturnType<typeof createFlexPlayground>>(
  template,
  { context: createFlexPlayground },
)
createApp(
  {
    components: {
      FlexPlayground: component,
      ...defineFlexComponents(),
      ...defineGridComponents(),
      ...definePanelComponents(),
      ...defineBadgeComponents(),
      ...defineButtonComponents(),
      ...defineFormComponents(),
      ...defineFormSelectField(),
      ...defineIconComponents((name) =>
        name === 'lucide:chevron-down' ? lucide_chevron_down : '',
      ),
    },
  },
  { selector: 'app#flex-playground', template: html`<FlexPlayground/>` },
)
