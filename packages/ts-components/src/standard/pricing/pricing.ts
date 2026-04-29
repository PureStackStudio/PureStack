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
  :tone="tone"
  :variant="variant || 'none'"
  :variantMode="variantMode"
>
  <Flex direction="column" align="start">
    <SectionHeader
      r-if="eyebrow || title || subtitle || footnote"
      :eyebrow="eyebrow"
      :title="title"
      :subtitle="subtitle"
      :footnote="footnote"
      titleTag="h2"/>
    <Grid
      :columns="columns || 1"
      :columnsLg="columnsLg || 2"
      :columnsXl="columnsXl || 4"
      alignItems="stretch"
    >
      <slot></slot>
    </Grid>
  </Flex>
</Panel>`

const pricingPlanTemplate = html`<Panel
  :tone="tone"
  :variant="variant || 'surface'"
  :variantMode="variantMode"
>
  <Flex direction="column" align="start">
    <Flex justify="between" align="center" r-if="icon || badge">
      <IconFrame
        r-if="icon"
        :name="icon"
        :tone="tone"
        variant="surface"
        size="lg"/>
      <Badge r-if="badge" :tone="tone">{{ badge }}</Badge>
    </Flex>
    <SectionHeader
      :title="title"
      :subtitle="summary"
      titleTag="h3"/>
    <Flex align="baseline" r-if="price">
      <strong class="fs-h2">{{ price }}</strong>
      <span r-if="period">{{ period }}</span>
    </Flex>
    <BtnLink :href="ctaLink" :tone="tone" r-if="ctaLabel && ctaLink">
      {{ ctaLabel }}
    </BtnLink>
    <Flex container="ul" direction="column" align="start" class="m-0 p-0">
      <slot></slot>
    </Flex>
    <small r-if="note">{{ note }}</small>
  </Flex>
</Panel>`

const pricingFeatureTemplate = html`<Flex container="li" align="start">
  <IconFrame
    :name="icon || 'iconoir:check'"
    :tone="tone"
    :variant="variant || 'surface'"
    size="sm"/>
  <slot></slot>
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
