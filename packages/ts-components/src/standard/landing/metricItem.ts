import { defineComponent, html } from 'regor'
import type { MetricItem } from './landingTypes'

export function defineMetricItemComponent() {
  const metricItemTemplate = html`<Flex align="start">
    <IconFrame
      r-if="icon"
      :name="icon"
      :tone="tone"
      variant="surface"
      size="sm"/>
    <div>
      <p class="prose-meta mb-1" r-if="label">{{ label }}</p>
      <strong class="fs-body">{{ value }}</strong>
      <p class="text-subtle fs-xs mb-0" r-if="detail">{{ detail }}</p>
      <slot></slot>
    </div>
  </Flex>`

  return {
    metricItem: defineComponent<MetricItem>(metricItemTemplate, {
      props: ['label', 'value', 'detail', 'icon', 'tone'],
    }),
  }
}
