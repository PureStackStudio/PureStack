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
  canonicalUrl: undefined,
  openGraph: undefined,
  favIcon: {
    rel: 'icon',
    href: '/assets/favicon.svg',
    type: 'image/svg+xml',
  },
}

export function getHead(config?: BasicHeadConfig) {
  return createHead(getHeadConfig(merge(DEFAULTS, config))).push(
    h('meta').attr({
      name: 'generator',
      content: 'PureStack v1.1.16',
    }),
  )
}
