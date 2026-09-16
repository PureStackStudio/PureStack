import { defineComponent, html, type RefOrValue } from 'regor'

export interface StudioFaq {
  title?: RefOrValue<string>
}

const studioFaqTemplate = html`<ExpandablePanel
  :title="title"
  tone="neutral"
  variant="none"
  summaryVariant="none"
>
  <p><slot></slot></p>
</ExpandablePanel>`

export function defineStudioFaqComponent() {
  return defineComponent<StudioFaq>(studioFaqTemplate, { props: ['title'] })
}
