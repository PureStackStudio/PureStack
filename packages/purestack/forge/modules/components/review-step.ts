import { defineComponent, html } from 'regor'
import type { ProjectModel } from '../model'
import { Dashboard } from './dashboard'

export interface ReviewStep {
  workspace: ProjectModel
}

const reviewStepTemplate = html`<StepPanel
  label="Review configuration"
  eyebrow="05 / REVIEW"
  heading="Your project, at a glance."
  description="Check your choices before creating your website."
>
  <dl class="forge-review gap-4 fs-sm">
    <template r-for="entry in workspace.summary"
      ><dt>{{ entry.label }}</dt>
      <dd>{{ entry.value }}</dd></template>
  </dl>
  <p class="text-subtle fs-sm mt-5 mb-0">
    Your source files will be created in the selected folder. Forge will start a
    live site and stay open.
  </p>
  <template #actions>
    <Flex class="forge-actions mt-5 pt-4" justify="between" wrap="true">
      <Btn variant="outline" @click="workspace.select('setup')">← Back</Btn>
      <Btn
        tone="accent"
        :disabled="!workspace.canCreate"
        @click="workspace.create"
        >Create site →</Btn>
    </Flex>
  </template>
</StepPanel>`

export function defineReviewStepComponent() {
  return defineComponent<ReviewStep>(reviewStepTemplate, {
    context: (head) => ({ workspace: head.requireContext(Dashboard).model }),
  })
}
