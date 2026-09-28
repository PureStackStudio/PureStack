import {
  defineBadgeComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  definePanelComponents,
  defineVirtualListComponents,
} from '@purestack/ts-components'
import {
  batch,
  type ComputedRef,
  computed,
  createApp,
  defineComponent,
  html,
  observe,
  onUnmounted,
  type Ref,
  type RefOrValue,
  ref,
} from 'regor'

export interface ReviewTask {
  id: number
  title: string
  reviewed: Ref<boolean>
}

export interface ReviewTaskRow {
  item: RefOrValue<ReviewTask>
  index: RefOrValue<number>
}

const reviewTaskRowTemplate = html`<Flex
  align="center" class="px-3 bb-1 b-subtle"
  style="height: 100%; box-sizing: border-box; overflow: hidden"
  role="listitem" :aria-posinset="index + 1"
>
  <FormCheck :id="'review-task-' + item.id" :label="item.title" :checked="item.reviewed" />
</Flex>`

const reviewTaskRow = defineComponent<ReviewTaskRow>(reviewTaskRowTemplate, {
  props: ['item', 'index'],
})

export interface PersistentStateExample {
  tasks: ReviewTask[]
  visible: ComputedRef<ReviewTask[]>
  reviewedCount: ComputedRef<number>
  reviewedOnly: Ref<boolean>
  first: () => void
  last: () => void
  clear: () => void
}

const persistentStateTemplate = html`<Panel variant="surfaceAlt" bodyClass="p-3 min-w-0">
  <Flex direction="column">
    <Flex justify="between" align="center" wrap="true">
      <h3 class="m-0">Review checklist</h3>
      <Badge tone="success" variant="surface">{{ reviewedCount }} / {{ tasks.length }} reviewed</Badge>
    </Flex>
    <p class="m-0">Check a task, jump to the last row, then return to the first. Your selection survives the row being removed and mounted again.</p>
    <Flex wrap="true">
      <Btn variant="outline" :disabled="!visible.length" @click="first">First task</Btn>
      <Btn variant="outline" :disabled="!visible.length" @click="last">Last task</Btn>
      <Btn variant="outline" :disabled="!reviewedCount" @click="clear">Clear selections</Btn>
    </Flex>
    <FormCheck id="reviewed-only" label="Show reviewed only" :checked="reviewedOnly" />
    <VirtualList
      id="review-viewport" :items="visible" height="240" itemHeight="48" overscan="3"
      rowComponent="ReviewTaskRow" role="list" tabindex="0" aria-label="Review tasks"
      class="b-1 b-subtle rounded-md"
    />
    <FormStatus r-if="!visible.length" role="status">No reviewed tasks yet. Turn off the filter to select a task.</FormStatus>
  </Flex>
</Panel>`

function createPersistentStateExample(): PersistentStateExample {
  const tasks = Array.from({ length: 200 }, (_, index) => ({
    id: index + 1,
    title: `Review task ${index + 1}`,
    reviewed: ref(false),
  }))
  const reviewedOnly = ref(false)
  const visible = computed(() =>
    reviewedOnly() ? tasks.filter((task) => task.reviewed()) : tasks,
  )
  const scrollTo = (position: number) => {
    const viewport = document.querySelector<HTMLElement>('#review-viewport')
    if (!viewport) return
    viewport.scrollTop = Math.max(0, position) * 48
    viewport.dispatchEvent(new Event('scroll'))
  }
  const stop = observe(visible, () => scrollTo(0))
  onUnmounted(stop)
  return {
    tasks,
    visible,
    reviewedOnly,
    reviewedCount: computed(
      () => tasks.filter((task) => task.reviewed()).length,
    ),
    first: () => scrollTo(0),
    last: () => scrollTo(visible().length - 1),
    clear: () =>
      batch(() => {
        for (const task of tasks) task.reviewed(false)
      }),
  }
}

const persistentStateExample = defineComponent<PersistentStateExample>(
  persistentStateTemplate,
  { context: createPersistentStateExample },
)

createApp(
  {
    components: {
      PersistentStateExample: persistentStateExample,
      ReviewTaskRow: reviewTaskRow,
      ...defineBadgeComponents(),
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineFormComponents(),
      ...definePanelComponents(),
      ...defineVirtualListComponents(),
    },
  },
  {
    selector: 'app#virtual-list-state-demo',
    template: html`<PersistentStateExample />`,
  },
)
