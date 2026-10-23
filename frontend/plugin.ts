import { definePlugin } from '@purestack/ts-ssg'
import { defineFrontendComponents } from './components/index'
import { registerApiReferenceStyles } from './docs/apiReferenceStyles'
import { registerComponentGuideStyles } from './docs/componentGuide'
import { defineDocumentationComponents } from './docs/docsComponents'
import { addDocumentationLinks } from './docs/documentationLinks'
import { previewTemplate } from './docs/previewTemplate'
import { sitePreviewPages } from './docs/sitePreviews'
import { ensureLegalContent } from './ensureLegalContent'
import { registerDocumentationStyles } from './styles/documentation/index'
import { registerLandingStyles } from './styles/landing/index'
import { registerPalettePickerStyles } from './styles/shell/palette-picker'
import { landingTemplate } from './templates/landing'
import { registerPaletteStyles } from './theme/colors'
import { renderColorHead } from './theme/head'
import { skin } from './theme/skin'

/** Everything purestack.studio adds to PureStack: skin, components, layout, previews. */
export const frontendPlugin = definePlugin({
  name: 'purestack-frontend',
  skins: { purestack: skin },
  head: renderColorHead,
  components: (config) => ({
    ...defineFrontendComponents(),
    ...defineDocumentationComponents(config),
  }),
  pages: () => sitePreviewPages(),
  templates: {
    preview: previewTemplate,
    landing: landingTemplate,
  },
  hooks: {
    onPageDocument(_context, { document }) {
      addDocumentationLinks(document)
    },
    async onConfigResolved({ config }) {
      await ensureLegalContent(config.contentDir)
      registerLandingStyles()
      registerApiReferenceStyles()
      registerComponentGuideStyles()
      registerDocumentationStyles()
      registerPaletteStyles()
      registerPalettePickerStyles()
    },
  },
})
