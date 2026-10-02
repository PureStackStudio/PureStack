import {
  defineFlexComponents,
  defineFormComponents,
} from '@purestack/ts-components'
import { createApp, defineComponent, html, type Ref, ref } from 'regor'
import { mountFormAppearanceGalleries } from '../appearance'

export interface FormCheckExample {
  emailUpdates: Ref<boolean>
  productUpdates: Ref<boolean>
}

const formCheckExampleTemplate = html`<Flex direction="column">
  <fieldset class="p-3 m-0">
    <legend>Notification preferences</legend>
    <Flex direction="column" align="start">
      <FormCheck
        id="check-email"
        name="updates"
        value="email"
        label="Email summaries"
        :checked="emailUpdates"
      />
      <FormCheck
        id="check-product"
        name="updates"
        value="product"
        label="Product updates"
        :checked="productUpdates"
      />
      <FormCheck
        id="check-security"
        label="Security alerts · required"
        :checked="true"
        :disabled="true"
      />
    </Flex>
  </fieldset>
  <FormStatus>
    Email summaries: {{ emailUpdates ? 'On' : 'Off' }} · Product updates: {{
    productUpdates ? 'On' : 'Off' }}
  </FormStatus>
</Flex>`

function createFormCheckExample(): FormCheckExample {
  return { emailUpdates: ref(true), productUpdates: ref(false) }
}

const component = defineComponent<FormCheckExample>(formCheckExampleTemplate, {
  context: createFormCheckExample,
})

createApp(
  {
    components: {
      FormCheckExample: component,

      ...defineFlexComponents(),
      ...defineFormComponents(),
    },
  },
  { selector: 'app#form-check-demo', template: html`<FormCheckExample />` },
)

mountFormAppearanceGalleries()
