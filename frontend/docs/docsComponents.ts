import type { SiteConfig } from '@purestack/ts-common'
import { defineConsentPreviewComponent } from '../purestack.studio/components/consent/preview'
import { defineNavMenuPreviewComponent } from '../purestack.studio/components/nav-menu/preview'
import { definePageTocPreviewComponent } from '../purestack.studio/components/page-toc/preview'
import { defineSignInPreviewComponent } from '../purestack.studio/components/sign-in/preview'
import { defineTopBarPreviewComponent } from '../purestack.studio/components/top-bar/preview'
import { defineApiPropertyComponent } from './apiProperty'
import { defineModalExampleComponents } from './modal'
import { defineTabsExampleComponents } from './tabs'

export function defineDocumentationComponents(site: SiteConfig) {
  return {
    ApiProperty: defineApiPropertyComponent(),
    ConsentPreview: defineConsentPreviewComponent(site),
    NavMenuPreview: defineNavMenuPreviewComponent(site),
    PageTocPreview: definePageTocPreviewComponent(site),
    SignInPreview: defineSignInPreviewComponent(site),
    TopBarPreview: defineTopBarPreviewComponent(site),
    ...defineTabsExampleComponents(),
    ...defineModalExampleComponents(),
  }
}
