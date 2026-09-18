import {
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
} from '@purestack/ts-components'

import { createApp, defineComponent, html, type Ref, ref } from 'regor'

export interface RegorAppExample {
  completed: Ref<number>
  addTask: () => void
  reset: () => void
}

const regorAppExampleTemplate = html`<Flex direction="column">
  <FormStatus>{{ completed }} review tasks completed</FormStatus>
  <Flex wrap="true">
    <Btn tone="accent" @click="addTask">Complete a task</Btn>
    <Btn variant="outline" @click="reset">Reset review</Btn>
  </Flex>
</Flex>`

function createRegorAppExample(): RegorAppExample {
  const completed = ref(0)
  return {
    completed,
    addTask: () => completed(completed() + 1),
    reset: () => completed(0),
  }
}

const component = defineComponent<RegorAppExample>(regorAppExampleTemplate, {
  context: createRegorAppExample,
})

createApp(
  {
    components: {
      RegorAppExample: component,

      ...defineFlexComponents(),
      ...defineButtonComponents(),
      ...defineFormComponents(),
    },
  },
  { selector: 'app#regor-app-demo', template: html`<RegorAppExample />` },
)
