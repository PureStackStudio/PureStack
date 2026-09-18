import {
  defineBadgeComponents,
  defineBtnGroupComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineIconComponents,
  definePanelComponents,
} from '@purestack/ts-components'
import type { SemanticTone } from '@purestack/ts-style'
import {
  iconoir_calendar,
  iconoir_check,
  iconoir_send,
  lucide_chevron_down,
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

export type ReleaseState = 'Draft' | 'Ready' | 'Scheduled' | 'Published'

export interface PublishActions {
  releaseState: Ref<ReleaseState>
  releaseTone: ComputedRef<SemanticTone>
  isPublished: ComputedRef<boolean>
  feedback: ComputedRef<string>
  publish: () => void
  choose: (state: 'Draft' | 'Ready' | 'Scheduled', event: Event) => void
  reset: () => void
}

const publishActionsTemplate = html`<Panel tone="neutral" variant="surfaceAlt" class="p-4 overflow-visible">
  <Flex direction="column" align="start" class="gap-3">
    <div>
      <div class="fs-h2 fw-700">Release notes</div>
      <p class="tone-text-muted mb-0">Keep the main action close to its publishing choices.</p>
    </div>
    <Flex wrap="true" align="center" role="status">
      <Badge :tone="releaseTone">{{ releaseState }}</Badge>
      <span>{{ feedback }}</span>
    </Flex>
    <BtnGroup :wrap="true" role="group" aria-label="Publishing actions">
      <Btn tone="accent" icon="iconoir:send" :disabled="isPublished" @click="publish">Publish now</Btn>
      <BtnGroupDropDown label="More" tone="accent" menuTone="neutral" align="start">
        <Btn variant="subtle" icon="iconoir:calendar" :disabled="isPublished" @click="choose('Scheduled', $event)">Schedule for tomorrow</Btn>
        <Btn variant="subtle" icon="iconoir:check" :disabled="isPublished" @click="choose('Ready', $event)">Mark ready</Btn>
        <Btn variant="subtle" @click="choose('Draft', $event)">Return to draft</Btn>
      </BtnGroupDropDown>
    </BtnGroup>
    <Btn variant="link" @click="reset">Reset release</Btn>
  </Flex>
</Panel>`

function createPublishActions(): PublishActions {
  const releaseState = ref<ReleaseState>('Draft')
  const isPublished = computed(() => releaseState() === 'Published')
  const releaseTone = computed<SemanticTone>(() =>
    releaseState() === 'Draft'
      ? 'neutral'
      : releaseState() === 'Scheduled'
        ? 'info'
        : 'success',
  )
  const feedback = computed<string>(
    () =>
      ({
        Draft: 'Changes stay in this example.',
        Ready: 'Reviewed and ready to publish.',
        Scheduled: 'Preview scheduled for tomorrow at 09:00.',
        Published: 'Preview release published.',
      })[releaseState()],
  )
  return {
    releaseState,
    releaseTone,
    isPublished,
    feedback,
    publish: () => releaseState('Published'),
    choose: (state, event) => {
      releaseState(state)
      const menu = (event.currentTarget as HTMLElement).closest('details')
      if (menu) {
        menu.open = false
        menu.querySelector('summary')?.focus()
      }
    },
    reset: () => releaseState('Draft'),
  }
}

const icons: Record<string, string> = {
  'lucide:chevron-down': lucide_chevron_down,
  'iconoir:send': iconoir_send,
  'iconoir:calendar': iconoir_calendar,
  'iconoir:check': iconoir_check,
}
const component = defineComponent<PublishActions>(publishActionsTemplate, {
  context: createPublishActions,
})

createApp(
  {
    components: {
      PublishActions: component,
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
  { selector: 'app#publish-actions', template: html`<PublishActions/>` },
)
