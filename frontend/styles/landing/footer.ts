import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'
import { typography } from '../../theme/skin'

export function registerFooterStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
  root
    .select('.landing-page .site-footer')
    .paddingTop('48px')
    .background(tone.neutral.canvas)
  root.select('.landing-page .footer-top').gap('40px').paddingBottom('43px')
  root
    .select('.landing-page .footer-top p')
    .marginTop('18px')
    .fontSize(palette.font.size.xs)
    .lineHeight('1.9')
    .color(tone.neutral.root.text.subtle)
  root
    .select('.landing-page .footer-top nav')
    .display('flex')
    .gap('84px')
    .paddingTop('4px')
  root
    .select('.landing-page .footer-top nav > div')
    .display('flex')
    .flexDirection('column')
    .alignItems('flex-start')
    .gap('9px')
  root
    .select('.landing-page .footer-label')
    .marginBottom('6px')
    .color(tone.neutral.text.subtle)
    .font(`8px ${typography.mono}`)
    .letterSpacing('1.5px')
  root
    .select('.landing-page .footer-top nav a')
    .fontSize(palette.font.size.xs)
    .color(tone.neutral.text.subtle)
  root
    .select('.landing-page .site-footer a:hover')
    .color(tone.accent.text.default)
  root
    .select('.landing-page .footer-bottom')
    .borderTop(`1px solid ${tone.neutral.border.subtle}`)
    .gap('15px')
    .paddingBlock('23px')
    .font(`9px ${typography.mono}`)
    .color(tone.neutral.surface.active.border)
  root
    .select('.landing-page .footer-built')
    .display('flex')
    .alignItems('center')
    .gap('7px')
  root
    .select('.landing-page .footer-actions')
    .display('flex')
    .alignItems('center')
    .gap('15px')
  // The consent runtime moves its settings button here. Show it as one more
  // footer link rather than a button.
  root
    .select('.landing-page .footer-actions .consent-settings-teleport-area')
    .display('contents')
  root
    .select('.landing-page .footer-actions .btn')
    .minHeight('0')
    .padding('0')
    .borderColor('transparent')
    .background('none')
    .boxShadow('none')
    .font('inherit')
    .color('inherit')
  root
    .select('.landing-page .footer-actions .btn:hover')
    .color(tone.accent.text.default)
  root
    .select('.landing-page .footer-built .status-dot')
    .width('4px')
    .height('4px')
}
