import {
  type AutoCompleteOption,
  defineAutoCompleteInputComponents,
  defineBadgeComponents,
  defineButtonComponents,
  defineFormComponents,
  defineFormInputField,
  defineFormSelectField,
  defineGridComponents,
  defineIconComponents,
  definePanelComponents,
  type FormSelectOption,
  type ResolvedAutoCompleteOption,
} from '@purestack/ts-components'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import {
  type ComputedRef,
  computed,
  createApp,
  defineComponent,
  flatten,
  html,
  type RefOrValue,
  ref,
  sref,
} from 'regor'

interface Person {
  id: string
  name: string
  role: string
  team: string
  zone: string
  initials: string
  keywords: string[]
}

interface GuidePersonSuggestionRow {
  option: RefOrValue<ResolvedAutoCompleteOption | null>
  selected?: RefOrValue<boolean>
  person?: ComputedRef<Person | null>
}

const PEOPLE: Person[] = [
  {
    id: 'ada',
    name: 'Ada Lovelace',
    role: 'Runtime analysis',
    team: 'Compiler systems',
    zone: 'EU',
    initials: 'AL',
    keywords: ['algorithm', 'runtime', 'math', 'compiler'],
  },
  {
    id: 'grace',
    name: 'Grace Hopper',
    role: 'Developer tooling',
    team: 'Platform experience',
    zone: 'US',
    initials: 'GH',
    keywords: ['compiler', 'tools', 'debugging', 'navy'],
  },
  {
    id: 'katherine',
    name: 'Katherine Johnson',
    role: 'Launch verification',
    team: 'Mission control',
    zone: 'US',
    initials: 'KJ',
    keywords: ['flight', 'math', 'verification', 'launch'],
  },
  {
    id: 'margaret',
    name: 'Margaret Hamilton',
    role: 'Reliability lead',
    team: 'Incident response',
    zone: 'US',
    initials: 'MH',
    keywords: ['reliability', 'apollo', 'operations', 'safety'],
  },
  {
    id: 'radia',
    name: 'Radia Perlman',
    role: 'Network architecture',
    team: 'Edge routing',
    zone: 'Global',
    initials: 'RP',
    keywords: ['network', 'routing', 'spanning tree', 'edge'],
  },
]

const SERVICES: AutoCompleteOption[] = [
  { label: 'Identity API', value: 'identity', keywords: ['auth', 'login'] },
  { label: 'Mail Gateway', value: 'mail', keywords: ['smtp', 'inbox'] },
  { label: 'Billing Ledger', value: 'billing', keywords: ['invoice', 'money'] },
  { label: 'Audit Stream', value: 'audit', keywords: ['logs', 'events'] },
  { label: 'Deployment Orchestrator', value: 'deploy', keywords: ['release'] },
  { label: 'Observability Hub', value: 'observability', keywords: ['metrics'] },
]

const REGION_OPTIONS: AutoCompleteOption[] = [
  { label: 'US East', value: 'us-east', keywords: ['virginia', 'primary'] },
  { label: 'US West', value: 'us-west', keywords: ['oregon', 'backup'] },
  { label: 'Europe Central', value: 'eu-central', keywords: ['frankfurt'] },
  { label: 'Asia Pacific', value: 'apac', keywords: ['singapore'] },
  { label: 'Gov Cloud', value: 'gov-cloud', disabled: true },
]

const WORKSPACE_OPTIONS: AutoCompleteOption[] = [
  {
    label: 'Atlas Cloud',
    value: 'atlas-cloud',
    keywords: ['enterprise', 'production'],
  },
  {
    label: 'Beacon Labs',
    value: 'beacon-labs',
    keywords: ['research', 'preview'],
  },
  {
    label: 'Compass Ops',
    value: 'compass-ops',
    keywords: ['operations', 'incident'],
  },
  {
    label: 'Delta Finance',
    value: 'delta-finance',
    keywords: ['billing', 'revenue'],
  },
]

const RELEASE_TRAIN_OPTIONS: AutoCompleteOption[] = [
  { label: 'Stable', value: 'stable', keywords: ['ga', 'production'] },
  { label: 'Preview', value: 'preview', keywords: ['beta', 'review'] },
  { label: 'Canary', value: 'canary', disabled: true, keywords: ['internal'] },
]

const PRIMARY_OWNER_OPTIONS: AutoCompleteOption[] = [
  { label: 'Ada Lovelace', value: 'ada', keywords: ['runtime', 'math'] },
  { label: 'Grace Hopper', value: 'grace', keywords: ['compiler', 'navy'] },
  {
    label: 'Katherine Johnson',
    value: 'katherine',
    keywords: ['flight', 'math'],
  },
]

const RISK_OPTIONS: FormSelectOption[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
]

const peopleOptions = PEOPLE.map((person) => ({
  label: person.name,
  value: person.id,
  keywords: [person.role, person.team, person.zone, ...person.keywords],
}))

const guidePersonSuggestionRowTemplate = html`<div class="autocomplete-guide__person-row">
  <span class="autocomplete-guide__avatar">{{ person?.initials }}</span>
  <span class="autocomplete-guide__person-main">
    <strong class="autocomplete-guide__person-name"
      >{{ person?.name || option?.label }}</strong
    >
    <span class="autocomplete-guide__person-role">
      {{ person?.role }} - {{ person?.team }}
    </span>
  </span>
  <Badge tone="info" variant="surface">{{ person?.zone }}</Badge>
  <Icon
    class="autocomplete-guide__person-check"
    name="lucide:check"
    r-if="selected"/>
</div>`

const guideInlineOptionsTemplate = html`<AppForm
  action="/guide/autocomplete/basic"
  method="post"
  tone="accent"
  @submit="handleSubmit"
>
  <Grid columns="1" columnsMd="2">
    <AutoCompleteInput
      label="Workspace"
      name="workspace"
      placeholder="Search workspaces"
      icon="lucide:search"
      required="true"
      :model="workspaceQuery"
      :selectedValue="workspaceValue"
      :options="workspaceOptions"
      @optionselect="selectWorkspace($event.detail.option)"/>
    <AutoCompleteInput
      label="Release train"
      name="releaseTrain"
      placeholder="Stable, Preview, Canary"
      tone="info"
      icon="iconoir:rocket"
      :model="releaseQuery"
      :selectedValue="releaseValue"
      :options="releaseTrainOptions"
      @optionselect="selectReleaseTrain($event.detail.option)"/>
  </Grid>

  <FormStatus tone="accent"> {{ inlineSummary }} </FormStatus>
  <FormSubmit label="Save routing"/>
</AppForm>`

const guideFormCompositionTemplate = html`<AppForm
  action="/guide/autocomplete/intake"
  method="post"
  tone="success"
  @submit="handleSubmit"
>
  <Grid columns="1" columnsLg="3">
    <AutoCompleteInput
      label="Primary owner"
      name="primaryOwner"
      placeholder="Ada, Grace, Katherine"
      autocomplete="off"
      icon="iconoir:user"
      :model="ownerQuery"
      :selectedValue="ownerValue"
      :options="primaryOwnerOptions"
      @optionselect="selectOwner($event.detail.option)"/>
    <FormInputField label="Launch window" type="date" name="launchWindow"/>
    <FormSelectField
      label="Risk level"
      name="riskLevel"
      placeholder="Choose risk"
      :options="riskOptions"/>
  </Grid>

  <FormDivider label="Readiness"/>

  <Grid columns="1" columnsMd="2">
    <FormCheck
      label="Support has reviewed the handoff"
      name="supportReviewed"
      value="yes"/>
    <FormCheck
      label="Rollback owner is assigned"
      name="rollbackOwnerAssigned"
      value="yes"/>
  </Grid>

  <FormStatus tone="success">{{ compositionSummary }}</FormStatus>
  <FormSubmit label="Create launch plan" tone="success"/>
</AppForm>`

const guideAutoCompleteRuntimeTemplate = html`<Panel tone="info" variant="surface">
  <div class="autocomplete-guide__shell">
    <h2>Runtime autocomplete app</h2>
    <Grid columns="1" columnsLg="3" alignItems="start">
      <AutoCompleteInput
        label="Owner"
        :model="ownerQuery"
        :selectedValue="ownerValue"
        :options="peopleOptions"
        rowComponent="GuidePersonSuggestionRow"
        placeholder="Try Ada, compiler, routing..."
        icon="lucide:search"
        @querychange="recordSearch('Owner', $event.detail.query)"
        @optionselect="selectOwner($event.detail.option)"/>
      <AutoCompleteInput
        label="Service"
        :model="serviceQuery"
        :selectedValue="serviceValue"
        :options="serviceOptions"
        :loading="serviceLoading"
        minLength="1"
        maxResults="6"
        placeholder="Try auth, mail, logs..."
        loadingText="Searching services"
        emptyText="No service matches"
        icon="iconoir:server"
        @querychange="searchServices($event.detail.query)"
        @optionselect="selectService($event.detail.option)"/>
      <AutoCompleteInput
        label="Region"
        :model="regionQuery"
        :selectedValue="regionValue"
        :options="regionOptions"
        placeholder="Choose deployment region"
        icon="iconoir:map"
        tone="success"
        @querychange="recordSearch('Region', $event.detail.query)"
        @optionselect="selectRegion($event.detail.option)"/>
    </Grid>

    <Grid columns="1" columnsMd="2">
      <Panel tone="neutral" variant="surfaceAlt">
        <h3>Selection state</h3>
        <ul class="autocomplete-guide__summary">
          <li>
            <strong>Owner</strong>
            <span>{{ ownerSummary }}</span>
          </li>
          <li>
            <strong>Service</strong>
            <span>{{ serviceSummary }}</span>
          </li>
          <li>
            <strong>Region</strong>
            <span>{{ regionSummary }}</span>
          </li>
        </ul>
      </Panel>
      <Panel tone="neutral" variant="surfaceAlt">
        <h3>Recent search events</h3>
        <ul class="autocomplete-guide__summary">
          <li r-for="event in recentEvents">
            <span>{{ event }}</span>
          </li>
        </ul>
      </Panel>
    </Grid>
  </div>
</Panel>`

class GuideInlineOptions {
  readonly workspaceQuery = ref('')
  readonly workspaceValue = ref<string | number | null>(null)
  readonly releaseQuery = ref('')
  readonly releaseValue = ref<string | number | null>(null)
  readonly saved = ref(false)
  readonly workspaceOptions = WORKSPACE_OPTIONS
  readonly releaseTrainOptions = RELEASE_TRAIN_OPTIONS
  readonly inlineSummary = computed(() => {
    const workspace = this.resolveChoice('Workspace', this.workspaceQuery())
    const release = this.resolveChoice('Release', this.releaseQuery())
    const suffix = this.saved() ? ' Saved locally for the sample.' : ''
    return `${workspace}. ${release}.${suffix}`
  })

  selectWorkspace = (option: ResolvedAutoCompleteOption) => {
    this.saved(false)
    this.workspaceQuery(option.label)
  }

  selectReleaseTrain = (option: ResolvedAutoCompleteOption) => {
    this.saved(false)
    this.releaseQuery(option.label)
  }

  handleSubmit = (event: SubmitEvent) => {
    event.preventDefault()
    this.saved(true)
  }

  private resolveChoice(label: string, query: string) {
    return query ? `${label}: ${query}` : `${label}: not selected`
  }
}

class GuideFormComposition {
  readonly ownerQuery = ref('')
  readonly ownerValue = ref<string | number | null>(null)
  readonly submitted = ref(false)
  readonly primaryOwnerOptions = PRIMARY_OWNER_OPTIONS
  readonly riskOptions = RISK_OPTIONS
  readonly compositionSummary = computed(() => {
    const owner = this.ownerValue()
      ? `Owner: ${this.ownerQuery()}`
      : 'Owner: not selected'
    return this.submitted()
      ? `${owner}. Launch plan captured for the sample.`
      : owner
  })

  selectOwner = (option: ResolvedAutoCompleteOption) => {
    this.submitted(false)
    this.ownerQuery(option.label)
  }

  handleSubmit = (event: SubmitEvent) => {
    event.preventDefault()
    this.submitted(true)
  }
}

function defineGuidePersonSuggestionRow() {
  return defineComponent<GuidePersonSuggestionRow>(
    guidePersonSuggestionRowTemplate,
    {
      props: ['option', 'active', 'selected', 'disabled', 'query', 'index'],
      context: (head) => {
        const option = computed(() => flatten(head.props.option ?? null))
        return {
          ...head.props,
          option,
          person: computed(() => findPersonByOption(option())),
        }
      },
    },
  )
}

function defineGuideInlineOptions() {
  return defineComponent<GuideInlineOptions>(guideInlineOptionsTemplate, {
    context: () => new GuideInlineOptions(),
  })
}

function defineGuideFormComposition() {
  return defineComponent<GuideFormComposition>(guideFormCompositionTemplate, {
    context: () => new GuideFormComposition(),
  })
}

class GuideAutoCompleteRuntime {
  readonly ownerQuery = ref('')
  readonly ownerValue = ref<string | number | null>(null)
  readonly serviceQuery = ref('')
  readonly serviceValue = ref<string | number | null>(null)
  readonly regionQuery = ref('')
  readonly regionValue = ref<string | number | null>(null)
  readonly serviceLoading = ref(false)
  readonly serviceOptions = sref<AutoCompleteOption[]>(SERVICES)
  readonly recentEvents = sref<string[]>(['Type in a field to see events.'])
  readonly peopleOptions = peopleOptions
  readonly regionOptions = REGION_OPTIONS
  readonly ownerSummary = computed(() =>
    this.resolveSummary(this.ownerQuery(), this.ownerValue()),
  )
  readonly serviceSummary = computed(() =>
    this.resolveSummary(this.serviceQuery(), this.serviceValue()),
  )
  readonly regionSummary = computed(() =>
    this.resolveSummary(this.regionQuery(), this.regionValue()),
  )
  private serviceSearchTimer: ReturnType<typeof setTimeout> | undefined

  selectOwner = (option: ResolvedAutoCompleteOption) => {
    this.pushEvent(`Owner selected: ${option.label} (${option.value})`)
  }

  selectService = (option: ResolvedAutoCompleteOption) => {
    this.pushEvent(`Service selected: ${option.label} (${option.value})`)
  }

  selectRegion = (option: ResolvedAutoCompleteOption) => {
    this.pushEvent(`Region selected: ${option.label} (${option.value})`)
  }

  recordSearch = (field: string, query: string) => {
    this.pushEvent(`${field} search: ${query || 'empty query'}`)
  }

  searchServices = (query: string) => {
    this.recordSearch('Service', query)
    if (this.serviceSearchTimer) clearTimeout(this.serviceSearchTimer)

    this.serviceLoading(true)
    this.serviceSearchTimer = setTimeout(() => {
      this.serviceSearchTimer = undefined
      const normalized = normalizeSearchText(query)
      this.serviceOptions(
        normalized
          ? SERVICES.filter((option) =>
              [option.label, option.value, option.keywords]
                .flat()
                .join(' ')
                .toLocaleLowerCase()
                .includes(normalized),
            )
          : SERVICES,
      )
      this.serviceLoading(false)
    }, 260)
  }

  unmounted = () => {
    if (this.serviceSearchTimer) clearTimeout(this.serviceSearchTimer)
  }

  private resolveSummary(query: string, value: string | number | null) {
    if (value === null) return query ? `${query} (not selected)` : 'None'
    return `${query} -> ${value}`
  }

  private pushEvent(event: string) {
    this.recentEvents([event, ...this.recentEvents()].slice(0, 5))
  }
}

function defineGuideAutoCompleteRuntime() {
  return defineComponent<GuideAutoCompleteRuntime>(
    guideAutoCompleteRuntimeTemplate,
    {
      context: () => new GuideAutoCompleteRuntime(),
    },
  )
}

function findPersonByOption(option: ResolvedAutoCompleteOption | null) {
  if (!option) return null
  return PEOPLE.find((person) => person.id === option.value) ?? null
}

function normalizeSearchText(value: string) {
  return value.trim().toLocaleLowerCase()
}

const guideComponents = {
  ...defineAutoCompleteInputComponents(),
  ...defineBadgeComponents(),
  ...defineButtonComponents(),
  ...defineFormComponents(),
  ...defineFormInputField(),
  ...defineFormSelectField(),
  ...defineGridComponents(),
  ...defineIconComponents(getSvgIcon),
  ...definePanelComponents(),
  guideAutoCompleteRuntime: defineGuideAutoCompleteRuntime(),
  guideFormComposition: defineGuideFormComposition(),
  guideInlineOptions: defineGuideInlineOptions(),
  guidePersonSuggestionRow: defineGuidePersonSuggestionRow(),
}

function mountGuideApp(
  selector: string,
  template: ReturnType<typeof html>,
  label: string,
) {
  const mount = document.querySelector(selector)
  if (!(mount instanceof HTMLElement)) {
    console.error(
      `[auto-complete-input-sample] mount element not found: expected \`${selector}\`.`,
    )
    return
  }

  createApp(
    {
      components: guideComponents,
    },
    {
      element: mount,
      template,
    },
  )
  mount.setAttribute('data-autocomplete-sample', label)
}

mountGuideApp(
  'app#auto-complete-input-runtime',
  html`<GuideAutoCompleteRuntime></GuideAutoCompleteRuntime>`,
  'runtime',
)
mountGuideApp(
  'app#auto-complete-inline-options',
  html`<GuideInlineOptions></GuideInlineOptions>`,
  'inline-options',
)
mountGuideApp(
  'app#auto-complete-form-composition',
  html`<GuideFormComposition></GuideFormComposition>`,
  'form-composition',
)
