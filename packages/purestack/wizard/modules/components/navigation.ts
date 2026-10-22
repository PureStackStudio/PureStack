import { defineComponent, html } from 'regor'
import type { WizardModel } from '../model'
import { WizardDashboard } from './dashboard'

export interface WizardNavigation {
  studio: WizardModel
}

const navigationTemplate = html`<Panel tone="neutral" variant="surfaceAlt" class="wizard-navigation" bodyClass="p-4">
  <p class="text-eyebrow mb-4">YOUR NEW WEBSITE</p>
  <Flex container="nav" direction="column" class="gap-2" aria-label="Setup sections">
    <Btn r-for="entry in studio.sections" :tone="studio.section === entry.id ? 'accent' : 'neutral'"
      :variant="studio.section === entry.id ? 'surface' : 'flat'"
      :aria-current="!studio.showCreation && studio.section === entry.id ? 'step' : null" :disabled="studio.showCreation" @click="studio.select(entry.id)">
      <span class="wizard-nav-number">{{ entry.number }}</span>{{ entry.label }}
    </Btn>
  </Flex>
  <div class="wizard-local-status mt-5 pt-4">
    <p class="text-eyebrow mb-0">LOCAL SESSION</p>
    <p class="text-subtle fs-xs mt-2 mb-0" role="status">{{ studio.connection === 'connected' ? 'Connected to your workspace' : studio.connection === 'closed' ? 'Session closed' : 'Connecting to your workspace…' }}</p>
    <p r-if="studio.cwd" class="wizard-workspace-path text-subtle fs-xs mt-2 mb-0">{{ studio.cwd }}</p>
  </div>
</Panel>`

export function defineWizardNavigationComponent() {
  return defineComponent<WizardNavigation>(navigationTemplate, {
    context: (head) => ({ studio: head.requireContext(WizardDashboard).model }),
  })
}
