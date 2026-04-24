import { styleBuilder } from './styles'
import { themes } from './themeOptions'
import type { ThemePalette } from './themePalette'

export const SPACING_UTILITIES = {
  0: '0 !important',
  1: '0.25em !important',
  2: '0.5em !important',
  3: '0.75em !important',
  4: '1em !important',
  5: '1.5em !important',
  6: '2em !important',
} as const

type SpacingUtilityName = keyof typeof SPACING_UTILITIES

export function registerUtilityStyles() {
  themes.forEach((theme, palette) => {
    applyMarginUtilities(theme)
    applyPaddingUtilities(theme)
    applyGapUtilities(theme)
    applyLayoutUtilities(theme)
    applyTextUtilities(theme, palette)
    applyFontSizeUtilities(theme, palette)
    applyShadowUtilities(theme)
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

  styleBuilder.select('.m-auto', theme).margin('auto !important')
  styleBuilder.select('.mt-auto', theme).marginTop('auto !important')
  styleBuilder.select('.mr-auto', theme).marginRight('auto !important')
  styleBuilder.select('.mb-auto', theme).marginBottom('auto !important')
  styleBuilder.select('.ml-auto', theme).marginLeft('auto !important')
  styleBuilder.select('.mx-auto', theme).set('margin-inline', 'auto !important')
  styleBuilder.select('.my-auto', theme).set('margin-block', 'auto !important')
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

function applyLayoutUtilities(theme: string) {
  styleBuilder.select('.w-full', theme).width(force('100%'))
  styleBuilder.select('.h-full', theme).height(force('100%'))
  styleBuilder.select('.min-w-0', theme).minWidth(force('0'))
  styleBuilder
    .select('.list-none', theme)
    .listStyle(force('none'))
    .padding(force('0'))
}

function applyShadowUtilities(theme: string) {
  styleBuilder.select('.box-shadow-none', theme).boxShadow(force('none'))
}

function force(val: string) {
  return `${val} !important`
}

function applyFontSizeUtilities(theme: string, palette: ThemePalette) {
  const fontSizes = palette.font.size
  styleBuilder.select('.fs-xxxs', theme).fontSize(force(fontSizes.xxxs))
  styleBuilder.select('.fs-xxs', theme).fontSize(force(fontSizes.xxs))
  styleBuilder.select('.fs-xs', theme).fontSize(force(fontSizes.xs))
  styleBuilder.select('.fs-sm', theme).fontSize(force(fontSizes.sm))
  styleBuilder.select('.fs-body', theme).fontSize(force(fontSizes.body))
  styleBuilder.select('.fs-h6', theme).fontSize(force(fontSizes.h6))
  styleBuilder.select('.fs-h5', theme).fontSize(force(fontSizes.h5))
  styleBuilder.select('.fs-h4', theme).fontSize(force(fontSizes.h4))
  styleBuilder.select('.fs-h3', theme).fontSize(force(fontSizes.h3))
  styleBuilder.select('.fs-h2', theme).fontSize(force(fontSizes.h2))
  styleBuilder.select('.fs-h1', theme).fontSize(force(fontSizes.h1))
  styleBuilder.select('.fs-display', theme).fontSize(force(fontSizes.display))
}

function applyTextUtilities(theme: string, palette: ThemePalette) {
  styleBuilder
    .select(
      '.text-subtle, .prose-meta, .text-caption, .text-attribution',
      theme,
    )
    .color(palette.current.text.subtle)
    .margin('0 0 0.8em')

  styleBuilder
    .select('.text-eyebrow', theme)
    .apply(palette.applyFont(palette.font.size.xs, palette.font.weight.w700))
    .color(palette.current.text.subtle)
    .letterSpacing('0.18em')
    .textTransform('uppercase')
    .margin('0 0 0.55em')

  styleBuilder
    .select('.text-title', theme)
    .apply(palette.applyFont(palette.font.size.h2, palette.font.weight.w700))
    .lineHeight('1.1')
    .margin('0 0 0.45em')

  styleBuilder
    .select('.text-tagline', theme)
    .apply(palette.applyFont(palette.font.size.sm))
    .color(palette.current.text.subtle)
    .lineHeight('1.6')
    .margin('0 0 1em')

  styleBuilder
    .select('.text-lead', theme)
    .apply(palette.applyFont(palette.font.size.h4))
    .lineHeight('1.6')
    .margin('0 0 1em')

  styleBuilder
    .select('.text-caption', theme)
    .apply(palette.applyFont(palette.font.size.h3))
    .lineHeight('1.5')
    .margin('0 0 0.8em')

  styleBuilder
    .select('.text-quote', theme)
    .apply(palette.applyFont(palette.font.size.h5, palette.font.weight.w600))
    .fontStyle('italic')
    .lineHeight('1.5')
    .margin('0 0 0.65em')

  styleBuilder
    .select('.text-attribution', theme)
    .apply(palette.applyFont(palette.font.size.xxs, palette.font.weight.w600))
    .letterSpacing('0.08em')
    .textTransform('uppercase')
    .margin('0 0 0.75em')

  styleBuilder
    .select('.prose-pullquote', theme)
    .apply(palette.applyFont(palette.font.size.h3, palette.font.weight.w100))
    .fontStyle('italic')
    .margin('0 0 1em')

  styleBuilder
    .select('.prose-meta', theme)
    .apply(palette.applyFont(palette.font.size.xxs, palette.font.weight.w600))
    .letterSpacing('0.08em')
    .textTransform('uppercase')
    .margin('0 0 0.7em')
}

function getSpacingUtilityNames(): SpacingUtilityName[] {
  return Object.keys(SPACING_UTILITIES) as unknown as SpacingUtilityName[]
}
