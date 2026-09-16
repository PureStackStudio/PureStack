import { defineComponent, html, type RefOrValue } from 'regor'

export interface StudioFeature {
  title?: RefOrValue<string>
  summary?: RefOrValue<string>
  icon?: RefOrValue<string>
  href?: RefOrValue<string>
  linkLabel?: RefOrValue<string>
}

const studioFeatureTemplate = html`<Panel
  class="feature-card"
  bodyClass="feature-card__body"
  tone="neutral"
  variant="surface"
>
  <IconFrame
    class="feature-icon"
    :name="icon"
    tone="accent"
    variant="surface"/>
  <SectionHeader
    :title="title"
    :subtitle="summary"
    titleTag="h3"
    titleClass="feature-title"
    subtitleClass="feature-summary"
  >
    <slot></slot>
  </SectionHeader>
  <BtnLink
    r-if="href"
    class="text-link"
    :href="href"
    tone="accent"
    variant="link"
    icon="tabler:arrow-up-right"
    iconPosition="end"
    >{{ linkLabel }}</BtnLink
  >
</Panel>`

export function defineStudioFeatureComponent() {
  return defineComponent<StudioFeature>(studioFeatureTemplate, {
    props: ['title', 'summary', 'icon', 'href', 'linkLabel'],
  })
}
