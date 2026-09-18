import {
  defineBadgeComponents,
  defineBtnGroupComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineIconComponents,
  definePanelComponents,
} from '@purestack/ts-components'
import {
  iconoir_archive,
  iconoir_mail,
  iconoir_mail_open,
  iconoir_more_horiz,
  iconoir_trash,
} from '@purestack/ts-svg-icons'
import {
  batch,
  type ComputedRef,
  computed,
  createApp,
  defineComponent,
  html,
  type Ref,
  ref,
} from 'regor'

export interface SelectionToolbar {
  selectedCount: Ref<number>
  unread: Ref<boolean>
  selectionEmpty: ComputedRef<boolean>
  readState: ComputedRef<string>
  selectionLabel: ComputedRef<string>
  message: Ref<string>
  archive: () => void
  markRead: () => void
  markUnread: (event: Event) => void
  trash: (event: Event) => void
  reset: () => void
}

const selectionToolbarTemplate = html`<Panel tone="neutral" variant="surfaceAlt" class="p-4 overflow-visible">
  <Flex direction="column" class="gap-3">
    <Flex justify="between" align="center" wrap="true" class="gap-3">
      <div>
        <div class="fw-700">{{ selectionLabel }}</div>
        <p class="fs-xs tone-text-muted mb-0">Inbox preview <Badge>{{ readState }}</Badge></p>
      </div>
      <BtnGroup align="end" :wrap="true" role="group" aria-label="Selected message actions">
        <Btn variant="outline" icon="iconoir:archive" :disabled="selectionEmpty" @click="archive">Archive</Btn>
        <Btn variant="outline" icon="iconoir:mail-open" :disabled="selectionEmpty" @click="markRead">Mark read</Btn>
        <BtnGroupDropDown icon="iconoir:more-horiz" :iconOnly="true" ariaLabel="More message actions" variant="outline" menuTone="neutral">
          <Btn variant="subtle" icon="iconoir:mail" :disabled="selectionEmpty" @click="markUnread">Mark unread</Btn>
          <Btn tone="danger" variant="subtle" icon="iconoir:trash" :disabled="selectionEmpty" @click="trash">Move to trash</Btn>
        </BtnGroupDropDown>
      </BtnGroup>
    </Flex>
    <p role="status" class="m-0">{{ message }}</p>
    <Btn variant="link" @click="reset">Reset selection</Btn>
  </Flex>
</Panel>`

function createSelectionToolbar(): SelectionToolbar {
  const selectedCount = ref(8)
  const unread = ref(true)
  const selectionEmpty = computed(() => selectedCount() === 0)
  const readState = computed<string>(() =>
    selectionEmpty() ? 'No selection' : unread() ? 'Unread' : 'Read',
  )
  const selectionLabel = computed(() => `${selectedCount()} messages selected`)
  const message = ref('Actions affect only these eight example messages.')
  const close = (event: Event) => {
    const menu = (event.currentTarget as HTMLElement).closest('details')
    if (menu) {
      menu.open = false
      menu.querySelector('summary')?.focus()
    }
  }
  return {
    selectedCount,
    unread,
    selectionEmpty,
    readState,
    selectionLabel,
    message,
    archive: () => {
      message(`Archived ${selectedCount()} messages.`)
      selectedCount(0)
    },
    markRead: () => {
      unread(false)
      message(`Marked ${selectedCount()} messages as read.`)
    },
    markUnread: (event) => {
      unread(true)
      message(`Marked ${selectedCount()} messages as unread.`)
      close(event)
    },
    trash: (event) => {
      message(`Moved ${selectedCount()} messages to trash.`)
      selectedCount(0)
      close(event)
    },
    reset: () =>
      batch(() => {
        selectedCount(8)
        unread(true)
        message('Actions affect only these eight example messages.')
      }),
  }
}

const icons: Record<string, string> = {
  'iconoir:archive': iconoir_archive,
  'iconoir:mail-open': iconoir_mail_open,
  'iconoir:mail': iconoir_mail,
  'iconoir:more-horiz': iconoir_more_horiz,
  'iconoir:trash': iconoir_trash,
}
const component = defineComponent<SelectionToolbar>(selectionToolbarTemplate, {
  context: createSelectionToolbar,
})

createApp(
  {
    components: {
      SelectionToolbar: component,
      ...defineBadgeComponents(),
      ...defineBtnGroupComponents(),
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...definePanelComponents(),
      ...defineIconComponents((name) => {
        if (!icons[name]) throw new Error(`Icon is not registered: ${name}`)
        return icons[name]
      }),
    },
  },
  {
    selector: 'app#selection-toolbar-demo',
    template: html`<SelectionToolbar/>`,
  },
)
