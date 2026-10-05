import { h } from '@purestack/ts-html'
import { definePlugin } from '@purestack/ts-ssg'
import { defineStudioComponents } from './components/studioComponents'
import { card } from './demoStyle'
import { registerApiReferenceStyles } from './docs/apiReferenceStyles'
import { registerComponentGuideStyles } from './docs/componentGuide'
import { defineDocumentationComponents } from './docs/docsComponents'
import { writeSiteGuidePreviews } from './docs/siteGuide'
import { writeConsentPreview } from './purestack.studio/components/site/consent/preview'
import { writeNavMenuPreview } from './purestack.studio/components/site/nav-menu/preview'
import { writePageTocPreview } from './purestack.studio/components/site/page-toc/preview'
import { writeSignInPreview } from './purestack.studio/components/site/sign-in/preview'
import { writeTopBarPreview } from './purestack.studio/components/site/top-bar/preview'
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
  templates: {
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
    async onContentDiscovered(context) {
      await writeSiteGuidePreviews(context.config)
      await writeConsentPreview(context.config)
      await writeNavMenuPreview(context.config)
      await writePageTocPreview(context.config)
      await writeSignInPreview(context.config)
      await writeTopBarPreview(context.config)
    },
  },
})
