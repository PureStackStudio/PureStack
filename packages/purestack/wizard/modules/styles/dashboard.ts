import type { ThemePalette } from '@purestack/ts-style'
import type { WizardStyle } from './index'

export function registerDashboardStyles(
  root: WizardStyle,
  palette: ThemePalette,
) {
  root
    .select('.wizard-panel')
    .minWidth('0')
    .boxShadow(palette.effect.panelShadow)
  root
    .select('.wizard-panel .section-header .text-title')
    .fontSize(palette.font.size.h3)
    .letterSpacing('-0.025em')
  root.select('.wizard-template-card').height('100%')
  root.select('.wizard-template-card .panel__body').height('100%')
  root
    .select('.wizard-template-marker')
    .width('2.75rem')
    .height('2.75rem')
    .borderRadius(palette.radii.md)
    .backgroundColor(palette.semanticTone.accent.surface.rest.background)
    .color(palette.semanticTone.accent.text.default)
  root
    .select('.wizard-review')
    .display('grid')
    .gridTemplateColumns('minmax(5rem, 8rem) minmax(0, 1fr)')
  root.select('.wizard-review dt').color(palette.current.text.subtle)
  root.select('.wizard-review dd').margin('0').overflowWrap('anywhere')
  root
    .select('.wizard-panel .wizard-actions')
    .borderTop(`1px solid ${palette.current.border.subtle}`)
}
