import { defineComponent, html } from 'regor'
import type { WizardOptionCategory as OptionCategory } from '../model'

export interface WizardOptionCategory {
  category: OptionCategory
}

const optionCategoryTemplate = html`<Panel tone="neutral" variant="surfaceAlt" bodyClass="p-4">
  <h3 class="fs-h5 mt-0 mb-2">{{ category.label }}</h3>
  <p class="text-subtle fs-sm mt-0 mb-4">{{ category.description }}</p>
  <Flex direction="column" class="gap-4">
    <WizardOptionField r-for="option in category.fields" :option="option"/>
    <WizardOptionCategory r-for="child in category.categories" :category="child"/>
  </Flex>
</Panel>`

export function defineWizardOptionCategoryComponent() {
  return defineComponent<WizardOptionCategory>(optionCategoryTemplate, {
    props: ['category'],
  })
}
