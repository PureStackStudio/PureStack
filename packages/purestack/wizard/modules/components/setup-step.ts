import { defineComponent, html } from 'regor'
import type { WizardModel } from '../model'
import { WizardDashboard } from './dashboard'

export interface WizardSetupStep {
  studio: WizardModel
}

const setupStepTemplate = html`<WizardStep label="Project setup" eyebrow="04 / SETUP"
  heading="The finishing touches." description="Choose what happens after your project files are created.">
  <Flex direction="column" class="gap-5">
    <div>
      <FormCheck id="wizard-install" label="Install dependencies" :checked="studio.install" tone="accent"/>
      <p class="text-subtle fs-xs mt-2 mb-0">Use the package manager configured by the template.</p>
    </div>
    <div>
      <FormCheck id="wizard-git" label="Initialize Git" :checked="studio.git" tone="accent"/>
      <p class="text-subtle fs-xs mt-2 mb-0">Create a repository, or reuse an existing one.</p>
    </div>
  </Flex>
  <template #actions>
    <WizardStepActions :navigate="studio.select" back="options" next="review" nextLabel="Review configuration"/>
  </template>
</WizardStep>`

export function defineWizardSetupStepComponent() {
  return defineComponent<WizardSetupStep>(setupStepTemplate, {
    context: (head) => ({ studio: head.requireContext(WizardDashboard).model }),
  })
}
