import {
  type BasicHeadConfig,
  createHead,
  getHeadConfig,
  h,
} from '@purestack/ts-html'
import { themes } from '@purestack/ts-style'
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
    rel: 'icon',
    href: '/assets/favicon.svg',
    type: 'image/svg+xml',
  },
}

export function getHead(config?: BasicHeadConfig) {
  const head = createHead(getHeadConfig(merge(DEFAULTS, config))).push(
    h('meta').attr({
      name: 'generator',
      content: 'ts-ssg v1.0.0',
    }),
    h('meta').attr({
      name: 'color-scheme',
      content: 'dark light',
    }),
    ...buildThemeColorMetaTags(),
  )
  return head
}

function buildThemeColorMetaTags() {
  const options = themes.getOptions()
  const lightColor = options.colors.light.accent
  const darkColor = options.colors.dark.accent

  return [
    h('meta').attr({
      name: 'theme-color',
      media: '(prefers-color-scheme: light)',
      content: lightColor,
    }),
    h('meta').attr({
      name: 'theme-color',
      media: '(prefers-color-scheme: dark)',
      content: darkColor,
    }),
  ]
}
