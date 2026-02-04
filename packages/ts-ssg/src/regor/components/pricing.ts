import { createComponent, html } from 'regor'

import { getSvgIcon } from '../../style/icons'
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
  planIconBackground: string
  planIconGradient: string
  planIconColor: string
  planIconRing: string
  planFeature: string
  planFeatureIconBackground: string
  planFeatureIconGradient: string
  planFeatureIconColor: string
  planFeatureIconRing: string
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

interface PricingTableModel {
  eyebrow?: string
  title?: string
  subtitle?: string
  footnote?: string
  hasHeader: boolean
  hasFootnote: boolean
}

interface PricingPlanModel {
  title?: string
  summary?: string
  price?: string
  period?: string
  badge?: string
  note?: string
  variant?: string
  icon?: string
  ctaLabel?: string
  ctaLink?: string
  hasBadge: boolean
  hasPrice: boolean
  hasCta: boolean
  hasIcon: boolean
  iconSvg?: string
}

interface PricingFeatureModel {
  icon?: string
  iconSvg?: string
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

const pricingPlanTemplate = html`<article
  class="pricing-plan"
  :class="{ 'pricing-plan--featured': variant === 'featured' }"
>
  <div class="pricing-plan__head">
    <div class="pricing-plan__icon" r-if="hasIcon" r-html="iconSvg"></div>
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
  <div class="pricing-plan__cta" r-if="hasCta">
    <a class="pricing-plan__cta-link" :href="ctaLink">{{ ctaLabel }}</a>
  </div>
  <ul class="pricing-plan__features">
    <slot></slot>
  </ul>
  <p class="pricing-plan__note" r-if="note">{{ note }}</p>
</article>`

const pricingFeatureTemplate = html`<li class="pricing-feature">
  <span class="pricing-feature__icon" r-html="iconSvg"></span>
  <span class="pricing-feature__text"><slot></slot></span>
</li>`

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
      .margin('0 !important')
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

  const basePlanIcon = (theme: string) =>
    styleBuilder
      .select('.pricing-plan__icon', theme)
      .width('44px')
      .height('44px')
      .display('inline-flex')
      .alignItems('center')
      .justifyContent('center')
      .borderRadius('12px')
      .background(palette(theme).pricing.planIconGradient)
      .border(`1px solid ${palette(theme).pricing.planIconRing}`)
      .color(palette(theme).pricing.planIconColor)
      .boxShadow('0 10px 20px rgba(35, 56, 135, 0.25)')
      .marginBottom('4px')

  basePlanIcon('light')
  basePlanIcon('dark')

  styleBuilder
    .select('.pricing-plan__icon', 'light')
    .set('background-color', palette('light').pricing.planIconBackground)
  styleBuilder
    .select('.pricing-plan__icon', 'dark')
    .set('background-color', palette('dark').pricing.planIconBackground)

  const basePlanIconSvg = (theme: string) =>
    styleBuilder
      .select('.pricing-plan__icon svg', theme)
      .width('24px')
      .height('24px')
      .display('block')
      .stroke('currentColor')
      .fill('none')
      .set('stroke-linecap', 'round')
      .set('stroke-linejoin', 'round')
      .set('stroke-width', '2.2')

  basePlanIconSvg('light')
  basePlanIconSvg('dark')

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
      .select('.pricing-feature', theme)
      .set('break-inside', 'avoid')
      .display('grid')
      .gridTemplateColumns('18px minmax(0, 1fr)')
      .gap('8px')
      .alignItems('start')
      .fontSize('13px')
      .lineHeight('1.5')
      .marginBottom('8px')

  baseFeatureItem('light').color(palette('light').pricing.planFeature)
  baseFeatureItem('dark').color(palette('dark').pricing.planFeature)

  const baseFeatureIcon = (theme: string) =>
    styleBuilder
      .select('.pricing-feature__icon', theme)
      .width('22px')
      .height('22px')
      .display('inline-flex')
      .alignItems('center')
      .justifyContent('center')
      .borderRadius('7px')
      .background(palette(theme).pricing.planFeatureIconGradient)
      .border(`1px solid ${palette(theme).pricing.planFeatureIconRing}`)
      .color(palette(theme).pricing.planFeatureIconColor)
      .boxShadow('0 8px 16px rgba(39, 61, 146, 0.2)')
      .marginTop('0')

  baseFeatureIcon('light')
  baseFeatureIcon('dark')

  styleBuilder
    .select('.pricing-feature__icon', 'light')
    .set('background-color', palette('light').pricing.planFeatureIconBackground)
  styleBuilder
    .select('.pricing-feature__icon', 'dark')
    .set('background-color', palette('dark').pricing.planFeatureIconBackground)

  const baseFeatureIconSvg = (theme: string) =>
    styleBuilder
      .select('.pricing-feature__icon svg', theme)
      .width('14px')
      .height('14px')
      .display('block')
      .stroke('currentColor')
      .fill('none')
      .set('stroke-linecap', 'round')
      .set('stroke-linejoin', 'round')
      .set('stroke-width', '2.2')

  baseFeatureIconSvg('light')
  baseFeatureIconSvg('dark')

  const baseFeatureText = (theme: string) =>
    styleBuilder.select('.pricing-feature__text', theme).display('block')

  baseFeatureText('light')
  baseFeatureText('dark')

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
  return createComponent<PricingTableModel>(pricingTableTemplate, {
    props: ['eyebrow', 'title', 'subtitle', 'footnote'],
    context: (head) => resolvePricingTableContext(head.props),
  })
}

function createPricingPlanComponent() {
  return createComponent<PricingPlanModel>(pricingPlanTemplate, {
    props: [
      'title',
      'summary',
      'price',
      'period',
      'badge',
      'note',
      'variant',
      'icon',
      'ctaLabel',
      'ctaLink',
    ],
    context: (head) => resolvePricingPlanContext(head.props),
  })
}

function createPricingFeatureComponent() {
  return createComponent<PricingFeatureModel>(pricingFeatureTemplate, {
    props: ['icon'],
    context: (head) => resolvePricingFeatureContext(head.props),
  })
}

export function createPricingComponents() {
  registerPricingStyles()
  return {
    pricingTable: createPricingTableComponent(),
    pricingPlan: createPricingPlanComponent(),
    pricingFeature: createPricingFeatureComponent(),
  }
}

function resolvePricingTableContext(
  props: PricingTableModel,
): PricingTableModel {
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

function resolvePricingPlanContext(props: PricingPlanModel): PricingPlanModel {
  const title = resolveString(props.title) || 'Plan'
  const summary = resolveString(props.summary)
  const price = resolveString(props.price)
  const period = resolveString(props.period)
  const badge = resolveString(props.badge)
  const note = resolveString(props.note)
  const variant = resolveVariant(props.variant)
  const icon = resolveString(props.icon)
  const ctaLabel = resolveString(props.ctaLabel)
  const ctaLink = resolveString(props.ctaLink)
  const hasCta = Boolean(ctaLabel && ctaLink)
  return {
    title,
    summary,
    price,
    period,
    badge,
    note,
    variant,
    icon,
    hasBadge: Boolean(badge),
    hasPrice: Boolean(price),
    hasCta,
    hasIcon: Boolean(icon),
    iconSvg: getSvgIcon(icon, 'code'),
  }
}

function resolvePricingFeatureContext(
  props: PricingFeatureModel,
): PricingFeatureModel {
  const icon = resolveString(props.icon)
  return {
    icon,
    iconSvg: getSvgIcon(icon, 'check'),
  }
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
