import { defineComponent, html } from 'regor'

export interface FooterStartCard {
  title: string
}

const startTemplate = html`<Panel variant="surface" class="footer-start p-0" bodyClass="footer-start-body">
  <Flex justify="between" align="center" class="footer-start-heading">
    <IconFrame name="lucide:book-open" tone="accent" variant="surface"/>
    <span class="footer-kicker">A clear place to start</span>
  </Flex>
  <h2>{{ title }}</h2>
  <p>Start with your message. The guide shows you where each piece lives.</p>
  <BtnLink
    href="/guide/"
    tone="accent"
    variant="link"
    icon="lucide:arrow-up-right"
    iconPosition="end"
    class="footer-start-link"
    >Open the guide</BtnLink>
</Panel>`

export function defineFooterStartCardComponent() {
  return defineComponent<FooterStartCard>(startTemplate, {
    context: () => ({ title: 'Make this space your own.' }),
  })
}
