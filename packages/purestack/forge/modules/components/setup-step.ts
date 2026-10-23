import { defineComponent, html } from 'regor'
import type { ProjectModel } from '../model'
import { Dashboard } from './dashboard'

export interface SetupStep {
  workspace: ProjectModel
}

const setupStepTemplate = html`<StepPanel
  label="Project setup"
  eyebrow="04 / SETUP"
  heading="The finishing touches."
  description="Choose what happens after your project files are created."
>
  <Flex direction="column" class="gap-5">
    <div>
      <FormCheck
        id="forge-install"
        label="Install dependencies"
        :checked="workspace.install"
        tone="accent"/>
      <p class="text-subtle fs-xs mt-2 mb-0">
        Use the package manager configured by the template.
      </p>
    </div>
    <div>
      <FormCheck
        id="forge-git"
        label="Initialize Git"
        :checked="workspace.git"
        tone="accent"/>
      <p class="text-subtle fs-xs mt-2 mb-0">
        Create a repository, or reuse an existing one.
      </p>
    </div>
  </Flex>
  <template #actions>
    <StepActions
      :navigate="workspace.select"
      back="options"
      next="review"
      nextLabel="Review configuration"/>
  </template>
</StepPanel>`

export function defineSetupStepComponent() {
  return defineComponent<SetupStep>(setupStepTemplate, {
    context: (head) => ({ workspace: head.requireContext(Dashboard).model }),
  })
}
