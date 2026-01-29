import { type BasicHeadConfig, h } from '@purestack/ts-html'

import { getHead } from './head'

export interface RenderPageInput {
  bodyHtml: string
  headConfig?: BasicHeadConfig
}

export async function renderPage(input: RenderPageInput): Promise<string> {
  const { bodyHtml, headConfig } = input
  const head = getHead(headConfig)
  const html = h('html').push(
    head,
    h('body').push(h('main').push(h('article').raw(bodyHtml))),
  )
  return await html.toPrettyHtml()
}
