import { h } from '@purestack/ts-html'

import { getHtml } from './head'

export function getPage() {
  const html = getHtml({
    title: 'My Index Page',
  })
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
  return page
}
