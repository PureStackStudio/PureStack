import { type BasicHeadConfig, h } from '@purestack/ts-html'

import { getHead } from './config/head'
import type { ThemeStylesheetLink } from './style/themes'

export interface RenderPageInput {
  bodyHtml: string
  headConfig?: BasicHeadConfig
  styleLinks?: ThemeStylesheetLink[]
}

export async function renderPage(input: RenderPageInput): Promise<string> {
  const { bodyHtml, headConfig, styleLinks } = input
  const head = getHead(headConfig)
  if (styleLinks && styleLinks.length > 0) {
    for (const link of styleLinks) {
      head.push(
        h('link').attr({
          rel: link.rel,
          href: link.href,
          ...(link.media ? { media: link.media } : {}),
          ...(link.title ? { title: link.title } : {}),
        }),
      )
    }
  }
  const html = h('html').push(
    head,
    h('body').push(h('main').push(h('article').raw(bodyHtml))),
  )
  return await html.toPrettyHtml()
}
