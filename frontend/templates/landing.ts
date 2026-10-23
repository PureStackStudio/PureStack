import type { PageTemplate } from '@purestack/ts-common'
import { h } from '@purestack/ts-html'
import { card } from '../demoStyle'

export const landingTemplate: PageTemplate = ({
  head,
  bodyHtml,
  headerHtml,
  footerHtml,
}) => {
  head.push(h('style').raw(card.toCSS()))
  return h('html')
    .attr({ lang: 'en' })
    .push(
      head,
      h('body')
        .class('landing-page tone--neutral')
        .push(
          h('a')
            .class('skip-link')
            .attr({ href: '#main' })
            .text('Skip to content'),
          h('').raw(headerHtml ?? ''),
          h('main').id('main').attr({ tabindex: '-1' }).raw(bodyHtml),
          h('consent'),
          h('').raw(footerHtml ?? ''),
        ),
    )
}
