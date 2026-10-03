import {
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormInputField,
  definePanelComponents,
} from '@purestack/ts-components'
import { batch, computed, createApp, defineComponent, html, ref } from 'regor'

const reviewTemplate = html`<Panel variant="surface" tone="neutral" bodyClass="p-3">
  <Flex direction="column" align="stretch">
    <div><p class="text-eyebrow m-0">INDEPENDENT BROWSER APP</p><h3 class="fs-h4 my-2">{{ title }}</h3></div>
    <FormStatus :tone="completed >= target ? 'success' : 'info'" aria-live="polite">{{ completed }} of {{ target }} tasks complete · {{ completed >= target ? 'Ready for review' : 'Work in progress' }}</FormStatus>
    <progress class="w-full" :value="completed" :max="target" :aria-label="title + ': ' + completed + ' of ' + target + ' complete'"></progress>
    <FormInputField :id="prefix + '-goal'" label="Review goal" type="number" min="1" max="12" :model="goal" :disabled="locked"/>
    <FormInputField :id="prefix + '-note'" label="Review note" placeholder="Add context for this review" :model="note" :disabled="locked"/>
    <p class="m-0">{{ note || 'No review note yet.' }}</p>
    <FormCheck :id="prefix + '-locked'" label="Pause changes" :checked="locked"/>
    <Flex wrap="true" class="gap-2">
      <Btn tone="accent" @click="complete" :disabled="locked || completed >= target">Complete a task</Btn>
      <Btn variant="outline" @click="undo" :disabled="locked || completed === 0">Undo task</Btn>
      <Btn tone="neutral" variant="subtleBtn" @click="reset">Reset review</Btn>
    </Flex>
  </Flex>
</Panel>`

// One module may serve several mounts. Each createApp call owns fresh refs.
for (const mount of document.querySelectorAll<HTMLElement>(
  'app[data-review-counter]',
)) {
  createApp(
    {
      components: {
        ReviewCounter: defineComponent(reviewTemplate, {
          context: () => {
            const completed = ref(0)
            const goal = ref('5')
            const note = ref('')
            const locked = ref(false)
            const target = computed(() =>
              Math.max(1, Math.min(12, Math.floor(Number(goal()) || 5))),
            )
            return {
              prefix: mount.id,
              title: mount.dataset.reviewCounter || 'Release review',
              completed,
              goal,
              note,
              locked,
              target,
              complete: () => {
                if (!locked() && completed() < target())
                  completed(completed() + 1)
              },
              undo: () => {
                if (!locked() && completed() > 0) completed(completed() - 1)
              },
              reset: () =>
                batch(() => {
                  completed(0)
                  goal('5')
                  note('')
                  locked(false)
                }),
            }
          },
        }),
        ...defineFlexComponents(),
        ...definePanelComponents(),
        ...defineButtonComponents(),
        ...defineFormComponents(),
        ...defineFormInputField(),
      },
    },
    { element: mount, template: html`<ReviewCounter/>` },
  )
}
