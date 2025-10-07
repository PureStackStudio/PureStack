import { colorizeHTML } from '@logpot/printer'
import { s } from '@purestack/ts-css'
import { h } from '@purestack/ts-html'
import { createLogger, getLogger } from 'logpot'

import { Header } from './components/header'
import { getHtml } from './head'

async function main() {
  const logger = await createLogger({
    consoleTransport: {
      formatter: {
        kind: 'template',
        printer: {
          quotes: '',
          objectFormatter: {
            showBrackets: false,
            showCommas: false,
          },
        },
      },
    },
  })

  getLogger().debug('\n' + colorizeHTML(await run()))
  await logger.close()
}

main().catch(console.error)

async function run() {
  const style = s()
  const body = h('body')
  const html = getHtml()
  const page = html
    .push(body.push(Header(style), getMain(), getScript()))
    .select('main', (n) =>
      n.attr({ id: '66' }).push(h('template').id(33).text('hello')),
    )
    .select('head', (head) => head.push(h('style').raw(style.toCSS())))

  return await page.toPrettyHtml()
}
function getScript() {
  return h('script').raw('console.log(`Hello world!`)')
}

function getMain() {
  return h('main')
    .push(h('test').text('123').raw('<img src="a.png"/>').text('456'))
    .push(h('button').attr({ disabled: '', class: 'abc', style: '' }))
    .push(h('form').attr({ disabled: '', class: 'abc', name: '' }))
    .raw('<p>abcdef</p>')
}
