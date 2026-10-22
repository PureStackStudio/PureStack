import { defineComponent, html } from 'regor'
import type { WizardModel } from '../model'
import { WizardDashboard } from './dashboard'

export interface WizardSiteStep {
  studio: WizardModel
}

const siteStepTemplate = html`<WizardStep label="Site details" eyebrow="01 / SITE"
  heading="Give your project a home." description="Choose its name and where you'd like to keep the source.">
  <Flex direction="column" class="gap-4">
    <FormInputField id="wizard-title" label="Site title" :model="studio.title" :required="true" maxlength="2000"/>
    <p class="text-subtle fs-xs m-0">The name people see on your website.</p>
    <FormInputField id="wizard-directory" label="Project folder" :model="studio.directory" :required="true" maxlength="2000"/>
    <p class="text-subtle fs-xs m-0">Relative to the folder where you started the CLI.</p>
  </Flex>
  <template #actions>
    <WizardStepActions :navigate="studio.select" next="templates" nextLabel="Choose a template"/>
  </template>
</WizardStep>`

export function defineWizardSiteStepComponent() {
  return defineComponent<WizardSiteStep>(siteStepTemplate, {
    context: (head) => ({ studio: head.requireContext(WizardDashboard).model }),
  })
}
