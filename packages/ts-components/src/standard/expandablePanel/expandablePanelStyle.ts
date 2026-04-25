import {
  styleBuilder,
  type ThemeMode,
  type ThemePalette,
  themes,
} from '@purestack/ts-style'

export function registerExpandablePanelStyles() {
  themes.forEach((theme, palette) => {
    registerExpandablePanelShellStyles(theme, palette)
    registerExpandablePanelSummaryStyles(theme, palette)
  })
}

function registerExpandablePanelShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.expandable-panel', theme)
    .boxShadow(palette.effect.panelShadow)
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
) {
  styleBuilder
    .select('.expandable-panel[open] .expandable-panel__summary', theme)
    .borderBottomLeftRadius('0 !important')
    .borderBottomRightRadius('0 !important')

  styleBuilder
    .select('.expandable-panel__summary::-webkit-details-marker', theme)
    .display('none')

  styleBuilder
    .select('.expandable-panel__summary:focus-visible', theme)
    .outline(`2px solid ${palette.current.border.focus}`)
    .outlineOffset('-2px')

  styleBuilder
    .select('.expandable-panel__chevron', theme)
    .transition(
      'transform 180ms ease, color 180ms ease, border-color 180ms ease, background 180ms ease',
    )

  styleBuilder
    .select('.expandable-panel[open] .expandable-panel__chevron', theme)
    .transform('rotate(180deg)')
}
