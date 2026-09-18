import {
  defineContactFormComponents,
  defineFlexComponents,
  defineFormComponents,
} from '@purestack/ts-components'

import { createApp, defineComponent, html, type Ref, ref } from 'regor'

export interface ContactFormExample {
  receipt: Ref<string>
  capture: (event: Event) => void
}

const contactFormExampleTemplate = html`<Flex direction="column">
  <div @submit.prevent="capture">
    <ContactForm
      title="Tell us about your project"
      description="This preview keeps your message in this page."
      action="#"
      submitLabel="Preview message"
    />
  </div>
  <FormStatus tone="success" :hidden="!receipt">{{ receipt }}</FormStatus>
</Flex>`

function createContactFormExample(): ContactFormExample {
  const receipt = ref('')
  return {
    receipt,
    capture: (event) => {
      const form = event.target as HTMLFormElement
      if (!form.reportValidity()) return
      const data = new FormData(form)
      receipt(
        `Message preview ready for ${String(data.get('name') ?? '')}: ${String(data.get('message') ?? '')}`,
      )
    },
  }
}

const component = defineComponent<ContactFormExample>(
  contactFormExampleTemplate,
  {
    context: createContactFormExample,
  },
)

createApp(
  {
    components: {
      ContactFormExample: component,

      ...defineContactFormComponents(),
      ...defineFlexComponents(),
      ...defineFormComponents(),
    },
  },
  { selector: 'app#contact-form-demo', template: html`<ContactFormExample />` },
)
