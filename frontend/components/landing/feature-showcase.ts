import { defineComponent, html, type RefOrValue } from 'regor'

export interface FeatureShowcase {
  title?: RefOrValue<string>
  summary?: RefOrValue<string>
  icon?: RefOrValue<string>
  href?: RefOrValue<string>
  linkLabel?: RefOrValue<string>
}

const featureShowcaseTemplate = html`<Panel
  class="feature-card"
  bodyClass="feature-card__body"
  tone="neutral"
  variant="flat"
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
    target="_blank"
    rel="noopener"
    tone="accent"
    variant="link"
    icon="tabler:arrow-up-right"
    iconPosition="end"
    >{{ linkLabel }}</BtnLink>
</Panel>`

export function defineFeatureShowcaseComponent() {
  return defineComponent<FeatureShowcase>(featureShowcaseTemplate, {
    props: ['title', 'summary', 'icon', 'href', 'linkLabel'],
  })
}
