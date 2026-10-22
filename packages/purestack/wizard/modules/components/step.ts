import { defineComponent, html } from 'regor'

export interface WizardStep {
  label: string
  eyebrow: string
  heading: string
  description: string
}

const stepTemplate = html`<section :aria-label="label">
  <SectionHeader :eyebrow="eyebrow" :title="heading" :subtitle="description" class="mb-5"/>
  <slot></slot>
  <slot name="actions"></slot>
</section>`

export function defineWizardStepComponent() {
  return defineComponent<WizardStep>(stepTemplate, {
    props: ['label', 'eyebrow', 'heading', 'description'],
  })
}
