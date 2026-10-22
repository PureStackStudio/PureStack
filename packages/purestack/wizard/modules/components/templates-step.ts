import { defineComponent, html } from 'regor'
import type { WizardModel } from '../model'
import { WizardDashboard } from './dashboard'

export interface WizardTemplatesStep {
  studio: WizardModel
}

const templatesStepTemplate = html`<WizardStep label="Starting template" eyebrow="02 / TEMPLATE"
  heading="A good place to begin." description="Start with a complete website, then make it yours.">
  <Grid columns="1" columnsLg="2" class="gap-4">
    <WizardTemplateCard r-for="entry in studio.templates" :entry="entry" :selected="studio.template === entry.id" :choose="studio.chooseTemplate"/>
  </Grid>
  <Flex direction="column" class="gap-3 mt-5">
    <FormInputField id="wizard-template-source" label="Use another template" :model="studio.templateSource"
      placeholder="@scope/template or ./path/to/template" :disabled="studio.templateLoading"/>
    <Flex justify="end"><Btn variant="outline" :disabled="studio.templateLoading" @click="studio.loadTemplate">{{ studio.templateLoading ? 'Loading template…' : 'Load template' }}</Btn></Flex>
  </Flex>
  <template #actions>
    <WizardStepActions :navigate="studio.select" back="site" next="options" nextLabel="Template options" :disabled="studio.templateLoading"/>
  </template>
</WizardStep>`

export function defineWizardTemplatesStepComponent() {
  return defineComponent<WizardTemplatesStep>(templatesStepTemplate, {
    context: (head) => ({ studio: head.requireContext(WizardDashboard).model }),
  })
}
