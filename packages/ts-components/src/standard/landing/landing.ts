import type { SemanticTone } from '@purestack/ts-style'
import { defineComponent, html, type RefOrValue } from 'regor'
import type {
  ComponentVariant,
  ComponentVariantMode,
} from '../componentVariant'

export interface LandingSection {
  eyebrow?: RefOrValue<string>
  title?: RefOrValue<string>
  subtitle?: RefOrValue<string>
  titleTag?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  variantMode?: RefOrValue<ComponentVariantMode>
  columns?: RefOrValue<number | string>
  columnsLg?: RefOrValue<number | string>
  alignItems?: RefOrValue<string>
}

export interface FeatureCard {
  eyebrow?: RefOrValue<string>
  title?: RefOrValue<string>
  summary?: RefOrValue<string>
  badge?: RefOrValue<string>
  icon?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
}

export interface MetricStrip {
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  columns?: RefOrValue<number | string>
  columnsSm?: RefOrValue<number | string>
  columnsLg?: RefOrValue<number | string>
}

export interface MetricItem {
  label?: RefOrValue<string>
  value?: RefOrValue<string>
  detail?: RefOrValue<string>
  icon?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
}

export interface CodeShowcase {
  eyebrow?: RefOrValue<string>
  title?: RefOrValue<string>
  summary?: RefOrValue<string>
  language?: RefOrValue<string>
  resultTitle?: RefOrValue<string>
  resultMeta?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
}

export interface ComparisonTable {
  eyebrow?: RefOrValue<string>
  title?: RefOrValue<string>
  subtitle?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  columns?: RefOrValue<number | string>
  columnsLg?: RefOrValue<number | string>
}

export interface ComparisonColumn {
  title?: RefOrValue<string>
  summary?: RefOrValue<string>
  badge?: RefOrValue<string>
  icon?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
}

export interface ComparisonFeature {
  icon?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
}

export interface CtaSection {
  eyebrow?: RefOrValue<string>
  title?: RefOrValue<string>
  subtitle?: RefOrValue<string>
  primaryLabel?: RefOrValue<string>
  primaryHref?: RefOrValue<string>
  primaryIcon?: RefOrValue<string>
  secondaryLabel?: RefOrValue<string>
  secondaryHref?: RefOrValue<string>
  secondaryIcon?: RefOrValue<string>
  meta?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
}

const landingSectionTemplate = html`<Panel
  :tone="tone"
  :variant="variant || 'none'"
  :variantMode="variantMode"
  class="mb-6"
>
  <Grid
    columns="1"
    :columnsLg="columnsLg || columns"
    :alignItems="alignItems || 'start'"
    class="gap-6"
  >
    <SectionHeader
      r-if="eyebrow || title || subtitle"
      :eyebrow="eyebrow"
      :title="title"
      :subtitle="subtitle"
      :titleTag="titleTag || 'h2'"
      subtitleClass="mb-0"/>
    <slot></slot>
  </Grid>
</Panel>`

const featureCardTemplate = html`<Panel
  :tone="tone"
  :variant="variant || 'surface'"
  class="h-full"
>
  <Flex direction="column" align="start" class="gap-3 h-full">
    <Flex align="center" justify="between" class="w-full gap-3" r-if="icon || badge">
      <IconFrame
        r-if="icon"
        :name="icon"
        :tone="tone"
        variant="surface"
        class="icon-frame--lg"/>
      <Badge r-if="badge" :tone="tone">{{ badge }}</Badge>
    </Flex>
    <p class="text-eyebrow mb-0" r-if="eyebrow">{{ eyebrow }}</p>
    <h3 class="fs-h4 fw-700 lh-2 mb-0" r-if="title">{{ title }}</h3>
    <p class="text-tagline mb-0" r-if="summary">{{ summary }}</p>
    <div class="min-w-0 lh-6"><slot></slot></div>
    <Flex wrap="true" class="gap-2 mt-auto">
      <slot name="actions"></slot>
    </Flex>
  </Flex>
</Panel>`

const metricStripTemplate = html`<Panel
  :tone="tone"
  :variant="variant || 'surfaceAlt'"
  class="w-full"
>
  <Grid
    :columns="columns || 1"
    :columnsSm="columnsSm || 2"
    :columnsLg="columnsLg || 4"
    class="gap-3"
  >
    <slot></slot>
  </Grid>
</Panel>`

const metricItemTemplate = html`<Flex align="start" class="gap-2 min-w-0">
  <IconFrame
    r-if="icon"
    :name="icon"
    :tone="tone"
    variant="surface"
    class="icon-frame--sm"/>
  <div class="min-w-0">
    <p class="prose-meta mb-1" r-if="label">{{ label }}</p>
    <strong class="fs-body lh-2" r-if="value">{{ value }}</strong>
    <p class="text-subtle fs-xs mb-0" r-if="detail">{{ detail }}</p>
    <slot></slot>
  </div>
</Flex>`

const codeShowcaseTemplate = html`<Panel
  :tone="tone"
  :variant="variant || 'surface'"
  class="h-full"
>
  <Flex direction="column" class="gap-4 h-full">
    <Flex align="start" justify="between" wrap="true" class="gap-3">
      <SectionHeader
        :eyebrow="eyebrow"
        :title="title"
        :subtitle="summary"
        titleTag="h3"
        titleClass="fs-h4 mb-1"
        subtitleClass="mb-0"/>
      <Badge r-if="language" :tone="tone">{{ language }}</Badge>
    </Flex>
    <Panel variant="outline" tone="neutral" class="box-shadow-none">
      <slot></slot>
    </Panel>
    <Panel r-if="resultTitle || resultMeta" :tone="tone" variant="outline" class="box-shadow-none">
      <Flex align="center" justify="between" wrap="true" class="gap-2">
        <strong r-if="resultTitle">{{ resultTitle }}</strong>
        <Badge r-if="resultMeta" :tone="tone">{{ resultMeta }}</Badge>
      </Flex>
      <div class="mt-3 min-w-0">
        <slot name="result"></slot>
      </div>
    </Panel>
  </Flex>
</Panel>`

const comparisonTableTemplate = html`<Panel
  :tone="tone"
  :variant="variant || 'surfaceAlt'"
  class="mb-6"
>
  <Flex direction="column" align="start" class="gap-4 w-full">
    <SectionHeader
      r-if="eyebrow || title || subtitle"
      :eyebrow="eyebrow"
      :title="title"
      :subtitle="subtitle"
      titleTag="h2"
      subtitleClass="mb-0"/>
    <Grid
      :columns="columns || 1"
      :columnsLg="columnsLg || 3"
      alignItems="stretch"
      class="gap-4 w-full"
    >
      <slot></slot>
    </Grid>
  </Flex>
</Panel>`

const comparisonColumnTemplate = html`<Panel
  :tone="tone"
  :variant="variant || 'surface'"
  class="h-full"
>
  <Flex direction="column" align="start" class="gap-3 h-full">
    <Flex align="center" justify="between" class="w-full gap-3" r-if="icon || badge">
      <IconFrame
        r-if="icon"
        :name="icon"
        :tone="tone"
        variant="surface"
        class="icon-frame--lg"/>
      <Badge r-if="badge" :tone="tone">{{ badge }}</Badge>
    </Flex>
    <h3 class="fs-h4 fw-700 lh-2 mb-0" r-if="title">{{ title }}</h3>
    <p class="text-tagline mb-0" r-if="summary">{{ summary }}</p>
    <Flex
      container="ul"
      direction="column"
      align="start"
      class="gap-3 m-0 p-0 w-full"
    >
      <slot></slot>
    </Flex>
  </Flex>
</Panel>`

const comparisonFeatureTemplate = html`<Flex container="li" align="start" class="gap-2 min-w-0">
  <IconFrame
    :name="icon || 'lucide:check'"
    :tone="tone"
    variant="surface"
    class="icon-frame--sm"/>
  <span class="min-w-0 lh-5"><slot></slot></span>
</Flex>`

const ctaSectionTemplate = html`<Panel
  :tone="tone"
  :variant="variant || 'surfaceAlt'"
  class="mb-6"
>
  <Grid columns="1" columnsLg="minmax(0, 1fr) auto" alignItems="center" class="gap-4">
    <SectionHeader
      :eyebrow="eyebrow"
      :title="title"
      :subtitle="subtitle"
      titleTag="h2"
      titleClass="fs-h2 mb-2"
      subtitleClass="mb-0"/>
    <Flex align="center" justify="end" wrap="true" class="gap-3">
      <BtnLink
        r-if="primaryLabel && primaryHref"
        :href="primaryHref"
        :icon="primaryIcon"
        iconPosition="end"
        :tone="tone || 'accent'"
        size="lg"
      >
        {{ primaryLabel }}
      </BtnLink>
      <BtnLink
        r-if="secondaryLabel && secondaryHref"
        :href="secondaryHref"
        :icon="secondaryIcon"
        :tone="tone || 'ghost'"
        variant="outline"
        size="lg"
      >
        {{ secondaryLabel }}
      </BtnLink>
      <slot name="actions"></slot>
    </Flex>
    <p class="prose-meta mb-0" r-if="meta">{{ meta }}</p>
  </Grid>
</Panel>`

function defineLandingSectionComponent() {
  return defineComponent<LandingSection>(landingSectionTemplate, {
    props: [
      'eyebrow',
      'title',
      'subtitle',
      'titleTag',
      'tone',
      'variant',
      'variantMode',
      'columns',
      'columnsLg',
      'alignItems',
    ],
  })
}

function defineFeatureCardComponent() {
  return defineComponent<FeatureCard>(featureCardTemplate, {
    props: ['eyebrow', 'title', 'summary', 'badge', 'icon', 'tone', 'variant'],
  })
}

function defineMetricStripComponent() {
  return defineComponent<MetricStrip>(metricStripTemplate, {
    props: ['tone', 'variant', 'columns', 'columnsSm', 'columnsLg'],
  })
}

function defineMetricItemComponent() {
  return defineComponent<MetricItem>(metricItemTemplate, {
    props: ['label', 'value', 'detail', 'icon', 'tone'],
  })
}

function defineCodeShowcaseComponent() {
  return defineComponent<CodeShowcase>(codeShowcaseTemplate, {
    props: [
      'eyebrow',
      'title',
      'summary',
      'language',
      'resultTitle',
      'resultMeta',
      'tone',
      'variant',
    ],
  })
}

function defineComparisonTableComponent() {
  return defineComponent<ComparisonTable>(comparisonTableTemplate, {
    props: [
      'eyebrow',
      'title',
      'subtitle',
      'tone',
      'variant',
      'columns',
      'columnsLg',
    ],
  })
}

function defineComparisonColumnComponent() {
  return defineComponent<ComparisonColumn>(comparisonColumnTemplate, {
    props: ['title', 'summary', 'badge', 'icon', 'tone', 'variant'],
  })
}

function defineComparisonFeatureComponent() {
  return defineComponent<ComparisonFeature>(comparisonFeatureTemplate, {
    props: ['icon', 'tone'],
  })
}

function defineCtaSectionComponent() {
  return defineComponent<CtaSection>(ctaSectionTemplate, {
    props: [
      'eyebrow',
      'title',
      'subtitle',
      'primaryLabel',
      'primaryHref',
      'primaryIcon',
      'secondaryLabel',
      'secondaryHref',
      'secondaryIcon',
      'meta',
      'tone',
      'variant',
    ],
  })
}

export function defineLandingComponents() {
  return {
    landingSection: defineLandingSectionComponent(),
    featureCard: defineFeatureCardComponent(),
    metricStrip: defineMetricStripComponent(),
    metricItem: defineMetricItemComponent(),
    codeShowcase: defineCodeShowcaseComponent(),
    comparisonTable: defineComparisonTableComponent(),
    comparisonColumn: defineComparisonColumnComponent(),
    comparisonFeature: defineComparisonFeatureComponent(),
    ctaSection: defineCtaSectionComponent(),
  }
}
