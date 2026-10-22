import { defineComponent, html, type RefOrValue } from 'regor'
import type { WizardNavigate, WizardSection } from '../model'

export interface WizardStepActions {
  back?: WizardSection
  next?: WizardSection
  nextLabel?: string
  navigate: WizardNavigate
  disabled?: RefOrValue<boolean>
}

const stepActionsTemplate = html`<Flex class="wizard-actions mt-5 pt-4"
  :justify="back ? (next ? 'between' : 'start') : 'end'" wrap="true">
  <Btn r-if="back" variant="outline" @click="navigate(back)">← Back</Btn>
  <Btn r-if="next" tone="accent" :disabled="disabled" @click="navigate(next)">{{ nextLabel }} →</Btn>
</Flex>`

export function defineWizardStepActionsComponent() {
  return defineComponent<WizardStepActions>(stepActionsTemplate, {
    props: ['back', 'next', 'nextLabel', 'navigate', 'disabled'],
  })
}
