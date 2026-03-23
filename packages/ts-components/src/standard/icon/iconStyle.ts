import { styleBuilder, type ThemeMode, themes } from '@purestack/ts-style'

export function registerIconStyles() {
  themes.forEach((theme) => {
    registerIconBaseStyles(theme)
  })
}

function registerIconBaseStyles(theme: ThemeMode) {
  styleBuilder
    .select('.icon', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .width('1.7em')
    .height('1.7em')
    .lineHeight('0')
    .verticalAlign('middle')
    .flexShrink('0')

  styleBuilder
    .select('.icon svg', theme)
    .display('block')
    .width('100%')
    .height('100%')
}
