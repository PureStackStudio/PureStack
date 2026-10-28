import type { Style } from '@purestack/ts-css'
import { BREAKPOINTS, mediaBelow, type ThemePalette } from '@purestack/ts-style'
import { typography } from '../../theme/skin'

/** Spacing at composition boundaries; component variants own their visual states. */
export function registerCompositionStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
  root
    .select('body.landing-page')
    .background(tone.neutral.canvas)
    .color(tone.neutral.text.default)
  root
    .select('.landing-page .workbench, .landing-page .feature-card')
    .padding('0')
    .gap('0')
  root
    .select('.landing-page .workbench')
    .boxShadow(palette.effect.floatingShadow)
  root.select('.landing-page .workbench__body').padding('0').gap('0')
  root
    .select('.landing-page .feature-card__body')
    .padding('30px')
    .display('block')
  root
    .select(
      '.landing-page .feature-card .section-header, .landing-page .package-card .section-header, .landing-page .section-heading.section-header',
    )
    .gap('0')
    .display('block')
    .minWidth('0')
  root.select('.landing-page .feature-icon').padding('0')
  root
    .select('.landing-page .text-link')
    .padding('0')
    .letterSpacing('0')
    .fontWeight('400')
  root.select('.landing-page .text-link .icon').width('16px').height('16px')
  root.select('.landing-page .package-grid').gap('0')
  root.select('.landing-page .diagram-lines').gap('0')
  root
    .select('.landing-page .faq-list .expandable-panel')
    .padding('0')
    .margin('0')
    .borderRadius('0')
    .boxShadow('none')
  root
    .select('.landing-page .faq-list .expandable-panel__summary')
    .paddingInline('0')
  root
    .select('.landing-page .faq-list .expandable-panel__body')
    .padding('0')
    .border('0')
  root
    .select('.landing-page .faq-list .expandable-panel__summary .fw-700')
    .fontWeight('500')
    .lineHeight('1.6')
  root
    .select('.landing-page .faq-list .expandable-panel__chevron')
    .width('20px')
    .height('20px')
    .padding('0')
  root
    .select('.landing-page .file-tree .tree-note, .landing-page .footer-bottom')
    .color(tone.neutral.root.text.subtle)

  // Tabs and their bundled runtime still control radio selection and panel visibility.
  // This workbench has three short filenames, so all tabs fit even at mobile widths.
  root
    .select('.landing-page .workbench-tabs')
    .padding('0')
    .gap('0')
    .boxShadow('none')
    .minWidth('0')
  root
    .select('.landing-page .workbench-tabs .tabs__list')
    .gap('0')
    .gridTemplateColumns('repeat(3, minmax(0, 1fr))')
  root.select('.landing-page .workbench-tabs .tabs__panel-body').padding('0')
  root
    .select('.landing-page .workbench-tabs .tabs__tab-buttons')
    .gap('0')
    .alignItems('stretch')
    .alignSelf('stretch')
    .overflow('visible')
  root
    .select('.landing-page .workbench-tabs .tabs__tabs-row')
    .gap('0')
    .margin('0')
    .padding('0')
  root
    .select('.landing-page .workbench-tabs.tabs--compact .tabs__tabs-row')
    .display('flex')
  root
    .select(
      '.landing-page .workbench-tabs .tabs__select-wrap, .landing-page .workbench-tabs .tabs__overflow',
    )
    .display('none')
  root
    .select(
      '.landing-page .workbench-tabs :is(.tabs__tab, .tabs__tab-buttons > .btn)',
    )
    .borderRadius('0')
    .letterSpacing('0')
    .fontFamily(typography.mono)
    .fontWeight('400')
    .minHeight('46px')
  root
    .select('.landing-page .workbench-tabs .tabs__control:checked + .tabs__tab')
    .color(tone.neutral.text.default)
    .background(tone.neutral.surfaceAlt.rest.bgcolor)
    .boxShadow(`inset 0 2px ${tone.accent.text.default}`)
  root
    .select('.landing-page .workbench-tabs.tabs--enhanced .tabs__tab')
    .display('none')
  root
    .select('.landing-page .workbench-tabs.tabs--enhanced .tabs__control')
    .display('none')
  root
    .select('.landing-page .workbench-tabs .tabs__tab-icon')
    .color(tone.accent.text.subtle)
    .width('14px')
    .height('14px')
  root
    .select('.landing-page .workbench-tabs .tabs__tab-buttons::after')
    .content('"Explore the files ↖"')
    .order('99')
    .marginLeft('auto')
    .alignSelf('center')
    .paddingInline('22px')
    .color(tone.neutral.root.text.subtle)
    .font(`10px ${typography.mono}`)

  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .feature-card__body')
    .padding('24px')
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .feature-small .feature-card__body')
    .padding('22px')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .workbench-tabs .tabs__tab-buttons::after')
    .display('none')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .feature-small:last-child')
    .gridColumn('span 6')
    .minHeight('auto')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select(
      '.landing-page .feature-card__body, .landing-page .feature-small .feature-card__body',
    )
    .padding('24px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .feature-small:last-child')
    .gridColumn('1')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select(
      '.landing-page .workbench-tabs :is(.tabs__tab, .tabs__tab-buttons > .btn)',
    )
    .minHeight('42px')
    .paddingInline('10px')
}
