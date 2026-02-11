import { createComponent, html } from 'regor'

import { getSvgIcon } from '../../style/icons'
import { styleBuilder } from '../../style/styles'
import type { ThemeMode, ThemeOptions } from '../../style/themeOptions'
import { themes } from '../../style/themeOptions'
import type { ThemePalette } from '../../style/themePalette'

interface PricingTableProps {
  eyebrow?: string
  title?: string
  subtitle?: string
  footnote?: string
}

interface PricingTableContext extends PricingTableProps {
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
  icon?: string
  ctaLabel?: string
  ctaLink?: string
}

interface PricingPlanContext extends PricingPlanProps {
  hasBadge: boolean
  hasPrice: boolean
  hasCta: boolean
  hasIcon: boolean
  iconSvg?: string
}

interface PricingFeatureProps {
  icon?: string
}

interface PricingFeatureContext extends PricingFeatureProps {
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
    <div class="pricing-plan__meta">
      <div class="pricing-plan__icon" r-if="hasIcon" r-html="iconSvg"></div>
      <span class="pricing-plan__badge" r-if="hasBadge">{{ badge }}</span>
    </div>
    <div class="pricing-plan__title-row">
      <h3 class="pricing-plan__title">{{ title }}</h3>
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
  themes.forEach((theme, palette, options) => {
    applyPricingShellStyles(theme, palette, options)
    applyPricingHeaderStyles(theme, palette)
    applyPricingPlanStyles(theme, palette, options)
    applyPricingFeatureStyles(theme, palette)
    applyPricingFeaturedStyles(theme, palette, options)
    applyPricingResponsiveStyles(theme)
  })
}

function applyPricingShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.pricing', theme)
    .position('relative')
    .overflow('hidden')
    .padding('28px')
    .borderRadius(options.radii.lg)
    .border(`1px solid ${palette.border.subtle}`)
    .background(palette.background.showcaseAlt)
    .boxShadow(options.shadows.soft)
    .margin('0 0 32px')

  styleBuilder
    .select('.pricing::before', theme)
    .content('""')
    .position('absolute')
    .inset('0')
    .opacity('0.4')
    .background(palette.effect.glowSecondary)
    .pointerEvents('none')

  styleBuilder
    .select('.pricing__grid', theme)
    .position('relative')
    .zIndex('1')
    .display('grid')
    .gridTemplateColumns('1fr')
    .gap('16px')
    .alignItems('stretch')
}

function applyPricingHeaderStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.pricing__header', theme)
    .position('relative')
    .zIndex('1')
    .display('grid')
    .gap('6px')
    .margin('0 0 20px')

  styleBuilder
    .select('.pricing__eyebrow', theme)
    .textTransform('uppercase')
    .letterSpacing('0.18em')
    .fontSize('11px')
    .fontWeight('700')
    .margin('0')
    .color(palette.text.subtle)

  styleBuilder
    .select('.pricing__title', theme)
    .margin('0 !important')
    .fontSize('clamp(24px, 3.2vw, 34px)')
    .fontWeight('700')
    .letterSpacing('-0.02em')
    .color(palette.text.default)

  styleBuilder
    .select('.pricing__subtitle', theme)
    .margin('0')
    .fontSize('14px')
    .lineHeight('1.6')
    .maxWidth('680px')
    .color(palette.text.subtle)

  styleBuilder
    .select('.pricing__footnote', theme)
    .position('relative')
    .zIndex('1')
    .margin('5px 0 0 !important;')
    .fontSize('12px')
    .color(palette.text.subtle)
}

function applyPricingPlanStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  applyPricingPlanShellStyles(theme, palette, options)
  applyPricingPlanHeaderStyles(theme, palette, options)
  applyPricingPlanPriceStyles(theme, palette)
  applyPricingPlanCtaStyles(theme, palette, options)
  applyPricingPlanNoteStyles(theme, palette)
}

function applyPricingPlanShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.pricing-plan', theme)
    .display('flex')
    .flexDirection('column')
    .gap('12px')
    .padding('18px')
    .borderRadius(options.radii.md)
    .border(`1px solid ${palette.border.default}`)
    .background(palette.background.panel)
    .boxShadow(palette.effect.panelShadow)
    .height('100%')

  styleBuilder.select('.pricing-plan__head', theme).display('grid').gap('6px')
}

function applyPricingPlanHeaderStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.pricing-plan__meta', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .gap('12px')

  styleBuilder
    .select('.pricing-plan__icon', theme)
    .width('44px')
    .height('44px')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .borderRadius('12px')
    .background(palette.icon.accent.gradient)
    .set('background-color', palette.icon.accent.background)
    .border(`1px solid ${palette.icon.accent.ring}`)
    .color(palette.icon.accent.color)
    .boxShadow(palette.effect.accentShadow)
    .marginBottom('4px')

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

  styleBuilder
    .select('.pricing-plan__title-row', theme)
    .display('flex')
    .flexWrap('wrap')
    .gap('10px')
    .alignItems('center')
    .justifyContent('flex-start')

  styleBuilder
    .select('.pricing-plan__title', theme)
    .margin('0')
    .fontSize('18px')
    .fontWeight('700')
    .color(palette.text.default)

  styleBuilder
    .select('.pricing-plan__badge', theme)
    .padding('4px 10px')
    .borderRadius(options.radii.pill)
    .fontSize('11px')
    .fontWeight('700')
    .textTransform('uppercase')
    .letterSpacing('0.1em')
    .background(palette.badge.accent.background)
    .color(palette.badge.accent.text)

  styleBuilder
    .select('.pricing-plan__summary', theme)
    .margin('0')
    .fontSize('13px')
    .lineHeight('1.5')
    .color(palette.text.subtle)
}

function applyPricingPlanPriceStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.pricing-plan__price', theme)
    .display('flex')
    .gap('10px')
    .alignItems('baseline')
    .set('min-height', '38px')

  styleBuilder
    .select('.pricing-plan__amount', theme)
    .fontSize('24px')
    .fontWeight('700')
    .letterSpacing('-0.02em')
    .color(palette.text.default)

  styleBuilder
    .select('.pricing-plan__period', theme)
    .fontSize('11px')
    .textTransform('uppercase')
    .letterSpacing('0.12em')
    .fontWeight('600')
    .color(palette.text.subtle)
}

function applyPricingPlanCtaStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder.select('.pricing-plan__cta', theme).margin('0')

  styleBuilder
    .select('.pricing-plan__cta-link', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .gap('8px')
    .padding('9px 14px')
    .borderRadius(options.radii.pill)
    .fontWeight('600')
    .fontSize('13px')
    .textDecoration('none')
    .border(`1px solid ${palette.border.default}`)
    .background(palette.action.neutral.background)
    .color(palette.action.neutral.text)
    .boxShadow(palette.effect.interactiveShadow)
    .transition(
      'transform 180ms ease, box-shadow 180ms ease, background 180ms ease',
    )

  styleBuilder
    .select('.pricing-plan__cta-link:hover', theme)
    .background(palette.action.neutral.hover)
    .transform('translateY(-1px)')

  styleBuilder
    .select('.pricing-plan__cta-link:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
}

function applyPricingPlanNoteStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.pricing-plan__note', theme)
    .margin('0')
    .fontSize('11px')
    .lineHeight('1.5')
    .color(palette.text.subtle)
}

function applyPricingFeatureStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.pricing-plan__features', theme)
    .listStyle('none')
    .padding('0')
    .margin('0')
    .display('block')
    .set('column-gap', '18px')
    .set('column-count', '1')

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
    .color(palette.text.default)

  styleBuilder
    .select('.pricing-feature__icon', theme)
    .width('22px')
    .height('22px')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .borderRadius('7px')
    .background(palette.icon.neutral.gradient)
    .set('background-color', palette.icon.neutral.background)
    .border(`1px solid ${palette.icon.neutral.ring}`)
    .color(palette.icon.neutral.color)
    .boxShadow(palette.effect.interactiveShadow)
    .marginTop('0')

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

  styleBuilder.select('.pricing-feature__text', theme).display('block')
}

function applyPricingFeaturedStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.pricing-plan--featured', theme)
    .position('relative')
    .transform('translateY(-4px)')
    .background(palette.background.feature)
    .border(`1px solid ${palette.border.accent}`)
    .boxShadow(palette.effect.panelShadowStrong)

  styleBuilder
    .select('.pricing-plan--featured::before', theme)
    .content('""')
    .position('absolute')
    .inset('0')
    .borderRadius(options.radii.md)
    .border(`1px solid ${palette.border.accent}`)
    .opacity('0.5')
    .pointerEvents('none')

  styleBuilder
    .select('.pricing-plan--featured .pricing-plan__cta-link', theme)
    .background(palette.action.accent.background)
    .color(palette.action.accent.text)
    .borderColor('transparent')

  styleBuilder
    .select('.pricing-plan--featured .pricing-plan__cta-link:hover', theme)
    .background(palette.action.accent.hover)
}

function applyPricingResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.pricing__grid', theme)
    .media('min-width: 900px')
    .gridTemplateColumns('repeat(2, minmax(0, 1fr))')

  styleBuilder
    .select('.pricing__grid', theme)
    .media('min-width: 1400px')
    .gridTemplateColumns('repeat(4, minmax(0, 1fr))')

  styleBuilder
    .select('.pricing', theme)
    .media('max-width: 720px')
    .padding('22px')

  styleBuilder
    .select('.pricing-plan--featured', theme)
    .media('max-width: 720px')
    .transform('translateY(0)')
}

function createPricingTableComponent() {
  return createComponent<PricingTableContext>(pricingTableTemplate, {
    props: ['eyebrow', 'title', 'subtitle', 'footnote'],
    context: (head) => resolvePricingTableContext(head.props),
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
      'icon',
      'ctaLabel',
      'ctaLink',
    ],
    context: (head) => resolvePricingPlanContext(head.props),
  })
}

function createPricingFeatureComponent() {
  return createComponent<PricingFeatureContext>(pricingFeatureTemplate, {
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
  const variant = resolveVariant(props.variant)
  const ctaLabel = resolveString(props.ctaLabel)
  const ctaLink = resolveString(props.ctaLink)
  const hasCta = Boolean(ctaLabel && ctaLink)
  return {
    ...props,
    title,
    variant,
    hasBadge: Boolean(props.badge),
    hasPrice: Boolean(props.price),
    hasCta,
    hasIcon: Boolean(props.icon),
    iconSvg: getSvgIcon(props.icon, 'code'),
  }
}

function resolvePricingFeatureContext(
  props: PricingFeatureProps,
): PricingFeatureContext {
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
