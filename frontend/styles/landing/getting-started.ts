import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'
import { typography } from '../../theme/skin'

export function registerGettingStartedStyles(
  root: Style,
  palette: ThemePalette,
) {
  const tone = palette.semanticTone
  root
    .select('.landing-page .start-section')
    .borderBlock(`1px solid ${tone.neutral.border.subtle}`)
    .background(tone.neutral.surface.rest.bgcolor)
    .paddingBlock('77px')
  root.select('.landing-page .start-layout').gap('100px')
  root
    .select('.landing-page .start-copy > p')
    .fontSize('13px')
    .color(tone.neutral.text.subtle)
    .lineHeight('1.9')
    .maxWidth('390px')
    .marginTop('21px')
  root
    .select('.landing-page .start-steps')
    .listStyle('none')
    .margin('32px 0 0')
    .padding('0')
    .display('flex')
    .flexDirection('column')
    .gap('20px')
  root
    .select('.landing-page .start-steps li')
    .display('flex')
    .alignItems('flex-start')
    .gap('16px')
  root
    .select('.landing-page .start-steps li > span')
    .display('flex')
    .alignItems('center')
    .justifyContent('center')
    .width('27px')
    .height('27px')
    .border(`1px solid ${tone.neutral.surfaceAlt.rest.border}`)
    .borderRadius('50%')
    .color(tone.accent.text.default)
    .background(tone.accent.surface.rest.bgcolor)
    .font(`9px ${typography.mono}`)
  root
    .select('.landing-page .start-steps strong')
    .color(tone.accent.surface.hover.text)
    .fontSize(palette.font.size.sm)
    .fontWeight('500')
  root
    .select('.landing-page .start-steps p')
    .color(tone.neutral.root.text.subtle)
    .fontSize(palette.font.size.xs)
    .marginTop('2px')
  root
    .select('.landing-page .start-terminal')
    .minWidth('0')
    .border(`1px solid ${tone.neutral.surfaceAlt.rest.border}`)
    .borderRadius(palette.radii.lg)
    .overflow('hidden')
    .boxShadow('0 12px 28px #0002')
    .background(tone.neutral.canvas)
  root
    .select('.landing-page .terminal-heading')
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .gap('10px')
    .padding('15px 20px')
    .borderBottom(`1px solid ${tone.neutral.border.default}`)
    .background(tone.neutral.surface.hover.bgcolor)
  root
    .select('.landing-page .terminal-heading > span:first-child')
    .display('flex')
    .alignItems('center')
    .gap('9px')
    .fontSize(palette.font.size.xs)
    .color(tone.neutral.surfaceAlt.rest.text)
  root
    .select('.landing-page .terminal-heading .icon')
    .width('14px')
    .height('14px')
  root
    .select('.landing-page .terminal-heading > span:last-child')
    .font(`8px ${typography.mono}`)
    .color(tone.neutral.text.subtle)
    .letterSpacing('1px')
  root.select('.landing-page .terminal-body').padding('27px 24px')
  root
    .select('.landing-page .terminal-command')
    .position('relative')
    .paddingRight('20px')
    .marginBottom('27px')
    .font(`10px / 1.9 ${typography.mono}`)
  root
    .select('.landing-page .terminal-command > span')
    .display('block')
    .marginBottom('7px')
    .color(tone.neutral.root.text.subtle)
  root
    .select(
      '.landing-page .terminal-command pre, .landing-page .terminal-command code',
    )
    .display('block')
    .color(tone.neutral.surfaceAlt.rest.text)
    .font(`11px / 1.9 ${typography.mono}`)
    .background('none')
    .border('0')
    .padding('0')
    .whiteSpace('pre-wrap')
    .overflowWrap('anywhere')
  root
    .select('.landing-page .terminal-command .copy-button')
    .position('absolute')
    .right('-7px')
    .top('-8px')
  root
    .select('.landing-page .terminal-address')
    .display('flex')
    .alignItems('center')
    .gap('8px')
    .color(tone.neutral.text.subtle)
    .font(`9px / 1.7 ${typography.mono}`)
    .paddingTop('5px')
  root
    .select('.landing-page .terminal-address .status-dot')
    .width('4px')
    .height('4px')
  root
    .select('.landing-page .terminal-footer')
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .padding('13px 20px')
    .borderTop(`1px solid ${tone.neutral.border.default}`)
    .background(tone.neutral.surfaceAlt.rest.bgcolor)
    .color(`${tone.accent.text.default} !important`)
    .fontSize(palette.font.size.xxs)
  root
    .select('.landing-page .terminal-footer:hover')
    .background(tone.accent.surface.rest.bgcolor)
}
