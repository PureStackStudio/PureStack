import type { ThemePalette } from '@purestack/ts-style'
import { styleBuilder, type ThemeMode, themes } from '@purestack/ts-style'

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
    .padding('0.5em 1em')
    .borderRadius('999px')
    .border(`0px solid ${palette.current.border.default}`)
    .background(palette.semanticTone.neutral.surfaceAlt.rest.background)
    .color(palette.current.text.default)
    .fontSize('0.72rem')
    .fontWeight('700')
    .lineHeight('1.2')
    .letterSpacing('0.08em')
    .textTransform('uppercase')
}
