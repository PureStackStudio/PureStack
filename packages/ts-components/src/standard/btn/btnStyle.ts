import type { ThemePalette } from '@purestack/ts-style'
import { styleBuilder, type ThemeMode, themes } from '@purestack/ts-style'

export function registerButtonStyles() {
  themes.forEach((theme, palette) => {
    registerButtonBaseStyles(theme, palette)
    registerButtonSizeStyles(theme, palette)
  })
}

function registerButtonBaseStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.btn', theme)
    .display('inline-flex')
    .background('transparent')
    .verticalAlign('middle')
    .alignItems('center')
    .justifyContent('center')
    .gap('0.25em')
    .border('none')
    .borderColor('transparent')
    .cursor('pointer')
    .textDecoration('none')
    .whiteSpace('nowrap')
    .transition(
      'background 150ms ease, color 150ms ease, border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease',
    )
    .webkitTapHighlightColor('transparent')
    .padding('0.5em 0.75em')
    .apply(palette.applyFont(palette.font.size.body, palette.font.weight.w500))
    .userSelect('none')

  styleBuilder
    .select('.btn:disabled', theme)
    .cursor('not-allowed')
    .transform('none')
    .boxShadow('none')

  styleBuilder
    .select('.btn__label', theme)
    .display('inline-flex')
    .alignItems('center')

  styleBuilder.select('.btn__icon', theme).width('1.1em').height('1.1em')
}

function registerButtonSizeStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.btn--sm', theme)
    .apply(palette.applyFont(palette.font.size.xs, palette.font.weight.w500))

  /*- The default size (md) is defined in the .btn for simplicity. */

  styleBuilder
    .select('.btn--lg', theme)
    .apply(palette.applyFont(palette.font.size.h2, palette.font.weight.w500))
  styleBuilder.select('.btn--icon-only', theme).padding('0.25em')
  styleBuilder.select('.btn--icon-only .btn__label', theme).display('none')
}
