import { defineComponent, html } from 'regor'
import type { ProjectModel } from '../model'
import { Dashboard } from './dashboard'

export interface OptionsStep {
  workspace: ProjectModel
}

const optionsStepTemplate = html`<StepPanel label="Template options" eyebrow="03 / OPTIONS"
  heading="Make the starting point yours." description="These settings come from your selected template.">
  <p r-if="workspace.templateLoading" role="status" class="text-subtle">Loading template settings…</p>
  <p r-if="!workspace.templateLoading && !workspace.categories.length" class="text-subtle">This template is ready to use with no additional settings.</p>
  <Flex direction="column" class="gap-5" r-if="!workspace.templateLoading">
    <OptionCategory r-for="category in workspace.categories" :category="category"/>
  </Flex>
  <template #actions>
    <StepActions :navigate="workspace.select" back="templates" next="setup" nextLabel="Project setup" :disabled="workspace.templateLoading"/>
  </template>
</StepPanel>`

export function defineOptionsStepComponent() {
  return defineComponent<OptionsStep>(optionsStepTemplate, {
    context: (head) => ({ workspace: head.requireContext(Dashboard).model }),
  })
}
