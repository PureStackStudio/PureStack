import {
  BREAKPOINTS,
  mediaMin,
  styleBuilder,
  themes,
} from '@purestack/ts-style'

export function registerGridStyles() {
  themes.forEach((theme, _palette) => {
    styleBuilder
      .select('.grid', theme)
      .display('grid')
      .minWidth('0')
      .gap('0.75rem')
      .gridTemplateColumns('var(--grid-template-columns)')

    styleBuilder.select('.grid > *', theme).minWidth('0')

    styleBuilder.select('.align-stretch', theme).alignItems('stretch')
    styleBuilder.select('.align-start', theme).alignItems('start')
    styleBuilder.select('.align-center', theme).alignItems('center')
    styleBuilder.select('.align-end', theme).alignItems('end')

    styleBuilder.select('.justify-items-stretch', theme).justifyItems('stretch')
    styleBuilder.select('.justify-items-start', theme).justifyItems('start')
    styleBuilder.select('.justify-items-center', theme).justifyItems('center')
    styleBuilder.select('.justify-items-end', theme).justifyItems('end')

    styleBuilder.select('.grid-dense', theme).gridAutoFlow('row dense')

    styleBuilder
      .select('.grid', theme)
      .media(mediaMin(BREAKPOINTS.sm))
      .gridTemplateColumns('var(--grid-template-columns-sm)')

    styleBuilder
      .select('.grid', theme)
      .media(mediaMin(BREAKPOINTS.md))
      .gridTemplateColumns('var(--grid-template-columns-md)')

    styleBuilder
      .select('.grid', theme)
      .media(mediaMin(BREAKPOINTS.lg))
      .gridTemplateColumns('var(--grid-template-columns-lg)')

    styleBuilder
      .select('.grid', theme)
      .media(mediaMin(BREAKPOINTS.xl))
      .gridTemplateColumns('var(--grid-template-columns-xl)')
  })
}
