import {
  defineButtonComponents,
  defineFlexComponents,
  defineFormInputField,
} from '@purestack/ts-components'
import { createApp, defineComponent, html, type Ref, ref } from 'regor'

export interface ProjectForm {
  project: Ref<string>
  message: Ref<string>
  submit: () => void
  resetForm: () => void
}

const projectFormTemplate = html`<Flex
  container="form"
  direction="column"
  @submit.prevent="submit"
  @reset.prevent="resetForm"
>
  <FormInputField
    id="demo-project-name"
    label="Project name"
    :model="project"
    name="project"
    :required="true"/>
  <Flex wrap="true">
    <Btn type="submit" tone="accent">Save project</Btn>
    <Btn type="reset" variant="surface" tone="neutral">Reset</Btn>
  </Flex>
  <p class="m-0" role="status">{{ message }}</p>
</Flex>`

function createProjectForm(): ProjectForm {
  const project = ref('My next idea')
  const message = ref('Changes stay in this demo.')
  return {
    project,
    message,
    submit: () => message(`Saved “${project()}”.`),
    resetForm: () => {
      project('My next idea')
      message('Form reset.')
    },
  }
}

const component = defineComponent<ProjectForm>(projectFormTemplate, {
  context: createProjectForm,
})

createApp(
  {
    components: {
      ProjectForm: component,
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineFormInputField(),
    },
  },
  {
    selector: 'app#project-form',
    template: html`<ProjectForm/>`,
  },
)
