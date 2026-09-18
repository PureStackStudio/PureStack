import {
  type AutoCompleteOption,
  defineAutoCompleteInputComponents,
  defineBadgeComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormInputField,
  defineIconComponents,
  type ResolvedAutoCompleteOption,
} from '@purestack/ts-components'
import { lucide_check, lucide_chevron_down } from '@purestack/ts-svg-icons'
import {
  createApp,
  defineComponent,
  html,
  type Ref,
  type RefOrValue,
  ref,
} from 'regor'

export interface ServiceSuggestion {
  option: RefOrValue<ResolvedAutoCompleteOption | null>
  selected: RefOrValue<boolean>
}
const serviceSuggestionTemplate = html`<Flex align="center" justify="between">
  <span>
    <strong>{{ option?.label }}</strong>
    <small class="d-block">Service ID: {{ option?.value }}</small>
  </span>
  <Badge r-if="selected" tone="success">Selected</Badge>
</Flex>`
const serviceSuggestion = defineComponent<ServiceSuggestion>(
  serviceSuggestionTemplate,
  { props: ['option', 'selected'] },
)
export interface CustomSuggestions {
  serviceQuery: Ref<string>
  serviceOptions: AutoCompleteOption[]
}

const customSuggestionsTemplate = html`<AutoCompleteInput
  id="auto-service"
  label="Service"
  :model="serviceQuery"
  :options="serviceOptions"
  rowComponent="ServiceSuggestion"
  :minLength="1"
  :maxResults="3"
  placeholder="Type API or mail"
/>`

function createCustomSuggestions(): CustomSuggestions {
  return {
    serviceQuery: ref(''),
    serviceOptions: [
      { label: 'Identity API', value: 'identity', keywords: ['auth'] },
      { label: 'Mail gateway', value: 'mail', keywords: ['email'] },
      { label: 'Billing API', value: 'billing', keywords: ['invoice'] },
    ],
  }
}

const component = defineComponent<CustomSuggestions>(
  customSuggestionsTemplate,
  {
    context: createCustomSuggestions,
  },
)
const icons: Record<string, string> = {
  'lucide:check': lucide_check,
  'lucide:chevron-down': lucide_chevron_down,
}

createApp(
  {
    components: {
      CustomSuggestions: component,
      ServiceSuggestion: serviceSuggestion,
      ...defineAutoCompleteInputComponents(),
      ...defineFormInputField(),
      ...defineFlexComponents(),
      ...defineFormComponents(),
      ...defineButtonComponents(),
      ...defineBadgeComponents(),
      ...defineIconComponents((name) => icons[name] ?? ''),
    },
  },
  {
    selector: 'app#auto-custom-row-demo',
    template: html`<CustomSuggestions />`,
  },
)
