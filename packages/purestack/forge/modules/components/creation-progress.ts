import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type SRef,
} from 'regor'
import type { CreationTask } from '../shared/protocol'

export interface CreationProgress {
  tasks: SRef<CreationTask[]>
  completed?: ComputedRef<number>
  currentLabel?: ComputedRef<string>
}

const creationProgressTemplate = html`<Flex direction="column" class="gap-4" aria-label="Site creation progress">
  <Flex align="center" class="gap-3">
    <span class="forge-progress-spinner" aria-hidden="true"></span>
    <div role="status" aria-live="polite">
      <strong>{{ currentLabel }}</strong>
      <p class="text-subtle fs-xs mt-2 mb-0">
        {{ completed }} of {{ tasks.length }} steps finished
      </p>
    </div>
  </Flex>
  <progress
    class="forge-progress-meter"
    :value="completed"
    :max="tasks.length || 1"
    aria-label="Completed setup steps"
  ></progress>
  <ol class="forge-task-list m-0 p-0">
    <li r-for="task in tasks" :data-state="task.state" class="py-3">
      <span class="forge-task-marker" aria-hidden="true"
        >{{ task.state === 'done' ? '✓' : task.state === 'failed' ? '×' : '○' }}</span>
      <span>{{ task.label }}</span><span class="text-subtle fs-xs">{{ task.state === 'running' ? 'In progress' : task.state === 'done' ? 'Complete' : task.state === 'failed' ? 'Needs attention' : 'Waiting' }}</span>
    </li>
  </ol>
</Flex>`

export function defineCreationProgressComponent() {
  return defineComponent<CreationProgress>(creationProgressTemplate, {
    props: ['tasks'],
    context: (head) => ({
      tasks: head.props.tasks,
      completed: computed(
        () =>
          head.props
            .tasks()
            .filter((task) => task.state === 'done' || task.state === 'failed')
            .length,
      ),
      currentLabel: computed(
        () =>
          head.props.tasks().find((task) => task.state === 'running')?.label ??
          'Preparing your workspace…',
      ),
    }),
  })
}
