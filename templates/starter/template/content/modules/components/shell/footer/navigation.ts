import { defineComponent, html } from 'regor'
import { StarterFooter } from './footer'

export interface FooterNavigation {
  footer: StarterFooter
}

const navigationTemplate = html`<Grid
  container="nav"
  columns="2"
  class="footer-navigation"
  aria-label="Footer navigation"
>
  <div r-for="group in footer.groups" class="footer-link-group">
    <h2>{{ group.title }}</h2>
    <a r-for="link in group.links" :href="link.href"
      >{{ link.label }}</a>
  </div>
</Grid>`

export function defineFooterNavigationComponent() {
  return defineComponent<FooterNavigation>(navigationTemplate, {
    context: (head) => ({ footer: head.requireContext(StarterFooter) }),
  })
}
