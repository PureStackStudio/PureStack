import type { ThemePalette } from '@purestack/ts-style'
import type { WizardStyle } from './index'

export function registerCreationStyles(
  root: WizardStyle,
  palette: ThemePalette,
) {
  root.select('.wizard-workspace-path').overflowWrap('anywhere')
  root
    .select('.wizard-progress-spinner')
    .width('2.5rem')
    .height('2.5rem')
    .flexShrink('0')
    .border(`3px solid ${palette.current.border.subtle}`)
    .borderTopColor(palette.semanticTone.accent.text.default)
    .borderRadius('50%')
    .animation('wizard-progress-spin 900ms linear infinite')
  root
    .keyframes('wizard-progress-spin')
    .select('to')
    .transform('rotate(360deg)')
  root
    .media('prefers-reduced-motion: reduce')
    .select('.wizard-progress-spinner')
    .animation('none')
  root
    .select('.wizard-progress-meter')
    .width('100%')
    .height('0.6rem')
    .accentColor(palette.semanticTone.accent.button.rest.bgcolor)
  root
    .select('.wizard-progress-meter::-webkit-progress-bar')
    .backgroundColor(palette.current.surfaceAlt.rest.bgcolor)
    .borderRadius(palette.radii.pill)
  root
    .select('.wizard-progress-meter::-webkit-progress-value')
    .backgroundColor(palette.semanticTone.accent.button.rest.bgcolor)
    .borderRadius(palette.radii.pill)
  root
    .select('.wizard-progress-meter::-moz-progress-bar')
    .backgroundColor(palette.semanticTone.accent.button.rest.bgcolor)
    .borderRadius(palette.radii.pill)
  root.select('.wizard-task-list').listStyle('none')
  root
    .select('.wizard-task-list li')
    .display('grid')
    .gridTemplateColumns('1.25rem minmax(0, 1fr) auto')
    .gap('0.75rem')
    .alignItems('center')
    .borderBottom(`1px solid ${palette.current.border.subtle}`)
  root
    .select('.wizard-task-list li[data-state="running"]')
    .color(palette.semanticTone.accent.text.default)
  root
    .select('.wizard-task-list li[data-state="failed"]')
    .color(palette.semanticTone.danger.text.default)
  root.select('.wizard-task-marker').fontWeight('700')
  root
    .select('.wizard-next-commands')
    .whiteSpace('pre-wrap')
    .overflowWrap('anywhere')
}
