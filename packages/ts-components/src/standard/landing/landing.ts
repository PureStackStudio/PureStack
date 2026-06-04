export type {
  CodeShowcase,
  ComparisonColumn,
  ComparisonFeature,
  ComparisonTable,
  CtaSection,
  FeatureCard,
  LandingBand,
  LandingBandEdge,
  LandingBandImageFit,
  LandingSection,
  LandingTitleTag,
  MetricItem,
  MetricStrip,
} from './landingTypes'

import { defineCodeShowcaseComponent } from './codeShowcase'
import { defineComparisonColumnComponent } from './comparisonColumn'
import { defineComparisonFeatureComponent } from './comparisonFeature'
import { defineComparisonTableComponent } from './comparisonTable'
import { defineCtaSectionComponent } from './ctaSection'
import { defineFeatureCardComponent } from './featureCard'
import { defineLandingBandComponent } from './landingBand'
import { defineLandingSectionComponent } from './landingSection'
import { defineMetricItemComponent } from './metricItem'
import { defineMetricStripComponent } from './metricStrip'

export { defineCodeShowcaseComponent } from './codeShowcase'
export { defineComparisonColumnComponent } from './comparisonColumn'
export { defineComparisonFeatureComponent } from './comparisonFeature'
export { defineComparisonTableComponent } from './comparisonTable'
export { defineCtaSectionComponent } from './ctaSection'
export { defineFeatureCardComponent } from './featureCard'
export { defineLandingBandComponent } from './landingBand'
export { defineLandingSectionComponent } from './landingSection'
export { defineMetricItemComponent } from './metricItem'
export { defineMetricStripComponent } from './metricStrip'

export function defineLandingComponents() {
  return {
    ...defineLandingBandComponent(),
    ...defineLandingSectionComponent(),
    ...defineFeatureCardComponent(),
    ...defineMetricStripComponent(),
    ...defineMetricItemComponent(),
    ...defineCodeShowcaseComponent(),
    ...defineComparisonTableComponent(),
    ...defineComparisonColumnComponent(),
    ...defineComparisonFeatureComponent(),
    ...defineCtaSectionComponent(),
  }
}
