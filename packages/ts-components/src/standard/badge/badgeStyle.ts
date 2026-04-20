import {
  styleBuilder,
  type ThemeMode,
  type ThemePalette,
  themes,
} from '@purestack/ts-style'

export function registerBadgeStyles() {
  themes.forEach((theme, palette) => {
    registerBadgeBaseStyles(theme, palette)
  })
}

function registerBadgeBaseStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.badge', theme)
    .display('inline-flex')
    .alignItems('center')
    .padding('0.12em 0.5em')
    .borderRadius('999px')
    .apply(palette.applyFont(palette.font.size.xxxs, palette.font.weight.w700))
    .textTransform('uppercase')
}
