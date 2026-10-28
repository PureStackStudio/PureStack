import type { SemanticTone } from '@purestack/ts-style'
import { defineComponent, html, type RefOrValue } from 'regor'
import type {
  ComponentVariant,
  ComponentVariantMode,
} from '../componentVariant'

export interface PricingTable {
  eyebrow?: RefOrValue<string>
  title?: RefOrValue<string>
  subtitle?: RefOrValue<string>
  footnote?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  variantMode?: RefOrValue<ComponentVariantMode>
  columns?: RefOrValue<number | string>
  columnsLg?: RefOrValue<number | string>
  columnsXl?: RefOrValue<number | string>
}

export interface PricingPlan {
  title?: RefOrValue<string>
  summary?: RefOrValue<string>
  price?: RefOrValue<string>
  period?: RefOrValue<string>
  badge?: RefOrValue<string>
  note?: RefOrValue<string>
  variant?: RefOrValue<ComponentVariant>
  variantMode?: RefOrValue<ComponentVariantMode>
  icon?: RefOrValue<string>
  ctaLabel?: RefOrValue<string>
  ctaLink?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
}

export interface PricingFeature {
  icon?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
}

const pricingTableTemplate = html`<Panel
  class="pricing-table min-w-0"
  :class="variant && variant !== 'none' ? 'p-5' : 'p-0 text-inherit'"
  bodyClass="pricing-table__body flex flex-column gap-6"
  :tone="tone"
  :variant="variant || 'none'"
  :variantMode="variantMode"
>
  <SectionHeader
    r-if="eyebrow || title || subtitle"
    class="pricing-table__heading flex flex-column align-center gap-3 text-center"
    :eyebrow="eyebrow"
    :title="title"
    :subtitle="subtitle"
    eyebrowClass="m-0 fs-xxs tracking-wide text-inherit opacity-75"
    titleClass="m-0 fs-h2 fw-600 lh-2 max-w-heading tracking-tight text-balance text-inherit"
    subtitleClass="m-0 fs-body lh-6 max-w-prose tracking-normal text-pretty text-inherit opacity-75"
    titleTag="h2"/>
  <Grid
    class="pricing-table__grid gap-4 w-full"
    :columns="columns || 1"
    :columnsLg="columnsLg || 2"
    :columnsXl="columnsXl || 4"
    alignItems="stretch"
  >
    <slot></slot>
  </Grid>
  <p
    r-if="footnote"
    class="pricing-table__footnote m-0 fs-sm lh-5 text-center opacity-75 text-pretty"
  >
    {{ footnote }}
  </p>
</Panel>`

const pricingPlanTemplate = html`<Panel
  class="pricing-plan w-full h-full min-w-0 p-5"
  bodyClass="pricing-plan__body flex flex-column gap-5 h-full"
  :tone="tone"
  :variant="variant || 'surface'"
  :variantMode="variantMode"
>
  <Flex
    class="pricing-plan__header gap-3"
    justify="between"
    align="start"
    wrap="true"
    r-if="icon || badge"
  >
    <IconFrame
      r-if="icon"
      class="pricing-plan__icon p-2"
      :name="icon"
      :tone="tone"
      variant="surface"
      aria-hidden="true"/>
    <Badge r-if="badge" :tone="tone">{{ badge }}</Badge>
  </Flex>
  <SectionHeader
    r-if="title || summary"
    class="pricing-plan__heading flex flex-column gap-3"
    :title="title"
    :subtitle="summary"
    titleTag="h3"
    titleClass="pricing-plan__title m-0 fs-h4 fw-600 lh-2 tracking-tight text-balance text-inherit wrap-anywhere"
    subtitleClass="pricing-plan__summary m-0 fs-body lh-6 tracking-normal text-pretty text-inherit opacity-75"/>
  <Flex
    class="pricing-plan__price-row gap-2"
    align="baseline"
    wrap="true"
    r-if="price !== undefined && price !== null && price !== ''"
  >
    <strong
      class="pricing-plan__price fs-h1 fw-600 lh-1 tracking-tight tabular-nums wrap-anywhere"
      >{{ price }}</strong>
    <span class="pricing-plan__period fs-sm lh-5 opacity-75" r-if="period"
      >{{ period }}</span>
  </Flex>
  <Flex
    container="ul"
    direction="column"
    class="pricing-plan__features gap-2 m-0 p-0 list-none"
  >
    <slot></slot>
  </Flex>
  <Flex
    r-if="(ctaLabel && ctaLink) || note"
    direction="column"
    class="pricing-plan__footer mt-auto gap-3"
  >
    <BtnLink
      class="pricing-plan__action w-full ws-normal"
      :href="ctaLink"
      :tone="tone"
      r-if="ctaLabel && ctaLink"
    >
      {{ ctaLabel }}
    </BtnLink>
    <small
      class="pricing-plan__note fs-sm lh-5 opacity-75 text-center text-pretty"
      r-if="note"
      >{{ note }}</small>
  </Flex>
</Panel>`

const pricingFeatureTemplate = html`<Flex
  container="li"
  align="start"
  class="pricing-feature gap-3 py-1 fs-body lh-5"
>
  <IconFrame
    class="pricing-feature__icon tone-text fs-xxs p-1"
    :name="icon || 'iconoir:check'"
    :tone="tone"
    :variant="variant || 'none'"
    size="sm"
    aria-hidden="true"/>
  <div class="pricing-feature__content flex-1 min-w-0 text-pretty">
    <slot></slot>
  </div>
</Flex>`

function definePricingTableComponent() {
  return defineComponent<PricingTable>(pricingTableTemplate, {
    props: [
      'eyebrow',
      'title',
      'subtitle',
      'footnote',
      'tone',
      'variant',
      'variantMode',
      'columns',
      'columnsLg',
      'columnsXl',
    ],
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
      'variantMode',
      'icon',
      'ctaLabel',
      'ctaLink',
      'tone',
    ],
  })
}

function definePricingFeatureComponent() {
  return defineComponent<PricingFeature>(pricingFeatureTemplate, {
    props: ['icon', 'tone', 'variant'],
  })
}

export function definePricingComponents() {
  return {
    pricingTable: definePricingTableComponent(),
    pricingPlan: definePricingPlanComponent(),
    pricingFeature: definePricingFeatureComponent(),
  }
}
