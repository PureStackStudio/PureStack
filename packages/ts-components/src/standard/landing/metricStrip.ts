import { defineComponent, html } from 'regor'
import type { MetricStrip } from './landingTypes'

export function defineMetricStripComponent() {
  const metricStripTemplate = html`<Panel
  class="metric-strip w-full min-w-0 p-5"
  :tone="tone"
  :variant="variant || 'surface'"
>
  <Grid
    class="metric-strip__grid gap-6"
    :columns="columns || 1"
    :columnsSm="columnsSm || 2"
    :columnsLg="columnsLg || 4"
    alignItems="start"
  >
    <slot></slot>
  </Grid>
</Panel>`

  return {
    metricStrip: defineComponent<MetricStrip>(metricStripTemplate, {
      props: ['tone', 'variant', 'columns', 'columnsSm', 'columnsLg'],
    }),
  }
}
