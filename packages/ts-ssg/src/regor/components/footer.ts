import { createComponent, html } from 'regor'

import { getSvgIcon } from '../../style/icons'
import { styleBuilder } from '../../style/styles'
import type { ThemeMode, ThemeOptions } from '../../style/themeOptions'
import { themes } from '../../style/themeOptions'
import type { ThemePalette } from '../../style/themePalette'
import { resolveTsSsgContext } from '../resolveTsSsgContext'
import type { TsSsgContext } from '../ts-ssg-context'

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

function registerFooterStyles() {
  themes.forEach((theme, palette, options) => {
    applyFooterShellStyles(theme, palette, options)
    applyFooterContentStyles(theme, palette, options)
    applyFooterActionStyles(theme, palette, options)
    applyFooterColumnStyles(theme, palette, options)
    applyFooterBottomStyles(theme, palette, options)
    applyFooterToneStyles(theme, palette)
    applyFooterResponsiveStyles(theme)
  })
}

function applyFooterShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-footer', theme)
    .position('relative')
    .overflow('hidden')
    .margin('36px 0 0')
    .padding('1px')
    .borderRadius(options.radii.lg)
    .background(palette.background.showcaseAlt)
    .boxShadow(palette.effect.panelShadowStrong)

  styleBuilder
    .select('.site-footer__inner', theme)
    .position('relative')
    .zIndex('1')
    .display('grid')
    .gap('28px')
    .padding('28px')
    .borderRadius(`calc(${options.radii.lg} - 1px)`)
    .background(palette.background.raised)
    .border(`1px solid ${palette.border.subtle}`)

  styleBuilder
    .select('.site-footer__top', theme)
    .display('grid')
    .gridTemplateColumns('minmax(0, 1fr) auto')
    .gap('16px')
    .alignItems('end')

  styleBuilder
    .select('.site-footer__brand', theme)
    .display('grid')
    .gap('10px')
    .maxWidth('760px')

  styleBuilder
    .select('.site-footer__top-actions', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('flex-end')
    .gap('10px')
    .flexWrap('wrap')

  styleBuilder.select('.site-footer__top-actions:empty', theme).display('none')

  styleBuilder
    .select('.site-footer__main', theme)
    .display('grid')
    .gridTemplateColumns('minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 0.95fr)')
    .gap('20px')
}

function applyFooterContentStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  applyFooterHeadingStyles(theme, palette)
  applyFooterPrimaryStyles(theme, palette)
  applyFooterStatusStyles(theme, palette, options)
}

function applyFooterHeadingStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.site-footer__eyebrow', theme)
    .margin('0')
    .fontSize('11px')
    .fontWeight('700')
    .textTransform('uppercase')
    .letterSpacing('0.14em')
    .color(palette.text.subtle)
  styleBuilder
    .select('.site-footer__title', theme)
    .margin('0')
    .fontSize('clamp(24px, 3.4vw, 34px)')
    .lineHeight('1.12')
    .letterSpacing('-0.02em')
    .color(palette.text.strong)
  styleBuilder
    .select('.site-footer__tagline', theme)
    .margin('0')
    .fontSize('16px')
    .lineHeight('1.6')
    .whiteSpace('pre-line')
    .color(palette.text.subtle)
}

function applyFooterPrimaryStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder.select('.site-footer__primary', theme).display('grid').gap('14px')
  styleBuilder
    .select('.site-footer__primary-content', theme)
    .display('grid')
    .gap('10px')
  styleBuilder
    .select('.site-footer__primary-content :where(p)', theme)
    .margin('0')
    .lineHeight('1.7')
    .color(palette.text.muted)
  styleBuilder
    .select('.site-footer__primary-content :where(a)', theme)
    .color(palette.text.accent)
    .fontWeight('600')
}

function applyFooterStatusStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-footer__status', theme)
    .display('flex')
    .alignItems('center')
    .gap('8px')
    .flexWrap('wrap')
  styleBuilder.select('.site-footer__status:empty', theme).display('none')
  styleBuilder
    .select('.site-footer__status :where(span, a, strong)', theme)
    .display('inline-flex')
    .alignItems('center')
    .padding('5px 10px')
    .borderRadius(options.radii.pill)
    .background(palette.badge.muted.background)
    .color(palette.badge.muted.text)
    .fontSize('11px')
    .fontWeight('700')
    .letterSpacing('0.06em')
    .textTransform('uppercase')
    .textDecoration('none')
}

function applyFooterActionStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  applyFooterCtaStyles(theme, palette, options)
  applyFooterNewsletterStyles(theme, palette, options)
}

function applyFooterCtaStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-footer__cta', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .gap('8px')
    .padding('10px 18px')
    .borderRadius(options.radii.pill)
    .textDecoration('none')
    .fontWeight('700')
    .border(`1px solid ${palette.border.accent}`)
    .background(palette.action.accent.background)
    .color(palette.action.accent.text)
    .transition(
      'background 170ms ease, border-color 170ms ease, transform 170ms ease',
    )

  styleBuilder
    .select('.site-footer__cta:hover', theme)
    .background(palette.action.accent.hover)
    .transform('translateY(-1px)')

  styleBuilder
    .select('.site-footer__cta:focus-visible', theme)
    .outline(`2px solid ${palette.action.accent.focusRing}`)
    .outlineOffset('2px')
}

function applyFooterNewsletterStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  applyFooterNewsletterShellStyles(theme, palette, options)
  applyFooterNewsletterFieldStyles(theme, palette, options)
  applyFooterNewsletterButtonStyles(theme, palette, options)
  applyFooterNewsletterMetaStyles(theme, palette)
}

function applyFooterNewsletterShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-footer__columns', theme)
    .display('grid')
    .gridTemplateColumns('repeat(2, minmax(0, 1fr))')
    .gap('16px')
  styleBuilder
    .select('.site-footer__newsletter', theme)
    .display('grid')
    .gap('10px')
    .padding('14px')
    .borderRadius(options.radii.md)
    .background(palette.background.surface)
    .border(`1px solid ${palette.border.default}`)
  styleBuilder
    .select('.site-footer__newsletter-title', theme)
    .margin('0')
    .fontSize('16px')
    .fontWeight('700')
    .letterSpacing('-0.01em')
    .color(palette.text.strong)
  styleBuilder
    .select('.site-footer__newsletter-body', theme)
    .margin('0')
    .fontSize('14px')
    .lineHeight('1.6')
    .color(palette.text.muted)
  styleBuilder
    .select('.site-footer__newsletter-form', theme)
    .display('grid')
    .gap('8px')
}

function applyFooterNewsletterFieldStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-footer__newsletter-label', theme)
    .fontSize('12px')
    .fontWeight('600')
    .color(palette.text.subtle)
  styleBuilder
    .select('.site-footer__newsletter-row', theme)
    .display('grid')
    .gridTemplateColumns('minmax(0, 1fr) auto')
    .gap('8px')
  styleBuilder
    .select('.site-footer__newsletter-input', theme)
    .width('100%')
    .padding('10px 12px')
    .borderRadius(options.radii.md)
    .border(`1px solid ${palette.border.default}`)
    .background(palette.background.surfaceAlt)
    .color(palette.text.default)
  styleBuilder
    .select('.site-footer__newsletter-input::placeholder', theme)
    .color(palette.text.soft)
  styleBuilder
    .select('.site-footer__newsletter-input:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
    .borderColor(palette.border.focus)
}

function applyFooterNewsletterButtonStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-footer__newsletter-button', theme)
    .padding('10px 14px')
    .borderRadius(options.radii.md)
    .border(`1px solid ${palette.border.default}`)
    .background(palette.action.neutral.background)
    .color(palette.action.neutral.text)
    .fontWeight('700')
    .cursor('pointer')
    .transition('background 170ms ease, transform 170ms ease')
  styleBuilder
    .select('.site-footer__newsletter-button:hover', theme)
    .background(palette.action.neutral.hover)
    .transform('translateY(-1px)')
  styleBuilder
    .select('.site-footer__newsletter-button:focus-visible', theme)
    .outline(`2px solid ${palette.action.neutral.focusRing}`)
    .outlineOffset('2px')
}

function applyFooterNewsletterMetaStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.site-footer__newsletter-extra:empty', theme)
    .display('none')
  styleBuilder
    .select('.site-footer__newsletter-extra', theme)
    .fontSize('12px')
    .lineHeight('1.5')
    .color(palette.text.subtle)
}

function applyFooterColumnStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  applyFooterColumnShellStyles(theme, palette, options)
  applyFooterColumnListStyles(theme)
  applyFooterLinkStyles(theme, palette, options)
}

function applyFooterColumnShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.footer-column', theme)
    .display('grid')
    .gap('9px')
    .padding('12px')
    .borderRadius(options.radii.md)
    .background(palette.background.surface)
    .border(`1px solid ${palette.border.subtle}`)
  styleBuilder
    .select('.footer-column--compact', theme)
    .gap('6px')
    .padding('10px')
  styleBuilder
    .select('.footer-column__title', theme)
    .margin('0')
    .fontSize('13px')
    .fontWeight('800')
    .textTransform('uppercase')
    .letterSpacing('0.08em')
    .color(palette.text.subtle)
  styleBuilder
    .select('.footer-column__description', theme)
    .margin('0')
    .fontSize('13px')
    .lineHeight('1.5')
    .color(palette.text.soft)
}

function applyFooterColumnListStyles(theme: ThemeMode) {
  styleBuilder
    .select('.footer-column__list', theme)
    .listStyle('none')
    .margin('0')
    .padding('0')
    .display('grid')
    .gap('4px')
  styleBuilder.select('.footer-link-item', theme).listStyle('none')
}

function applyFooterLinkStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.footer-link', theme)
    .display('inline-flex')
    .alignItems('center')
    .gap('6px')
    .textDecoration('none')
    .fontSize('14px')
    .lineHeight('1.6')
    .color(palette.text.default)
    .transition('color 150ms ease')
  styleBuilder.select('.footer-link--muted', theme).color(palette.text.subtle)
  styleBuilder.select('.footer-link--strong', theme).fontWeight('700')
  styleBuilder.select('.footer-link:hover', theme).color(palette.text.accent)
  styleBuilder
    .select('.footer-link:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
    .borderRadius(options.radii.sm)
  styleBuilder
    .select('.footer-link[data-icon="external"]::after', theme)
    .content('""')
    .width('8px')
    .height('8px')
    .borderTop('2px solid currentColor')
    .borderRight('2px solid currentColor')
    .transform('translateY(-1px)')
  styleBuilder
    .select('.footer-link[data-icon="arrow"]::after', theme)
    .content('"->"')
    .fontSize('12px')
}

function applyFooterBottomStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  applyFooterBottomShellStyles(theme, palette)
  applyFooterBottomLegalStyles(theme, palette, options)
  applyFooterBottomSocialStyles(theme, palette, options)
}

function applyFooterBottomShellStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.site-footer__bottom', theme)
    .display('grid')
    .gridTemplateColumns('minmax(0, 1fr) auto auto')
    .gap('12px')
    .alignItems('center')
    .paddingTop('8px')
    .borderTop(`1px solid ${palette.border.subtle}`)
  styleBuilder
    .select('.site-footer__copyright', theme)
    .margin('0')
    .fontSize('13px')
    .lineHeight('1.5')
    .color(palette.text.soft)
}

function applyFooterBottomLegalStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-footer__legal', theme)
    .display('flex')
    .alignItems('center')
    .gap('12px')
    .flexWrap('wrap')
  styleBuilder
    .select('.site-footer__legal :where(a)', theme)
    .fontSize('13px')
    .fontWeight('600')
    .textDecoration('none')
    .color(palette.text.subtle)
  styleBuilder
    .select('.site-footer__legal :where(a:hover)', theme)
    .color(palette.text.accent)
  styleBuilder
    .select('.site-footer__legal :where(a:focus-visible)', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
    .borderRadius(options.radii.sm)
}

function applyFooterBottomSocialStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-footer__social', theme)
    .display('flex')
    .alignItems('center')
    .gap('8px')
    .justifyContent('flex-end')
    .flexWrap('wrap')
  styleBuilder
    .select('.footer-social', theme)
    .display('inline-flex')
    .alignItems('center')
    .gap('8px')
    .padding('7px 10px')
    .borderRadius(options.radii.pill)
    .border(`1px solid ${palette.border.default}`)
    .background(palette.background.surfaceAlt)
    .textDecoration('none')
    .fontSize('13px')
    .fontWeight('700')
    .color(palette.text.default)
    .transition(
      'background 160ms ease, border-color 160ms ease, transform 160ms ease',
    )
  styleBuilder
    .select('.footer-social:hover', theme)
    .background(palette.background.accentMuted)
    .borderColor(palette.border.accent)
    .transform('translateY(-1px)')
  styleBuilder
    .select('.footer-social:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
  styleBuilder
    .select('.footer-social__icon', theme)
    .width('16px')
    .height('16px')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
  styleBuilder
    .select('.footer-social__icon svg', theme)
    .width('16px')
    .height('16px')
    .display('block')
    .stroke('currentColor')
    .fill('none')
    .set('stroke-linecap', 'round')
    .set('stroke-linejoin', 'round')
    .set('stroke-width', '2')
}

function applyFooterToneStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.site-footer--tone-accent', theme)
    .background(palette.background.showcase)

  styleBuilder
    .select('.site-footer--tone-accent .site-footer__inner', theme)
    .background(palette.background.feature)
    .borderColor(palette.border.accent)

  styleBuilder
    .select('.site-footer--tone-neutral .site-footer__inner', theme)
    .background(palette.background.surface)

  styleBuilder
    .select('.site-footer--variant-minimal', theme)
    .background('transparent')
    .boxShadow('none')

  styleBuilder
    .select('.site-footer--variant-minimal .site-footer__inner', theme)
    .background('transparent')
}

function applyFooterResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.site-footer__main', theme)
    .media('max-width: 980px')
    .gridTemplateColumns('1fr')

  styleBuilder
    .select('.site-footer__columns', theme)
    .media('max-width: 640px')
    .gridTemplateColumns('1fr')

  styleBuilder
    .select('.site-footer__top', theme)
    .media('max-width: 840px')
    .gridTemplateColumns('1fr')

  styleBuilder
    .select('.site-footer__top-actions', theme)
    .media('max-width: 840px')
    .justifyContent('flex-start')

  styleBuilder
    .select('.site-footer__newsletter-row', theme)
    .media('max-width: 480px')
    .gridTemplateColumns('1fr')

  styleBuilder
    .select('.site-footer__bottom', theme)
    .media('max-width: 840px')
    .gridTemplateColumns('1fr')

  styleBuilder
    .select('.site-footer__social', theme)
    .media('max-width: 840px')
    .justifyContent('flex-start')
}

function createSiteFooterComponent() {
  return createComponent<SiteFooterContext>(siteFooterTemplate, {
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
  return createComponent<FooterColumnContext>(footerColumnTemplate, {
    props: ['title', 'description', 'compact'],
    context: (head) => resolveFooterColumnContext(head.props),
  })
}

function createFooterLinkComponent() {
  return createComponent<FooterLinkContext>(footerLinkTemplate, {
    props: ['href', 'label', 'target', 'rel', 'icon', 'variant'],
    context: (head) => resolveFooterLinkContext(head.props),
  })
}

function createFooterSocialComponent() {
  return createComponent<FooterSocialContext>(footerSocialTemplate, {
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
  const showNewsletter = resolveBooleanFlag(props.newsletter, true)
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
  const compact = resolveBooleanFlag(props.compact, false)
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
    iconSvg: getSvgIcon(
      resolveFooterSocialIcon(props.icon, props.label),
      'code',
    ),
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

function resolveFooterSocialIcon(icon?: string, label?: string) {
  const normalized = icon?.toLowerCase() || label?.toLowerCase() || ''
  if (normalized.includes('github')) return 'code'
  if (normalized.includes('discord')) return 'support'
  if (normalized.includes('linkedin')) return 'building'
  if (normalized.includes('x') || normalized.includes('twitter'))
    return 'rocket'
  if (normalized.includes('community') || normalized.includes('forum')) {
    return 'stack'
  }
  if (normalized.includes('security')) return 'shield'
  return 'code'
}

function normalizeNewsletterMethod(value?: string) {
  const normalized = value?.toLowerCase() || ''
  if (normalized === 'post') return 'post'
  return 'get'
}

function resolveBooleanFlag(value: unknown, fallback: boolean) {
  if (typeof value === 'boolean') return value
  if (typeof value !== 'string') return fallback
  const normalized = value.trim().toLowerCase()
  if (
    normalized === 'false' ||
    normalized === '0' ||
    normalized === 'no' ||
    normalized === 'off'
  ) {
    return false
  }
  if (
    normalized === 'true' ||
    normalized === '1' ||
    normalized === 'yes' ||
    normalized === 'on'
  ) {
    return true
  }
  return fallback
}
