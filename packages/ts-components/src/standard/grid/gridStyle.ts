import { mediaMin, styleBuilder, themes } from '@purestack/ts-style'

export function registerGridStyles() {
  themes.forEach((theme, _palette) => {
    styleBuilder
      .select('.grid', theme)
      .display('grid')
      .minWidth('0')
      .gap('0.75rem')
      .gridTemplateColumns('var(--grid-template-columns)')
      .alignItems('stretch')
      .justifyItems('stretch')

    styleBuilder.select('.grid > *', theme).minWidth('0')

    styleBuilder.select('.grid--align-start', theme).alignItems('start')
    styleBuilder.select('.grid--align-center', theme).alignItems('center')
    styleBuilder.select('.grid--align-end', theme).alignItems('end')

    styleBuilder.select('.grid--justify-start', theme).justifyItems('start')
    styleBuilder.select('.grid--justify-center', theme).justifyItems('center')
    styleBuilder.select('.grid--justify-end', theme).justifyItems('end')

    styleBuilder.select('.grid--dense', theme).gridAutoFlow('row dense')

    styleBuilder
      .select('.grid', theme)
      .media(mediaMin('sm'))
      .gridTemplateColumns('var(--grid-template-columns-sm)')

    styleBuilder
      .select('.grid', theme)
      .media(mediaMin('md'))
      .gridTemplateColumns('var(--grid-template-columns-md)')

    styleBuilder
      .select('.grid', theme)
      .media(mediaMin('lg'))
      .gridTemplateColumns('var(--grid-template-columns-lg)')

    styleBuilder
      .select('.grid', theme)
      .media(mediaMin('xl'))
      .gridTemplateColumns('var(--grid-template-columns-xl)')
  })
}
