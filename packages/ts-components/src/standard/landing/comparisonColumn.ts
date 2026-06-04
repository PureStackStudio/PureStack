import { defineComponent, html } from 'regor'
import type { ComparisonColumn } from './landingTypes'

export function defineComparisonColumnComponent() {
  const comparisonColumnTemplate = html`<Panel :tone="tone" :variant="variant || 'surface'">
    <Flex direction="column" align="start">
      <Flex align="center" justify="between" class="w-full" r-if="icon || badge">
        <IconFrame
          r-if="icon"
          :name="icon"
          :tone="tone"
          :variant="variant"
          size="lg"/>
        <Badge r-if="badge" :tone="tone">{{ badge }}</Badge>
      </Flex>
      <h3 class="fs-h4 fw-700 my-0" r-if="title">{{ title }}</h3>
      <p class="text-tagline mb-0" r-if="summary">{{ summary }}</p>
      <slot></slot>
    </Flex>
  </Panel>`

  return {
    comparisonColumn: defineComponent<ComparisonColumn>(
      comparisonColumnTemplate,
      {
        props: ['title', 'summary', 'badge', 'icon', 'tone', 'variant'],
      },
    ),
  }
}
