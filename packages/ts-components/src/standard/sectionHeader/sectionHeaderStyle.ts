import { styleBuilder, themes } from '@purestack/ts-style'

export function registerSectionHeaderStyles() {
  themes.forEach((theme) => {
    styleBuilder
      .select('.section-header', theme)
      .display('grid')
      .alignContent('start')
      .minWidth('0')

    styleBuilder
      .select('.section-header .text-title', theme)
      .color('var(--ps-current-text-default)')

    styleBuilder
      .select('.section-header > :last-child', theme)
      .marginBottom('0')
  })
}
