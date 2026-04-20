import type { ThemePalette } from '@purestack/ts-style'
import { styleBuilder, type ThemeMode, themes } from '@purestack/ts-style'

export function registerFooterStyles() {
  themes.forEach((theme, palette) => {
    applyFooterShellStyles(theme, palette)
    applyFooterBottomStyles(theme, palette)
  })
}

export function applyFooterShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.site-footer', theme)
    .position('relative')
    .overflow('hidden')
    .border(`0px solid ${palette.current.border.default}`)
    .background(palette.semanticTone.neutral.surface.rest.background)
    .padding('0')

  styleBuilder
    .select('.site-footer__inner', theme)
    .position('relative')
    .display('grid')
    .padding('1em')
    .background('transparent')
}

export function applyFooterBottomStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  applyFooterBottomShellStyles(theme, palette)
}

export function applyFooterBottomShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.site-footer__bottom', theme)
    .apply(palette.applyFont(palette.font.size.xxs))
    .padding('0.5em 1em 0.5em 1em')
    .color(palette.current.text.subtle)
    .borderTop(`1px solid ${palette.current.border.subtle}`)
  styleBuilder
    .select('.site-footer__bottom :where(a)', theme)
    .color(palette.current.text.subtle)
}
