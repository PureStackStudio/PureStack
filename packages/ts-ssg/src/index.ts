import { createHead, getHeadConfig, h } from '@purestack/ts-html'
import { createLogger, getLogger } from 'logpot'

import { colorizeHTML } from './colorizeHTML'

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

  const html = h('html').attr({
    lang: 'en',
    dir: 'ltr',
  })
  const body = h('body').children(
    h('main').children(h('test').text('123')).raw('<p>abcdef</p>'),
    h('script').raw('<><>şşş<<<'),
  )
  h('img').attr({ id: '23' })
  const page = html
    .children(head, body)
    .select('main', (n) =>
      n.attr({ id: '34' }).children(h('style').text('hello')),
    )

  return await page.toPrettyHtml()
}
