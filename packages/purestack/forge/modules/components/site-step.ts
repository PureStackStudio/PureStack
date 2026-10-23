import { defineComponent, html } from 'regor'
import type { ProjectModel } from '../model'
import { Dashboard } from './dashboard'

export interface SiteStep {
  workspace: ProjectModel
}

const siteStepTemplate = html`<StepPanel label="Site details" eyebrow="01 / SITE"
  heading="Give your project a home." description="Choose its name and where you'd like to keep the source.">
  <Flex direction="column" class="gap-4">
    <FormInputField id="forge-title" label="Site title" :model="workspace.title" :required="true" maxlength="2000"/>
    <p class="text-subtle fs-xs m-0">The name people see on your website.</p>
    <FormInputField id="forge-directory" label="Project folder" :model="workspace.directory" :required="true" maxlength="2000"/>
    <p class="text-subtle fs-xs m-0">Relative to the folder where you started the CLI.</p>
  </Flex>
  <template #actions>
    <StepActions :navigate="workspace.select" next="templates" nextLabel="Choose a template"/>
  </template>
</StepPanel>`

export function defineSiteStepComponent() {
  return defineComponent<SiteStep>(siteStepTemplate, {
    context: (head) => ({ workspace: head.requireContext(Dashboard).model }),
  })
}
