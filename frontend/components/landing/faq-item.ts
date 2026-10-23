import { defineComponent, html, type RefOrValue } from 'regor'

export interface FaqItem {
  title?: RefOrValue<string>
}

const faqItemTemplate = html`<ExpandablePanel
  :title="title"
  tone="neutral"
  variant="none"
  summaryVariant="none"
>
  <p><slot></slot></p>
</ExpandablePanel>`

export function defineFaqItemComponent() {
  return defineComponent<FaqItem>(faqItemTemplate, { props: ['title'] })
}
