import {
  type Component,
  computed,
  defineComponent,
  html,
  onMounted,
  onUnmounted,
} from 'regor'
import { WizardModel, type WizardSection } from '../model'
import { defineWizardCreationPanelComponent } from './creation-panel'
import { defineWizardOptionsStepComponent } from './options-step'
import { defineWizardReviewStepComponent } from './review-step'
import { defineWizardSetupStepComponent } from './setup-step'
import { defineWizardSiteStepComponent } from './site-step'
import { defineWizardTemplatesStepComponent } from './templates-step'

export class WizardDashboard {
  readonly model = new WizardModel()
  readonly components = {
    site: defineWizardSiteStepComponent(),
    templates: defineWizardTemplatesStepComponent(),
    options: defineWizardOptionsStepComponent(),
    setup: defineWizardSetupStepComponent(),
    review: defineWizardReviewStepComponent(),
    creation: defineWizardCreationPanelComponent(),
  } satisfies Record<
    WizardSection | 'creation',
    Component<{ studio: WizardModel }>
  >
  readonly activeComponent = computed(
    () =>
      this.components[
        this.model.showCreation() ? 'creation' : this.model.section()
      ],
  )

  constructor() {
    onMounted(this.model.connect)
    onUnmounted(this.model.dispose)
  }
}

const dashboardTemplate = html`<Grid columns="1" columnsLg="28rem minmax(0, 1fr)" class="gap-5" alignItems="start">
  <WizardNavigation/>
  <Panel tone="neutral" variant="surface" class="wizard-panel" bodyClass="p-5">
    <Flex direction="column" class="gap-5">
      <FormStatus tone="danger" r-if="model.error">{{ model.error }}</FormStatus>
      <div :is="activeComponent"></div>
    </Flex>
  </Panel>
</Grid>`

export function defineWizardDashboardComponent() {
  return defineComponent<WizardDashboard>(dashboardTemplate, {
    context: () => new WizardDashboard(),
  })
}
