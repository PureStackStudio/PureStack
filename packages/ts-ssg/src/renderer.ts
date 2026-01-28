import { h } from '@purestack/ts-html'

export interface RenderPageInput {
  title: string
  bodyHtml: string
  siteTitle: string
}

export async function renderPage(input: RenderPageInput): Promise<string> {
  const { title, bodyHtml, siteTitle } = input
  const html = h('html').push(
    h('head').push(
      h('meta').attr({ charset: 'utf-8' }),
      h('meta').attr({ name: 'viewport', content: 'width=device-width,initial-scale=1' }),
      h('title').text(title ? `${title} | ${siteTitle}` : siteTitle),
    ),
    h('body').push(h('main').push(h('article').raw(bodyHtml))),
  )
  return await html.toPrettyHtml()
}
