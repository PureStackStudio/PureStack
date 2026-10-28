import { defineComponent, html } from 'regor'
import type { CtaSection } from './landingTypes'

export function defineCtaSectionComponent() {
  const ctaSectionTemplate = html`<Panel
  class="cta-section min-w-0 p-5"
  bodyClass="cta-section__body"
  :tone="tone"
  :variant="variant || 'surface'"
>
  <Grid
    columns="repeat(auto-fit, minmax(min(100%, 18rem), 1fr))"
    alignItems="center"
    class="cta-section__layout gap-6"
  >
    <Flex direction="column" class="cta-section__content flex-1 gap-4">
      <SectionHeader
        r-if="eyebrow || title || subtitle"
        class="cta-section__heading flex flex-column gap-3"
        :eyebrow="eyebrow"
        :title="title"
        :subtitle="subtitle"
        titleTag="h2"
        eyebrowClass="m-0 fs-xxs tracking-wide text-inherit opacity-75"
        titleClass="m-0 fs-h2 fw-600 lh-2 max-w-heading tracking-tight text-balance text-inherit wrap-anywhere"
        subtitleClass="m-0 fs-body lh-6 max-w-prose tracking-normal text-pretty text-inherit opacity-75"/>
      <p
        class="cta-section__meta m-0 fs-sm lh-5 opacity-75 text-pretty"
        r-if="meta"
      >
        {{ meta }}
      </p>
    </Flex>
    <span
      class="cta-section__actions flex flex-wrap align-center gap-3 hidden-empty"
      ><BtnLink
        class="cta-section__primary max-w-full px-4 py-3 ws-normal"
        r-if="primaryLabel && primaryHref"
        :href="primaryHref"
        :icon="primaryIcon"
        iconPosition="end"
        :tone="tone || 'accent'"
      >
        {{ primaryLabel }} </BtnLink><BtnLink
        class="cta-section__secondary max-w-full px-4 py-3 ws-normal"
        r-if="secondaryLabel && secondaryHref"
        :href="secondaryHref"
        :icon="secondaryIcon"
        :tone="tone || 'accent'"
        variant="none"
        iconPosition="end"
      >
        {{ secondaryLabel }} </BtnLink><slot name="actions"></slot></span>
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
