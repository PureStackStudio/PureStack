import {
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormInputField,
  definePanelComponents,
} from '@purestack/ts-components'
import { createApp, defineComponent, html, type Ref, ref } from 'regor'
import { mountFormAppearanceGalleries } from '../appearance'

export interface AppFormExample {
  projectName: Ref<string>
  savedProject: Ref<string>
  save: (event: Event) => void
  reset: () => void
}

const appFormExampleTemplate = html`<Panel bodyClass="p-4">
  <AppForm @submit.prevent="save" @reset.prevent="reset">
    <FormInputField
      id="app-form-project"
      name="project"
      label="Project name"
      :model="projectName"
      :required="true"
      minlength="3"
    />
    <FormMeta>
      <FormSubmit label="Save project" tone="accent" />
      <Btn type="reset" variant="outline">Reset</Btn>
    </FormMeta>
    <FormStatus tone="success" :hidden="!savedProject">
      Saved locally: {{ savedProject }}
    </FormStatus>
  </AppForm>
</Panel>`

function createAppFormExample(): AppFormExample {
  const projectName = ref('Studio docs')
  const savedProject = ref('')
  return {
    projectName,
    savedProject,
    save: (event) => {
      const form = event.target as HTMLFormElement
      if (!form.reportValidity()) return
      savedProject(String(new FormData(form).get('project') ?? ''))
    },
    reset: () => {
      projectName('Studio docs')
      savedProject('')
    },
  }
}

const component = defineComponent<AppFormExample>(appFormExampleTemplate, {
  context: createAppFormExample,
})

createApp(
  {
    components: {
      AppFormExample: component,

      ...defineFlexComponents(),
      ...definePanelComponents(),
      ...defineButtonComponents(),
      ...defineFormComponents(),
      ...defineFormInputField(),
    },
  },
  { selector: 'app#app-form-demo', template: html`<AppFormExample />` },
)

mountFormAppearanceGalleries()
