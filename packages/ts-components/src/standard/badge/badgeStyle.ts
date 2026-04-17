import { styleBuilder, type ThemeMode, themes } from '@purestack/ts-style'

export function registerBadgeStyles() {
  themes.forEach((theme) => {
    registerBadgeBaseStyles(theme)
  })
}

function registerBadgeBaseStyles(theme: ThemeMode) {
  styleBuilder
    .select('.badge', theme)
    .display('inline-flex')
    .alignItems('center')
    .padding('0.5em 1em')
    .borderRadius('999px')
    .fontSize('0.72rem')
    .fontWeight('700')
    .lineHeight('1.2')
    .letterSpacing('0.08em')
    .textTransform('uppercase')
}
