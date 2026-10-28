import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'
import { typography } from '../../theme/skin'

export function registerWorkbenchStyles(root: Style, palette: ThemePalette) {
  registerWorkbenchFrameStyles(root, palette)
  registerWorkbenchTabStyles(root, palette)
  registerWorkbenchPaneStyles(root, palette)
  registerCopyFeedbackStyles(root, palette)
  registerSourceCodeStyles(root, palette)
  registerContentPreviewStyles(root, palette)
  registerCounterPreviewStyles(root, palette)
  registerStylePreviewStyles(root, palette)
  registerWorkbenchStatusStyles(root, palette)
}

function registerWorkbenchFrameStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone

  root.select('.landing-page .workbench-wrap').marginTop('51px')
  root
    .select('.landing-page .workbench')
    .overflow('hidden')
    .borderRadius('10px')
    .textAlign('left')
  root
    .select('.landing-page .workbench-toolbar')
    .gap('21px')
    .height('42px')
    .padding('0 19px')
    .borderBottom(`1px solid ${tone.neutral.border.subtle}`)
    .background(tone.neutral.surfaceAlt.rest.bgcolor)
  root.select('.landing-page .window-dots').gap('6px')
  root
    .select('.landing-page .window-dots i')
    .display('block')
    .width('7px')
    .height('7px')
    .background(tone.neutral.surface.hover.border)
    .borderRadius('50%')
  root
    .select('.landing-page .window-dots i:first-child')
    .background(tone.neutral.surface.active.border)
  root
    .select('.landing-page .window-dots i:nth-child(2)')
    .background(tone.neutral.surface.active.border)
  root
    .select('.landing-page .window-dots i:nth-child(3)')
    .background(tone.accent.surface.hover.border)
  root
    .select('.landing-page .workbench-title')
    .color(tone.neutral.text.subtle)
    .font(`10px ${typography.mono}`)
    .letterSpacing('0.4px')
  root
    .select('.landing-page .workbench-language')
    .marginLeft('auto')
    .color(tone.neutral.root.text.subtle)
    .font(`10px ${typography.mono}`)
}

function registerWorkbenchTabStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone

  root
    .select('.workbench-tabs .tabs__tabs-row')
    .display('flex')
    .alignItems('stretch')
    .height('47px')
    .borderBottom(`1px solid ${tone.neutral.border.subtle}`)
    .background(tone.neutral.surface.rest.bgcolor)
  root
    .select('.workbench-tabs :is(.tabs__tab, .tabs__tab-buttons > .btn)')
    .display('flex')
    .alignItems('center')
    .gap('9px')
    .padding('0 23px')
    .position('relative')
    .color(tone.neutral.root.text.subtle)
    .background('transparent')
    .border('0')
    .borderRight(
      `1px solid color-mix(in srgb, ${tone.neutral.border.subtle} 50%, transparent)`,
    )
    .font(`11px ${typography.mono}`)
  root
    .select('.workbench-tabs :is(.tabs__tab, .tabs__tab-buttons > .btn):hover')
    .color(tone.accent.surface.hover.text)
    .background(tone.neutral.surfaceAlt.rest.bgcolor)
  root
    .select('.workbench-tabs .tabs__tab-buttons > .btn.active')
    .color(tone.neutral.text.default)
    .background(tone.neutral.surfaceAlt.rest.bgcolor)
  root
    .select('.workbench-tabs .tabs__tab-buttons > .btn.active::before')
    .content('""')
    .position('absolute')
    .top('-1px')
    .left('0')
    .right('0')
    .height('2px')
    .background(tone.accent.text.default)
}

function registerWorkbenchPaneStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone

  root.select('.landing-page .example-panel').minHeight('345px')
  root
    .select('.landing-page .source-pane')
    .minWidth('0')
    .background(tone.neutral.surface.rest.bgcolor)
    .borderRight(`1px solid ${tone.neutral.border.subtle}`)
  root
    .select('.landing-page .pane-caption')
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .height('43px')
    .padding('0 23px')
    .color(tone.neutral.root.text.subtle)
    .font(`9px ${typography.mono}`)
    .letterSpacing('1px')
  root
    .select('.landing-page .pane-caption > span')
    .display('flex')
    .alignItems('center')
    .gap('7px')
  root
    .select('.landing-page .pane-caption > .icon')
    .width('13px')
    .height('13px')
    .color(tone.neutral.surface.active.border)
  root
    .select('.landing-page .pane-caption .status-dot')
    .width('4px')
    .height('4px')
}

function registerCopyFeedbackStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone

  root
    .select('.landing-page .copy-button')
    .display('inline-flex')
    .justifyContent('center')
    .alignItems('center')
    .gap('6px')
    .minWidth('32px')
    .minHeight('32px')
    .padding('4px 7px')
    .borderRadius(palette.radii.sm)
    .font(`10px ${typography.mono} !important`)
    .letterSpacing('0')
  root.select('.landing-page .copy-button .icon').width('13px').height('13px')
  root
    .select('.landing-page .copy-button.is-copied')
    .color(tone.accent.text.default)
  root
    .select('.landing-page .copy-button.is-failed')
    .color(tone.danger.text.default)
  root
    .select('.landing-page .copy-toast')
    .position('fixed')
    .zIndex('50')
    .bottom('25px')
    .left('50%')
    .transform('translate(-50%, 8px)')
    .maxWidth('calc(100% - 40px)')
    .padding('11px 18px')
    .border(`1px solid ${tone.success.surface.rest.border}`)
    .borderRadius(palette.radii.md)
    .background(tone.accent.surfaceAlt.rest.bgcolor)
    .color(tone.accent.surface.hover.text)
    .boxShadow(palette.effect.softShadow)
    .opacity('0')
    .pointerEvents('none')
    .fontSize(palette.font.size.sm)
    .transition('opacity 180ms, transform 180ms')
  root
    .select('.landing-page .copy-toast.is-visible')
    .opacity('1')
    .transform('translate(-50%, 0)')
}

function registerSourceCodeStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone

  root
    .select('.landing-page .source-code')
    .padding('8px 28px 28px 44px')
    .font(`12px / 1.9 ${typography.mono}`)
    .tabSize('2')
    .whiteSpace('pre')
    .overflowX('auto')
    .color(tone.neutral.surfaceAlt.rest.text)
    .background('transparent')
    .border('0')
    .borderRadius('0')
  root
    .select('.landing-page .source-code code')
    .font('inherit')
    .color('inherit')
    .background('none')
    .padding('0')
    .border('0')
  root
    .select('.landing-page .syntax-muted')
    .color(tone.neutral.surface.active.border)
  root.select('.landing-page .syntax-green').color(tone.success.text.default)
  root.select('.landing-page .syntax-blue').color(tone.info.text.default)
  root.select('.landing-page .syntax-amber').color(tone.warning.text.default)
  root.select('.landing-page .syntax-purple').color(tone.feature.text.default)
}

function registerContentPreviewStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone

  root
    .select('.landing-page .preview-pane')
    .minWidth('0')
    .background(
      `radial-gradient(ellipse at 50% 70%, color-mix(in srgb, ${tone.accent.surface.hover.bgcolor} 18%, transparent), transparent 75%), ${tone.neutral.surface.rest.bgcolor}`,
    )
  root.select('.landing-page .content-preview').padding('26px 44px 35px')
  root
    .select('.landing-page .preview-eyebrow')
    .font(`9px ${typography.mono}`)
    .letterSpacing('1.6px')
    .color(tone.neutral.root.text.subtle)
  root
    .select('.landing-page .content-preview h2')
    .fontSize(palette.font.size.h2)
    .letterSpacing('-1.6px')
    .lineHeight('1.3')
    .marginTop('10px')
  root
    .select('.landing-page .content-preview h2 > span')
    .color(tone.accent.text.default)
  root
    .select('.landing-page .content-preview > p')
    .marginTop('7px')
    .color(tone.accent.text.subtle)
    .fontSize(palette.font.size.sm)
  root
    .select('.landing-page .demo-panel')
    .marginTop('25px')
    .padding('0')
    .borderRadius(palette.radii.md)
  root.select('.landing-page .demo-panel .panel__body').padding('18px')
  root
    .select(
      '.landing-page .demo-panel .badge, .landing-page .sample-top .badge',
    )
    .display('inline-flex')
    .padding('3px 7px')
    .borderRadius('3px')
    .font(`9px ${typography.mono}`)
    .lineHeight('1.4')
  root
    .select('.landing-page .demo-panel p')
    .marginTop('10px')
    .fontSize(palette.font.size.sm)
  root
    .select('.landing-page .preview-footnote')
    .display('flex')
    .alignItems('center')
    .justifyContent('center')
    .gap('5px')
    .color(tone.neutral.root.text.subtle)
    .font(`9px / 1.6 ${typography.mono}`)
    .marginTop('19px')
  root
    .select('.landing-page .content-preview .preview-footnote')
    .justifyContent('start')
  root
    .select('.landing-page .preview-footnote .icon')
    .width('12px')
    .height('12px')
}

function registerCounterPreviewStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone

  root
    .select('.landing-page .counter-preview')
    .textAlign('center')
    .padding('35px 24px 24px')
  root
    .select('.landing-page .counter-preview h2')
    .fontSize(palette.font.size.h3)
    .letterSpacing('-0.6px')
    .marginTop('12px')
  root.select('.landing-page #counter').marginTop('24px')
  root
    .select('.landing-page #counter button')
    .minWidth('185px')
    .minHeight('48px')
    .borderRadius(palette.radii.md)
    .background(tone.accent.text.default)
    .color(tone.accent.button.rest.text)
    .border(`1px solid ${tone.accent.button.rest.border}`)
    .fontSize(palette.font.size.body)
    .fontWeight('600')
    .padding('11px 20px')
    .transition('transform 120ms')
  root.select('.landing-page #counter button:active').transform('scale(0.97)')
  root
    .select('.landing-page .counter-preview > p')
    .marginTop('20px')
    .color(tone.neutral.text.subtle)
    .fontSize(palette.font.size.xs)
}

function registerStylePreviewStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone

  root
    .select('.landing-page .style-preview')
    .padding('32px 45px')
    .textAlign('center')
  root
    .select('.landing-page .your-card')
    .border(`1px solid ${tone.neutral.surface.hover.border}`)
  root.select('.landing-page .your-card > .icon').width('30px').height('30px')
  root
    .select('.landing-page .your-card h2')
    .marginTop('13px')
    .fontSize(palette.font.size.h3)
    .letterSpacing('-0.6px')
  root
    .select('.landing-page .your-card p')
    .marginTop('8px')
    .fontSize(palette.font.size.sm)
    .opacity('0.75')
}

function registerWorkbenchStatusStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone

  root
    .select('.landing-page .workbench-status')
    .minHeight('32px')
    .gap('12px')
    .padding('6px 19px')
    .borderTop(`1px solid ${tone.neutral.border.default}`)
    .background(tone.neutral.surfaceAlt.rest.bgcolor)
    .color(tone.neutral.text.subtle)
    .font(`9px ${typography.mono}`)
  root
    .select('.landing-page .workbench-status > span')
    .display('flex')
    .alignItems('center')
    .gap('6px')
  root
    .select('.landing-page .workbench-status .icon')
    .width('12px')
    .height('12px')
  root
    .select('.landing-page .workbench-caption')
    .marginTop('16px !important')
    .textAlign('center')
    .color(tone.neutral.root.text.subtle)
    .fontSize(palette.font.size.xs)
}
