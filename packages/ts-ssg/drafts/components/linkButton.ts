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
    alignItems: 'center',
    border: '1px solid transparent',
    borderRadius: '999rem',
    display: 'inline-flex',
    fontSize: 'var(--sl-text-sm)',
    gap: '0.5em',
    lineHeight: '1.1875',
    outlineOffset: '0.25rem',
    padding: '0.4375rem 1.125rem',
    textDecoration: 'none',
    background: '#ff44aa',
  })
}
