import {
  defineBadgeComponents,
  defineButtonComponents,
  defineComposerComponents,
  defineExpandablePanelComponents,
  defineFlexComponents,
  defineFormComponents,
  defineIconComponents,
  definePanelComponents,
} from '@purestack/ts-components'
import {
  iconoir_nav_arrow_down,
  lucide_bold,
  lucide_code,
  lucide_eraser,
  lucide_italic,
  lucide_link,
  lucide_list,
  lucide_list_ordered,
  lucide_underline,
  tabler_align_center,
  tabler_align_left,
  tabler_align_right,
} from '@purestack/ts-svg-icons'
import { createApp, defineComponent, html, type Ref, ref } from 'regor'

export interface ComposerExample {
  messageHtml: Ref<string>
  messageText: Ref<string>
  locked: Ref<boolean>
  reset: () => void
}

const composerExampleTemplate = html`<Flex direction="column">
  <Composer
    label="Release note"
    placeholder="Write a short update"
    :html="messageHtml"
    :text="messageText"
    :disabled="locked"
    minHeight="12rem"
  />
  <Flex wrap="true">
    <FormCheck id="composer-lock" label="Read-only preview" :checked="locked" />
    <Btn variant="link" @click="reset">Restore draft</Btn>
  </Flex>
  <Panel variant="outline" bodyClass="p-3">
    <strong>Plain-text output</strong>
    <p class="ws-pre-wrap">{{ messageText || 'No content' }}</p>
  </Panel>
  <ExpandablePanel title="Current HTML value">
    <pre class="overflow-x-auto"><code>{{ messageHtml }}</code></pre>
  </ExpandablePanel>
</Flex>`

function createComposerExample(): ComposerExample {
  const initial =
    '<p><strong>Preview release</strong></p><p>The component guides are ready for review.</p>'
  const messageHtml = ref(initial)
  return {
    messageHtml,
    messageText: ref(''),
    locked: ref(false),
    reset: () => messageHtml(initial),
  }
}

const component = defineComponent<ComposerExample>(composerExampleTemplate, {
  context: createComposerExample,
})
const icons: Record<string, string> = {
  'iconoir:nav-arrow-down': iconoir_nav_arrow_down,
  'lucide:bold': lucide_bold,
  'lucide:italic': lucide_italic,
  'lucide:underline': lucide_underline,
  'tabler:align-left': tabler_align_left,
  'tabler:align-center': tabler_align_center,
  'tabler:align-right': tabler_align_right,
  'lucide:list': lucide_list,
  'lucide:list-ordered': lucide_list_ordered,
  'lucide:link': lucide_link,
  'lucide:eraser': lucide_eraser,
  'lucide:code': lucide_code,
}

createApp(
  {
    components: {
      ComposerExample: component,

      ...defineComposerComponents(),
      ...defineExpandablePanelComponents(),
      ...defineBadgeComponents(),
      ...defineFlexComponents(),
      ...defineFormComponents(),
      ...defineButtonComponents(),
      ...definePanelComponents(),
      ...defineIconComponents((name) => icons[name] ?? ''),
    },
  },
  { selector: 'app#composer-demo', template: html`<ComposerExample />` },
)
