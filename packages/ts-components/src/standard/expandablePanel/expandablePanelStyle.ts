import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  type ThemePalette,
  themes,
} from '@purestack/ts-style'

export function registerExpandablePanelStyles() {
  themes.forEach((theme, palette, options) => {
    registerExpandablePanelShellStyles(theme, palette, options)
    registerExpandablePanelSummaryStyles(theme, palette, options)
    registerExpandablePanelBodyStyles(theme, palette, options)
    registerExpandablePanelResponsiveStyles(theme)
  })
}

function registerExpandablePanelShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.expandable-panel', theme)
    .display('grid')
    .margin('0 0 16px')
    .border(`1px solid ${palette.current.border.default}`)
    .borderRadius(options.radii.lg)
    .background(palette.semanticTone.neutral.surface.rest.background)
    .boxShadow(palette.effect.panelShadow)
    .alignContent('start')
    .overflow('hidden')
    .transition(
      'border-color 180ms ease, box-shadow 180ms ease, background 180ms ease',
    )

  styleBuilder
    .select('.expandable-panel[open]', theme)
    .borderColor(palette.current.border.default)
    .boxShadow(palette.effect.panelShadowStrong)
}

function registerExpandablePanelSummaryStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.expandable-panel__summary', theme)
    .listStyle('none')
    .display('grid')
    .gridTemplateColumns('auto minmax(0, 1fr) auto')
    .alignItems('center')
    .gap('0.75rem')
    .padding('1rem')
    .cursor('pointer')
    .minWidth('0')
    .borderRadius('16px')

  styleBuilder
    .select('.expandable-panel[open] .expandable-panel__summary', theme)
    .borderRadius('16px 16px 0 0')

  styleBuilder
    .select('.expandable-panel__summary::-webkit-details-marker', theme)
    .display('none')

  styleBuilder
    .select('.expandable-panel__summary:focus-visible', theme)
    .outline(`2px solid ${palette.current.border.focus}`)
    .outlineOffset('-2px')

  styleBuilder
    .select('.expandable-panel__icon', theme)
    .width('22px')
    .height('22px')

  styleBuilder
    .select('.expandable-panel__header', theme)
    .display('flex')
    .alignItems('center')
    .gap('10px')
    .flexWrap('wrap')
    .minWidth('0')

  styleBuilder
    .select('.expandable-panel__title', theme)
    .minWidth('0')
    .fontSize('1.06rem')
    .fontWeight('700')
    .lineHeight('1.3')
    .letterSpacing('-0.02em')

  styleBuilder
    .select('.expandable-panel__description', theme)
    .minWidth('100%')
    .fontSize('0.97rem')
    .lineHeight('1.55')

  styleBuilder
    .select('.expandable-panel__header-side', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('center')
    .gap('12px')
    .minWidth('0')

  styleBuilder
    .select('.expandable-panel__header-meta', theme)
    .fontSize('0.95rem')
    .fontWeight('600')

  styleBuilder
    .select('.expandable-panel__chevron', theme)
    .width('34px')
    .height('34px')
    .minWidth('34px')
    .minHeight('34px')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .borderRadius(options.radii.pill)
    .border(`1px solid ${palette.current.border.subtle}`)
    .transition(
      'transform 180ms ease, color 180ms ease, border-color 180ms ease, background 180ms ease',
    )

  styleBuilder
    .select('.expandable-panel__chevron-icon', theme)
    .width('16px')
    .height('16px')

  styleBuilder
    .select('.expandable-panel[open] .expandable-panel__chevron', theme)
    .transform('rotate(180deg)')
}

function registerExpandablePanelBodyStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.expandable-panel__body', theme)
    .display('grid')
    .gap('0.75rem')
    .padding('1rem')
    .borderTop(`1px solid ${palette.current.border.subtle}`)

  styleBuilder
    .select('.expandable-panel:not([open]) .expandable-panel__body', theme)
    .display('none')

  styleBuilder
    .select('.expandable-panel__body :where(h2, h3, h4, p, ul, ol)', theme)
    .margin('0')

  styleBuilder
    .select('.expandable-panel__body :where(p, li)', theme)
    .lineHeight('1.7')

  styleBuilder
    .select('.expandable-panel__body :where(ul, ol)', theme)
    .paddingLeft('1.2rem')

  styleBuilder
    .select('.expandable-panel__body :where(strong)', theme)
    .fontWeight('700')

  styleBuilder
    .select('.expandable-panel__body :where(a)', theme)
    .color(palette.semanticTone.accent.text.default)
    .fontWeight('600')
    .textDecoration('underline')

  styleBuilder
    .select('.expandable-panel__body :where(img)', theme)
    .display('block')
    .width('100%')
    .height('auto')
    .borderRadius(options.radii.sm)
}

function registerExpandablePanelResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.expandable-panel__summary', theme)
    .media('max-width: 760px')
    .gridTemplateColumns('1fr')
    .alignItems('stretch')

  styleBuilder
    .select('.expandable-panel__header-side', theme)
    .media('max-width: 760px')
    .justifyContent('space-between')
}
