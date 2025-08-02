import { Style } from '@purestack/ts-css'
import { h } from '@purestack/ts-html'

interface LinkButtonProps {
  href: string
  style: Style
}

export function LinkButton(opts: LinkButtonProps) {
  const { style, href } = opts
  createStyles(style)
  const a = h('a')
  return a.class('link-button').attr({ href }).push(h('Icon').text('[X]'))
}

function createStyles(style: Style) {
  style.select('.link-button').css({
    'align-items': 'center',
    border: '1px solid transparent',
    'border-radius': '999rem',
    display: 'inline-flex',
    'font-size': 'var(--sl-text-sm)',
    gap: '0.5em',
    'line-height': '1.1875',
    'outline-offset': '0.25rem',
    padding: '0.4375rem 1.125rem',
    'text-decoration': 'none',
  })
}
