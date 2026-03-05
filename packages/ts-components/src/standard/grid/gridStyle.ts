import { styleBuilder } from '../../style/styles'
import { themes } from '../../style/themeOptions'

export function registerGridStyles() {
  themes.forEach((theme) => {
    styleBuilder
      .select('.grid', theme)
      .display('grid')
      .minWidth('0')
      .gap('var(--grid-gap)')
      .gridTemplateColumns('repeat(var(--grid-cols), minmax(0, 1fr))')
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
      .media('min-width: 640px')
      .gap('var(--grid-gap-sm, var(--grid-gap))')
      .gridTemplateColumns(
        'repeat(var(--grid-cols-sm, var(--grid-cols)), minmax(0, 1fr))',
      )

    styleBuilder
      .select('.grid', theme)
      .media('min-width: 768px')
      .gap('var(--grid-gap-md, var(--grid-gap-sm, var(--grid-gap)))')
      .gridTemplateColumns(
        'repeat(var(--grid-cols-md, var(--grid-cols-sm, var(--grid-cols))), minmax(0, 1fr))',
      )

    styleBuilder
      .select('.grid', theme)
      .media('min-width: 1024px')
      .gap(
        'var(--grid-gap-lg, var(--grid-gap-md, var(--grid-gap-sm, var(--grid-gap))))',
      )
      .gridTemplateColumns(
        'repeat(var(--grid-cols-lg, var(--grid-cols-md, var(--grid-cols-sm, var(--grid-cols)))), minmax(0, 1fr))',
      )

    styleBuilder
      .select('.grid', theme)
      .media('min-width: 1280px')
      .gap(
        'var(--grid-gap-xl, var(--grid-gap-lg, var(--grid-gap-md, var(--grid-gap-sm, var(--grid-gap)))))',
      )
      .gridTemplateColumns(
        'repeat(var(--grid-cols-xl, var(--grid-cols-lg, var(--grid-cols-md, var(--grid-cols-sm, var(--grid-cols))))), minmax(0, 1fr))',
      )
  })
}
