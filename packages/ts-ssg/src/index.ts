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

  getLogger().debug(await run())
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
    h('div').raw('abcdef'),
    h('script').raw('<><>şşş<<<'),
  )
  const page = html.children(head, body)

  return await page.toPrettyHtml()
}
