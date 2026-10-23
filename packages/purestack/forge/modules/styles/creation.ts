import type { ThemePalette } from '@purestack/ts-style'
import type { ThemeStyle } from './index'

export function registerCreationStyles(
  root: ThemeStyle,
  palette: ThemePalette,
) {
  root.select('.forge-workspace-path').overflowWrap('anywhere')
  root
    .select('.forge-progress-spinner')
    .width('2.5rem')
    .height('2.5rem')
    .flexShrink('0')
    .border(`3px solid ${palette.current.border.subtle}`)
    .borderTopColor(palette.semanticTone.accent.text.default)
    .borderRadius('50%')
    .animation('forge-progress-spin 900ms linear infinite')
  root.keyframes('forge-progress-spin').select('to').transform('rotate(360deg)')
  root
    .media('prefers-reduced-motion: reduce')
    .select('.forge-progress-spinner')
    .animation('none')
  root
    .select('.forge-progress-meter')
    .width('100%')
    .height('0.6rem')
    .accentColor(palette.semanticTone.accent.button.rest.bgcolor)
  root
    .select('.forge-progress-meter::-webkit-progress-bar')
    .backgroundColor(palette.current.surfaceAlt.rest.bgcolor)
    .borderRadius(palette.radii.pill)
  root
    .select('.forge-progress-meter::-webkit-progress-value')
    .backgroundColor(palette.semanticTone.accent.button.rest.bgcolor)
    .borderRadius(palette.radii.pill)
  root
    .select('.forge-progress-meter::-moz-progress-bar')
    .backgroundColor(palette.semanticTone.accent.button.rest.bgcolor)
    .borderRadius(palette.radii.pill)
  root.select('.forge-task-list').listStyle('none')
  root
    .select('.forge-task-list li')
    .display('grid')
    .gridTemplateColumns('1.25rem minmax(0, 1fr) auto')
    .gap('0.75rem')
    .alignItems('center')
    .borderBottom(`1px solid ${palette.current.border.subtle}`)
  root
    .select('.forge-task-list li[data-state="running"]')
    .color(palette.semanticTone.accent.text.default)
  root
    .select('.forge-task-list li[data-state="failed"]')
    .color(palette.semanticTone.danger.text.default)
  root.select('.forge-task-marker').fontWeight('700')
  root
    .select('.forge-next-commands')
    .whiteSpace('pre-wrap')
    .overflowWrap('anywhere')
}
