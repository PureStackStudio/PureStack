import { defineComponent, html } from 'regor'
import type { OptionGroup } from '../model'

export interface OptionCategory {
  category: OptionGroup
}

const optionCategoryTemplate = html`<Panel tone="neutral" variant="surfaceAlt" bodyClass="p-4">
  <h3 class="fs-h5 mt-0 mb-2">{{ category.label }}</h3>
  <p class="text-subtle fs-sm mt-0 mb-4">{{ category.description }}</p>
  <Flex direction="column" class="gap-4">
    <OptionField r-for="option in category.fields" :option="option"/>
    <OptionCategory r-for="child in category.categories" :category="child"/>
  </Flex>
</Panel>`

export function defineOptionCategoryComponent() {
  return defineComponent<OptionCategory>(optionCategoryTemplate, {
    props: ['category'],
  })
}
