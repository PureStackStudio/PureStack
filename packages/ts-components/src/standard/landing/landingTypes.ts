import type { CSSProps } from '@purestack/ts-css'
import type { SemanticTone } from '@purestack/ts-style'
import type { ComputedRef, RefOrValue } from 'regor'
import type {
  ComponentVariant,
  ComponentVariantMode,
} from '../componentVariant'
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
