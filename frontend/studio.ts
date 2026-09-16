import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { PageTemplateMap } from '@purestack/ts-common'
import { h } from '@purestack/ts-html'
import { type BuildInput, buildSite, startDevServer } from '@purestack/ts-ssg'
import { createLogger, getLogger } from 'logpot'
import { defineStudioComponents } from './components/studioComponents'
import { card } from './demoStyle'
import { defineDocumentationComponents } from './docs/docsComponents'
import { registerStudioSkin } from './theme/studioSkin'
import { registerStudioStyles } from './theme/studioStyles'
import type { Component } from 'regor'

registerStudioSkin()

const command = process.argv[2] ?? 'serve'
if (!['serve', 'build', 'publish'].includes(command)) {
  throw new Error('Usage: yarn tsx frontend/studio.ts [serve|build|publish]')
}

const templates: PageTemplateMap = {
  studio: ({ head, bodyHtml, headerHtml, footerHtml }) => {
    head.push(h('style').raw(card.toCSS()))
    return h('html')
      .attr({ lang: 'en', 'data-theme': 'dark', 'data-theme-ready': '' })
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
          ...defineDocumentationComponents(),
        } as unknown as Record<string, Component>
        registerStudioStyles()
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
