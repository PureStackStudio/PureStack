import type { SiteConfig } from '@purestack/ts-common'
import { defineConsentPreviewComponent } from '../purestack.studio/components/site/consent/preview'
import { defineNavMenuPreviewComponent } from '../purestack.studio/components/site/nav-menu/preview'
import { definePageTocPreviewComponent } from '../purestack.studio/components/site/page-toc/preview'
import { defineSignInPreviewComponent } from '../purestack.studio/components/site/sign-in/preview'
import { defineTopBarPreviewComponent } from '../purestack.studio/components/site/top-bar/preview'
import { defineApiPropertyComponent } from './apiProperty'
import { defineComponentGuideComponents } from './componentGuide'
import { defineChartAppearanceGallery } from './dataGuide'
import { defineFormAppearanceGallery } from './formAppearance'
import { defineLandingAppearanceGallery } from './landingGuide'
import { defineModalExampleComponents } from './modal'

export function defineDocumentationComponents(site: SiteConfig) {
  return {
    ...defineComponentGuideComponents(),
    FormAppearanceGallery: defineFormAppearanceGallery(),
    ChartAppearanceGallery: defineChartAppearanceGallery(),
    LandingAppearanceGallery: defineLandingAppearanceGallery(),
    ApiProperty: defineApiPropertyComponent(),
    ConsentPreview: defineConsentPreviewComponent(site),
    NavMenuPreview: defineNavMenuPreviewComponent(site),
    PageTocPreview: definePageTocPreviewComponent(site),
    SignInPreview: defineSignInPreviewComponent(site),
    TopBarPreview: defineTopBarPreviewComponent(site),
    ...defineModalExampleComponents(),
  }
}
