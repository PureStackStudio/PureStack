import { styleBuilder } from '../../../style/styles'
import { type ThemeMode, themes } from '../../../style/themeOptions'
import type { ThemePalette } from '../../../style/themePalette'

export function registerBadgeStyles() {
  themes.forEach((theme, palette) => {
    registerBadgeBaseStyles(theme, palette)
    registerBadgeToneStyles(theme, palette)
  })
}

function registerBadgeBaseStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.badge', theme)
    .display('inline-flex')
    .alignItems('center')
    .padding('2px 8px')
    .borderRadius('999px')
    .border(`1px solid ${palette.border.default}`)
    .background(palette.background.surfaceAlt)
    .color(palette.text.default)
    .fontSize('0.72rem')
    .fontWeight('700')
    .lineHeight('1.2')
    .letterSpacing('0.02em')
    .textTransform('uppercase')
}

function registerBadgeToneStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.badge--info', theme)
    .borderColor(palette.status.info.border)
    .background(palette.status.info.background)
    .color(palette.status.info.text)

  styleBuilder
    .select('.badge--success', theme)
    .borderColor(palette.status.success.border)
    .background(palette.status.success.background)
    .color(palette.status.success.text)

  styleBuilder
    .select('.badge--error', theme)
    .borderColor(palette.status.danger.border)
    .background(palette.status.danger.background)
    .color(palette.status.danger.text)

  styleBuilder
    .select('.badge--warning', theme)
    .borderColor(palette.status.warning.border)
    .background(palette.status.warning.background)
    .color(palette.status.warning.text)
}
