import {
  styleBuilder,
  type ThemeOptions,
  type ThemePalette,
  themes,
} from '@purestack/ts-style'

export function registerIconStyles() {
  themes.forEach((theme, palette, options) => {
    registerIconBaseStyles(theme, palette, options)
  })
}

function registerIconBaseStyles(
  theme: string,
  palette: ThemePalette,
  options: ThemeOptions,
) {
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
    .alignSelf('center')

  styleBuilder
    .select('.icon svg', theme)
    .display('block')
    .width('100%')
    .height('100%')

  styleBuilder
    .select('.icon-wrap', theme)
    .padding('0.25em')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .borderRadius(options.radii.md)
    .color(palette.current.text.default)
}
