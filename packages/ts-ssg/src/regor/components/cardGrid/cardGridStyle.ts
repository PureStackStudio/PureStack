import { styleBuilder } from '../../../style/styles'
import { themes } from '../../../style/themeOptions'

export function registerCardGridStyles() {
  themes.forEach((theme, palette, options) => {
    styleBuilder
      .select('.card-grid', theme)
      .display('grid')
      .gap('16px')
      .padding('24px')
      .borderRadius(options.radii.md)
      .border(`1px solid ${palette.border.subtle}`)

    styleBuilder
      .select('.card-grid__title', theme)
      .fontSize('18px')
      .fontWeight('600')
      .color(palette.text.default)
  })
}

export function registerCardStyles() {
  themes.forEach((theme, palette, options) => {
    styleBuilder
      .select('.card', theme)
      .display('grid')
      .gap('8px')
      .padding('16px')
      .borderRadius(options.radii.md)
      .border(`1px solid ${palette.border.default}`)

    styleBuilder.select('.card__icon', theme).fontWeight('600')

    styleBuilder.select('.card__title', theme).color(palette.text.subtle)
  })
}
