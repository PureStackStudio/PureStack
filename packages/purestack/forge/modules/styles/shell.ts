import { BREAKPOINTS, mediaBelow, type ThemePalette } from '@purestack/ts-style'
import type { ThemeStyle } from './index'

export function registerShellStyles(root: ThemeStyle, palette: ThemePalette) {
  root
    .select('body.template-splash')
    .backgroundColor(palette.current.canvas)
    .color(palette.current.text.default)
    .fontFamily(palette.font.family.base)
    .minHeight('100dvh')
    .display('flex')
    .flexDirection('column')
  root.select('body.template-splash > main').flex('1')
  root.select('.template-splash .splash').maxWidth('none').padding('0')
  root.select('.forge-content').padding('3.5rem 2rem 2rem')
  root.select('.forge-content > .section-header').maxWidth('45rem')
  root
    .select('.forge-content > .section-header .text-title')
    .fontSize('clamp(2rem, 3.5vw, 3rem)')
    .letterSpacing('-0.045em')
    .lineHeight('1.15')
  root
    .select('.forge-content > .section-header .text-eyebrow')
    .color(palette.semanticTone.accent.text.default)
  root
    .select('.forge-content > .section-header .text-tagline')
    .lineHeight('1.8')
  root.select('.forge-navigation').position('sticky').top('6rem')
  root
    .select('.forge-navigation .btn')
    .justifyContent('flex-start')
    .width('100%')
  root
    .select('.forge-navigation .btn__label')
    .whiteSpace('normal')
    .textAlign('start')
  root
    .select('.forge-navigation .forge-nav-number')
    .fontSize(palette.font.size.xs)
    .opacity('0.6')
    .marginRight('0.75rem')
  root
    .select('.forge-navigation .forge-local-status')
    .borderTop(`1px solid ${palette.current.border.subtle}`)
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.forge-navigation')
    .position('static')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.forge-content')
    .padding('2rem 1rem 1rem')
}
