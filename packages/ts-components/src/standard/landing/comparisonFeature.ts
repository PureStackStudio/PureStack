import { defineComponent, html } from 'regor'
import type { ComparisonFeature } from './landingTypes'

export function defineComparisonFeatureComponent() {
  const comparisonFeatureTemplate = html`<Flex
  container="li"
  align="start"
  class="comparison-feature gap-3 py-2 fs-body lh-5"
>
  <IconFrame
    class="comparison-feature__icon tone-text fs-xs p-0 mt-1"
    :name="icon || 'lucide:check'"
    :tone="tone"
    variant="none"
    size="sm"
    aria-hidden="true"/>
  <div class="comparison-feature__content flex-1 min-w-0 text-pretty">
    <slot></slot>
  </div>
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
