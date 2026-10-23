import { defineComponent, html } from 'regor'
import type { ProjectModel } from '../model'
import { Dashboard } from './dashboard'

export interface CreationPanel {
  workspace: ProjectModel
}

const creationPanelTemplate = html`<section aria-label="Create your site">
  <SectionHeader
    class="mb-5"
    eyebrow="YOUR WORKSPACE"
    :title="workspace.status === 'closing' ? (workspace.result ? 'Your workspace is saved.' : 'Forge is closed.') : workspace.busy ? 'Bringing your site to life.' : 'Your next chapter starts here.'"
    :subtitle="workspace.status === 'closing' ? 'The local session is ending. Any files already created are preserved.' : workspace.busy ? 'Follow each step as your project takes shape.' : 'Your source is ready. Open the live site and keep exploring.'"/>
  <CreationProgress r-if="workspace.busy" :tasks="workspace.tasks"/>
  <CreationResult
    r-if="workspace.result && !workspace.busy && workspace.status !== 'closing'"
    :project="workspace.result"
    :connected="workspace.connection === 'connected'"
    :restart="workspace.restartPreview"
    :finish="workspace.finish"/>
</section>`

export function defineCreationPanelComponent() {
  return defineComponent<CreationPanel>(creationPanelTemplate, {
    context: (head) => ({ workspace: head.requireContext(Dashboard).model }),
  })
}
