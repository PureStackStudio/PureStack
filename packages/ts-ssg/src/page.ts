import { h } from '@purestack/ts-html'

import { getHtml } from './head'

export function getPage() {
  const html = getHtml({
    title: 'My Index Page',
  })
  const body = h('body').push(
    h('main').push(h('test').text('123')).raw('<p>abcdef</p>'),
    h('script').raw('<><>şşş<<<'),
  )
  h('img').attr({ id: '23' })
  const page = html
    .push(body)
    .select('main', (n) => n.attr({ id: '34' }).push(h('style').text('hello')))
  return page
}
