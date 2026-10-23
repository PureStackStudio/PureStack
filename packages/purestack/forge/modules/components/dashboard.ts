import {
  type Component,
  computed,
  defineComponent,
  html,
  onMounted,
  onUnmounted,
} from 'regor'
import { ProjectModel, type SectionId } from '../model'
import { defineCreationPanelComponent } from './creation-panel'
import { defineOptionsStepComponent } from './options-step'
import { defineReviewStepComponent } from './review-step'
import { defineSetupStepComponent } from './setup-step'
import { defineSiteStepComponent } from './site-step'
import { defineTemplatesStepComponent } from './templates-step'

export class Dashboard {
  readonly model = new ProjectModel()
  readonly components = {
    site: defineSiteStepComponent(),
    templates: defineTemplatesStepComponent(),
    options: defineOptionsStepComponent(),
    setup: defineSetupStepComponent(),
    review: defineReviewStepComponent(),
    creation: defineCreationPanelComponent(),
  } satisfies Record<
    SectionId | 'creation',
    Component<{ workspace: ProjectModel }>
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

const dashboardTemplate = html`<Grid
  columns="1"
  columnsLg="28rem minmax(0, 1fr)"
  class="gap-5"
  alignItems="start"
>
  <Navigation/>
  <Panel tone="neutral" variant="surface" class="forge-panel" bodyClass="p-5">
    <Flex direction="column" class="gap-5">
      <FormStatus tone="danger" r-if="model.error"
        >{{ model.error }}</FormStatus>
      <div :is="activeComponent"></div>
    </Flex>
  </Panel>
</Grid>`

export function defineDashboardComponent() {
  return defineComponent<Dashboard>(dashboardTemplate, {
    context: () => new Dashboard(),
  })
}
