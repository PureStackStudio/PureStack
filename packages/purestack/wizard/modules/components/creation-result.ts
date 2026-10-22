import { defineComponent, html, type RefOrValue } from 'regor'
import type { StudioResult } from '../shared/protocol'

export interface WizardCreationResult {
  project: StudioResult
  connected: RefOrValue<boolean>
  restart: () => void
  finish: () => void
}

const creationResultTemplate = html`<Flex direction="column" class="gap-5">
  <Panel tone="accent" variant="surface" bodyClass="p-4">
    <p class="text-eyebrow mt-0 mb-2">PROJECT CREATED</p>
    <p class="wizard-workspace-path fw-700 m-0">{{ project.directory }}</p>
    <p class="fs-sm mt-3 mb-0">{{ project.template }}</p>
  </Panel>
  <FormStatus r-for="failure in project.failures" tone="warning">{{ failure }}</FormStatus>
  <FormStatus r-if="project.previewError" tone="warning">{{ project.previewError }}</FormStatus>
  <Flex wrap="true" class="gap-3">
    <BtnLink r-if="project.previewUrl" :href="project.previewUrl" target="_blank" rel="noopener noreferrer" tone="accent">Browse live site ↗</BtnLink>
    <Btn r-if="!project.previewUrl" tone="accent" :disabled="!connected" @click="restart">Start live site</Btn>
    <Btn variant="outline" :disabled="!connected" @click="finish">Finish Studio</Btn>
  </Flex>
  <p class="text-subtle fs-sm m-0">Studio stays open while you explore. Source edits appear on the live site automatically. Finishing Studio stops both local servers.</p>
  <WizardNextSteps :commands="project.commands"/>
</Flex>`

export function defineWizardCreationResultComponent() {
  return defineComponent<WizardCreationResult>(creationResultTemplate, {
    props: ['project', 'connected', 'restart', 'finish'],
  })
}
