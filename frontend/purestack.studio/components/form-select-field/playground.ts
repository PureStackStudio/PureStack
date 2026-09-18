import {
  defineFlexComponents,
  defineFormComponents,
  defineFormSelectField,
  defineIconComponents,
  type FormSelectOption,
  type FormSelectValue,
} from '@purestack/ts-components'
import { lucide_chevron_down } from '@purestack/ts-svg-icons'
import { createApp, defineComponent, html, type Ref, ref } from 'regor'

export interface FormSelectFieldExample {
  regionValue: Ref<FormSelectValue>
  regionOptions: FormSelectOption[]
  locked: Ref<boolean>
}

const formSelectFieldExampleTemplate = html`<Flex direction="column">
  <FormSelectField
    id="select-region"
    label="Deployment region"
    name="region"
    placeholder="Choose a region"
    :model="regionValue"
    :options="regionOptions"
    :disabled="locked"
  />
  <FormCheck id="select-lock" label="Lock selection" :checked="locked" />
  <FormStatus>Selected region: {{ regionValue || 'None' }}</FormStatus>
</Flex>`

function createFormSelectFieldExample(): FormSelectFieldExample {
  return {
    regionValue: ref<FormSelectValue>(''),
    locked: ref(false),
    regionOptions: [
      { label: 'Europe Central', value: 'eu-central' },
      { label: 'US East', value: 'us-east' },
      { label: 'Asia Pacific · unavailable', value: 'apac', disabled: true },
    ],
  }
}

const component = defineComponent<FormSelectFieldExample>(
  formSelectFieldExampleTemplate,
  {
    context: createFormSelectFieldExample,
  },
)
const icons: Record<string, string> = {
  'lucide:chevron-down': lucide_chevron_down,
}

createApp(
  {
    components: {
      FormSelectFieldExample: component,

      ...defineFlexComponents(),
      ...defineFormSelectField(),
      ...defineFormComponents(),
      ...defineIconComponents((name) => icons[name] ?? ''),
    },
  },
  {
    selector: 'app#form-select-field-demo',
    template: html`<FormSelectFieldExample />`,
  },
)
