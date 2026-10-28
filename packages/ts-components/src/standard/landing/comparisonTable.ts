import { defineComponent, html } from 'regor'
import type { ComparisonTable } from './landingTypes'

export function defineComparisonTableComponent() {
  const comparisonTableTemplate = html`<Panel
  class="comparison-table min-w-0 p-5"
  :class="variant === 'none' ? 'text-inherit' : ''"
  bodyClass="comparison-table__body flex flex-column gap-6"
  :tone="tone"
  :variant="variant || 'surface'"
>
  <SectionHeader
    r-if="eyebrow || title || subtitle"
    class="comparison-table__heading flex flex-column align-center gap-3 text-center"
    :eyebrow="eyebrow"
    :title="title"
    :subtitle="subtitle"
    titleTag="h2"
    eyebrowClass="m-0 fs-xxs tracking-wide text-inherit opacity-75"
    titleClass="m-0 fs-h2 fw-600 lh-2 max-w-heading tracking-tight text-balance text-inherit"
    subtitleClass="m-0 fs-body lh-6 max-w-prose tracking-normal text-pretty text-inherit opacity-75"/>
  <Grid
    :columns="columns || 1"
    :columnsLg="columnsLg || 3"
    alignItems="stretch"
    class="comparison-table__grid w-full gap-4"
  >
    <slot></slot>
  </Grid>
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
