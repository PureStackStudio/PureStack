import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'
import { typography } from '../../theme/skin'

export function registerFeaturesStyles(root: Style, palette: ThemePalette) {
  registerAudienceStyles(root, palette)
  registerSectionHeadingStyles(root, palette)
  registerFeatureCardStyles(root, palette)
  registerContentFeatureStyles(root, palette)
  registerComponentSampleStyles(root, palette)
  registerCompactFeatureStyles(root, palette)
  registerToneSampleStyles(root, palette)
  registerOutputSampleStyles(root, palette)
  registerEditorSampleStyles(root, palette)
}

function registerAudienceStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone

  root
    .select('.landing-page .build-for')
    .marginTop('63px')
    .paddingBottom('37px')
    .borderBottom(`1px solid ${tone.neutral.border.subtle}`)
    .textAlign('center')
  root
    .select('.landing-page .build-for > span')
    .font(`9px ${typography.mono}`)
    .letterSpacing('1.5px')
    .color(tone.neutral.root.text.subtle)
  root
    .select('.landing-page .build-for > div')
    .display('flex')
    .flexWrap('wrap')
    .justifyContent('center')
    .gap('16px 45px')
    .marginTop('20px')
    .color(tone.accent.surface.rest.text)
    .fontSize(palette.font.size.body)
    .fontWeight('500')
    .letterSpacing('-0.2px')
}

function registerSectionHeadingStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone

  root.select('.landing-page .section').paddingBlock('92px')
  root
    .select('.landing-page .eyebrow')
    .display('block')
    .color(tone.accent.text.subtle)
    .font(`10px / 1.6 ${typography.mono}`)
    .letterSpacing('1.7px')
    .marginBottom('19px')
  root
    .select('.landing-page .section h2, .landing-page .start-section h2')
    .fontSize(palette.font.size.h1)
    .lineHeight('1.16')
    .letterSpacing('-1.8px')
  root
    .select(
      '.landing-page .section h2 > span, .landing-page .start-section h2 > span',
    )
    .color(tone.accent.text.subtle)
  root.select('.landing-page .section-heading').marginBottom('37px')
  root
    .select('.landing-page .section-heading > p')
    .fontSize(palette.font.size.body)
    .lineHeight('1.85')
    .marginTop('19px')
    .color(tone.neutral.text.subtle)
}

function registerFeatureCardStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone

  root.select('.landing-page .feature-grid').gap('15px')
  root
    .select('.landing-page .feature-card')
    .position('relative')
    .borderRadius(palette.radii.lg)
    .overflow('hidden')
    .transition('border-color 200ms')
  root
    .select('.landing-page .feature-content, .landing-page .feature-components')
    .gridColumn('span 3')
  root.select('.landing-page .feature-small').gridColumn('span 2')
  root
    .select('.landing-page .feature-icon')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .width('35px')
    .height('35px')
    .borderRadius('7px')
    .marginBottom('19px')
  root.select('.landing-page .feature-icon .icon').width('19px').height('19px')
  root
    .select('.landing-page .feature-card h3')
    .fontSize(palette.font.size.h4)
    .letterSpacing('-0.5px')
    .lineHeight('1.5')
  root
    .select('.landing-page .feature-card .feature-summary')
    .color(tone.neutral.text.subtle)
    .fontSize('13px')
    .marginTop('10px')
    .lineHeight('1.85')
    .maxWidth('425px')
}

function registerContentFeatureStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone

  root
    .select('.landing-page .file-tree')
    .padding('20px 20px 17px')
    .marginBlock('27px 23px')
    .border(`1px solid ${tone.neutral.border.default}`)
    .borderRadius(palette.radii.md)
    .background(tone.neutral.canvas)
    .font(`11px / 2.6 ${typography.mono}`)
  root
    .select('.landing-page .file-tree > div')
    .display('flex')
    .gap('10px')
    .alignItems('center')
    .color(tone.accent.surface.rest.text)
  root
    .select('.landing-page .file-tree .tree-note')
    .marginLeft('auto')
    .fontSize(palette.font.size.xxxs)
    .color(tone.neutral.surface.active.border)
  root.select('.landing-page .tree-folder').color(tone.neutral.text.subtle)
  root.select('.landing-page .tree-indent').paddingLeft('15px')
  root.select('.landing-page .tree-indent-deep').paddingLeft('30px')
  root
    .select('.landing-page .text-link')
    .display('inline-flex')
    .alignItems('center')
    .gap('13px')
    .fontSize(palette.font.size.sm)
    .lineHeight('1.6')
    .transition('color 180ms')
}

function registerComponentSampleStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone

  root
    .select('.landing-page .component-sample')
    .marginBlock('27px 23px')
    .padding('18px 20px')
    .border(`1px solid ${tone.neutral.surfaceAlt.rest.border}`)
    .borderRadius(palette.radii.md)
    .background(tone.neutral.surfaceAlt.rest.bgcolor)
  root
    .select('.landing-page .sample-top')
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .gap('8px')
    .fontSize(palette.font.size.xs)
    .fontWeight('500')
    .color(tone.neutral.surfaceAlt.rest.text)
  root.select('.landing-page .sample-chart').marginTop('15px')
  root
    .select('.landing-page .sample-chart-label')
    .font(`9px ${typography.mono}`)
    .color(tone.neutral.root.text.subtle)
  root
    .select('.landing-page .sample-chart .bar-chart')
    .display('block')
    .width('100%')
    .height('90px')
    .marginTop('6px')
    .padding('0')
    .border('0')
    .borderBottom(`1px solid ${tone.accent.surface.rest.border}`)
    .borderRadius('0')
    .background(
      `repeating-linear-gradient( to top, transparent 0, transparent 24px, color-mix(in srgb, ${tone.accent.text.subtle} 5%, transparent) 25px, transparent 26px )`,
    )
  root
    .select('.landing-page .sample-chart-axis')
    .display('flex')
    .justifyContent('space-between')
    .color(tone.neutral.root.text.subtle)
    .font(`8px ${typography.mono}`)
    .marginTop('6px')
  root
    .select('.landing-page .sample-bottom')
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .gap('10px')
    .marginTop('18px')
    .borderTop(`1px solid ${tone.neutral.border.default}`)
    .paddingTop('11px')
    .fontSize(palette.font.size.xxxs)
    .color(tone.accent.text.subtle)
  root
    .select('.landing-page .sample-bottom > span:first-child')
    .display('flex')
    .alignItems('center')
    .gap('6px')
  root
    .select('.landing-page .sample-bottom .status-dot')
    .width('4px')
    .height('4px')
  root
    .select('.landing-page .sample-avatar')
    .display('grid')
    .placeItems('center')
    .width('22px')
    .height('22px')
    .borderRadius('50%')
    .background(tone.accent.border.subtle)
    .color(tone.neutral.surfaceAlt.rest.text)
    .font(`8px ${typography.mono}`)
}

function registerCompactFeatureStyles(root: Style, palette: ThemePalette) {
  root.select('.landing-page .feature-small').minHeight('294px')
  root.select('.landing-page .feature-small h3').fontSize(palette.font.size.h5)
  root
    .select('.landing-page .feature-small .feature-summary')
    .fontSize(palette.font.size.sm)
    .lineHeight('1.9')
}

function registerToneSampleStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone

  root
    .select('.landing-page .tone-sample')
    .display('flex')
    .alignItems('center')
    .marginTop('26px')
    .paddingBlock('2px')
  root
    .select('.landing-page .tone-sample i')
    .display('block')
    .width('26px')
    .height('26px')
    .borderRadius('50%')
    .background(tone.accent.text.default)
    .border(`3px solid ${tone.neutral.surface.rest.bgcolor}`)
  root.select('.landing-page .tone-sample i + i').marginLeft('-6px')
  root
    .select('.landing-page .tone-sample i:nth-child(2)')
    .background(tone.info.tone)
  root
    .select('.landing-page .tone-sample i:nth-child(3)')
    .background(tone.accent.surface.hover.border)
  root
    .select('.landing-page .tone-sample i:nth-child(4)')
    .background(tone.warning.tone)
  root
    .select('.landing-page .tone-sample i:nth-child(5)')
    .background(tone.danger.tone)
  root
    .select('.landing-page .tone-sample > span')
    .marginLeft('12px')
    .font(`9px / 1.5 ${typography.mono}`)
    .color(tone.neutral.text.subtle)
}

function registerOutputSampleStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone

  root
    .select('.landing-page .output-sample')
    .display('flex')
    .alignItems('center')
    .gap('7px')
    .marginTop('28px')
    .font(`9px ${typography.mono}`)
  root
    .select('.landing-page .output-sample > span')
    .border(`1px solid ${tone.neutral.surfaceAlt.rest.border}`)
    .borderRadius(palette.radii.sm)
    .padding('5px 7px')
    .color(tone.neutral.text.subtle)
  root
    .select('.landing-page .output-sample .output-js')
    .borderStyle('dashed')
    .color(tone.warning.text.default)
  root
    .select('.landing-page .output-sample .output-web')
    .background(tone.accent.surface.hover.bgcolor)
    .color(tone.accent.surface.rest.text)
    .borderColor(tone.neutral.surface.hover.border)
  root
    .select('.landing-page .output-sample .icon')
    .width('13px')
    .height('13px')
    .color(tone.neutral.root.text.subtle)
}

function registerEditorSampleStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone

  root
    .select('.landing-page .editor-sample')
    .position('relative')
    .display('flex')
    .alignItems('center')
    .gap('4px')
    .marginTop('25px')
    .font(`11px ${typography.mono}`)
    .background(tone.neutral.canvas)
    .border(`1px solid ${tone.accent.surface.hover.bgcolor}`)
    .borderRadius(palette.radii.sm)
    .padding('12px')
  root
    .select('.landing-page .editor-sample > small')
    .display('flex')
    .alignItems('center')
    .gap('4px')
    .position('absolute')
    .right('8px')
    .top('-15px')
    .font(`8px ${typography.mono}`)
    .padding('4px 6px')
    .color(tone.accent.text.default)
    .background(tone.accent.surface.hover.bgcolor)
    .border(`1px solid ${tone.neutral.surface.hover.border}`)
    .borderRadius('3px')
  root.select('.landing-page .editor-sample .icon').width('10px').height('10px')
  root
    .select('.landing-page .editor-caret')
    .display('block')
    .height('13px')
    .width('1px')
    .background(tone.accent.text.default)
}
