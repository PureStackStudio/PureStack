import { defineCommandBlockComponent } from './getting-started/command-block'
import { defineForgeOverviewComponent } from './getting-started/forge-overview'
import { defineActivityChartPreviewComponent } from './landing/activity-chart-preview'
import { defineFaqItemComponent } from './landing/faq-item'
import { defineFeatureShowcaseComponent } from './landing/feature-showcase'
import { definePackageLinkComponent } from './landing/package-link'
import { defineRegorRelationshipComponent } from './landing/regor-relationship'
import { defineSourceWorkbenchComponent } from './landing/source-workbench'
import { defineCopyButtonComponent } from './shared/copy-button'
import { defineBrandComponent } from './shell/brand'
import { definePalettePickerComponent } from './shell/palette-picker'

export function defineFrontendComponents() {
  return {
    brand: defineBrandComponent(),
    palettePicker: definePalettePickerComponent(),
    featureShowcase: defineFeatureShowcaseComponent(),
    packageLink: definePackageLinkComponent(),
    regorRelationship: defineRegorRelationshipComponent(),
    copyButton: defineCopyButtonComponent(),
    faqItem: defineFaqItemComponent(),
    commandBlock: defineCommandBlockComponent(),
    forgeOverview: defineForgeOverviewComponent(),
    activityChartPreview: defineActivityChartPreviewComponent(),
    sourceWorkbench: defineSourceWorkbenchComponent(),
  }
}
