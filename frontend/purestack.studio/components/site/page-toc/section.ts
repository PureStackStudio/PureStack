import { defineComponent, html, type Ref, type SRef } from 'regor'

export interface Section {
  key: number
  title: Ref<string>
  excluded: Ref<boolean>
  id: Ref<string>
  heading: SRef<HTMLHeadingElement | null>
}

export interface TocPlaygroundSection {
  section: Section
}

const sectionTemplate = html`<Panel tone="accent" variant="surface" bodyClass="p-4">
  <Flex direction="column" class="gap-3">
    <h3
      class="m-0 fs-lg fw-600"
      :ref="section.heading"
      :id="section.id || undefined"
      :data-toc-ignore="section.excluded ? '' : undefined"
    >
      {{ section.title }}
    </h3>
    <p class="m-0 fs-xs wrap-anywhere">
      <code class="ws-normal">{{ section.id ? 'ID: #' + section.id : 'ID assigned on refresh' }}</code>
      · {{ section.excluded ? 'Excluded from the outline' : 'Included on refresh' }}
    </p>
    <p class="m-0">
      This heading is rendered by Regor in the browser. Its TOC link, nesting
      and active state come from the page runtime.
    </p>
  </Flex>
</Panel>`

export function defineTocPlaygroundSection() {
  return defineComponent<TocPlaygroundSection>(sectionTemplate, {
    props: ['section'],
  })
}
