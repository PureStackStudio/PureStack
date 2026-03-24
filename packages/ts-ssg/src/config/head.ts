import {
  type BasicHeadConfig,
  createHead,
  getHeadConfig,
  h,
} from '@purestack/ts-html'
import { merge } from '@purestack/ts-util'

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

export function getHead(config?: BasicHeadConfig) {
  const meta = h('meta')
  const head = createHead(getHeadConfig(merge(DEFAULTS, config))).push(
    meta.attr({
      name: 'generator',
      content: 'ts-ssg v1.0.0',
    }),
  )
  return head
}
