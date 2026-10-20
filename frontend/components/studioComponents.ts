import { defineStudioActivityChartComponent } from './studioActivityChart'
import { defineStudioBrandComponent } from './studioBrand'
import { defineStudioCommandComponent } from './studioCommand'
import { defineStudioColorPickerComponent } from './studioColorPicker'
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
    studioActivityChart: defineStudioActivityChartComponent(),
    studioWorkbench: defineStudioWorkbenchComponent(),
  }
}
