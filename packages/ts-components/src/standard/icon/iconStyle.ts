import type { ThemePalette } from '@purestack/ts-style'
import { styleBuilder, themes } from '@purestack/ts-style'

export function registerIconStyles() {
  themes.forEach((theme, palette) => {
    registerIconBaseStyles(theme, palette)
  })
}

function registerIconBaseStyles(theme: string, palette: ThemePalette) {
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
    .select('.icon-frame', theme)
    .padding('0.25em')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .lineHeight('0')
    .flexShrink('0')
    .borderRadius(palette.radii.md)

  styleBuilder
    .select('.icon-frame--sm', theme)
    .borderRadius(palette.radii.sm)
    .padding('0.5em')
    .fontSize('0.6em')

  styleBuilder
    .select('.icon-frame--lg', theme)
    .borderRadius('0.75rem')
    .padding('0.5em')
    .fontSize('1.5em')
}
