import { defineComponent, html } from 'regor'
import type { MetricStrip } from './landingTypes'

export function defineMetricStripComponent() {
  const metricStripTemplate = html`<Panel :tone="tone" :variant="variant || 'surface'" class="w-full">
    <Grid
      :columns="columns || 1"
      :columnsSm="columnsSm || 2"
      :columnsLg="columnsLg || 4"
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
