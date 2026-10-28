import { defineComponent, html } from 'regor'
import type { MetricItem } from './landingTypes'

export function defineMetricItemComponent() {
  const metricItemTemplate = html`<Flex direction="column" align="start" class="metric-item h-full min-w-0 gap-3">
  <Flex r-if="label || icon" align="center" class="metric-item__header gap-2">
    <IconFrame
      r-if="icon"
      :name="icon"
      :tone="tone"
      variant="surface"
      size="sm"
      aria-hidden="true"/>
    <p
      r-if="label"
      class="metric-item__label fs-body fw-500 lh-4 m-0 wrap-anywhere"
    >
      {{ label }}
    </p>
  </Flex>
  <strong
    r-if="value !== undefined && value !== null && value !== ''"
    class="metric-item__value fs-h1 fw-600 lh-1 m-0 wrap-anywhere tabular-nums"
  >
    {{ value }}
  </strong>
  <p r-if="detail" class="metric-item__detail fs-sm lh-5 opacity-75 m-0">
    {{ detail }}
  </p>
  <slot></slot>
</Flex>`

  return {
    metricItem: defineComponent<MetricItem>(metricItemTemplate, {
      props: ['label', 'value', 'detail', 'icon', 'tone'],
    }),
  }
}
