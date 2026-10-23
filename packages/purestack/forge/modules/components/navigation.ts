import { defineComponent, html } from 'regor'
import type { ProjectModel } from '../model'
import { Dashboard } from './dashboard'

export interface Navigation {
  workspace: ProjectModel
}

const navigationTemplate = html`<Panel
  tone="neutral"
  variant="surfaceAlt"
  class="forge-navigation"
  bodyClass="p-4"
>
  <p class="text-eyebrow mb-4">YOUR NEW WEBSITE</p>
  <Flex
    container="nav"
    direction="column"
    class="gap-2"
    aria-label="Setup sections"
  >
    <Btn
      r-for="entry in workspace.sections"
      :tone="workspace.section === entry.id ? 'accent' : 'neutral'"
      :variant="workspace.section === entry.id ? 'surface' : 'flat'"
      :aria-current="!workspace.showCreation && workspace.section === entry.id ? 'step' : null"
      :disabled="workspace.showCreation"
      @click="workspace.select(entry.id)"
    >
      <span class="forge-nav-number">{{ entry.number }}</span>{{ entry.label }}
    </Btn>
  </Flex>
  <div class="forge-local-status mt-5 pt-4">
    <p class="text-eyebrow mb-0">LOCAL SESSION</p>
    <p class="text-subtle fs-xs mt-2 mb-0" role="status">
      {{ workspace.connection === 'connected' ? 'Connected to your workspace' : workspace.connection === 'closed' ? 'Session closed' : 'Connecting to your workspace…' }}
    </p>
    <p
      r-if="workspace.cwd"
      class="forge-workspace-path text-subtle fs-xs mt-2 mb-0"
    >
      {{ workspace.cwd }}
    </p>
  </div>
</Panel>`

export function defineNavigationComponent() {
  return defineComponent<Navigation>(navigationTemplate, {
    context: (head) => ({ workspace: head.requireContext(Dashboard).model }),
  })
}
