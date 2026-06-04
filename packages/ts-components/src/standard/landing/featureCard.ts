import { defineComponent, html } from 'regor'
import type { FeatureCard } from './landingTypes'

export function defineFeatureCardComponent() {
  const featureCardTemplate = html`<Panel :tone="tone" :variant="variant || 'surface'">
    <Flex direction="column" align="start" justify="center">
      <Flex align="center" justify="center" class="w-full" r-if="icon || badge">
        <IconFrame
          r-if="icon"
          :name="icon"
          :tone="tone"
          :variant="variant"
          size="lg"/>
        <Badge r-if="badge" :tone="tone">{{ badge }}</Badge>
      </Flex>
      <Flex direction="column" align="center" class="text-justify">
        <p class="text-eyebrow" r-if="eyebrow">{{ eyebrow }}</p>
        <h3 class="fs-h4 fw-700 my-0" r-if="title">{{ title }}</h3>
        <p class="text-tagline mb-0" r-if="summary">{{ summary }}</p>
        <slot></slot>
      </Flex>
      <Flex wrap="true" class="mt-auto">
        <slot name="actions"></slot>
      </Flex>
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
