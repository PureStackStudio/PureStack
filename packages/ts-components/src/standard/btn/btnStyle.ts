import type { ThemeOptions } from '@purestack/ts-style'
import { styleBuilder, type ThemeMode, themes } from '@purestack/ts-style'

export function registerButtonStyles() {
  themes.forEach((theme, _, options) => {
    registerButtonBaseStyles(theme, options)
    registerButtonSizeStyles(theme, options.radii)
  })
}

function registerButtonBaseStyles(
  theme: ThemeMode,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.btn', theme)
    .display('inline-flex')
    .verticalAlign('middle')
    .alignItems('center')
    .justifyContent('center')
    .gap('8px')
    .border('1px solid transparent')
    .fontWeight('600')
    .lineHeight('1')
    .cursor('pointer')
    .textDecoration('none')
    .whiteSpace('nowrap')
    .transition(
      'background 150ms ease, color 150ms ease, border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease',
    )
    .webkitTapHighlightColor('transparent')
    .padding('10px 16px')
    .fontSize('0.95rem')
    .borderRadius(options.radii.md)

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

function registerButtonSizeStyles(
  theme: ThemeMode,
  radii: { sm: string; md: string; lg: string },
) {
  styleBuilder
    .select('.btn--sm', theme)
    .padding('8px 12px')
    .fontSize('0.86rem')
    .borderRadius(radii.sm)

  /*- The default size (md) is defined in the .btn for simplicity. */

  styleBuilder
    .select('.btn--lg', theme)
    .padding('12px 20px')
    .fontSize('1rem')
    .borderRadius(radii.md)

  styleBuilder
    .select('.btn--icon-only.btn--sm', theme)
    .padding('8px')
    .width('34px')

  styleBuilder
    .select('.btn--icon-only.btn--md', theme)
    .padding('10px')
    .width('40px')

  styleBuilder
    .select('.btn--icon-only.btn--lg', theme)
    .padding('12px')
    .width('46px')

  styleBuilder.select('.btn--icon-only .btn__label', theme).display('none')
}
