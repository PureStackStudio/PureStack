import { defineComponent, html } from 'regor'
import type { ComparisonColumn } from './landingTypes'

export function defineComparisonColumnComponent() {
  const comparisonColumnTemplate = html`<Panel
  class="comparison-column h-full w-full min-w-0 p-5"
  bodyClass="comparison-column__body flex flex-column gap-5 h-full"
  :tone="tone"
  :variant="variant || 'surface'"
>
  <Flex
    align="start"
    justify="between"
    wrap="true"
    class="comparison-column__header gap-3"
    r-if="icon || badge"
  >
    <IconFrame
      r-if="icon"
      class="comparison-column__icon p-2"
      :name="icon"
      :tone="tone"
      variant="surface"
      aria-hidden="true"/>
    <Badge r-if="badge" :tone="tone">{{ badge }}</Badge>
  </Flex>
  <Flex
    r-if="title || summary"
    direction="column"
    class="comparison-column__heading gap-3"
  >
    <h3
      class="comparison-column__title fs-h4 fw-600 lh-2 m-0 tracking-tight text-balance wrap-anywhere"
      r-if="title"
    >
      {{ title }}
    </h3>
    <p
      class="comparison-column__summary fs-body lh-6 m-0 tracking-normal text-pretty opacity-75"
      r-if="summary"
    >
      {{ summary }}
    </p>
  </Flex>
  <slot></slot>
  <span
    class="comparison-column__actions flex flex-wrap align-center mt-auto gap-3 hidden-empty"
    ><slot name="actions"></slot></span>
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
