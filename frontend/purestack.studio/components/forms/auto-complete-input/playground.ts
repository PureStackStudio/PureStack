import {
  type AutoCompleteOption,
  type AutoCompleteValue,
  defineAutoCompleteInputComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormInputField,
  defineIconComponents,
  type ResolvedAutoCompleteOption,
} from '@purestack/ts-components'
import {
  lucide_check,
  lucide_chevron_down,
  lucide_loader_circle,
} from '@purestack/ts-svg-icons'
import { createApp, defineComponent, html, type Ref, ref } from 'regor'
import { mountFormAppearanceGalleries } from '../appearance'

export interface AutoCompleteInputExample {
  searchQuery: Ref<string>
  chosenRegion: Ref<AutoCompleteValue | null>
  regionOptions: AutoCompleteOption[]
  pending: Ref<boolean>
  locked: Ref<boolean>
  minimum: Ref<number>
  limit: Ref<number>
  focusOpens: Ref<boolean>
  activity: Ref<string>
  searchActivity: Ref<string>
  searched: (query: string) => void
  selected: (option: ResolvedAutoCompleteOption) => void
  reset: () => void
}

const autoCompleteInputExampleTemplate = html`<Flex direction="column">
  <AutoCompleteInput
    id="auto-region"
    label="Deployment region"
    placeholder="Try Europe or Frankfurt"
    :model="searchQuery"
    :selectedValue="chosenRegion"
    :options="regionOptions"
    :loading="pending"
    :disabled="locked"
    :minLength="minimum"
    :maxResults="limit"
    :openOnFocus="focusOpens"
    :context="{ onSearch: searched, onSelect: selected }"
    emptyText="No matching region"
  />
  <Flex wrap="true">
    <FormInputField id="auto-minimum" label="Minimum query length" type="number" min="0" :model="minimum" />
    <FormInputField id="auto-limit" label="Maximum results" type="number" min="1" :model="limit" />
  </Flex>
  <Flex wrap="true">
    <FormCheck id="auto-focus" label="Open on focus" :checked="focusOpens" />
    <FormCheck id="auto-loading" label="Loading state" :checked="pending" />
    <FormCheck id="auto-disabled" label="Disabled state" :checked="locked" />
    <Btn variant="link" @click="reset">Clear selection</Btn>
  </Flex>
  <FormStatus>
    Query: {{ searchQuery || 'Empty' }} · Selected value: {{ chosenRegion ?? 'None'
    }}
  </FormStatus>
  <p class="text-muted">onSearch: {{ searchActivity || '(empty query)' }}</p>
  <p class="text-muted">{{ activity }}</p>
</Flex>`

function createAutoCompleteInputExample(): AutoCompleteInputExample {
  const searchQuery = ref('')
  const chosenRegion = ref<AutoCompleteValue | null>(null)
  const activity = ref('Select a region to inspect onSelect.')
  const searchActivity = ref('')
  return {
    searchQuery,
    chosenRegion,
    pending: ref(false),
    locked: ref(false),
    minimum: ref(0),
    limit: ref(3),
    focusOpens: ref(true),
    activity,
    searchActivity,
    searched: (query) => searchActivity(query),
    selected: (option) =>
      activity(`onSelect: ${option.label} → ${option.value}`),
    regionOptions: [
      { label: 'Europe Central', value: 'eu-central', keywords: ['Frankfurt'] },
      { label: 'US East', value: 'us-east', keywords: ['Virginia'] },
      { label: 'Asia Pacific', value: 'apac', keywords: ['Singapore'] },
      {
        label: 'Private region · unavailable',
        value: 'private',
        disabled: true,
      },
    ],
    reset: () => {
      searchQuery('')
      chosenRegion(null)
    },
  }
}

const component = defineComponent<AutoCompleteInputExample>(
  autoCompleteInputExampleTemplate,
  {
    context: createAutoCompleteInputExample,
  },
)
const icons: Record<string, string> = {
  'lucide:loader-circle': lucide_loader_circle,
  'lucide:check': lucide_check,
  'lucide:chevron-down': lucide_chevron_down,
}

createApp(
  {
    components: {
      AutoCompleteInputExample: component,

      ...defineAutoCompleteInputComponents(),
      ...defineFormInputField(),
      ...defineFlexComponents(),
      ...defineFormComponents(),
      ...defineButtonComponents(),
      ...defineIconComponents((name) => icons[name] ?? ''),
    },
  },
  {
    selector: 'app#auto-complete-input-demo',
    template: html`<AutoCompleteInputExample />`,
  },
)

mountFormAppearanceGalleries()
