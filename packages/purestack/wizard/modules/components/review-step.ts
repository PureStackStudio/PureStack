import { defineComponent, html } from 'regor'
import type { WizardModel } from '../model'
import { WizardDashboard } from './dashboard'

export interface WizardReviewStep {
  studio: WizardModel
}

const reviewStepTemplate = html`<WizardStep label="Review configuration" eyebrow="05 / REVIEW"
  heading="Your project, at a glance." description="Check your choices before creating your website.">
  <dl class="wizard-review gap-4 fs-sm">
    <template r-for="entry in studio.summary"><dt>{{ entry.label }}</dt><dd>{{ entry.value }}</dd></template>
  </dl>
  <p class="text-subtle fs-sm mt-5 mb-0">Your source files will be created in the selected folder. Studio will start a live site and stay open.</p>
  <template #actions>
    <Flex class="wizard-actions mt-5 pt-4" justify="between" wrap="true">
      <Btn variant="outline" @click="studio.select('setup')">← Back</Btn>
      <Btn tone="accent" :disabled="!studio.canCreate" @click="studio.create">Create site →</Btn>
    </Flex>
  </template>
</WizardStep>`

export function defineWizardReviewStepComponent() {
  return defineComponent<WizardReviewStep>(reviewStepTemplate, {
    context: (head) => ({ studio: head.requireContext(WizardDashboard).model }),
  })
}
