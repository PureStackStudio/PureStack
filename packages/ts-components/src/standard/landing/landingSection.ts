import { defineComponent, html } from 'regor'
import type { LandingSection } from './landingTypes'

export function defineLandingSectionComponent() {
  const landingSectionTemplate = html`<Panel
    :tone="tone"
    :variant="variant || 'none'"
    :variantMode="variantMode"
    class="mb-6"
  >
    <Grid
      columns="1"
      :columnsLg="columnsLg || columns"
      :alignItems="alignItems || 'start'"
    >
      <SectionHeader
        r-if="eyebrow || title || subtitle"
        :eyebrow="eyebrow"
        :title="title"
        :subtitle="subtitle"
        :titleTag="titleTag || 'h2'"
        subtitleClass="mb-0"/>
      <slot></slot>
    </Grid>
  </Panel>`

  return {
    landingSection: defineComponent<LandingSection>(landingSectionTemplate, {
      props: [
        'eyebrow',
        'title',
        'subtitle',
        'titleTag',
        'tone',
        'variant',
        'variantMode',
        'columns',
        'columnsLg',
        'alignItems',
      ],
    }),
  }
}
