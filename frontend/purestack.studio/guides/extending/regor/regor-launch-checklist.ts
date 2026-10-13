import {
  defineBadgeComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineIconComponents,
  definePanelComponents,
} from '@purestack/ts-components'
import { tabler_rocket } from '@purestack/ts-svg-icons'
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

export interface Task {
  id: string
  title: string
  done: Ref<boolean>
}

export interface TaskRow {
  task: Task
}

const taskRow = defineComponent<TaskRow>(
  html`<FormCheck :id="'launch-' + task.id" :label="task.title" :checked="task.done" />`,
  { props: ['task'] },
)

export interface LaunchChecklist {
  tasks: Task[]
  completed: ComputedRef<number>
  ready: ComputedRef<boolean>
  launched: Ref<boolean>
  launch: () => void
  reset: () => void
}

const launchChecklistTemplate = html`<Panel tone="neutral" variant="surfaceAlt" bodyClass="p-3">
  <Flex direction="column">
    <Flex justify="between" align="center" wrap="true">
      <strong>Launch checklist</strong>
      <Badge :tone="ready ? 'success' : 'warning'" variant="surface">
        {{ completed }} of {{ tasks.length }} done
      </Badge>
    </Flex>
    <TaskRow r-for="task in tasks" :task="task" />
    <Flex wrap="true">
      <Btn tone="accent" icon="tabler:rocket" :disabled="!ready || launched" @click="launch">Launch</Btn>
      <Btn tone="neutral" variant="surface" @click="reset">Start over</Btn>
    </Flex>
    <FormStatus r-if="launched" role="status">Launched. Every check passed.</FormStatus>
  </Flex>
</Panel>`

function createLaunchChecklist(): LaunchChecklist {
  const tasks: Task[] = [
    { id: 'docs', title: 'Docs reviewed', done: ref(true) },
    { id: 'tests', title: 'Tests passing', done: ref(false) },
    { id: 'notes', title: 'Release notes written', done: ref(false) },
  ]
  const launched = ref(false)
  const completed = computed(() => tasks.filter((task) => task.done()).length)
  const ready = computed(() => completed() === tasks.length)
  return {
    tasks,
    completed,
    ready,
    launched,
    launch: () => launched(true),
    reset: () =>
      batch(() => {
        for (const task of tasks) task.done(false)
        launched(false)
      }),
  }
}

createApp(
  {
    components: {
      LaunchChecklist: defineComponent<LaunchChecklist>(
        launchChecklistTemplate,
        { context: createLaunchChecklist },
      ),
      TaskRow: taskRow,
      ...defineBadgeComponents(),
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineFormComponents(),
      ...defineIconComponents((name) =>
        name === 'tabler:rocket' ? tabler_rocket : '',
      ),
      ...definePanelComponents(),
    },
  },
  { selector: 'app#launch-checklist', template: html`<LaunchChecklist />` },
)
