import { defineComponent, html, type RefOrValue } from 'regor'
import type { Navigate, SectionId } from '../model'

export interface StepActions {
  back?: SectionId
  next?: SectionId
  nextLabel?: string
  navigate: Navigate
  disabled?: RefOrValue<boolean>
}

const stepActionsTemplate = html`<Flex class="forge-actions mt-5 pt-4"
  :justify="back ? (next ? 'between' : 'start') : 'end'" wrap="true">
  <Btn r-if="back" variant="outline" @click="navigate(back)">← Back</Btn>
  <Btn r-if="next" tone="accent" :disabled="disabled" @click="navigate(next)">{{ nextLabel }} →</Btn>
</Flex>`

export function defineStepActionsComponent() {
  return defineComponent<StepActions>(stepActionsTemplate, {
    props: ['back', 'next', 'nextLabel', 'navigate', 'disabled'],
  })
}
