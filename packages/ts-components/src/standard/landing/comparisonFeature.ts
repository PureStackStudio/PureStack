import { defineComponent, html } from 'regor'
import type { ComparisonFeature } from './landingTypes'

export function defineComparisonFeatureComponent() {
  const comparisonFeatureTemplate = html`<Flex container="li" align="start">
    <IconFrame
      :name="icon || 'lucide:check'"
      :tone="tone"
      variant="surface"
      size="sm"/>
    <slot></slot>
  </Flex>`

  return {
    comparisonFeature: defineComponent<ComparisonFeature>(
      comparisonFeatureTemplate,
      {
        props: ['icon', 'tone'],
      },
    ),
  }
}
