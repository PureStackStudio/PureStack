import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
} from 'regor'

export type PricingPlanVariant = 'featured' | 'primary'

export interface PricingTable {
  eyebrow?: string
  title?: string
  subtitle?: string
  footnote?: string
  tone?: RefOrValue<string>
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
  tone?: string
  panelClass?: ComputedRef<string>
}

export interface PricingFeature {
  icon?: string
}

const pricingTableTemplate = html`<Panel :tone="tone" class="pricing">
  <div class="pricing__header" r-if="eyebrow || title || subtitle">
    <p class="pricing__eyebrow" r-if="eyebrow">{{ eyebrow }}</p>
    <h2 class="pricing__title" r-if="title">{{ title }}</h2>
    <p class="pricing__subtitle" r-if="subtitle">{{ subtitle }}</p>
  </div>
  <div class="pricing__grid">
    <slot></slot>
  </div>
  <p class="pricing__footnote" r-if="footnote">{{ footnote }}</p>
</Panel>`

const pricingPlanTemplate = html`<Panel :tone="tone" :class="panelClass">
  <div class="pricing-plan__head">
    <div class="pricing-plan__meta">
      <Icon class="pricing-plan__icon" r-if="icon" :name="icon"/>
      <Badge tone="neutral" r-if="badge">{{ badge }}</Badge>
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
    <BtnLink tone="neutral" :href="ctaLink">{{ ctaLabel }}</BtnLink>
  </div>
  <ul class="pricing-plan__features">
    <slot></slot>
  </ul>
  <p class="pricing-plan__note" r-if="note">{{ note }}</p>
</Panel>`

const pricingFeatureTemplate = html`<li class="pricing-feature">
  <Icon class="pricing-feature__icon" :name="icon || 'iconoir:check'"/>
  <span class="pricing-feature__text"><slot></slot></span>
</li>`

function definePricingTableComponent() {
  return defineComponent<PricingTable>(pricingTableTemplate, {
    props: ['eyebrow', 'title', 'subtitle', 'footnote'],
    context: (head) => resolvePricingTable(head.props),
  })
}

function definePricingPlanComponent() {
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
      'tone',
    ],
    context: (head) => resolvePricingPlan(head.props),
  })
}

function definePricingFeatureComponent() {
  return defineComponent<PricingFeature>(pricingFeatureTemplate, {
    props: ['icon'],
    context: (head) => resolvePricingFeature(head.props),
  })
}

export function definePricingComponents() {
  return {
    pricingTable: definePricingTableComponent(),
    pricingPlan: definePricingPlanComponent(),
    pricingFeature: definePricingFeatureComponent(),
  }
}

function resolvePricingTable(props: PricingTable): PricingTable {
  return {
    ...props,
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
    panelClass: computed(() =>
      ['pricing-plan', variant === 'featured' ? 'pricing-plan--featured' : '']
        .filter(Boolean)
        .join(' '),
    ),
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
