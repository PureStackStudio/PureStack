import type { ThemePalette } from '@purestack/ts-style'
import type { ThemeStyle } from './index'

export function registerDashboardStyles(
  root: ThemeStyle,
  palette: ThemePalette,
) {
  root
    .select('.forge-panel')
    .minWidth('0')
    .boxShadow(palette.effect.panelShadow)
  root
    .select('.forge-panel .section-header .text-title')
    .fontSize(palette.font.size.h3)
    .letterSpacing('-0.025em')
  root.select('.forge-template-card').height('100%')
  root.select('.forge-template-card .panel__body').height('100%')
  root
    .select('.forge-template-marker')
    .width('2.75rem')
    .height('2.75rem')
    .borderRadius(palette.radii.md)
    .backgroundColor(palette.semanticTone.accent.surface.rest.background)
    .color(palette.semanticTone.accent.text.default)
  root
    .select('.forge-review')
    .display('grid')
    .gridTemplateColumns('minmax(5rem, 8rem) minmax(0, 1fr)')
  root.select('.forge-review dt').color(palette.current.text.subtle)
  root.select('.forge-review dd').margin('0').overflowWrap('anywhere')
  root
    .select('.forge-panel .forge-actions')
    .borderTop(`1px solid ${palette.current.border.subtle}`)
}
