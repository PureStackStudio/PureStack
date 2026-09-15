import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { PageTemplateMap } from '@purestack/ts-common'
import { h } from '@purestack/ts-html'
import { buildSite, startDevServer } from '@purestack/ts-ssg'
import { createLogger, getLogger } from 'logpot'
import { card } from './demoStyle'

const command = process.argv[2] ?? 'serve'
if (!['serve', 'build', 'publish'].includes(command)) {
  throw new Error('Usage: yarn tsx frontend/studio.ts [serve|build|publish]')
}

const templates: PageTemplateMap = {
  studio: ({ head, bodyHtml, headerHtml, footerHtml }) => {
    head.push(h('link').attr({ rel: 'stylesheet', href: '/assets/studio.css' }))
    head.push(h('style').raw(card.toCSS()))
    return h('html')
      .attr({ lang: 'en' })
      .push(
        head,
        h('body')
          .class('studio')
          .push(
            h('a')
              .class('skip-link')
              .attr({ href: '#main' })
              .text('Skip to content'),
            h('').raw(headerHtml ?? ''),
            h('main').id('main').attr({ tabindex: '-1' }).raw(bodyHtml),
            h('').raw(footerHtml ?? ''),
          ),
      )
  },
}

const build = {
  siteConfig: {
    contentDir: path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      'purestack.studio',
    ),
  },
  options: { templates },
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
