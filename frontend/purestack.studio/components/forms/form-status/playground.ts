import {
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
} from '@purestack/ts-components'
import type { SemanticTone } from '@purestack/ts-style'
import { createApp, defineComponent, html, type Ref, ref } from 'regor'

export interface FormStatusExample {
  statusMessage: Ref<string>
  statusTone: Ref<SemanticTone>
  showSuccess: () => void
  showError: () => void
  clear: () => void
}

const formStatusExampleTemplate = html`<Flex direction="column">
  <Flex wrap="true">
    <Btn tone="success" @click="showSuccess">Save local draft</Btn>
    <Btn tone="danger" variant="outline" @click="showError">
      Show validation error
    </Btn>
    <Btn variant="link" @click="clear">Clear message</Btn>
  </Flex>
  <FormStatus :tone="statusTone" :hidden="!statusMessage">
    {{ statusMessage }}
  </FormStatus>
</Flex>`

function createFormStatusExample(): FormStatusExample {
  const statusMessage = ref('Choose an action to see its feedback.')
  const statusTone = ref<SemanticTone>('info')
  return {
    statusMessage,
    statusTone,
    showSuccess: () => {
      statusTone('success')
      statusMessage('Draft saved in this example.')
    },
    showError: () => {
      statusTone('danger')
      statusMessage('Enter a project name before continuing.')
    },
    clear: () => statusMessage(''),
  }
}

const component = defineComponent<FormStatusExample>(
  formStatusExampleTemplate,
  {
    context: createFormStatusExample,
  },
)

createApp(
  {
    components: {
      FormStatusExample: component,

      ...defineFlexComponents(),
      ...defineButtonComponents(),
      ...defineFormComponents(),
    },
  },
  { selector: 'app#form-status-demo', template: html`<FormStatusExample />` },
)
