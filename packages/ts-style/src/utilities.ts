import { styleBuilder } from './styles'
import { themes } from './themeOptions'

export const SPACING_UTILITIES = {
  0: '0',
  1: '0.25em',
  2: '0.5em',
  3: '0.75em',
  4: '1em',
  5: '1.5em',
  6: '2em',
} as const

type SpacingUtilityName = keyof typeof SPACING_UTILITIES

export function registerUtilityStyles() {
  themes.forEach((theme) => {
    applyMarginUtilities(theme)
    applyPaddingUtilities(theme)
    applyGapUtilities(theme)
  })
}

function applyMarginUtilities(theme: string) {
  for (const name of getSpacingUtilityNames()) {
    const value = SPACING_UTILITIES[name]
    styleBuilder.select(`.m-${name}`, theme).margin(value)
    styleBuilder.select(`.mt-${name}`, theme).marginTop(value)
    styleBuilder.select(`.mr-${name}`, theme).marginRight(value)
    styleBuilder.select(`.mb-${name}`, theme).marginBottom(value)
    styleBuilder.select(`.ml-${name}`, theme).marginLeft(value)
    styleBuilder.select(`.mx-${name}`, theme).set('margin-inline', value)
    styleBuilder.select(`.my-${name}`, theme).set('margin-block', value)
  }

  styleBuilder.select('.m-auto', theme).margin('auto')
  styleBuilder.select('.mt-auto', theme).marginTop('auto')
  styleBuilder.select('.mr-auto', theme).marginRight('auto')
  styleBuilder.select('.mb-auto', theme).marginBottom('auto')
  styleBuilder.select('.ml-auto', theme).marginLeft('auto')
  styleBuilder.select('.mx-auto', theme).set('margin-inline', 'auto')
  styleBuilder.select('.my-auto', theme).set('margin-block', 'auto')
}

function applyPaddingUtilities(theme: string) {
  for (const name of getSpacingUtilityNames()) {
    const value = SPACING_UTILITIES[name]
    styleBuilder.select(`.pad-${name}`, theme).padding(value)
    styleBuilder.select(`.padt-${name}`, theme).paddingTop(value)
    styleBuilder.select(`.padr-${name}`, theme).paddingRight(value)
    styleBuilder.select(`.padb-${name}`, theme).paddingBottom(value)
    styleBuilder.select(`.padl-${name}`, theme).paddingLeft(value)
    styleBuilder.select(`.padx-${name}`, theme).set('padding-inline', value)
    styleBuilder.select(`.pady-${name}`, theme).set('padding-block', value)
  }
}

function applyGapUtilities(theme: string) {
  for (const name of getSpacingUtilityNames()) {
    const value = SPACING_UTILITIES[name]
    styleBuilder.select(`.gap-${name}`, theme).gap(value)
    styleBuilder.select(`.gap-x-${name}`, theme).columnGap(value)
    styleBuilder.select(`.gap-y-${name}`, theme).set('row-gap', value)
  }
}

function getSpacingUtilityNames(): SpacingUtilityName[] {
  return Object.keys(SPACING_UTILITIES) as unknown as SpacingUtilityName[]
}
