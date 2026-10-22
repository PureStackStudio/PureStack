import type { ThemePalette } from '@purestack/ts-style'
import type { StarterStyle } from '../index'

export function registerLandingCanvasStyles(
  root: StarterStyle,
  palette: ThemePalette,
) {
  root
    .select('.landing-canvas-scene')
    .position('relative')
    .padding('0 0 1.25rem 1.25rem')
  root
    .select('.landing-canvas-backdrop')
    .position('absolute')
    .inset('2rem 1.25rem 0 0')
    .borderRadius(palette.radii.lg)
    .backgroundColor(palette.semanticTone.accent.surface.rest.bgcolor)
    .border(`1px solid ${palette.semanticTone.accent.surface.rest.border}`)
  root
    .select('.landing-canvas')
    .position('relative')
    .borderRadius(palette.radii.lg)
    .boxShadow(palette.effect.panelShadow)
  root
    .select('.landing-canvas-toolbar')
    .padding('1rem 1.25rem')
    .gap('0.75rem')
    .borderBottom(`1px solid ${palette.current.border.subtle}`)
    .color(palette.current.text.subtle)
  root.select('.landing-window-dots').gap('0.3rem')
  root
    .select('.landing-window-dots span')
    .width('0.4rem')
    .height('0.4rem')
    .borderRadius('50%')
    .backgroundColor(palette.current.border.default)
  root
    .select('.landing-window-dots span:first-child')
    .backgroundColor(palette.semanticTone.accent.tone)
  root
    .select('.landing-canvas-label')
    .maxWidth('22ch')
    .fontSize('0.65rem')
    .fontWeight('600')
    .lineHeight('1.6')
    .letterSpacing('0.08em')
    .textTransform('uppercase')
  root
    .select('.landing-canvas-content')
    .padding('1.5rem')
    .display('grid')
    .gap('1.5rem')
  root.select('.landing-canvas-message').display('grid').gap('1.25rem')
  root.select('.landing-canvas-message > .icon-frame').justifySelf('start')
  root
    .select('.landing-canvas-title')
    .display('grid')
    .gap('0.25rem')
    .fontSize('clamp(1.6rem, 2.5vw, 2.1rem)')
    .fontWeight('600')
    .lineHeight('1.35')
    .letterSpacing('-0.025em')
  root.select('.landing-principles').gap('0.75rem')
  root.select('.landing-principle').boxShadow('none')
  root.select('.landing-principle .panel__body').display('grid').gap('0.65rem')
  root
    .select('.landing-principle h3')
    .fontSize('0.94rem')
    .fontWeight('600')
    .lineHeight('1.5')
    .letterSpacing('0')
  root
    .select('.landing-principle p')
    .fontSize('0.85rem')
    .fontWeight('400')
    .lineHeight('1.7')
    .letterSpacing('0')
    .color(palette.current.text.subtle)
  root
    .select('.landing-canvas-status')
    .padding('0.85rem 1.25rem')
    .gap('0.75rem')
    .borderTop(`1px solid ${palette.current.border.subtle}`)
    .fontSize('0.65rem')
    .fontWeight('400')
    .lineHeight('1.6')
    .letterSpacing('0.02em')
    .color(palette.current.text.subtle)
  root
    .select('.landing-canvas-status > span:first-child')
    .display('flex')
    .alignItems('center')
    .gap('0.35rem')
  root
    .select('.landing-canvas-status .icon')
    .width('0.8rem')
    .height('0.8rem')
    .color(palette.semanticTone.accent.text.default)
}
