import { h } from '@purestack/ts-html'
import { createLogger, getLogger } from 'logpot'

import { colorizeHTML } from './colorizeHTML'
import { getHtml } from './head'

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
  const html = getHtml()
  const body = h('body').children(
    h('main').children(h('test').text('123')).raw('<p>abcdef</p>'),
    h('script').raw('<><>şşş<<<'),
  )
  h('img').attr({ id: '23' })
  const page = html
    .children(body)
    .select('main', (n) =>
      n.attr({ id: '34' }).children(h('style').text('hello')),
    )

  return await page.toPrettyHtml()
}
