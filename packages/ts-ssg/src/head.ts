import { merge } from '@logpot/utils'
import {
  BasicHeadConfig,
  createHead,
  getHeadConfig,
  h,
} from '@purestack/ts-html'

const DEFAULTS: BasicHeadConfig = {
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
  favIcon: {
    rel: 'shortcut icon',
    href: '/purestack/favicon.svg',
    type: 'image/svg+xml',
  },
}

export function getHtml(config?: BasicHeadConfig) {
  return h('html')
    .attr({
      lang: 'en',
      dir: 'ltr',
    })
    .children(getHead(config))
}
export function getHead(config?: BasicHeadConfig) {
  const meta = h('meta')
  const head = createHead(getHeadConfig(merge(DEFAULTS, config))).children(
    meta.attr({
      name: 'generator',
      content: 'ts-ssg v1.0.0',
    }),
  )
  return head
}
