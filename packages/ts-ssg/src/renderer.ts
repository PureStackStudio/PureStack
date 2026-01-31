import { type BasicHeadConfig, h } from '@purestack/ts-html'

import { getHead } from './head'

export interface RenderPageInput {
  bodyHtml: string
  headConfig?: BasicHeadConfig
  styleHref?: string
}

export async function renderPage(input: RenderPageInput): Promise<string> {
  const { bodyHtml, headConfig, styleHref } = input
  const head = getHead(headConfig)
  if (styleHref) {
    head.push(
      h('link').attr({
        rel: 'stylesheet',
        href: styleHref,
      }),
    )
  }
  const html = h('html').push(
    head,
    h('body').push(h('main').push(h('article').raw(bodyHtml))),
  )
  return await html.toPrettyHtml()
}
