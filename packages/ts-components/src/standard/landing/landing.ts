import type { CSSProps } from '@purestack/ts-css'
import { docLayoutVar, type SemanticTone } from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'
import type {
  ComponentVariant,
  ComponentVariantMode,
} from '../componentVariant'
import { resolveComponentClasses } from '../componentVariant'
import type { GridAlignItems } from '../grid/grid'

export type LandingBandImageFit =
  | 'cover'
  | 'contain'
  | 'fill'
  | 'none'
  | 'scale-down'

export type LandingBandEdge = 'flat' | 'slant-up' | 'slant-down'

export type LandingTitleTag =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'div'
  | 'span'

export interface LandingBand {
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  variantMode?: RefOrValue<ComponentVariantMode>
  image?: RefOrValue<string>
  imageFit?: RefOrValue<LandingBandImageFit>
  imagePosition?: RefOrValue<string>
  display?: RefOrValue<CSSProps['display']>
  alignItems?: RefOrValue<CSSProps['alignItems']>
  justifyContent?: RefOrValue<CSSProps['justifyContent']>
  height?: RefOrValue<string>
  paddingTop?: RefOrValue<string>
  paddingBottom?: RefOrValue<string>
  marginTop?: RefOrValue<string>
  marginBottom?: RefOrValue<string>
  topEdge?: RefOrValue<LandingBandEdge>
  bottomEdge?: RefOrValue<LandingBandEdge>
  edgeSize?: RefOrValue<string>
  topEdgeStart?: RefOrValue<string>
  bottomEdgeStart?: RefOrValue<string>
  classes?: ComputedRef<string>
  bandStyle?: ComputedRef<Partial<CSSProps>>
}

export interface LandingSection {
  eyebrow?: RefOrValue<string>
  title?: RefOrValue<string>
  subtitle?: RefOrValue<string>
  titleTag?: RefOrValue<LandingTitleTag>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  variantMode?: RefOrValue<ComponentVariantMode>
  columns?: RefOrValue<number | string>
  columnsLg?: RefOrValue<number | string>
  alignItems?: RefOrValue<GridAlignItems>
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

const DEFAULT_LANDING_BAND_VARIANT: ComponentVariant = 'surfaceAlt'
const DEFAULT_LANDING_BAND_VARIANT_MODE: ComponentVariantMode = 'stateless'
const DEFAULT_LANDING_BAND_HEIGHT = '16rem'
const DEFAULT_LANDING_BAND_EDGE_SIZE = '4rem'
const DEFAULT_LANDING_BAND_EDGE_START = '0%'
const LANDING_BAND_INLINE_PADDING = '1em'

const landingBandTemplate = html`<section :class="classes" :style="bandStyle">
  <slot></slot>
</section>`

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

const featureCardTemplate = html`<Panel :tone="tone" :variant="variant || 'surface'">
  <Flex direction="column" align="start" justify="center">
    <Flex align="center" justify="center" class="w-full" r-if="icon || badge">
      <IconFrame
        r-if="icon"
        :name="icon"
        :tone="tone"
        :variant="variant"
        size="lg"/>
      <Badge r-if="badge" :tone="tone">{{ badge }}</Badge>
    </Flex>
    <Flex direction="column" align="center" class="text-justify">
      <p class="text-eyebrow" r-if="eyebrow">{{ eyebrow }}</p>
      <h3 class="fs-h4 fw-700 my-0" r-if="title">{{ title }}</h3>
      <p class="text-tagline mb-0" r-if="summary">{{ summary }}</p>
      <slot></slot>
    </Flex>
    <Flex wrap="true" class="mt-auto">
      <slot name="actions"></slot>
    </Flex>
  </Flex>
</Panel>`

const metricStripTemplate = html`<Panel :tone="tone" :variant="variant || 'surface'" class="w-full">
  <Grid
    :columns="columns || 1"
    :columnsSm="columnsSm || 2"
    :columnsLg="columnsLg || 4"
  >
    <slot></slot>
  </Grid>
</Panel>`

const metricItemTemplate = html`<Flex align="start">
  <IconFrame
    r-if="icon"
    :name="icon"
    :tone="tone"
    variant="surface"
    size="sm"/>
  <div>
    <p class="prose-meta mb-1" r-if="label">{{ label }}</p>
    <strong class="fs-body" r-if="value != undefined">{{ value }}</strong>
    <p class="text-subtle fs-xs mb-0" r-if="detail">{{ detail }}</p>
    <slot></slot>
  </div>
</Flex>`

const codeShowcaseTemplate = html`<Panel :tone="tone" :variant="variant || 'surface'">
  <Flex direction="column">
    <Flex align="start" justify="between" wrap="true">
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
    <Panel
      r-if="resultTitle || resultMeta"
      :tone="tone"
      variant="outline"
      class="box-shadow-none"
    >
      <Flex align="center" justify="between" wrap="true" class="mb-2">
        <strong r-if="resultTitle">{{ resultTitle }}</strong>
        <Badge r-if="resultMeta" :tone="tone">{{ resultMeta }}</Badge>
      </Flex>
      <slot name="result"></slot>
    </Panel>
  </Flex>
</Panel>`

const comparisonTableTemplate = html`<Panel :tone="tone" :variant="variant || 'surface'" class="mb-6">
  <Flex direction="column" align="start" class="w-full">
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
      class="w-full"
    >
      <slot></slot>
    </Grid>
  </Flex>
</Panel>`

const comparisonColumnTemplate = html`<Panel :tone="tone" :variant="variant || 'surface'">
  <Flex direction="column" align="start">
    <Flex align="center" justify="between" class="w-full" r-if="icon || badge">
      <IconFrame
        r-if="icon"
        :name="icon"
        :tone="tone"
        :variant="variant"
        size="lg"/>
      <Badge r-if="badge" :tone="tone">{{ badge }}</Badge>
    </Flex>
    <h3 class="fs-h4 fw-700 my-0" r-if="title">{{ title }}</h3>
    <p class="text-tagline mb-0" r-if="summary">{{ summary }}</p>
    <slot></slot>
  </Flex>
</Panel>`

const comparisonFeatureTemplate = html`<Flex container="li" align="start">
  <IconFrame
    :name="icon || 'lucide:check'"
    :tone="tone"
    variant="surface"
    size="sm"/>
  <slot></slot>
</Flex>`

const ctaSectionTemplate = html`<Panel :tone="tone" :variant="variant || 'surface'">
  <Grid columns="1" columnsLg="minmax(0, 1fr) auto" alignItems="center">
    <SectionHeader
      :eyebrow="eyebrow"
      :title="title"
      :subtitle="subtitle"
      titleTag="h2"
      titleClass="fs-h2 mb-2"
      subtitleClass="mb-0"/>
    <Flex align="center" justify="end" wrap="true">
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

function defineLandingBandComponent() {
  return defineComponent<LandingBand>(landingBandTemplate, {
    props: [
      'tone',
      'variant',
      'variantMode',
      'image',
      'imageFit',
      'imagePosition',
      'display',
      'alignItems',
      'justifyContent',
      'height',
      'marginTop',
      'marginBottom',
      'paddingTop',
      'paddingBottom',
      'topEdge',
      'bottomEdge',
      'edgeSize',
      'topEdgeStart',
      'bottomEdgeStart',
    ],
    context: (head) => resolveLandingBand(head.props),
  })
}

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
    landingBand: defineLandingBandComponent(),
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

function resolveLandingBand(props: LandingBand): LandingBand {
  const height = computed(() =>
    resolveStyleValue(props.height, DEFAULT_LANDING_BAND_HEIGHT),
  )
  const edgeSize = computed(() =>
    resolveStyleValue(props.edgeSize, DEFAULT_LANDING_BAND_EDGE_SIZE),
  )
  const inlineStartBleed = resolveLandingBandInlineBleed('start')
  const inlineEndBleed = resolveLandingBandInlineBleed('end')

  return {
    ...props,
    classes: computed(() =>
      resolveComponentClasses(props, {
        defaultVariant: DEFAULT_LANDING_BAND_VARIANT,
        defaultVariantMode: DEFAULT_LANDING_BAND_VARIANT_MODE,
        classes: ['rounded-none', resolveLandingBandBorderClass(props)],
      }),
    ),
    bandStyle: computed<Partial<CSSProps>>(() => ({
      display: resolveCssPropValue(props.display, 'flex'),
      alignItems: resolveCssPropValue(props.alignItems, 'start'),
      justifyContent: resolveCssPropValue(props.justifyContent, 'center'),
      borderRadius: '0 !important',
      borderLeft: 'none !important',
      borderRight: 'none !important',
      overflow: 'hidden',
      boxSizing: 'border-box',
      pointerEvents: 'none',
      minHeight: height(),
      marginInlineStart: `calc(-1 * (${inlineStartBleed}))`,
      marginInlineEnd: `calc(-1 * (${inlineEndBleed}))`,
      paddingInlineStart: `calc(${LANDING_BAND_INLINE_PADDING} + ${inlineStartBleed})`,
      paddingInlineEnd: `calc(${LANDING_BAND_INLINE_PADDING} + ${inlineEndBleed})`,
      paddingTop: resolveLandingBandEdgePadding(
        props.paddingTop,
        edgeSize(),
        props.topEdge,
      ),
      paddingBottom: resolveLandingBandEdgePadding(
        props.paddingBottom,
        edgeSize(),
        props.bottomEdge,
      ),
      marginTop: resolveStyleValue(props.marginTop, '0'),
      marginBottom: resolveStyleValue(props.marginBottom, '0'),
      backgroundImage: resolveBackgroundImage(props.image),
      backgroundSize: unref(props.imageFit) || 'cover',
      backgroundPosition: unref(props.imagePosition) || 'center',
      backgroundRepeat: 'no-repeat',
      clipPath: resolveLandingBandClipPath(props, edgeSize()),
    })),
  }
}

function resolveLandingBandInlineBleed(side: 'start' | 'end') {
  return `${resolveCenteredViewportBleed()} + ${resolveDocLayoutInlineCorrection(side)}`
}

function resolveCenteredViewportBleed() {
  return '50vw - 50%'
}

function resolveDocLayoutInlineCorrection(side: 'start' | 'end') {
  const inlineStartState = `(${resolveDocLayoutInlineStartState()})`
  const inlineEndState = `(${resolveDocLayoutInlineEndState()})`
  const balance =
    side === 'start'
      ? `${inlineStartState} - ${inlineEndState}`
      : `${inlineEndState} - ${inlineStartState}`
  return `(${balance}) / 2`
}

function resolveDocLayoutInlineStartState() {
  return [
    docLayoutVar('activeShellPaddingInlineStart'),
    docLayoutVar('activeNavWidth'),
  ].join(' + ')
}

function resolveDocLayoutInlineEndState() {
  return [
    docLayoutVar('activeShellPaddingInlineEnd'),
    docLayoutVar('activeTocWidth'),
  ].join(' + ')
}

function resolveLandingBandClipPath(
  props: LandingBand,
  edgeSize: string,
): string | undefined {
  const topEdge = resolveLandingBandEdge(props.topEdge)
  const bottomEdge = resolveLandingBandEdge(props.bottomEdge)

  if (topEdge === 'flat' && bottomEdge === 'flat') return undefined

  const topStart = resolveStyleValue(
    props.topEdgeStart,
    DEFAULT_LANDING_BAND_EDGE_START,
  )
  const bottomStart = resolveStyleValue(
    props.bottomEdgeStart,
    DEFAULT_LANDING_BAND_EDGE_START,
  )
  const topLeftY = topEdge === 'slant-up' ? edgeSize : '0'
  const topRightY = topEdge === 'slant-down' ? edgeSize : '0'
  const bottomRightY =
    bottomEdge === 'slant-up' ? `calc(100% - ${edgeSize})` : '100%'
  const bottomLeftY =
    bottomEdge === 'slant-down' ? `calc(100% - ${edgeSize})` : '100%'
  const points = [
    `0 ${topLeftY}`,
    `${topStart} ${topLeftY}`,
    `100% ${topRightY}`,
    `100% ${bottomRightY}`,
    `${bottomStart} ${bottomLeftY}`,
    `0 ${bottomLeftY}`,
  ]

  return `polygon(${points.join(', ')})`
}

function resolveLandingBandEdgePadding(
  padding: RefOrValue<string> | undefined,
  edgeSize: string,
  edge: RefOrValue<LandingBandEdge> | undefined,
) {
  const resolvedPadding = resolveStyleValue(padding, '1em')
  return resolveLandingBandEdge(edge) === 'flat'
    ? resolvedPadding
    : `calc(${resolvedPadding} + ${edgeSize})`
}

function resolveLandingBandEdge(edge?: RefOrValue<LandingBandEdge>) {
  const resolved = unref(edge)
  return resolved === 'slant-up' || resolved === 'slant-down'
    ? resolved
    : 'flat'
}

function resolveLandingBandBorderClass(props: LandingBand) {
  return resolveLandingBandEdge(props.topEdge) === 'flat' &&
    resolveLandingBandEdge(props.bottomEdge) === 'flat'
    ? undefined
    : 'b-0'
}

function resolveBackgroundImage(image?: RefOrValue<string>) {
  const resolved = unref(image)
  return typeof resolved === 'string' && resolved.trim()
    ? `url("${resolved.trim()}")`
    : undefined
}

function resolveStyleValue(
  value: RefOrValue<string> | undefined,
  fallback: string,
) {
  const resolved = unref(value)
  return typeof resolved === 'string' && resolved.trim()
    ? resolved.trim()
    : fallback
}

function resolveCssPropValue<T>(value: RefOrValue<T> | undefined, fallback: T) {
  return unref(value) || fallback
}
