import { defineComponent, html } from 'regor'

export type PricingPlanVariant = 'featured' | 'primary'

export interface PricingTable {
  eyebrow?: string
  title?: string
  subtitle?: string
  footnote?: string
}

export interface PricingPlan {
  title?: string
  summary?: string
  price?: string
  period?: string
  badge?: string
  note?: string
  variant?: PricingPlanVariant
  icon?: string
  ctaLabel?: string
  ctaLink?: string
}

export interface PricingFeature {
  icon?: string
}

const pricingTableTemplate = html`<section class="pricing">
  <div class="pricing__header" r-if="eyebrow || title || subtitle">
    <p class="pricing__eyebrow" r-if="eyebrow">{{ eyebrow }}</p>
    <h2 class="pricing__title" r-if="title">{{ title }}</h2>
    <p class="pricing__subtitle" r-if="subtitle">{{ subtitle }}</p>
  </div>
  <div class="pricing__grid">
    <slot></slot>
  </div>
  <p class="pricing__footnote" r-if="footnote">{{ footnote }}</p>
</section>`

const pricingPlanTemplate = html`<article
  class="pricing-plan"
  :class="{ 'pricing-plan--featured': variant === 'featured' }"
>
  <div class="pricing-plan__head">
    <div class="pricing-plan__meta">
      <Icon class="pricing-plan__icon" r-if="icon" :name="icon || 'iconoir:code'" />
      <span class="pricing-plan__badge" r-if="badge">{{ badge }}</span>
    </div>
    <div class="pricing-plan__title-row">
      <h3 class="pricing-plan__title">{{ title }}</h3>
    </div>
    <p class="pricing-plan__summary" r-if="summary">{{ summary }}</p>
  </div>
  <div class="pricing-plan__price" r-if="price">
    <span class="pricing-plan__amount">{{ price }}</span>
    <span class="pricing-plan__period" r-if="period">{{ period }}</span>
  </div>
  <div class="pricing-plan__cta" r-if="ctaLabel && ctaLink">
    <a class="pricing-plan__cta-link" :href="ctaLink">{{ ctaLabel }}</a>
  </div>
  <ul class="pricing-plan__features">
    <slot></slot>
  </ul>
  <p class="pricing-plan__note" r-if="note">{{ note }}</p>
</article>`

const pricingFeatureTemplate = html`<li class="pricing-feature">
  <Icon class="pricing-feature__icon" :name="icon || 'iconoir:check'" />
  <span class="pricing-feature__text"><slot></slot></span>
</li>`

function createPricingTableComponent() {
  return defineComponent<PricingTable>(pricingTableTemplate, {
    props: ['eyebrow', 'title', 'subtitle', 'footnote'],
    context: (head) => resolvePricingTable(head.props),
  })
}

function createPricingPlanComponent() {
  return defineComponent<PricingPlan>(pricingPlanTemplate, {
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
    context: (head) => resolvePricingPlan(head.props),
  })
}

function createPricingFeatureComponent() {
  return defineComponent<PricingFeature>(pricingFeatureTemplate, {
    props: ['icon'],
    context: (head) => resolvePricingFeature(head.props),
  })
}

export function createPricingComponents() {
  return {
    pricingTable: createPricingTableComponent(),
    pricingPlan: createPricingPlanComponent(),
    pricingFeature: createPricingFeatureComponent(),
  }
}

function resolvePricingTable(props: PricingTable): PricingTable {
  const eyebrow = resolveString(props.eyebrow)
  const title = resolveString(props.title)
  const subtitle = resolveString(props.subtitle)
  const footnote = resolveString(props.footnote)
  return {
    eyebrow,
    title,
    subtitle,
    footnote,
  }
}

function resolvePricingPlan(props: PricingPlan): PricingPlan {
  const title = resolveString(props.title) || 'Plan'
  const variant = resolveVariant(props.variant)
  const ctaLabel = resolveString(props.ctaLabel)
  const ctaLink = resolveString(props.ctaLink)
  return {
    ...props,
    title,
    variant,
    ctaLabel,
    ctaLink,
  }
}

function resolvePricingFeature(props: PricingFeature): PricingFeature {
  const icon = resolveString(props.icon)
  return {
    icon,
  }
}

function resolveVariant(value?: string) {
  const normalized = resolveString(value).toLowerCase()
  if (!normalized) return undefined
  if (normalized === 'featured' || normalized === 'primary') return 'featured'
  return undefined
}

function resolveString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : ''
}
