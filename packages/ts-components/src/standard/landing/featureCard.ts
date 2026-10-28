import { defineComponent, html } from 'regor'
import type { FeatureCard } from './landingTypes'

export function defineFeatureCardComponent() {
  const featureCardTemplate = html`<Panel
  class="feature-card h-full min-w-0 p-5"
  bodyClass="feature-card__body flex flex-column h-full gap-5"
  :tone="tone"
  :variant="variant || 'surface'"
>
  <Flex
    r-if="icon || badge"
    class="feature-card__header gap-3"
    align="start"
    justify="between"
    wrap="true"
  >
    <IconFrame
      r-if="icon"
      class="feature-card__icon p-2"
      :name="icon"
      :tone="tone || 'accent'"
      variant="surface"
      aria-hidden="true"/>
    <Badge r-if="badge" :tone="tone || 'accent'"
      >{{ badge }}</Badge>
  </Flex>
  <Flex direction="column" align="start" class="feature-card__content gap-3">
    <p
      r-if="eyebrow"
      class="feature-card__eyebrow fs-xxs fw-700 uppercase opacity-75 m-0"
    >
      {{ eyebrow }}
    </p>
    <h3
      r-if="title"
      class="feature-card__title fs-h4 fw-600 lh-2 m-0 wrap-anywhere"
    >
      {{ title }}
    </h3>
    <p r-if="summary" class="feature-card__summary fs-body lh-6 opacity-75 m-0">
      {{ summary }}
    </p>
    <slot></slot>
  </Flex>
  <Flex wrap="true" align="center" class="feature-card__actions mt-auto gap-3">
    <slot name="actions"></slot>
  </Flex>
</Panel>`

  return {
    featureCard: defineComponent<FeatureCard>(featureCardTemplate, {
      props: [
        'eyebrow',
        'title',
        'summary',
        'badge',
        'icon',
        'tone',
        'variant',
      ],
    }),
  }
}
