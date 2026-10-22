import { defineComponent, html } from 'regor'
import type { WizardModel } from '../model'
import { WizardDashboard } from './dashboard'

export interface WizardOptionsStep {
  studio: WizardModel
}

const optionsStepTemplate = html`<WizardStep label="Template options" eyebrow="03 / OPTIONS"
  heading="Make the starting point yours." description="These settings come from your selected template.">
  <p r-if="studio.templateLoading" role="status" class="text-subtle">Loading template settings…</p>
  <p r-if="!studio.templateLoading && !studio.categories.length" class="text-subtle">This template is ready to use with no additional settings.</p>
  <Flex direction="column" class="gap-5" r-if="!studio.templateLoading">
    <WizardOptionCategory r-for="category in studio.categories" :category="category"/>
  </Flex>
  <template #actions>
    <WizardStepActions :navigate="studio.select" back="templates" next="setup" nextLabel="Project setup" :disabled="studio.templateLoading"/>
  </template>
</WizardStep>`

export function defineWizardOptionsStepComponent() {
  return defineComponent<WizardOptionsStep>(optionsStepTemplate, {
    context: (head) => ({ studio: head.requireContext(WizardDashboard).model }),
  })
}
