import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { PageTemplateMap } from '@purestack/ts-common'
import { h } from '@purestack/ts-html'
import { type BuildInput, buildSite, startDevServer } from '@purestack/ts-ssg'
import { createLogger, getLogger } from 'logpot'
import { defineStudioComponents } from './components/studioComponents'
import { card } from './demoStyle'
import { registerApiReferenceStyles } from './docs/apiReferenceStyles'
import { defineDocumentationComponents } from './docs/docsComponents'
import { writeConsentPreview } from './purestack.studio/components/site/consent/preview'
import { writeNavMenuPreview } from './purestack.studio/components/site/nav-menu/preview'
import { writePageTocPreview } from './purestack.studio/components/site/page-toc/preview'
import { writeSignInPreview } from './purestack.studio/components/site/sign-in/preview'
import { writeTopBarPreview } from './purestack.studio/components/site/top-bar/preview'
import { registerStudioSkin } from './theme/studioSkin'
import { registerStudioStyles } from './theme/studioStyles'

registerStudioSkin()

const command = process.argv[2] ?? 'serve'
if (!['serve', 'build', 'publish'].includes(command)) {
  throw new Error('Usage: yarn tsx frontend/studio.ts [serve|build|publish]')
}

const templates: PageTemplateMap = {
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
}

const build: BuildInput = {
  siteConfig: {
    contentDir: path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      'purestack.studio',
    ),
  },
  options: {
    templates,
    hooks: {
      onConfigResolved(context) {
        context.components = {
          ...defineStudioComponents(),
          ...defineDocumentationComponents(context.config),
        }
        registerStudioStyles()
        registerApiReferenceStyles()
      },
      async onContentDiscovered(context) {
        await writeConsentPreview(context.config)
        await writeNavMenuPreview(context.config)
        await writePageTocPreview(context.config)
        await writeSignInPreview(context.config)
        await writeTopBarPreview(context.config)
      },
    },
  },
  publish: { enabled: command === 'publish' },
}

await createLogger()
if (command === 'serve') {
  await startDevServer({ build, port: 4700 })
} else {
  try {
    await buildSite(build)
  } finally {
    await getLogger().close()
  }
}
