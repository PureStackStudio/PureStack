import { computed, defineComponent, html, sref } from 'regor'

export class LaunchChecklist {
  readonly steps = [
    {
      title: 'Make the name and identity yours.',
      detail: 'Set your title, logo, and palette in siteConfig.json.',
    },
    {
      title: 'Say what you do and who it helps.',
      detail:
        'Replace the home page headline and introduction with your message.',
    },
    {
      title: 'Tell your story with real details.',
      detail:
        'Replace the About page prompts. Remove any claims you cannot support.',
    },
    {
      title: 'Give every link a useful destination.',
      detail:
        'Check navigation, buttons, and contact links. Remove unused example pages.',
    },
    {
      title: 'Try a small screen and both themes.',
      detail: 'Check readable text, clear controls, and the mobile navigation.',
    },
    {
      title: 'Build, review, and share.',
      detail:
        'Run yarn check, yarn test:ci, yarn build, and yarn publish. Review the release before uploading it.',
    },
  ].map((step, index) => ({
    ...step,
    id: `launch-step-${index}`,
    done: sref(false),
  }))
  readonly completed = computed(
    () => this.steps.filter((step) => step.done()).length,
  )
  readonly message = computed(() =>
    this.completed() === this.steps.length
      ? 'All checks complete. Take one last look, then share your site.'
      : 'A little progress, one useful step at a time.',
  )
  reset = () => {
    for (const step of this.steps) step.done(false)
  }
}

const checklistTemplate = html`<section aria-label="Launch checklist">
  <div class="flex flex-wrap justify-between align-center gap-3 mb-4">
    <strong class="fs-h4">Your launch checklist</strong>
    <span class="text-subtle fs-sm" role="status"
      >{{ completed }} of {{ steps.length }} complete</span>
  </div>
  <progress
    class="starter-checklist-progress"
    :value="completed"
    :max="steps.length"
    aria-label="Launch checklist progress"
  ></progress>
  <label r-for="step in steps" :for="step.id" class="starter-checklist-row">
    <input
      type="checkbox"
      :id="step.id"
      r-model="step.done"
      class="starter-checklist-input"/>
    <span class="d-flex flex-column gap-1"
      ><strong>{{ step.title }}</strong><span class="text-subtle fs-sm">{{ step.detail }}</span></span>
  </label>
  <p class="text-subtle fs-sm mt-4 mb-3" aria-live="polite">
    {{ message }}
  </p>
  <button
    type="button"
    @click="reset"
    class="px-3 py-2 rounded-md b-1 b-subtle tone-fill-surface text-subtle cursor-pointer fw-600"
  >
    Reset checklist
  </button>
</section>`

export function defineLaunchChecklistComponent() {
  return defineComponent<LaunchChecklist>(checklistTemplate, {
    context: () => new LaunchChecklist(),
  })
}
