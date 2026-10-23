import type { Style } from '@purestack/ts-css'
import { BREAKPOINTS, mediaBelow, type ThemePalette } from '@purestack/ts-style'
import { typography } from '../../theme/skin'

/** Spacing at composition boundaries; component variants own their visual states. */
export function registerCompositionStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
  root
    .select('body.landing-page')
    .css({ background: tone.neutral.canvas, color: tone.neutral.text.default })
  root
    .select('.landing-page .workbench, .landing-page .feature-card')
    .css({ padding: '0', gap: '0' })
  root
    .select('.landing-page .workbench')
    .css({ boxShadow: palette.effect.floatingShadow })
  root.select('.landing-page .workbench__body').css({ padding: '0', gap: '0' })
  root
    .select('.landing-page .feature-card__body')
    .css({ padding: '30px', display: 'block' })
  root
    .select(
      '.landing-page .feature-card .section-header, .landing-page .package-card .section-header, .landing-page .section-heading.section-header',
    )
    .css({ gap: '0', display: 'block', minWidth: '0' })
  root.select('.landing-page .feature-icon').css({ padding: '0' })
  root
    .select('.landing-page .text-link')
    .css({ padding: '0', letterSpacing: '0', fontWeight: '400' })
  root
    .select('.landing-page .text-link .icon')
    .css({ width: '16px', height: '16px' })
  root.select('.landing-page .package-grid').css({ gap: '0' })
  root.select('.landing-page .diagram-lines').css({ gap: '0' })
  root
    .select('.landing-page .faq-list .expandable-panel')
    .css({ padding: '0', margin: '0', borderRadius: '0', boxShadow: 'none' })
  root
    .select('.landing-page .faq-list .expandable-panel__summary')
    .css({ paddingInline: '0' })
  root
    .select('.landing-page .faq-list .expandable-panel__body')
    .css({ padding: '0', border: '0' })
  root
    .select('.landing-page .faq-list .expandable-panel__summary .fw-700')
    .css({ fontWeight: '500', lineHeight: '1.6' })
  root
    .select('.landing-page .faq-list .expandable-panel__chevron')
    .css({ width: '20px', height: '20px', padding: '0' })
  root
    .select('.landing-page .file-tree .tree-note, .landing-page .footer-bottom')
    .css({ color: tone.neutral.root.text.subtle })

  // Tabs and their bundled runtime still control radio selection and panel visibility.
  // This workbench has three short filenames, so all tabs fit even at mobile widths.
  root
    .select('.landing-page .workbench-tabs')
    .css({ padding: '0', gap: '0', boxShadow: 'none', minWidth: '0' })
  root
    .select('.landing-page .workbench-tabs .tabs__list')
    .css({ gap: '0', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' })
  root
    .select('.landing-page .workbench-tabs .tabs__panel-body')
    .css({ padding: '0' })
  root.select('.landing-page .workbench-tabs .tabs__tab-buttons').css({
    gap: '0',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    overflow: 'visible',
  })
  root
    .select('.landing-page .workbench-tabs .tabs__tabs-row')
    .css({ gap: '0', margin: '0', padding: '0' })
  root
    .select('.landing-page .workbench-tabs.tabs--compact .tabs__tabs-row')
    .css({ display: 'flex' })
  root
    .select(
      '.landing-page .workbench-tabs .tabs__select-wrap, .landing-page .workbench-tabs .tabs__overflow',
    )
    .css({ display: 'none' })
  root
    .select(
      '.landing-page .workbench-tabs :is(.tabs__tab, .tabs__tab-buttons > .btn)',
    )
    .css({
      borderRadius: '0',
      letterSpacing: '0',
      fontFamily: typography.mono,
      fontWeight: '400',
      minHeight: '46px',
    })
  root
    .select('.landing-page .workbench-tabs .tabs__control:checked + .tabs__tab')
    .css({
      color: tone.neutral.text.default,
      background: tone.neutral.surfaceAlt.rest.bgcolor,
      boxShadow: `inset 0 2px ${tone.accent.text.default}`,
    })
  root
    .select('.landing-page .workbench-tabs.tabs--enhanced .tabs__tab')
    .css({ display: 'none' })
  root
    .select('.landing-page .workbench-tabs.tabs--enhanced .tabs__control')
    .css({ display: 'none' })
  root
    .select('.landing-page .workbench-tabs .tabs__tab-icon')
    .css({ color: tone.accent.text.subtle, width: '14px', height: '14px' })
  root.select('.landing-page .workbench-tabs .tabs__tab-buttons::after').css({
    content: '"Explore the files ↖"',
    order: '99',
    marginLeft: 'auto',
    alignSelf: 'center',
    paddingInline: '22px',
    color: tone.neutral.root.text.subtle,
    font: `10px ${typography.mono}`,
  })

  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .feature-card__body')
    .css({ padding: '24px' })
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .feature-small .feature-card__body')
    .css({ padding: '22px' })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .workbench-tabs .tabs__tab-buttons::after')
    .css({ display: 'none' })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .feature-small:last-child')
    .css({ gridColumn: 'span 6', minHeight: 'auto' })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select(
      '.landing-page .feature-card__body, .landing-page .feature-small .feature-card__body',
    )
    .css({ padding: '24px' })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .feature-small:last-child')
    .css({ gridColumn: '1' })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select(
      '.landing-page .workbench-tabs :is(.tabs__tab, .tabs__tab-buttons > .btn)',
    )
    .css({ minHeight: '42px', paddingInline: '10px' })
}
