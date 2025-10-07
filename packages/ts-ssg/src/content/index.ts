import { s } from '@purestack/ts-css'
import { h } from '@purestack/ts-html'

import { Header } from '../components/header'
import { getHtml } from '../head'

const style = s()
getHtml({
  title: 'PureStack | Main',
  openGraph: {
    title: 'PureStack',
    description: 'PureStack',
  },
}).push(
  h('body').push(Header(style), h('main').push(h('article')), h('footer')),
)
