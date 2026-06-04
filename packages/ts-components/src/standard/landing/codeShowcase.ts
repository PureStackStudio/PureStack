import { defineComponent, html } from 'regor'
import type { CodeShowcase } from './landingTypes'

export function defineCodeShowcaseComponent() {
  const codeShowcaseTemplate = html`<Panel :tone="tone" :variant="variant || 'surface'">
    <Flex direction="column">
      <Flex align="start" justify="between" wrap="true">
        <SectionHeader
          :eyebrow="eyebrow"
          :title="title"
          :subtitle="summary"
          titleTag="h3"
          titleClass="fs-h4 mb-1"
          subtitleClass="mb-0"/>
        <Badge r-if="language" :tone="tone">{{ language }}</Badge>
      </Flex>
      <Panel
        variant="outline"
        tone="neutral"
        class="box-shadow-none"
        bodyClass="overflow-x-auto"
      >
        <slot></slot>
      </Panel>
      <Panel
        r-if="resultTitle || resultMeta"
        :tone="tone"
        variant="outline"
        class="box-shadow-none"
      >
        <Flex align="center" justify="between" wrap="true" class="mb-2">
          <strong r-if="resultTitle">{{ resultTitle }}</strong>
          <Badge r-if="resultMeta" :tone="tone">{{ resultMeta }}</Badge>
        </Flex>
        <slot name="result"></slot>
      </Panel>
    </Flex>
  </Panel>`

  return {
    codeShowcase: defineComponent<CodeShowcase>(codeShowcaseTemplate, {
      props: [
        'eyebrow',
        'title',
        'summary',
        'language',
        'resultTitle',
        'resultMeta',
        'tone',
        'variant',
      ],
    }),
  }
}
