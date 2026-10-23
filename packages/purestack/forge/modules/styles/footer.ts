import { BREAKPOINTS, mediaBelow, type ThemePalette } from '@purestack/ts-style'
import type { ThemeStyle } from './index'

export function registerFooterStyles(root: ThemeStyle, palette: ThemePalette) {
  root.select('.forge-footer').backgroundColor(palette.current.canvas)
  root
    .select('.forge-footer .site-footer__bottom')
    .padding('1.25rem 2rem')
    .gap('1rem')
    .fontSize(palette.font.size.xs)
  root
    .select('.forge-footer .site-footer__copyright')
    .color(palette.current.text.default)
    .fontWeight('600')
  root.select('.forge-footer .site-footer__legal').gap('1.5rem')
  root.select('.forge-footer a').textDecoration('none')
  root
    .select('.forge-footer a:hover')
    .color(palette.semanticTone.accent.text.default)
  root
    .select('.forge-footer a:focus-visible')
    .outline(`2px solid ${palette.semanticTone.accent.button.rest.bgcolor}`)
    .outlineOffset('4px')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.forge-footer .site-footer__bottom')
    .padding('1.25rem 1rem')
    .flexDirection('column')
    .alignItems('flex-start')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.forge-footer .site-footer__legal')
    .justifyContent('flex-start')
}
