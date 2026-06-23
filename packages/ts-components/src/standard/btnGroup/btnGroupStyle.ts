import type { ThemePalette } from '@purestack/ts-style'
import { styleBuilder, type ThemeMode, themes } from '@purestack/ts-style'

export function registerBtnGroupStyles() {
  themes.forEach((theme, palette) => {
    registerBtnGroupLayoutStyles(theme)
    registerBtnGroupDropDownStyles(theme, palette)
  })
}

function registerBtnGroupLayoutStyles(theme: ThemeMode) {
  styleBuilder
    .select('.btn-group', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('flex-start')
    .gap('0.375rem')
    .verticalAlign('middle')

  styleBuilder.select('.btn-group--center', theme).justifyContent('center')
  styleBuilder.select('.btn-group--end', theme).justifyContent('flex-end')
  styleBuilder.select('.btn-group--wrap', theme).flexWrap('wrap')
}

function registerBtnGroupDropDownStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.btn-group__dropdown', theme)
    .position('relative')
    .display('inline-flex')
    .lineHeight('normal')

  styleBuilder.select('.btn-group__toggle', theme).listStyle('none')
  styleBuilder.select('.btn-group__toggle::marker', theme).content('""')
  styleBuilder
    .select('.btn-group__toggle::-webkit-details-marker', theme)
    .display('none')

  styleBuilder
    .select('.btn-group__dropdown[open] > .btn-group__toggle', theme)
    .boxShadow(`0 0 0 3px ${palette.current.border.focus}`)

  styleBuilder
    .select('.btn-group__menu', theme)
    .position('absolute')
    .display('none')
    .top('calc(100% + 0.375rem)')
    .right('0')
    .zIndex(70)
    .width('max-content')
    .minWidth('max(11rem, 100%)')
    .maxWidth('calc(100vw - 2rem)')
    .padding('0.375rem')
    .gap('0.25rem')
    .boxShadow(palette.effect.strongShadow)

  styleBuilder
    .select('.btn-group__dropdown--start > .btn-group__menu', theme)
    .left('0')
    .right('auto')

  styleBuilder
    .select('.btn-group__dropdown[open] > .btn-group__menu', theme)
    .display('grid')

  styleBuilder
    .select('.btn-group__menu > .btn', theme)
    .width('100%')
    .justifyContent('flex-start')
    .textAlign('left')
    .whiteSpace('normal')

  styleBuilder
    .select('.btn-group__menu > .btn .btn__label', theme)
    .minWidth('0')
    .whiteSpace('normal')
    .overflowWrap('anywhere')

  styleBuilder
    .select('.btn-group__menu > *', theme)
    .maxWidth('100%')
    .minWidth('0')
}
