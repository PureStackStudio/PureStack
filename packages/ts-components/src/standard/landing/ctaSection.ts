import { defineComponent, html } from 'regor'
import type { CtaSection } from './landingTypes'

export function defineCtaSectionComponent() {
  const ctaSectionTemplate = html`<Panel :tone="tone" :variant="variant || 'surface'">
    <Grid columns="1" columnsLg="minmax(0, 1fr) auto" alignItems="center">
      <SectionHeader
        :eyebrow="eyebrow"
        :title="title"
        :subtitle="subtitle"
        titleTag="h2"
        titleClass="fs-h2 mb-2"
        subtitleClass="mb-0"/>
      <Flex align="center" justify="end" wrap="true">
        <BtnLink
          r-if="primaryLabel && primaryHref"
          :href="primaryHref"
          :icon="primaryIcon"
          iconPosition="end"
          :tone="tone || 'accent'"
          size="lg"
        >
          {{ primaryLabel }}
        </BtnLink>
        <BtnLink
          r-if="secondaryLabel && secondaryHref"
          :href="secondaryHref"
          :icon="secondaryIcon"
          :tone="tone || 'ghost'"
          variant="outline"
          size="lg"
        >
          {{ secondaryLabel }}
        </BtnLink>
        <slot name="actions"></slot>
      </Flex>
      <p class="prose-meta mb-0" r-if="meta">{{ meta }}</p>
    </Grid>
  </Panel>`

  return {
    ctaSection: defineComponent<CtaSection>(ctaSectionTemplate, {
      props: [
        'eyebrow',
        'title',
        'subtitle',
        'primaryLabel',
        'primaryHref',
        'primaryIcon',
        'secondaryLabel',
        'secondaryHref',
        'secondaryIcon',
        'meta',
        'tone',
        'variant',
      ],
    }),
  }
}
