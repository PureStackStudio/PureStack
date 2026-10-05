import { h } from '@purestack/ts-html'
import { definePlugin } from '@purestack/ts-ssg'
import { defineStudioComponents } from './components/studioComponents'
import { card } from './demoStyle'
import { registerApiReferenceStyles } from './docs/apiReferenceStyles'
import { registerComponentGuideStyles } from './docs/componentGuide'
import { defineDocumentationComponents } from './docs/docsComponents'
import { previewTemplate } from './docs/previewTemplate'
import { sitePreviewPages } from './docs/sitePreviews'
import { studioSkin } from './theme/studioSkin'
import { registerStudioStyles } from './theme/studioStyles'

/** Everything purestack.studio adds to PureStack: skin, components, layout, previews. */
export const studioPlugin = definePlugin({
  name: 'purestack-studio',
  skins: { studio: studioSkin },
  components: (config) => ({
    ...defineStudioComponents(),
    ...defineDocumentationComponents(config),
  }),
  pages: () => sitePreviewPages(),
  templates: {
    preview: previewTemplate,
    studio: ({ head, bodyHtml, headerHtml, footerHtml }) => {
      head.push(h('style').raw(card.toCSS()))
      return h('html')
        .attr({ lang: 'en' })
        .push(
          head,
          h('body')
            .class('studio tone--neutral')
            .push(
              h('a')
                .class('skip-link')
                .attr({ href: '#main' })
                .text('Skip to content'),
              h('').raw(headerHtml ?? ''),
              h('main').id('main').attr({ tabindex: '-1' }).raw(bodyHtml),
              h('consent'),
              h('').raw(footerHtml ?? ''),
            ),
        )
    },
  },
  hooks: {
    onConfigResolved() {
      registerStudioStyles()
      registerApiReferenceStyles()
      registerComponentGuideStyles()
    },
  },
})
