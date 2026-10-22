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
import { defineWizardCreationProgressComponent } from './creation-progress'
import { defineWizardCreationResultComponent } from './creation-result'
import { defineWizardDashboardComponent } from './dashboard'
import { defineWizardNavigationComponent } from './navigation'
import { defineWizardNextStepsComponent } from './next-steps'
import { defineWizardOptionCategoryComponent } from './option-category'
import { defineWizardOptionFieldComponent } from './option-field'
import { defineWizardStepComponent } from './step'
import { defineWizardStepActionsComponent } from './step-actions'
import { defineWizardTemplateCardComponent } from './template-card'

export function defineWizardComponents() {
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
    wizardDashboard: defineWizardDashboardComponent(),
    wizardNavigation: defineWizardNavigationComponent(),
    wizardStep: defineWizardStepComponent(),
    wizardStepActions: defineWizardStepActionsComponent(),
    wizardTemplateCard: defineWizardTemplateCardComponent(),
    wizardOptionCategory: defineWizardOptionCategoryComponent(),
    wizardOptionField: defineWizardOptionFieldComponent(),
    wizardCreationProgress: defineWizardCreationProgressComponent(),
    wizardCreationResult: defineWizardCreationResultComponent(),
    wizardNextSteps: defineWizardNextStepsComponent(),
  }
}
