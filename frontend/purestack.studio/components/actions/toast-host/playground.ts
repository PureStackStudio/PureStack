import {
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineIconComponents,
  definePanelComponents,
  defineToastComponents,
  ToastStore,
} from '@purestack/ts-components'
import { SEMANTIC_TONES, type SemanticTone } from '@purestack/ts-style'
import { iconoir_xmark } from '@purestack/ts-svg-icons'
import { createApp, defineComponent, html } from 'regor'

export interface ToastHostExample {
  notifications: ToastStore
  save: () => void
  warn: () => void
  fail: () => void
  clear: () => void
  tones: SemanticTone[]
  notifyTone: (tone: SemanticTone) => void
}

const toastHostExampleTemplate = html`<Flex direction="column">
  <ToastHost :items="notifications.items" :dismiss="notifications.dismiss" />
  <Flex wrap="true">
    <Btn tone="success" @click="save">Save local draft</Btn>
    <Btn tone="warning" variant="outline" @click="warn">Show review reminder</Btn>
    <Btn tone="danger" variant="outline" @click="fail">Show persistent error</Btn>
    <Btn variant="link" @click="clear">Clear notifications</Btn>
  </Flex>
  <p>Try every supported tone. Info and success last 5 seconds, warning lasts 10; all others stay until dismissed.</p>
  <Flex wrap="true" aria-label="All notification tones">
    <Btn r-for="tone in tones" :tone="tone" variant="surface" @click="notifyTone(tone)">{{ tone }}</Btn>
  </Flex>
  <FormStatus>{{ notifications.items.length }} active notifications</FormStatus>
</Flex>`

function createToastHostExample(): ToastHostExample {
  const notifications = new ToastStore()
  return {
    notifications,
    tones: SEMANTIC_TONES,
    notifyTone: (tone) =>
      notifications.notify(`${tone} example notification.`, tone),
    save: () => notifications.notify('Local draft saved.', 'success'),
    warn: () =>
      notifications.notify('Review the content before publishing.', 'warning'),
    fail: () =>
      notifications.notify(
        'Example build failed. Dismiss when acknowledged.',
        'danger',
      ),
    clear: notifications.clear,
  }
}

const component = defineComponent<ToastHostExample>(toastHostExampleTemplate, {
  context: createToastHostExample,
})
const icons: Record<string, string> = { 'iconoir:xmark': iconoir_xmark }

createApp(
  {
    components: {
      ToastHostExample: component,

      ...defineToastComponents(),
      ...definePanelComponents(),
      ...defineFlexComponents(),
      ...defineButtonComponents(),
      ...defineFormComponents(),
      ...defineIconComponents((name) => icons[name] ?? ''),
    },
  },
  { selector: 'app#toast-host-demo', template: html`<ToastHostExample />` },
)
