import type { SiteConfig } from 'purestack'
import { defineComponent, html } from 'regor'

export interface FooterBrand {
  description: string
  logo: SiteConfig['logo']
}

const brandTemplate = html`<div class="footer-brand">
  <SiteLogo :config="logo"/>
  <p class="footer-description">{{ description }}</p>
  <Flex align="center" class="footer-theme-row"><span>Find your light.</span><ThemeToggle/></Flex>
</div>`

export function defineFooterBrandComponent(logo: SiteConfig['logo']) {
  return defineComponent<FooterBrand>(brandTemplate, {
    context: () => ({
      logo,
      description: 'Your words, your direction, and a little room to grow.',
    }),
  })
}
