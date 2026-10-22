import type { ThemePalette } from '@purestack/ts-style'
import type { StarterStyle } from './index'

export function registerFooterStyles(
  root: StarterStyle,
  palette: ThemePalette,
  gutter: string,
) {
  root
    .select('.starter-footer')
    .borderTop(`1px solid ${palette.current.border.subtle}`)
    .backgroundColor(palette.current.surfaceAlt.rest.bgcolor)
    .padding(`3.5rem ${gutter} 1.5rem`)
  root
    .select(
      '.starter-footer > .site-footer__inner, .starter-footer > .site-footer__bottom',
    )
    .maxWidth('76rem')
    .margin('0 auto')
  root
    .select('.footer-layout')
    .gap('clamp(2rem, 4vw, 3rem)')
    .paddingBottom('3rem')
  root
    .select('.footer-brand')
    .display('grid')
    .gap('1.25rem')
    .justifyItems('start')
  root
    .select('.footer-description')
    .margin('0')
    .maxWidth('28ch')
    .fontSize('0.94rem')
    .fontWeight('400')
    .lineHeight('1.8')
    .letterSpacing('0')
    .color(palette.current.text.subtle)
  root
    .select('.footer-theme-row')
    .gap('0.75rem')
    .fontSize('0.8rem')
    .fontWeight('400')
    .lineHeight('1.5')
    .letterSpacing('0')
    .color(palette.current.text.subtle)
  root.select('.footer-navigation').gap('1.5rem')
  root
    .select('.footer-link-group')
    .display('flex')
    .flexDirection('column')
    .gap('0.9rem')
  root
    .select('.footer-link-group h2')
    .margin('0 0 0.35rem')
    .fontSize('0.75rem')
    .fontWeight('600')
    .lineHeight('1.5')
    .letterSpacing('0.12em')
    .textTransform('uppercase')
    .color(palette.current.text.subtle)
  root
    .select('.footer-link-group a')
    .fontSize('0.94rem')
    .fontWeight('500')
    .lineHeight('1.6')
    .letterSpacing('0')
    .color(palette.current.text.default)
    .textDecoration('none')
  root
    .select('.footer-link-group a:hover, .footer-link-group a:focus-visible')
    .color(palette.semanticTone.accent.text.default)
    .textDecoration('underline')
  root.select('.footer-start').boxShadow('none').borderRadius(palette.radii.md)
  root
    .select('.footer-start-body')
    .padding('1.5rem')
    .display('grid')
    .gap('1.15rem')
  root.select('.footer-start-heading').gap('1rem')
  root
    .select('.footer-kicker')
    .maxWidth('16ch')
    .fontSize('0.65rem')
    .fontWeight('600')
    .lineHeight('1.6')
    .letterSpacing('0.1em')
    .textTransform('uppercase')
    .color(palette.current.text.subtle)
  root
    .select('.footer-start h2')
    .margin('0')
    .fontSize('1.35rem')
    .fontWeight('600')
    .lineHeight('1.5')
    .letterSpacing('-0.02em')
  root
    .select('.footer-start p')
    .margin('0')
    .fontSize('0.9rem')
    .fontWeight('400')
    .lineHeight('1.75')
    .letterSpacing('0')
    .color(palette.current.text.subtle)
  root
    .select('.footer-start .footer-start-link')
    .padding('0')
    .justifySelf('start')
    .fontSize('0.9rem')
    .fontWeight('600')
    .lineHeight('1.5')
    .letterSpacing('0')
  root
    .select('.starter-footer .site-footer__bottom')
    .borderTop(`1px solid ${palette.current.border.subtle}`)
    .padding('1.25rem 0 0')
    .fontSize('0.8rem')
    .fontWeight('400')
    .lineHeight('1.6')
    .letterSpacing('0')
    .alignItems('flex-start')
    .rowGap('0')
  root
    .select('.starter-footer .site-footer__copyright')
    .justifyContent('flex-start')
}
