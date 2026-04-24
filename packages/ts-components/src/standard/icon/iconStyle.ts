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
    .select('.icon-framed', theme)
    .padding('0.25em')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .lineHeight('0')
    .flexShrink('0')
    .borderRadius(options.radii.md)
    .color(palette.current.text.default)

  styleBuilder
    .select('.icon-framed--tile', theme)
    .padding('0.5em')
    .border(`1px solid ${palette.current.icon.border}`)
    .background(palette.current.icon.gradient)
    .backgroundColor(palette.current.icon.background)
    .color(palette.current.icon.color)

  styleBuilder
    .select('.icon-framed--tile-sm', theme)
    .borderRadius(options.radii.sm)
    .padding('0.25em')
    .fontSize('0.82rem')

  styleBuilder
    .select('.icon-framed--tile-lg', theme)
    .borderRadius('0.75rem')
    .fontSize('1.12rem')
}
