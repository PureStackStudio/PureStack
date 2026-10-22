import { defineStudioSetupStepComponent } from './getting-started/studioSetupStep'
import { defineStudioActivityChartComponent } from './studioActivityChart'
import { defineStudioBrandComponent } from './studioBrand'
import { defineStudioColorPickerComponent } from './studioColorPicker'
import { defineStudioCommandComponent } from './studioCommand'
import { defineStudioCopyComponent } from './studioCopy'
import { defineStudioFaqComponent } from './studioFaq'
import { defineStudioFeatureComponent } from './studioFeature'
import { defineStudioPackageComponent } from './studioPackage'
import { defineStudioRegorConnectionComponent } from './studioRegorConnection'
import { defineStudioWorkbenchComponent } from './studioWorkbench'

export function defineStudioComponents() {
  return {
    studioBrand: defineStudioBrandComponent(),
    studioColorPicker: defineStudioColorPickerComponent(),
    studioFeature: defineStudioFeatureComponent(),
    studioPackage: defineStudioPackageComponent(),
    studioRegorConnection: defineStudioRegorConnectionComponent(),
    studioCopy: defineStudioCopyComponent(),
    studioFaq: defineStudioFaqComponent(),
    studioCommand: defineStudioCommandComponent(),
    studioSetupStep: defineStudioSetupStepComponent(),
    studioActivityChart: defineStudioActivityChartComponent(),
    studioWorkbench: defineStudioWorkbenchComponent(),
  }
}
