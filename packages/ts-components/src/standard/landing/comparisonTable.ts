import { defineComponent, html } from 'regor'
import type { ComparisonTable } from './landingTypes'

export function defineComparisonTableComponent() {
  const comparisonTableTemplate = html`<Panel :tone="tone" :variant="variant || 'surface'" class="mb-6">
    <Flex direction="column" align="start" class="w-full">
      <SectionHeader
        r-if="eyebrow || title || subtitle"
        :eyebrow="eyebrow"
        :title="title"
        :subtitle="subtitle"
        titleTag="h2"
        subtitleClass="mb-0"/>
      <Grid
        :columns="columns || 1"
        :columnsLg="columnsLg || 3"
        alignItems="stretch"
        class="w-full"
      >
        <slot></slot>
      </Grid>
    </Flex>
  </Panel>`

  return {
    comparisonTable: defineComponent<ComparisonTable>(comparisonTableTemplate, {
      props: [
        'eyebrow',
        'title',
        'subtitle',
        'tone',
        'variant',
        'columns',
        'columnsLg',
      ],
    }),
  }
}
