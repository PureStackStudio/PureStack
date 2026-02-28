import { defineComponent, html } from 'regor'

import { getSvgIcon } from '../../../style/icons'
import { registerPricingStyles } from './pricingStyle'

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

function createPricingTableComponent() {
  return defineComponent<PricingTableContext>(pricingTableTemplate, {
    props: ['eyebrow', 'title', 'subtitle', 'footnote'],
    context: (head) => resolvePricingTableContext(head.props),
  })
}

function createPricingPlanComponent() {
  return defineComponent<PricingPlanContext>(pricingPlanTemplate, {
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
  return defineComponent<PricingFeatureContext>(pricingFeatureTemplate, {
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
