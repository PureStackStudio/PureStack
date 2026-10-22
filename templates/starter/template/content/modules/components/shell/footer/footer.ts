import { defineComponent, html } from 'regor'

export class StarterFooter {
  readonly groups = [
    {
      title: 'Explore',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Our story', href: '/about/' },
      ],
    },
    {
      title: 'Make it yours',
      links: [
        { label: 'The guide', href: '/guide/' },
        { label: 'Launch checklist', href: '/guide/checklist/' },
      ],
    },
  ]
}

const footerTemplate = html`<Grid columns="1" columnsLg="minmax(0, 0.9fr) minmax(0, 1fr) minmax(0, 1.1fr)"
  alignItems="start" class="footer-layout">
  <FooterBrand/>
  <FooterNavigation/>
  <FooterStartCard/>
</Grid>`

export function defineStarterFooterComponent() {
  return defineComponent<StarterFooter>(footerTemplate, {
    context: () => new StarterFooter(),
  })
}
