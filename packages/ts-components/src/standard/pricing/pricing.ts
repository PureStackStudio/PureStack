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
  <Flex direction="column" align="start" class="pricing__stack gap-4">
    <div r-if="eyebrow || title || subtitle">
      <div class="text-eyebrow" r-if="eyebrow">{{ eyebrow }}</div>
      <h2 class="text-title" r-if="title">{{ title }}</h2>
      <p class="text-tagline mb-0" r-if="subtitle">{{ subtitle }}</p>
    </div>
    <Grid
      class="pricing__grid gap-4"
      columns="1"
      columnsLg="2"
      columnsXl="4"
      alignItems="start"
    >
      <slot></slot>
    </Grid>
    <p class="prose-meta mb-0" r-if="footnote">{{ footnote }}</p>
  </Flex>
</Panel>`

const pricingPlanTemplate = html`<Panel :tone="tone" :class="panelClass">
  <Flex direction="column" align="start" class="pricing-plan__stack gap-3">
    <Flex
      justify="between"
      align="center"
      class="pricing-plan__meta"
      r-if="icon || badge"
    >
      <Icon class="pricing-plan__icon" r-if="icon" :name="icon"/>
      <Badge tone="neutral" r-if="badge">{{ badge }}</Badge>
    </Flex>
    <div>
      <h3 class="pricing-plan__title fs-xl mb-0">{{ title }}</h3>
      <p class="pricing-plan__summary text-tagline mb-0" r-if="summary">
        {{ summary }}
      </p>
    </div>
    <Flex class="pricing-plan__price" align="baseline" r-if="price">
    <span class="pricing-plan__amount">{{ price }}</span>
    <span class="pricing-plan__period" r-if="period">{{ period }}</span>
    </Flex>
    <BtnLink
      class="mt-auto"
      tone="neutral"
      :href="ctaLink"
      r-if="ctaLabel && ctaLink"
    >
      {{ ctaLabel }}
    </BtnLink>
    <ul class="pricing-plan__features">
      <slot></slot>
    </ul>
    <p class="pricing-plan__note text-subtle mb-0" r-if="note">{{ note }}</p>
  </Flex>
</Panel>`

const pricingFeatureTemplate = html`<Flex container="li" align="start" class="pricing-feature gap-2">
  <Icon class="pricing-feature__icon" :name="icon || 'iconoir:check'"/>
  <slot></slot>
</Flex>`

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
