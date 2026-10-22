import { defineComponent, html } from 'regor'
import type { WizardModel } from '../model'
import { WizardDashboard } from './dashboard'

export interface WizardCreationPanel {
  studio: WizardModel
}

const creationPanelTemplate = html`<section aria-label="Create your site">
  <SectionHeader class="mb-5" eyebrow="YOUR WORKSPACE"
    :title="studio.status === 'closing' ? (studio.result ? 'Your workspace is saved.' : 'Studio is closed.') : studio.busy ? 'Bringing your site to life.' : 'Your next chapter starts here.'"
    :subtitle="studio.status === 'closing' ? 'The local session is ending. Any files already created are preserved.' : studio.busy ? 'Follow each step as your project takes shape.' : 'Your source is ready. Open the live site and keep exploring.'"/>
  <WizardCreationProgress r-if="studio.busy" :tasks="studio.tasks"/>
  <WizardCreationResult r-if="studio.result && !studio.busy && studio.status !== 'closing'" :project="studio.result" :connected="studio.connection === 'connected'"
    :restart="studio.restartPreview" :finish="studio.finish"/>
</section>`

export function defineWizardCreationPanelComponent() {
  return defineComponent<WizardCreationPanel>(creationPanelTemplate, {
    context: (head) => ({ studio: head.requireContext(WizardDashboard).model }),
  })
}
