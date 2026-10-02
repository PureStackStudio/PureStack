import {
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormInputField,
  definePanelComponents,
} from '@purestack/ts-components'
import { createApp, defineComponent, html, type Ref, ref } from 'regor'
import { mountFormAppearanceGalleries } from '../appearance'

export interface FormSubmitExample {
  releaseTitle: Ref<string>
  savedTitle: Ref<string>
  submit: (event: Event) => void
}

const formSubmitExampleTemplate = html`<Panel bodyClass="p-4">
  <AppForm @submit.prevent="submit">
    <FormInputField
      id="submit-title"
      label="Release title"
      name="release"
      :model="releaseTitle"
      :required="true"
    />
    <FormSubmit label="Save release title" tone="accent" />
    <FormStatus tone="success" :hidden="!savedTitle">
      Saved locally: {{ savedTitle }}
    </FormStatus>
  </AppForm>
</Panel>`

function createFormSubmitExample(): FormSubmitExample {
  const releaseTitle = ref('Preview release')
  const savedTitle = ref('')
  return {
    releaseTitle,
    savedTitle,
    submit: (event) => {
      const form = event.target as HTMLFormElement
      if (form.reportValidity()) savedTitle(releaseTitle())
    },
  }
}

const component = defineComponent<FormSubmitExample>(
  formSubmitExampleTemplate,
  {
    context: createFormSubmitExample,
  },
)

createApp(
  {
    components: {
      FormSubmitExample: component,

      ...defineFlexComponents(),
      ...definePanelComponents(),
      ...defineButtonComponents(),
      ...defineFormComponents(),
      ...defineFormInputField(),
    },
  },
  { selector: 'app#form-submit-demo', template: html`<FormSubmitExample />` },
)

mountFormAppearanceGalleries()
