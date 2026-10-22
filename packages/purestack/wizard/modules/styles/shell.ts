import { BREAKPOINTS, mediaBelow, type ThemePalette } from '@purestack/ts-style'
import type { WizardStyle } from './index'

export function registerShellStyles(root: WizardStyle, palette: ThemePalette) {
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
  root.select('.wizard-content').padding('3.5rem 2rem 2rem')
  root.select('.wizard-content > .section-header').maxWidth('45rem')
  root
    .select('.wizard-content > .section-header .text-title')
    .fontSize('clamp(2rem, 3.5vw, 3rem)')
    .letterSpacing('-0.045em')
    .lineHeight('1.15')
  root
    .select('.wizard-content > .section-header .text-eyebrow')
    .color(palette.semanticTone.accent.text.default)
  root
    .select('.wizard-content > .section-header .text-tagline')
    .lineHeight('1.8')
  root.select('.wizard-navigation').position('sticky').top('6rem')
  root
    .select('.wizard-navigation .btn')
    .justifyContent('flex-start')
    .width('100%')
  root
    .select('.wizard-navigation .btn__label')
    .whiteSpace('normal')
    .textAlign('start')
  root
    .select('.wizard-navigation .wizard-nav-number')
    .fontSize(palette.font.size.xs)
    .opacity('0.6')
    .marginRight('0.75rem')
  root
    .select('.wizard-navigation .wizard-local-status')
    .borderTop(`1px solid ${palette.current.border.subtle}`)
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.wizard-navigation')
    .position('static')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.wizard-content')
    .padding('2rem 1rem 1rem')
}
