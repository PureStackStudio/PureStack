import {
  createComposerBodyHtml,
  defineBadgeComponents,
  defineButtonComponents,
  defineComposerComponents,
  defineFlexComponents,
  defineFormComponents,
  defineIconComponents,
  definePanelComponents,
} from '@purestack/ts-components'
import {
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
import {
  type ComputedRef,
  computed,
  createApp,
  defineComponent,
  html,
  type Ref,
  ref,
} from 'regor'

export interface ComposerDraftWorkflow {
  messageHtml: Ref<string>
  messageText: Ref<string>
  savedHtml: Ref<string>
  savedText: Ref<string>
  editing: Ref<boolean>
  dirty: ComputedRef<boolean>
  status: Ref<string>
  open: () => void
  save: () => void
  restore: () => void
}

const composerDraftWorkflowTemplate = html`<Flex direction="column">
  <Flex justify="between" align="center" wrap="true">
    <div>
      <p class="text-eyebrow m-0">Draft workspace</p>
      <p class="mb-0">Open the editor, make a change, then save or restore the draft.</p>
    </div>
    <Badge :tone="dirty ? 'warning' : 'success'" variant="surface">{{ dirty ? 'Unsaved changes' : 'Saved snapshot' }}</Badge>
  </Flex>
  <Btn r-if="!editing" tone="accent" variant="surface" @click="open">Open draft editor</Btn>
  <Composer r-if="editing" id="composer-draft-editor" label="Team update"
    placeholder="Write a team update" :html="messageHtml" :text="messageText"
    :focusOnMount="true" minHeight="14rem"/>
  <Flex r-if="editing" wrap="true">
    <Btn tone="accent" :disabled="!dirty || !messageText.trim()" @click="save">Save snapshot</Btn>
    <Btn variant="outline" :disabled="!dirty" @click="restore">Restore snapshot</Btn>
    <Btn variant="link" @click="editing = false">Close editor</Btn>
  </Flex>
  <FormStatus role="status">{{ status }}</FormStatus>
  <Panel variant="surfaceAlt" bodyClass="p-3 min-w-0">
    <p class="text-eyebrow mt-0">Saved plain-text copy</p>
    <p id="composer-saved-text" class="ws-pre-wrap mb-0">{{ savedText }}</p>
  </Panel>
  <p class="text-muted m-0">The snapshot stays in this example's memory. Reloading the page resets it.</p>
</Flex>`

function createComposerDraftWorkflow(): ComposerDraftWorkflow {
  const initial = createComposerBodyHtml(
    '<p>The preview is ready for review.</p><p>Next: test the keyboard flow and share your notes.</p>',
  )
  const messageHtml = ref(initial)
  const messageText = ref('')
  const savedHtml = ref(initial)
  const savedText = ref(
    'The preview is ready for review.\nNext: test the keyboard flow and share your notes.',
  )
  const editing = ref(false)
  const status = ref(
    'Open the editor to continue. Focus moves to the start of the draft.',
  )
  return {
    messageHtml,
    messageText,
    savedHtml,
    savedText,
    editing,
    status,
    dirty: computed(() => messageHtml() !== savedHtml()),
    open: () => {
      editing(true)
      status('Editing. Save captures both HTML and plain text.')
    },
    save: () => {
      if (!messageText().trim()) return
      savedHtml(messageHtml())
      savedText(messageText())
      status('Snapshot saved. You can keep editing or close the editor.')
    },
    restore: () => {
      messageHtml(savedHtml())
      status('Restored the saved snapshot.')
    },
  }
}

const composerDraftWorkflow = defineComponent<ComposerDraftWorkflow>(
  composerDraftWorkflowTemplate,
  {
    context: createComposerDraftWorkflow,
  },
)
const icons: Record<string, string> = {
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
      ComposerDraftWorkflow: composerDraftWorkflow,
      ...defineComposerComponents(),
      ...defineBadgeComponents(),
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineFormComponents(),
      ...definePanelComponents(),
      ...defineIconComponents((name) => icons[name] ?? ''),
    },
  },
  {
    selector: 'app#composer-draft-demo',
    template: html`<ComposerDraftWorkflow/>`,
  },
)
