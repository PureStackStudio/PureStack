import { createComponent, html } from 'regor'

import { styleBuilder } from '../../style/styles'
import { getThemeOptions, getThemePalette } from '../../style/themeOptions'

export interface ThemePricingColors {
  background: string
  border: string
  title: string
  subtitle: string
  eyebrow: string
  footnote: string
  glow: string
  planBackground: string
  planBorder: string
  planShadow: string
  planTitle: string
  planSummary: string
  planPrice: string
  planPeriod: string
  planFeature: string
  planFeatureBullet: string
  planBadgeBackground: string
  planBadgeText: string
  planNote: string
  planCtaBackground: string
  planCtaText: string
  planCtaBorder: string
  planCtaHover: string
  planCtaShadow: string
  planHighlightBackground: string
  planHighlightBorder: string
  planHighlightShadow: string
  planHighlightCtaBackground: string
  planHighlightCtaText: string
  planHighlightCtaHover: string
  focusRing: string
}

interface PricingTableProps {
  eyebrow?: string
  title?: string
  subtitle?: string
  footnote?: string
}

interface PricingTableContext {
  eyebrow: string
  title: string
  subtitle: string
  footnote: string
  hasHeader: boolean
  hasFootnote: boolean
}

interface PricingPlanProps {
  title?: string
  summary?: string
  price?: string
  period?: string
  badge?: string
  note?: string
  variant?: string
  ctaLabel?: string
  ctaLink?: string
  ctaTarget?: string
  ctaRel?: string
}

interface PricingPlanContext {
  title: string
  summary: string
  price: string
  period: string
  badge: string
  note: string
  planClass: string
  hasBadge: boolean
  hasPrice: boolean
  hasCta: boolean
  ctaHtml: string
}

const pricingTableTemplate = html`<section class="pricing">
  <div class="pricing__header" r-if="hasHeader">
    <p class="pricing__eyebrow" r-if="eyebrow">{{ eyebrow }}</p>
    <h2 class="pricing__title" r-if="title">{{ title }}</h2>
    <p class="pricing__subtitle" r-if="subtitle">{{ subtitle }}</p>
  </div>
  <div class="pricing__grid">
    <slot></slot>
  </div>
  <p class="pricing__footnote" r-if="hasFootnote">{{ footnote }}</p>
</section>`

const pricingPlanTemplate = html`<article :class="planClass">
  <div class="pricing-plan__head">
    <div class="pricing-plan__title-row">
      <h3 class="pricing-plan__title">{{ title }}</h3>
      <span class="pricing-plan__badge" r-if="hasBadge">{{ badge }}</span>
    </div>
    <p class="pricing-plan__summary" r-if="summary">{{ summary }}</p>
  </div>
  <div class="pricing-plan__price" r-if="hasPrice">
    <span class="pricing-plan__amount">{{ price }}</span>
    <span class="pricing-plan__period" r-if="period">{{ period }}</span>
  </div>
  <div class="pricing-plan__cta" r-if="hasCta" r-html="ctaHtml"></div>
  <ul class="pricing-plan__features">
    <slot></slot>
  </ul>
  <p class="pricing-plan__note" r-if="note">{{ note }}</p>
</article>`

function registerPricingStyles() {
  const themeOptions = getThemeOptions()
  const palette = (theme: string) => getThemePalette(theme, themeOptions)

  const basePricing = (theme: string) =>
    styleBuilder
      .select('.pricing', theme)
      .position('relative')
      .overflow('hidden')
      .padding('28px')
      .borderRadius(themeOptions.radii.lg)
      .border(`1px solid ${palette(theme).pricing.border}`)
      .background(palette(theme).pricing.background)
      .boxShadow(themeOptions.shadows.soft)
      .margin('0 0 32px')

  basePricing('light')
  basePricing('dark')

  const basePricingGlow = (theme: string) =>
    styleBuilder
      .select('.pricing::before', theme)
      .content('""')
      .position('absolute')
      .inset('0')
      .opacity('0.4')
      .background(palette(theme).pricing.glow)
      .pointerEvents('none')

  basePricingGlow('light')
  basePricingGlow('dark')

  const baseHeader = (theme: string) =>
    styleBuilder
      .select('.pricing__header', theme)
      .position('relative')
      .zIndex('1')
      .display('grid')
      .gap('6px')
      .margin('0 0 20px')

  baseHeader('light')
  baseHeader('dark')

  const baseEyebrow = (theme: string) =>
    styleBuilder
      .select('.pricing__eyebrow', theme)
      .textTransform('uppercase')
      .letterSpacing('0.18em')
      .fontSize('11px')
      .fontWeight('700')
      .margin('0')

  baseEyebrow('light').color(palette('light').pricing.eyebrow)
  baseEyebrow('dark').color(palette('dark').pricing.eyebrow)

  const baseTitle = (theme: string) =>
    styleBuilder
      .select('.pricing__title', theme)
      .margin('0')
      .fontSize('clamp(24px, 3.2vw, 34px)')
      .fontWeight('700')
      .letterSpacing('-0.02em')

  baseTitle('light').color(palette('light').pricing.title)
  baseTitle('dark').color(palette('dark').pricing.title)

  const baseSubtitle = (theme: string) =>
    styleBuilder
      .select('.pricing__subtitle', theme)
      .margin('0')
      .fontSize('14px')
      .lineHeight('1.6')
      .maxWidth('680px')

  baseSubtitle('light').color(palette('light').pricing.subtitle)
  baseSubtitle('dark').color(palette('dark').pricing.subtitle)

  const baseGrid = (theme: string) =>
    styleBuilder
      .select('.pricing__grid', theme)
      .position('relative')
      .zIndex('1')
      .display('grid')
      .gridTemplateColumns('repeat(2, minmax(0, 1fr))')
      .gap('16px')
      .alignItems('stretch')

  baseGrid('light')
  baseGrid('dark')

  const baseFootnote = (theme: string) =>
    styleBuilder
      .select('.pricing__footnote', theme)
      .position('relative')
      .zIndex('1')
      .margin('5px 0 0 !important;')
      .fontSize('12px')

  baseFootnote('light').color(palette('light').pricing.footnote)
  baseFootnote('dark').color(palette('dark').pricing.footnote)

  const basePlan = (theme: string) =>
    styleBuilder
      .select('.pricing-plan', theme)
      .display('flex')
      .flexDirection('column')
      .gap('12px')
      .padding('18px')
      .borderRadius(themeOptions.radii.md)
      .border(`1px solid ${palette(theme).pricing.planBorder}`)
      .background(palette(theme).pricing.planBackground)
      .boxShadow(palette(theme).pricing.planShadow)
      .height('100%')

  basePlan('light')
  basePlan('dark')

  const basePlanHead = (theme: string) =>
    styleBuilder.select('.pricing-plan__head', theme).display('grid').gap('6px')

  basePlanHead('light')
  basePlanHead('dark')

  const baseTitleRow = (theme: string) =>
    styleBuilder
      .select('.pricing-plan__title-row', theme)
      .position('relative')
      .display('flex')
      .flexWrap('wrap')
      .gap('10px')
      .alignItems('center')
      .justifyContent('space-between')
      .paddingRight('96px')

  baseTitleRow('light')
  baseTitleRow('dark')

  const basePlanTitle = (theme: string) =>
    styleBuilder
      .select('.pricing-plan__title', theme)
      .margin('0')
      .fontSize('18px')
      .fontWeight('700')

  basePlanTitle('light').color(palette('light').pricing.planTitle)
  basePlanTitle('dark').color(palette('dark').pricing.planTitle)

  const baseBadge = (theme: string) =>
    styleBuilder
      .select('.pricing-plan__badge', theme)
      .position('absolute')
      .top('0')
      .right('0')
      .padding('4px 10px')
      .borderRadius(themeOptions.radii.pill)
      .fontSize('11px')
      .fontWeight('700')
      .textTransform('uppercase')
      .letterSpacing('0.1em')

  baseBadge('light')
    .background(palette('light').pricing.planBadgeBackground)
    .color(palette('light').pricing.planBadgeText)
  baseBadge('dark')
    .background(palette('dark').pricing.planBadgeBackground)
    .color(palette('dark').pricing.planBadgeText)

  const baseSummary = (theme: string) =>
    styleBuilder
      .select('.pricing-plan__summary', theme)
      .margin('0')
      .fontSize('13px')
      .lineHeight('1.5')

  baseSummary('light').color(palette('light').pricing.planSummary)
  baseSummary('dark').color(palette('dark').pricing.planSummary)

  const basePrice = (theme: string) =>
    styleBuilder
      .select('.pricing-plan__price', theme)
      .display('flex')
      .gap('10px')
      .alignItems('baseline')
      .set('min-height', '38px')

  basePrice('light')
  basePrice('dark')

  const baseAmount = (theme: string) =>
    styleBuilder
      .select('.pricing-plan__amount', theme)
      .fontSize('24px')
      .fontWeight('700')
      .letterSpacing('-0.02em')

  baseAmount('light').color(palette('light').pricing.planPrice)
  baseAmount('dark').color(palette('dark').pricing.planPrice)

  const basePeriod = (theme: string) =>
    styleBuilder
      .select('.pricing-plan__period', theme)
      .fontSize('11px')
      .textTransform('uppercase')
      .letterSpacing('0.12em')
      .fontWeight('600')

  basePeriod('light').color(palette('light').pricing.planPeriod)
  basePeriod('dark').color(palette('dark').pricing.planPeriod)

  const baseCta = (theme: string) =>
    styleBuilder.select('.pricing-plan__cta', theme).margin('0')

  baseCta('light')
  baseCta('dark')

  const baseCtaLink = (theme: string) =>
    styleBuilder
      .select('.pricing-plan__cta-link', theme)
      .display('inline-flex')
      .alignItems('center')
      .justifyContent('center')
      .gap('8px')
      .padding('9px 14px')
      .borderRadius(themeOptions.radii.pill)
      .fontWeight('600')
      .fontSize('13px')
      .textDecoration('none')
      .border(`1px solid ${palette(theme).pricing.planCtaBorder}`)
      .background(palette(theme).pricing.planCtaBackground)
      .color(palette(theme).pricing.planCtaText)
      .boxShadow(palette(theme).pricing.planCtaShadow)
      .transition(
        'transform 180ms ease, box-shadow 180ms ease, background 180ms ease',
      )

  baseCtaLink('light')
  baseCtaLink('dark')

  styleBuilder
    .select('.pricing-plan__cta-link:hover', 'light')
    .background(palette('light').pricing.planCtaHover)
    .transform('translateY(-1px)')

  styleBuilder
    .select('.pricing-plan__cta-link:hover', 'dark')
    .background(palette('dark').pricing.planCtaHover)
    .transform('translateY(-1px)')

  styleBuilder
    .select('.pricing-plan__cta-link:focus-visible', 'light')
    .outline(`2px solid ${palette('light').pricing.focusRing}`)
    .outlineOffset('2px')

  styleBuilder
    .select('.pricing-plan__cta-link:focus-visible', 'dark')
    .outline(`2px solid ${palette('dark').pricing.focusRing}`)
    .outlineOffset('2px')

  const baseFeatures = (theme: string) =>
    styleBuilder
      .select('.pricing-plan__features', theme)
      .listStyle('none')
      .padding('0')
      .margin('0')
      .display('block')
      .set('column-gap', '18px')
      .set('column-count', '1')

  baseFeatures('light')
  baseFeatures('dark')

  const baseFeatureItem = (theme: string) =>
    styleBuilder
      .select('.pricing-plan__features li', theme)
      .set('break-inside', 'avoid')
      .position('relative')
      .paddingLeft('18px')
      .fontSize('13px')
      .lineHeight('1.5')
      .marginBottom('8px')

  baseFeatureItem('light').color(palette('light').pricing.planFeature)
  baseFeatureItem('dark').color(palette('dark').pricing.planFeature)

  const baseFeatureBullet = (theme: string) =>
    styleBuilder
      .select('.pricing-plan__features li::before', theme)
      .content('""')
      .position('absolute')
      .left('0')
      .top('0.55em')
      .width('8px')
      .height('8px')
      .borderRadius('50%')
      .background(palette(theme).pricing.planFeatureBullet)

  baseFeatureBullet('light')
  baseFeatureBullet('dark')

  const baseNote = (theme: string) =>
    styleBuilder
      .select('.pricing-plan__note', theme)
      .margin('0')
      .fontSize('11px')
      .lineHeight('1.5')

  baseNote('light').color(palette('light').pricing.planNote)
  baseNote('dark').color(palette('dark').pricing.planNote)

  const featuredPlan = (theme: string) =>
    styleBuilder
      .select('.pricing-plan--featured', theme)
      .background(palette(theme).pricing.planHighlightBackground)
      .border(`1px solid ${palette(theme).pricing.planHighlightBorder}`)
      .boxShadow(palette(theme).pricing.planHighlightShadow)

  featuredPlan('light')
  featuredPlan('dark')

  const featuredBefore = (theme: string) =>
    styleBuilder
      .select('.pricing-plan--featured::before', theme)
      .content('""')
      .position('absolute')
      .inset('0')
      .borderRadius(themeOptions.radii.md)
      .border(`1px solid ${palette(theme).pricing.planHighlightBorder}`)
      .opacity('0.5')
      .pointerEvents('none')

  featuredBefore('light')
  featuredBefore('dark')

  styleBuilder
    .select('.pricing-plan--featured', 'light')
    .position('relative')
    .transform('translateY(-4px)')

  styleBuilder
    .select('.pricing-plan--featured', 'dark')
    .position('relative')
    .transform('translateY(-4px)')

  const featuredCta = (theme: string) =>
    styleBuilder
      .select('.pricing-plan--featured .pricing-plan__cta-link', theme)
      .background(palette(theme).pricing.planHighlightCtaBackground)
      .color(palette(theme).pricing.planHighlightCtaText)
      .borderColor('transparent')

  featuredCta('light')
  featuredCta('dark')

  styleBuilder
    .select('.pricing-plan--featured .pricing-plan__cta-link:hover', 'light')
    .background(palette('light').pricing.planHighlightCtaHover)

  styleBuilder
    .select('.pricing-plan--featured .pricing-plan__cta-link:hover', 'dark')
    .background(palette('dark').pricing.planHighlightCtaHover)

  const featureColumns = (theme: string) =>
    styleBuilder
      .select('.pricing-plan__features', theme)
      .media('min-width: 1400px')
      .set('column-count', '2')

  featureColumns('light')
  featureColumns('dark')

  const mobileGrid = (theme: string) =>
    styleBuilder
      .select('.pricing__grid', theme)
      .media('max-width: 720px')
      .gridTemplateColumns('1fr')

  mobileGrid('light')
  mobileGrid('dark')

  const mobilePricing = (theme: string) =>
    styleBuilder
      .select('.pricing', theme)
      .media('max-width: 720px')
      .padding('22px')

  mobilePricing('light')
  mobilePricing('dark')

  const mobileFeatured = (theme: string) =>
    styleBuilder
      .select('.pricing-plan--featured', theme)
      .media('max-width: 720px')
      .transform('translateY(0)')

  mobileFeatured('light')
  mobileFeatured('dark')
}

function createPricingTableComponent() {
  return createComponent<PricingTableContext>(pricingTableTemplate, {
    props: ['eyebrow', 'title', 'subtitle', 'footnote'],
    context: (head) =>
      resolvePricingTableContext(head.props as PricingTableProps),
  })
}

function createPricingPlanComponent() {
  return createComponent<PricingPlanContext>(pricingPlanTemplate, {
    props: [
      'title',
      'summary',
      'price',
      'period',
      'badge',
      'note',
      'variant',
      'ctaLabel',
      'ctaLink',
      'ctaTarget',
      'ctaRel',
    ],
    context: (head) =>
      resolvePricingPlanContext(head.props as PricingPlanProps),
  })
}

export function createPricingComponents() {
  registerPricingStyles()
  return {
    pricingTable: createPricingTableComponent(),
    pricingPlan: createPricingPlanComponent(),
  }
}

function resolvePricingTableContext(
  props: PricingTableProps,
): PricingTableContext {
  const eyebrow = resolveString(props.eyebrow)
  const title = resolveString(props.title)
  const subtitle = resolveString(props.subtitle)
  const footnote = resolveString(props.footnote)
  return {
    eyebrow,
    title,
    subtitle,
    footnote,
    hasHeader: Boolean(eyebrow || title || subtitle),
    hasFootnote: Boolean(footnote),
  }
}

function resolvePricingPlanContext(
  props: PricingPlanProps,
): PricingPlanContext {
  const title = resolveString(props.title) || 'Plan'
  const summary = resolveString(props.summary)
  const price = resolveString(props.price)
  const period = resolveString(props.period)
  const badge = resolveString(props.badge)
  const note = resolveString(props.note)
  const variant = resolveVariant(props.variant)
  const ctaLabel = resolveString(props.ctaLabel)
  const ctaLink = resolveString(props.ctaLink)
  const ctaTarget = resolveString(props.ctaTarget)
  const rawRel = resolveString(props.ctaRel)
  const ctaRel = rawRel || (ctaTarget === '_blank' ? 'noopener noreferrer' : '')
  const hasCta = Boolean(ctaLabel && ctaLink)
  return {
    title,
    summary,
    price,
    period,
    badge,
    note,
    planClass: ['pricing-plan', variant ? `pricing-plan--${variant}` : '']
      .filter(Boolean)
      .join(' '),
    hasBadge: Boolean(badge),
    hasPrice: Boolean(price),
    hasCta,
    ctaHtml: hasCta
      ? renderPricingCta({
          label: ctaLabel,
          link: ctaLink,
          target: ctaTarget,
          rel: ctaRel || undefined,
        })
      : '',
  }
}

function renderPricingCta(action: {
  label: string
  link: string
  target?: string
  rel?: string
}) {
  const attrs = [
    'class="pricing-plan__cta-link"',
    `href="${escapeAttr(action.link)}"`,
  ]
  if (action.target) {
    attrs.push(`target="${escapeAttr(action.target)}"`)
  }
  if (action.rel) {
    attrs.push(`rel="${escapeAttr(action.rel)}"`)
  }
  return `<a ${attrs.join(' ')}>${escapeHtml(action.label)}</a>`
}

function resolveVariant(value?: string) {
  const normalized = resolveString(value).toLowerCase()
  if (!normalized) return ''
  if (normalized === 'featured' || normalized === 'primary') return 'featured'
  return ''
}

function resolveString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : ''
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeAttr(value: string) {
  return escapeHtml(value).replace(/"/g, '&quot;')
}
