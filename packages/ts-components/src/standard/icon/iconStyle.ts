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

  styleBuilder
    .select('.icon svg', theme)
    .display('block')
    .width('100%')
    .height('100%')

  styleBuilder
    .select('.icon-wrap', theme)
    .width('44px')
    .height('44px')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .borderRadius(options.radii.md)
    .background(palette.semanticTone.accent.icon.gradient)
    .backgroundColor(palette.semanticTone.accent.icon.background)
    .border(`1px solid ${palette.semanticTone.accent.icon.border}`)
    .boxShadow(palette.effect.interactiveShadow)
    .color(palette.semanticTone.accent.icon.color)
}
