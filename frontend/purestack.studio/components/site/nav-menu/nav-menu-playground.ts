import type { NavItem } from '@purestack/ts-common'
import {
  type ComponentVariant,
  type ComponentVariantMode,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormSelectField,
  defineGridComponents,
  defineIconComponents,
  defineNavigationComponents,
  definePanelComponents,
  defineSignInComponents,
  type FormSelectOption,
} from '@purestack/ts-components'
import { SEMANTIC_TONES, type SemanticTone } from '@purestack/ts-style'
import {
  iconoir_pin,
  iconoir_pin_slash,
  lucide_chevron_down,
  tabler_bell,
  tabler_book,
  tabler_chart_bar,
  tabler_chevron_down,
  tabler_components,
  tabler_credit_card,
  tabler_file_invoice,
  tabler_home,
  tabler_key,
  tabler_layout_dashboard,
  tabler_package,
  tabler_palette,
  tabler_rocket,
  tabler_settings,
  tabler_users,
} from '@purestack/ts-svg-icons'
import {
  batch,
  type ComputedRef,
  computed,
  createApp,
  defineComponent,
  html,
  observe,
  type Ref,
  ref,
} from 'regor'

type TreeName = 'docs' | 'app'
type Backdrop = 'page' | 'spotlight'

interface PageOption {
  label: string
  value: string
}

export interface NavMenuPlayground {
  treeName: Ref<TreeName>
  currentUrl: Ref<string>
  showIcons: Ref<boolean>
  tone: Ref<SemanticTone>
  variant: Ref<ComponentVariant>
  variantMode: Ref<ComponentVariantMode>
  backdrop: Ref<Backdrop>
  items: ComputedRef<NavItem[]>
  pages: ComputedRef<PageOption[]>
  stageClass: ComputedRef<string>
  trees: FormSelectOption[]
  tones: FormSelectOption[]
  variants: FormSelectOption[]
  modes: FormSelectOption[]
  backdrops: FormSelectOption[]
  followLink: (event: Event) => void
  reset: () => void
}

const TREES: Record<TreeName, NavItem[]> = {
  docs: [
    { title: 'Home', url: '/', icon: 'tabler:home' },
    {
      title: 'Getting started',
      icon: 'tabler:rocket',
      children: [
        { title: 'Installation', url: '/start/install/' },
        { title: 'Your first page', url: '/start/first-page/' },
      ],
    },
    {
      title: 'Guides',
      icon: 'tabler:book',
      children: [
        { title: 'Themes', url: '/guides/themes/', icon: 'tabler:palette' },
        {
          title: 'Components',
          icon: 'tabler:components',
          children: [
            { title: 'Buttons', url: '/guides/components/buttons/' },
            { title: 'Navigation', url: '/guides/components/navigation/' },
          ],
        },
        { title: 'Deployment', url: '/guides/deploy/' },
      ],
    },
    { title: 'Reference', url: '/reference/', icon: 'tabler:package' },
  ],
  app: [
    { title: 'Dashboard', url: '/app/', icon: 'tabler:layout-dashboard' },
    { title: 'Customers', url: '/app/customers/', icon: 'tabler:users' },
    {
      title: 'Reports',
      icon: 'tabler:chart-bar',
      children: [
        { title: 'Revenue', url: '/app/reports/revenue/' },
        { title: 'Usage', url: '/app/reports/usage/' },
      ],
    },
    {
      title: 'Billing',
      icon: 'tabler:credit-card',
      children: [
        {
          title: 'Invoices',
          url: '/app/billing/invoices/',
          icon: 'tabler:file-invoice',
        },
        { title: 'Plans', url: '/app/billing/plans/' },
      ],
    },
    {
      title: 'Settings',
      icon: 'tabler:settings',
      children: [
        { title: 'API keys', url: '/app/settings/keys/', icon: 'tabler:key' },
        {
          title: 'Notifications',
          url: '/app/settings/notifications/',
          icon: 'tabler:bell',
        },
      ],
    },
  ],
}

const DEFAULTS = {
  treeName: 'docs' as TreeName,
  currentUrl: '/guides/themes/',
  showIcons: true,
  tone: 'neutral' as SemanticTone,
  variant: 'flat' as ComponentVariant,
  variantMode: 'stateless' as ComponentVariantMode,
  backdrop: 'page' as Backdrop,
}

const navMenuPlaygroundTemplate = html`<Flex direction="column">
  <div
    class="rounded-md p-4 spotlight-from-top-right"
    :class="stageClass"
    @click="followLink"
  >
    <div style="max-width: 18rem; margin-inline: auto; --ps-doc-layout-active-shell-padding-inline-start: 0px">
      <NavMenu
        :items="items"
        :currentUrl="currentUrl"
        :tone="tone"
        :variant="variant"
        :variantMode="variantMode"/>
    </div>
  </div>
  <p class="fs-xs text-subtle mb-0">
    Links stay in the playground: choose one to make it the current page.
  </p>
  <Grid columns="1" columnsSm="2" columnsLg="3">
    <FormSelectField id="nav-menu-tree" label="Navigation" :model="treeName" :options="trees"/>
    <FormSelectField id="nav-menu-current" label="Current page" :model="currentUrl" :options="pages"/>
    <FormSelectField id="nav-menu-backdrop" label="Backdrop" :model="backdrop" :options="backdrops"/>
    <FormSelectField id="nav-menu-tone" label="Tone" :model="tone" :options="tones"/>
    <FormSelectField id="nav-menu-variant" label="Variant" :model="variant" :options="variants"/>
    <FormSelectField id="nav-menu-mode" label="Variant mode" :model="variantMode" :options="modes"/>
  </Grid>
  <Flex wrap="true" align="center">
    <FormCheck id="nav-menu-icons" label="Show item icons" :checked="showIcons"/>
    <Btn variant="link" @click="reset">Reset playground</Btn>
  </Flex>
</Flex>`

function withoutIcons(items: NavItem[]): NavItem[] {
  return items.map(({ icon: _icon, children, ...item }) =>
    children ? { ...item, children: withoutIcons(children) } : item,
  )
}

function listPages(items: NavItem[], trail = ''): PageOption[] {
  return items.flatMap((item) => {
    const label = trail ? `${trail} / ${item.title}` : item.title
    const page = item.url ? [{ label, value: item.url }] : []
    return [...page, ...listPages(item.children ?? [], label)]
  })
}

function options(values: readonly string[]): FormSelectOption[] {
  return values.map((value) => ({ label: value, value }))
}

function createNavMenuPlayground(): NavMenuPlayground {
  const treeName = ref(DEFAULTS.treeName)
  const currentUrl = ref(DEFAULTS.currentUrl)
  const showIcons = ref(DEFAULTS.showIcons)
  const tone = ref(DEFAULTS.tone)
  const variant = ref(DEFAULTS.variant)
  const variantMode = ref(DEFAULTS.variantMode)
  const backdrop = ref(DEFAULTS.backdrop)

  const pages = computed(() => listPages(TREES[treeName()]))
  // A new tree starts on its first page, so the menu always shows one.
  observe(treeName, () => {
    const first = pages()[0]
    if (first) currentUrl(first.value)
  })

  return {
    treeName,
    currentUrl,
    showIcons,
    tone,
    variant,
    variantMode,
    backdrop,
    items: computed(() => {
      const tree = TREES[treeName()]
      return showIcons() ? tree : withoutIcons(tree)
    }),
    pages,
    stageClass: computed<string>(() =>
      backdrop() === 'spotlight'
        ? 'tone--accent tone-fill-spotlight'
        : 'b-1 b-subtle',
    ),
    trees: [
      { label: 'Documentation site', value: 'docs' },
      { label: 'Application', value: 'app' },
    ],
    tones: options(SEMANTIC_TONES),
    variants: options([
      'flat',
      'flatAlt',
      'flatSolid',
      'surface',
      'surfaceAlt',
      'solid',
      'glass',
      'spotlight',
      'outlineFill',
      'outline',
      'subtle',
      'none',
    ]),
    modes: options(['stateless', 'stateful']),
    backdrops: [
      { label: 'Page', value: 'page' },
      { label: 'Spotlight (for glass)', value: 'spotlight' },
    ],
    followLink: (event) => {
      const link = (event.target as Element | null)?.closest('a[href]')
      if (!link) return
      event.preventDefault()
      currentUrl(link.getAttribute('href') ?? '')
    },
    reset: () =>
      batch(() => {
        treeName(DEFAULTS.treeName)
        currentUrl(DEFAULTS.currentUrl)
        showIcons(DEFAULTS.showIcons)
        tone(DEFAULTS.tone)
        variant(DEFAULTS.variant)
        variantMode(DEFAULTS.variantMode)
        backdrop(DEFAULTS.backdrop)
      }),
  }
}

const icons: Record<string, string> = {
  'lucide:chevron-down': lucide_chevron_down,
  'tabler:chevron-down': tabler_chevron_down,
  'iconoir:pin': iconoir_pin,
  'iconoir:pin-slash': iconoir_pin_slash,
  'tabler:home': tabler_home,
  'tabler:rocket': tabler_rocket,
  'tabler:book': tabler_book,
  'tabler:palette': tabler_palette,
  'tabler:components': tabler_components,
  'tabler:package': tabler_package,
  'tabler:layout-dashboard': tabler_layout_dashboard,
  'tabler:users': tabler_users,
  'tabler:chart-bar': tabler_chart_bar,
  'tabler:credit-card': tabler_credit_card,
  'tabler:file-invoice': tabler_file_invoice,
  'tabler:settings': tabler_settings,
  'tabler:key': tabler_key,
  'tabler:bell': tabler_bell,
}

const component = defineComponent<NavMenuPlayground>(
  navMenuPlaygroundTemplate,
  { context: createNavMenuPlayground },
)

createApp(
  {
    components: {
      NavMenuPlayground: component,
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineGridComponents(),
      ...defineFormComponents(),
      ...defineFormSelectField(),
      ...defineNavigationComponents(),
      ...definePanelComponents(),
      ...defineSignInComponents(),
      ...defineIconComponents((name) => {
        if (!icons[name]) throw new Error(`Icon is not registered: ${name}`)
        return icons[name]
      }),
    },
  },
  {
    selector: 'app#nav-menu-playground',
    template: html`<NavMenuPlayground/>`,
  },
)
