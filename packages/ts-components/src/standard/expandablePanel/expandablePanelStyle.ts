import {
  BREAKPOINTS,
  mediaMax,
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
    registerExpandablePanelBodyStyles(theme, palette)
    registerExpandablePanelResponsiveStyles(theme)
  })
}

function registerExpandablePanelShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  _options: ThemeOptions,
) {
  styleBuilder
    .select('.expandable-panel', theme)
    .display('grid')
    .boxShadow(palette.effect.panelShadow)
    .alignContent('start')
    .overflow('hidden')
    .transition(
      'border-color 180ms ease, box-shadow 180ms ease, background 180ms ease',
    )

  styleBuilder
    .select('.expandable-panel[open]', theme)
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
    .padding('1em')
    .cursor('pointer')
    .minWidth('0')

  styleBuilder
    .select('.expandable-panel[open] .expandable-panel__summary', theme)
    .borderBottomLeftRadius('0')
    .borderBottomRightRadius('0')

  styleBuilder
    .select('.expandable-panel__summary::-webkit-details-marker', theme)
    .display('none')

  styleBuilder
    .select('.expandable-panel__summary:focus-visible', theme)
    .outline(`2px solid ${palette.current.border.focus}`)
    .outlineOffset('-2px')

  styleBuilder
    .select('.expandable-panel__header', theme)
    .gridColumn('2')
    .display('flex')
    .alignItems('center')
    .gap('10px')
    .flexWrap('wrap')
    .minWidth('0')

  styleBuilder
    .select(
      '.expandable-panel__summary:not(:has(.expandable-panel__icon)) .expandable-panel__header',
      theme,
    )
    .gridColumn('1 / 3')

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
    .gridColumn('3')
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
    .select('.expandable-panel[open] .expandable-panel__chevron', theme)
    .transform('rotate(180deg)')
}

function registerExpandablePanelBodyStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.expandable-panel__body', theme)
    .display('grid')
    .gap('0.75rem')
    .padding('1em')
    .borderTop(`1px solid ${palette.current.border.subtle}`)

  styleBuilder
    .select('.expandable-panel:not([open]) .expandable-panel__body', theme)
    .display('none')
}

function registerExpandablePanelResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.expandable-panel__summary', theme)
    .media(mediaMax(BREAKPOINTS.sm))
    .gridTemplateColumns('1fr')
    .alignItems('stretch')

  styleBuilder
    .select('.expandable-panel__header-side', theme)
    .media(mediaMax(BREAKPOINTS.sm))
    .justifyContent('space-between')
}
