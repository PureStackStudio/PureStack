import { defineComponent, html, type RefOrValue } from 'regor'
import type { WizardTemplateEntry } from '../model'

export interface WizardTemplateCard {
  entry: WizardTemplateEntry
  selected: RefOrValue<boolean>
  choose: (id: string) => void
}

const templateCardTemplate = html`<Panel :tone="selected ? 'accent' : 'neutral'"
  variant="surfaceAlt" class="wizard-template-card" bodyClass="p-4">
  <Flex direction="column" class="gap-4">
    <Flex class="wizard-template-marker fw-700" align="center" justify="center" aria-hidden="true">{{ entry.marker }}</Flex>
    <h3 class="fs-h5 m-0">{{ entry.title }}</h3>
    <p class="text-subtle fs-sm m-0">{{ entry.description }}</p>
    <Btn :tone="selected ? 'accent' : 'neutral'" :variant="selected ? 'solid' : 'outline'"
      :aria-pressed="selected" @click="choose(entry.id)">
      {{ selected ? 'Selected' : 'Choose template' }}
    </Btn>
  </Flex>
</Panel>`

export function defineWizardTemplateCardComponent() {
  return defineComponent<WizardTemplateCard>(templateCardTemplate, {
    props: ['entry', 'selected', 'choose'],
  })
}
