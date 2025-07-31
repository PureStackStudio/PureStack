import { toColorizer } from '@logpot/printer'
import { h } from '@purestack/ts-html'
import { createLogger, getLogger } from 'logpot'

import { createHead } from './head'
import { getHeadConfig } from './seo-head'

async function main() {
  const logger = await createLogger({
    consoleTransport: {
      formatter: {
        kind: 'template',
        template: '\n{msg:#b40657}\n',
        printer: {
          objectFormatter: {
            showBrackets: false,
          },
        },
      },
    },
  })

  getLogger().debug(colorizeHTML(await run()))
  await logger.close()
}

main().catch(console.error)

async function run() {
  const link = h('link')
  const meta = h('meta')
  const head = createHead(
    getHeadConfig({
      charset: 'utf-8',
      title: 'Page | Page Title',
      viewport: 'width=device-width,initial-scale=1',
      description: 'The purestack page.',
      canonicalUrl: 'https://tenray.io/purestack',
      openGraph: {
        title: 'Page Title',
        description: 'The purestack page.',
        url: 'https://tenray.io/purestack',
      },
    }),
  ).children(
    link.attr({
      rel: 'shortcut icon',
      href: '/purestack/favicon.svg',
      type: 'image/svg+xml',
    }),
    meta.attr({
      name: 'generator',
      content: 'ts-ssg v1.0.0',
    }),
  )

  const html = h('html').attrCustom({
    lang: 'en',
    dir: 'ltr',
  })
  const body = h('body').children(
    h('main').children(h('test').text('123')).raw('<p>abcdef</p>'),
    h('script').raw('<><>şşş<<<'),
  )
  const page = html
    .children(head, body)
    .select('main', (n) =>
      n.attr({ id: '34' }).children(h('style').text('hello')),
    )

  return await page.toPrettyHtml()
}

function colorizeHTML(html: string) {
  const tagColor = toColorizer('#106767')
  return html
    .replace(/(&lt;|<)\/?([a-zA-Z0-9-]+)/g, (_, lt, tag) => lt + tagColor(tag))
    .replace(/(\/?<)/g, tagColor('$1'))
    .replace(
      /([a-zA-Z-]+)(=)/g,
      (_, attr, eq) => toColorizer('cyan')(attr) + toColorizer('gray')(eq),
    )
    .replace(/("[^"]*")/g, toColorizer('yellow')('$1'))
    .replace(/(\/?>)/g, tagColor('$1'))
}
