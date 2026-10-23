import { defineComponent, html } from 'regor'
import type { ProjectModel } from '../model'
import { Dashboard } from './dashboard'

export interface TemplatesStep {
  workspace: ProjectModel
}

const templatesStepTemplate = html`<StepPanel label="Starting template" eyebrow="02 / TEMPLATE"
  heading="A good place to begin." description="Start with a complete website, then make it yours.">
  <Grid columns="1" columnsLg="2" class="gap-4">
    <TemplateCard r-for="entry in workspace.templates" :entry="entry" :selected="workspace.template === entry.id" :choose="workspace.chooseTemplate"/>
  </Grid>
  <Flex direction="column" class="gap-3 mt-5">
    <FormInputField id="forge-template-source" label="Use another template" :model="workspace.templateSource"
      placeholder="@scope/template or ./path/to/template" :disabled="workspace.templateLoading"/>
    <Flex justify="end"><Btn variant="outline" :disabled="workspace.templateLoading" @click="workspace.loadTemplate">{{ workspace.templateLoading ? 'Loading template…' : 'Load template' }}</Btn></Flex>
  </Flex>
  <template #actions>
    <StepActions :navigate="workspace.select" back="site" next="options" nextLabel="Template options" :disabled="workspace.templateLoading"/>
  </template>
</StepPanel>`

export function defineTemplatesStepComponent() {
  return defineComponent<TemplatesStep>(templatesStepTemplate, {
    context: (head) => ({ workspace: head.requireContext(Dashboard).model }),
  })
}
