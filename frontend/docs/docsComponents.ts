import type { SiteConfig } from '@purestack/ts-common'
import { defineApiPropertyComponent } from './apiProperty'
import { defineComponentGuideComponents } from './componentGuide'
import { defineChartAppearanceGallery } from './dataGuide'
import { defineFormAppearanceGallery } from './formAppearance'
import { defineLandingAppearanceGallery } from './landingGuide'
import { defineModalExampleComponents } from './modal'
import { defineSemanticToneGallery } from './semanticToneGuide'
import {
  defineConsentPreviewComponent,
  defineNavMenuPreviewComponent,
  definePageTocPreviewComponent,
  defineSignInPreviewComponent,
  defineTopBarPreviewComponent,
} from './sitePreviewComponents'
import { defineSiteAppearanceGallery } from './sitePreviews'

export function defineDocumentationComponents(site: SiteConfig) {
  return {
    ...defineComponentGuideComponents(),
    FormAppearanceGallery: defineFormAppearanceGallery(),
    ChartAppearanceGallery: defineChartAppearanceGallery(),
    LandingAppearanceGallery: defineLandingAppearanceGallery(),
    SiteAppearanceGallery: defineSiteAppearanceGallery(site),
    SemanticToneGallery: defineSemanticToneGallery(),
    ApiProperty: defineApiPropertyComponent(),
    ConsentPreview: defineConsentPreviewComponent(site),
    NavMenuPreview: defineNavMenuPreviewComponent(site),
    PageTocPreview: definePageTocPreviewComponent(site),
    SignInPreview: defineSignInPreviewComponent(site),
    TopBarPreview: defineTopBarPreviewComponent(site),
    ...defineModalExampleComponents(),
  }
}
