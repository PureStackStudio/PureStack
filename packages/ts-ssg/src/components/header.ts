import { Style } from '@purestack/ts-css'
import { h } from '@purestack/ts-html'

import { LinkButton } from './linkButton'

export function Header(style: Style) {
  createStyles(style)
  const div = h('div')
  return div
    .class('header')
    .push(
      div.class('title-wrapper d-flex'),
      div.class('d-flex').push(h('Search')),
      div.class('d-flex').push(h('SocialIcons')),
      h('ThemeSelect'),
      h('LanguageSelect'),
      LinkButton({ style, href: '/' }),
    )
}

function createStyles(style: Style) {
  style.select('.header').css({
    display: 'flex',
    gap: 'var(--sl-nav-gap)',
    'justify-content': 'space-between',
    'align-items': 'center',
    height: '100%',
  })
}
