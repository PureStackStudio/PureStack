import {
  type AutoCompleteOption,
  type AutoCompleteValue,
  defineAutoCompleteInputComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormInputField,
  defineIconComponents,
} from '@purestack/ts-components'
import { lucide_check, lucide_chevron_down } from '@purestack/ts-svg-icons'
import { createApp, defineComponent, html, type Ref, ref } from 'regor'

export interface AutoCompleteInputExample {
  searchQuery: Ref<string>
  chosenRegion: Ref<AutoCompleteValue | null>
  regionOptions: AutoCompleteOption[]
  pending: Ref<boolean>
  locked: Ref<boolean>
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
    emptyText="No matching region"
  />
  <Flex wrap="true">
    <FormCheck id="auto-loading" label="Loading state" :checked="pending" />
    <FormCheck id="auto-disabled" label="Disabled state" :checked="locked" />
    <Btn variant="link" @click="reset">Clear selection</Btn>
  </Flex>
  <FormStatus>
    Query: {{ searchQuery || 'Empty' }} · Selected value: {{ chosenRegion ?? 'None'
    }}
  </FormStatus>
</Flex>`

function createAutoCompleteInputExample(): AutoCompleteInputExample {
  const searchQuery = ref('')
  const chosenRegion = ref<AutoCompleteValue | null>(null)
  return {
    searchQuery,
    chosenRegion,
    pending: ref(false),
    locked: ref(false),
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
