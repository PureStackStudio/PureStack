import {
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormInputField,
  defineGridComponents,
  defineIconComponents,
  definePanelComponents,
} from '@purestack/ts-components'
import { lucide_mail } from '@purestack/ts-svg-icons'
import {
  type ComputedRef,
  computed,
  createApp,
  defineComponent,
  html,
  type Ref,
  ref,
} from 'regor'

export interface FormInputFieldExample {
  contactEmail: Ref<string>
  seats: Ref<number | string>
  locked: Ref<boolean>
  summary: ComputedRef<string>
}

const formInputFieldExampleTemplate = html`<Flex direction="column">
  <Grid columns="1" columnsSm="2">
    <FormInputField
      id="input-email"
      label="Contact email"
      name="email"
      type="email"
      autocomplete="email"
      icon="lucide:mail"
      placeholder="you@example.com"
      :model="contactEmail"
      :disabled="locked"
    />
    <FormInputField
      id="input-seats"
      label="Seats"
      type="number"
      min="1"
      step="1"
      :model="seats"
      :disabled="locked"
    />
  </Grid>
  <FormCheck id="input-lock" label="Lock fields" :checked="locked" />
  <FormStatus>{{ summary }}</FormStatus>
</Flex>`

function createFormInputFieldExample(): FormInputFieldExample {
  const contactEmail = ref('')
  const seats = ref<number | string>(3)
  const locked = ref(false)
  return {
    contactEmail,
    seats,
    locked,
    summary: computed(
      () => `${seats()} seats · ${contactEmail() || 'No email entered'}`,
    ),
  }
}

const component = defineComponent<FormInputFieldExample>(
  formInputFieldExampleTemplate,
  {
    context: createFormInputFieldExample,
  },
)
const icons: Record<string, string> = { 'lucide:mail': lucide_mail }

createApp(
  {
    components: {
      FormInputFieldExample: component,

      ...defineFlexComponents(),
      ...definePanelComponents(),
      ...defineButtonComponents(),
      ...defineFormComponents(),
      ...defineFormInputField(),
      ...defineGridComponents(),
      ...defineIconComponents((name) => icons[name] ?? ''),
    },
  },
  {
    selector: 'app#form-input-field-demo',
    template: html`<FormInputFieldExample />`,
  },
)
