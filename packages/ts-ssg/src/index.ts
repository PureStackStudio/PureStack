import { s } from '@purestack/ts-css'
import { h } from '@purestack/ts-html'
import { createLogger, getLogger } from 'logpot'

import { colorizeHTML } from './colorizeHTML'
import { getHeader } from './components/header'
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
  const style = s()
  const body = h('body')
  const html = getHtml()
  const page = html
    .push(body.push(getHeader(style), getMain(), getScript()))
    .select('main', (n) => n.attr({ id: '66' }).push(h('style').text('hello')))

  return await page.toPrettyHtml()
}
function getScript() {
  return h('script').raw('console.log(`Hello world!`)')
}

function getMain() {
  return h('main').push(h('test').text('123')).raw('<p>abcdef</p>')
}
