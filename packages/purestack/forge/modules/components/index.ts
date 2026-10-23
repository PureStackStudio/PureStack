import {
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormInputField,
  defineFormSelectField,
  defineGridComponents,
  defineIconComponents,
  definePanelComponents,
  defineSectionHeaderComponents,
} from '@purestack/ts-components'
import { lucide_chevron_down } from '@purestack/ts-svg-icons'
import { defineCreationProgressComponent } from './creation-progress'
import { defineCreationResultComponent } from './creation-result'
import { defineDashboardComponent } from './dashboard'
import { defineNavigationComponent } from './navigation'
import { defineNextStepsComponent } from './next-steps'
import { defineOptionCategoryComponent } from './option-category'
import { defineOptionFieldComponent } from './option-field'
import { defineStepPanelComponent } from './step'
import { defineStepActionsComponent } from './step-actions'
import { defineTemplateCardComponent } from './template-card'

export function defineComponents() {
  return {
    ...defineButtonComponents(),
    ...defineFlexComponents(),
    ...defineFormComponents(),
    ...defineFormInputField(),
    ...defineFormSelectField(),
    ...defineIconComponents((name) =>
      name === 'lucide:chevron-down' ? lucide_chevron_down : '',
    ),
    ...defineGridComponents(),
    ...definePanelComponents(),
    ...defineSectionHeaderComponents(),
    dashboard: defineDashboardComponent(),
    navigation: defineNavigationComponent(),
    stepPanel: defineStepPanelComponent(),
    stepActions: defineStepActionsComponent(),
    templateCard: defineTemplateCardComponent(),
    optionCategory: defineOptionCategoryComponent(),
    optionField: defineOptionFieldComponent(),
    creationProgress: defineCreationProgressComponent(),
    creationResult: defineCreationResultComponent(),
    nextSteps: defineNextStepsComponent(),
  }
}
