import {
  defineBadgeComponents,
  defineBtnGroupComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
} from '@purestack/ts-components'
import type { SemanticTone } from '@purestack/ts-style'
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

export interface ReleaseChecklist {
  documentation: Ref<boolean>
  tests: Ref<boolean>
  review: Ref<boolean>
  published: Ref<boolean>
  completed: ComputedRef<number>
  status: ComputedRef<string>
  tone: ComputedRef<SemanticTone>
  message: ComputedRef<string>
  publishDisabled: ComputedRef<boolean>
  publish: () => void
  reset: () => void
}

const releaseChecklistTemplate = html`<Flex direction="column" align="start">
  <fieldset class="m-0 p-3 w-full">
    <legend>Release checklist</legend>
    <Flex direction="column" align="start">
      <FormCheck id="release-documentation" label="Documentation is up to date" :checked="documentation" :disabled="published"/>
      <FormCheck id="release-tests" label="Tests are passing" :checked="tests" :disabled="published"/>
      <FormCheck id="release-review" label="Review is complete" :checked="review" :disabled="published"/>
    </Flex>
  </fieldset>
  <Flex align="center" wrap="true" role="status">
    <Badge :tone="tone">{{ status }}</Badge>
    <span>{{ message }}</span>
  </Flex>
  <BtnGroup :wrap="true" role="group" aria-label="Release actions">
    <Btn tone="accent" :disabled="publishDisabled" @click="publish">Publish preview</Btn>
    <Btn variant="surface" @click="reset">Reset checklist</Btn>
  </BtnGroup>
</Flex>`

function createReleaseChecklist(): ReleaseChecklist {
  const documentation = ref(false)
  const tests = ref(false)
  const review = ref(false)
  const published = ref(false)
  const completed = computed(
    () => Number(documentation()) + Number(tests()) + Number(review()),
  )
  const status = computed(() =>
    published() ? 'Published' : `${completed()}/3 ready`,
  )
  const tone = computed<SemanticTone>(() =>
    published() || completed() === 3 ? 'success' : 'warning',
  )
  const message = computed<string>(() =>
    published()
      ? 'Preview release published.'
      : completed() === 3
        ? 'All checks passed. Ready to publish.'
        : 'Complete every check to publish the preview.',
  )
  const publishDisabled = computed(() => completed() !== 3 || published())
  return {
    documentation,
    tests,
    review,
    published,
    completed,
    status,
    tone,
    message,
    publishDisabled,
    publish: () => {
      if (!publishDisabled()) published(true)
    },
    reset: () =>
      batch(() => {
        documentation(false)
        tests(false)
        review(false)
        published(false)
      }),
  }
}

const component = defineComponent<ReleaseChecklist>(releaseChecklistTemplate, {
  context: createReleaseChecklist,
})

createApp(
  {
    components: {
      ReleaseChecklist: component,
      ...defineBadgeComponents(),
      ...defineBtnGroupComponents(),
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineFormComponents(),
    },
  },
  { selector: 'app#release-checklist', template: html`<ReleaseChecklist/>` },
)
