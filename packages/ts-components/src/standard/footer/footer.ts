import { defineComponent, html } from 'regor'

export interface SiteFooter {
  teleport?: string
  ariaLabel?: string
  copyright?: string
  legalLabel?: string
  tone?: string
  rootClass?: string
}

export interface FooterSocial {
  href?: string
  label?: string
  icon?: string
  target?: string
  rel?: string
}

const siteFooterTemplate = html`<footer
  class="site-footer doc-content"
  :class="rootClass"
  :aria-label="ariaLabel"
  :r-teleport="teleport"
>
  <div class="site-footer__inner">
    <slot></slot>

    <div class="site-footer__bottom">
      <p class="site-footer__copyright">{{ copyright }}</p>
      <nav class="site-footer__legal" :aria-label="legalLabel">
        <slot name="legal"></slot>
      </nav>
      <div class="site-footer__social"><slot name="social"></slot></div>
    </div>
  </div>
</footer>`

const footerSocialTemplate = html`<a
  class="footer-social"
  :href="href"
  r-if="href"
  :target="target"
  :rel="rel"
  :aria-label="label"
>
  <Icon class="footer-social__icon" :name="icon || 'iconoir:code'"/>
  <span class="footer-social__label" r-if="label">{{ label }}</span>
</a>`

function defineSiteFooterComponent() {
  return defineComponent<SiteFooter>(siteFooterTemplate, {
    props: ['teleport', 'ariaLabel', 'copyright', 'legalLabel', 'tone'],
    context: (head) => resolveSiteFooter(head.props),
  })
}

function defineFooterSocialComponent() {
  return defineComponent<FooterSocial>(footerSocialTemplate, {
    props: ['href', 'label', 'icon', 'target', 'rel'],
    context: (head) => resolveFooterSocial(head.props),
  })
}

export function defineFooterComponents() {
  return {
    siteFooter: defineSiteFooterComponent(),
    footerSocial: defineFooterSocialComponent(),
  }
}

function resolveSiteFooter(props: SiteFooter): SiteFooter {
  const year = new Date().getFullYear()
  const tone = resolveFooterTone(props.tone)
  if (!props.teleport) props.teleport = 'body'
  return {
    ...props,
    ariaLabel: props.ariaLabel || 'Site footer',
    legalLabel: props.legalLabel || 'Legal and policy links',
    copyright: props.copyright || `(c) ${year}. All rights reserved.`,
    rootClass: `site-footer--tone-${tone}`,
  }
}

function resolveFooterSocial(props: FooterSocial): FooterSocial {
  const rel =
    props.rel || (props.target === '_blank' ? 'noopener noreferrer' : '')
  return {
    ...props,
    rel,
    label: props.label || '',
  }
}

function resolveFooterTone(value?: string) {
  const normalized = value?.toLowerCase() || ''
  if (
    normalized === 'accent' ||
    normalized === 'neutral' ||
    normalized === 'default'
  ) {
    return normalized
  }
  return 'default'
}
