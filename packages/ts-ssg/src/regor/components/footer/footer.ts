import { getSvgIcon } from '@purestack/ts-svg-icons'
import { defineComponent, html } from 'regor'
import { resolveTsSsgContext } from '../../resolveTsSsgContext'
import type { TsSsgContext } from '../../ts-ssg-context'
import { registerFooterStyles } from './footerStyle'

interface SiteFooterProps {
  teleport?: string
  eyebrow?: string
  title?: string
  tagline?: string
  ariaLabel?: string
  copyright?: string
  legalLabel?: string
  variant?: string
  tone?: string
  ctaLabel?: string
  ctaHref?: string
  ctaTarget?: string
  ctaRel?: string
  newsletter?: unknown
  newsletterTitle?: string
  newsletterBody?: string
  newsletterAction?: string
  newsletterMethod?: string
  newsletterName?: string
  newsletterPlaceholder?: string
  newsletterButtonLabel?: string
}

interface SiteFooterContext extends SiteFooterProps {
  rootClass: string
  hasEyebrow: boolean
  hasTitle: boolean
  hasTagline: boolean
  hasCtaHref: boolean
  hasCtaTarget: boolean
  hasCtaRel: boolean
  showNewsletter: boolean
}

interface FooterColumnProps {
  title?: string
  description?: string
  compact?: unknown
}

interface FooterColumnContext extends FooterColumnProps {
  rootClass: string
  hasTitle: boolean
  hasDescription: boolean
}

interface FooterLinkProps {
  href?: string
  label?: string
  target?: string
  rel?: string
  icon?: string
  variant?: string
}

interface FooterLinkContext extends FooterLinkProps {
  rootClass: string
  hasHref: boolean
  hasTarget: boolean
  hasRel: boolean
  hasLabel: boolean
}

interface FooterSocialProps {
  href?: string
  label?: string
  icon?: string
  target?: string
  rel?: string
}

interface FooterSocialContext extends FooterSocialProps {
  iconSvg: string
  hasHref: boolean
  hasTarget: boolean
  hasRel: boolean
  hasLabel: boolean
}

const siteFooterTemplate = html`<footer
  class="site-footer"
  :class="rootClass"
  :aria-label="ariaLabel"
  :r-teleport="teleport"
>
  <div class="site-footer__inner">
    <div class="site-footer__top">
      <div class="site-footer__brand">
        <p class="site-footer__eyebrow" r-if="hasEyebrow">{{ eyebrow }}</p>
        <h2 class="site-footer__title" r-if="hasTitle">{{ title }}</h2>
        <p class="site-footer__tagline" r-if="hasTagline">{{ tagline }}</p>
      </div>
      <div class="site-footer__top-actions">
        <slot name="cta"></slot>
        <a
          class="site-footer__cta"
          :href="ctaHref"
          r-if="hasCtaHref"
          :target="hasCtaTarget ? ctaTarget : null"
          :rel="hasCtaRel ? ctaRel : null"
        >
          {{ ctaLabel }}
        </a>
      </div>
    </div>

    <div class="site-footer__main">
      <section class="site-footer__primary">
        <div class="site-footer__primary-content"><slot></slot></div>
        <div class="site-footer__status"><slot name="status"></slot></div>
      </section>
      <div class="site-footer__columns"><slot name="columns"></slot></div>

      <aside class="site-footer__newsletter" r-if="showNewsletter">
        <h3 class="site-footer__newsletter-title">{{ newsletterTitle }}</h3>
        <p class="site-footer__newsletter-body">{{ newsletterBody }}</p>
        <form
          class="site-footer__newsletter-form"
          :action="newsletterAction"
          :method="newsletterMethod"
        >
          <label class="site-footer__newsletter-label" for="site-footer-email"
            >Email address</label
          >
          <div class="site-footer__newsletter-row">
            <input
              id="site-footer-email"
              class="site-footer__newsletter-input"
              type="email"
              required
              :name="newsletterName"
              :placeholder="newsletterPlaceholder"
              autocomplete="email"
            />
            <button class="site-footer__newsletter-button" type="submit">
              {{ newsletterButtonLabel }}
            </button>
          </div>
        </form>
        <div class="site-footer__newsletter-extra">
          <slot name="newsletter"></slot>
        </div>
      </aside>
    </div>

    <div class="site-footer__bottom">
      <p class="site-footer__copyright">{{ copyright }}</p>
      <nav class="site-footer__legal" :aria-label="legalLabel">
        <slot name="legal"></slot>
      </nav>
      <div class="site-footer__social"><slot name="social"></slot></div>
    </div>
  </div>
</footer>`

const footerColumnTemplate = html`<section
  class="footer-column"
  :class="rootClass"
>
  <h3 class="footer-column__title" r-if="hasTitle">{{ title }}</h3>
  <p class="footer-column__description" r-if="hasDescription">
    {{ description }}
  </p>
  <ul class="footer-column__list">
    <slot></slot>
  </ul>
</section>`

const footerLinkTemplate = html`<li class="footer-link-item">
  <a
    r-if="hasHref"
    class="footer-link"
    :class="rootClass"
    :href="href"
    :target="hasTarget ? target : null"
    :rel="hasRel ? rel : null"
    :data-icon="icon || null"
  >
    {{ label }}
  </a>
  <span r-else class="footer-link" :class="rootClass">{{ label }}</span>
</li>`

const footerSocialTemplate = html`<a
  class="footer-social"
  :href="href"
  r-if="hasHref"
  :target="hasTarget ? target : null"
  :rel="hasRel ? rel : null"
  :aria-label="label"
>
  <span class="footer-social__icon" r-html="iconSvg"></span>
  <span class="footer-social__label" r-if="hasLabel">{{ label }}</span>
</a>`

function createSiteFooterComponent() {
  return defineComponent<SiteFooterContext>(siteFooterTemplate, {
    props: [
      'teleport',
      'eyebrow',
      'title',
      'tagline',
      'ariaLabel',
      'copyright',
      'legalLabel',
      'variant',
      'tone',
      'ctaLabel',
      'ctaHref',
      'ctaTarget',
      'ctaRel',
      'newsletter',
      'newsletterTitle',
      'newsletterBody',
      'newsletterAction',
      'newsletterMethod',
      'newsletterName',
      'newsletterPlaceholder',
      'newsletterButtonLabel',
    ],
    context: (head) => {
      return resolveSiteFooterContext(
        head.props,
        resolveSiteTitle(resolveTsSsgContext(head)),
      )
    },
  })
}

function createFooterColumnComponent() {
  return defineComponent<FooterColumnContext>(footerColumnTemplate, {
    props: ['title', 'description', 'compact'],
    context: (head) => resolveFooterColumnContext(head.props),
  })
}

function createFooterLinkComponent() {
  return defineComponent<FooterLinkContext>(footerLinkTemplate, {
    props: ['href', 'label', 'target', 'rel', 'icon', 'variant'],
    context: (head) => resolveFooterLinkContext(head.props),
  })
}

function createFooterSocialComponent() {
  return defineComponent<FooterSocialContext>(footerSocialTemplate, {
    props: ['href', 'label', 'icon', 'target', 'rel'],
    context: (head) => resolveFooterSocialContext(head.props),
  })
}

export function createFooterComponents() {
  registerFooterStyles()
  return {
    siteFooter: createSiteFooterComponent(),
    footerColumn: createFooterColumnComponent(),
    footerLink: createFooterLinkComponent(),
    footerSocial: createFooterSocialComponent(),
  }
}

function resolveSiteTitle(context: TsSsgContext): string {
  const siteTitle = context?.site?.siteTitle
  if (typeof siteTitle !== 'string') return 'Your Site'
  const trimmed = siteTitle.trim()
  return trimmed.length > 0 ? trimmed : 'Your Site'
}

function resolveSiteFooterContext(
  props: SiteFooterProps,
  siteTitle: string,
): SiteFooterContext {
  const year = new Date().getFullYear()
  const tone = resolveFooterTone(props.tone)
  const variant = resolveFooterVariant(props.variant)
  const showNewsletter = (props.newsletter ?? true) as boolean
  const ctaRel =
    props.ctaRel || (props.ctaTarget === '_blank' ? 'noopener noreferrer' : '')
  if (!props.teleport) props.teleport = 'body'
  return {
    ...props,
    eyebrow: props.eyebrow || 'Engineered for ambitious teams',
    title: props.title || `${siteTitle} keeps shipping after launch`,
    tagline:
      props.tagline ||
      'Use this footer for docs, product pages, blogs, marketplaces, and internal portals. It scales from simple links to conversion-focused layouts.',
    ariaLabel: props.ariaLabel || 'Site footer',
    legalLabel: props.legalLabel || 'Legal and policy links',
    ctaLabel: props.ctaLabel || 'Start now',
    ctaRel,
    newsletterTitle: props.newsletterTitle || 'Stay in the loop',
    newsletterBody:
      props.newsletterBody ||
      'Monthly release notes, practical guides, and zero-noise product updates.',
    newsletterAction: props.newsletterAction || '#',
    newsletterMethod: normalizeNewsletterMethod(props.newsletterMethod),
    newsletterName: props.newsletterName || 'email',
    newsletterPlaceholder: props.newsletterPlaceholder || 'name@company.com',
    newsletterButtonLabel: props.newsletterButtonLabel || 'Subscribe',
    copyright:
      props.copyright || `© ${year} ${siteTitle}. All rights reserved.`,
    rootClass: `site-footer--tone-${tone} site-footer--variant-${variant}`,
    showNewsletter,
    hasEyebrow: Boolean(props.eyebrow || true),
    hasTitle: Boolean(props.title || true),
    hasTagline: Boolean(props.tagline || true),
    hasCtaHref: Boolean(props.ctaHref),
    hasCtaTarget: Boolean(props.ctaTarget),
    hasCtaRel: Boolean(ctaRel),
  }
}

function resolveFooterColumnContext(
  props: FooterColumnProps,
): FooterColumnContext {
  const compact = Boolean(props.compact)
  return {
    ...props,
    rootClass: compact ? 'footer-column--compact' : '',
    hasTitle: Boolean(props.title),
    hasDescription: Boolean(props.description),
  }
}

function resolveFooterLinkContext(props: FooterLinkProps): FooterLinkContext {
  const variant = resolveFooterLinkVariant(props.variant)
  const rel =
    props.rel || (props.target === '_blank' ? 'noopener noreferrer' : '')
  return {
    ...props,
    rootClass: `footer-link--${variant}`,
    rel,
    hasHref: Boolean(props.href),
    hasTarget: Boolean(props.target),
    hasRel: Boolean(rel),
    hasLabel: Boolean(props.label),
  }
}

function resolveFooterSocialContext(
  props: FooterSocialProps,
): FooterSocialContext {
  const rel =
    props.rel || (props.target === '_blank' ? 'noopener noreferrer' : '')
  return {
    ...props,
    rel,
    label: props.label || '',
    iconSvg: getSvgIcon(`${props.icon || 'iconoir:code'}`),
    hasHref: Boolean(props.href),
    hasTarget: Boolean(props.target),
    hasRel: Boolean(rel),
    hasLabel: Boolean(props.label),
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

function resolveFooterVariant(value?: string) {
  const normalized = value?.toLowerCase() || ''
  if (
    normalized === 'default' ||
    normalized === 'minimal' ||
    normalized === 'feature'
  ) {
    return normalized
  }
  return 'feature'
}

function resolveFooterLinkVariant(value?: string) {
  const normalized = value?.toLowerCase() || ''
  if (
    normalized === 'default' ||
    normalized === 'muted' ||
    normalized === 'strong'
  ) {
    return normalized
  }
  return 'default'
}

function normalizeNewsletterMethod(value?: string) {
  const normalized = value?.toLowerCase() || ''
  if (normalized === 'post') return 'post'
  return 'get'
}
