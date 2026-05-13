import { getBreakpointNames } from './breakpoints'
import { styleBuilder } from './styles'
import {
  BREAKPOINTS,
  mediaMax,
  mediaMin,
  type ThemeOptions,
  themes,
} from './themeOptions'
import type { ThemePalette } from './themePalette'

// Flex and grid utility classes live with their component styles:
// packages/ts-components/src/standard/flex/flexStyle.ts
// packages/ts-components/src/standard/grid/gridStyle.ts
// Keep layout-specific utilities there so this generic registry does not
// duplicate component-owned rules.
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
const BORDER_WIDTH_UTILITIES = [1, 2, 3] as const
const OPACITY_UTILITIES = {
  0: '0',
  25: '0.25',
  50: '0.5',
  75: '0.75',
  1: '1',
} as const

export function registerUtilityStyles() {
  themes.forEach((theme, palette, options) => {
    applyMarginUtilities(theme)
    applyPaddingUtilities(theme)
    applyGapUtilities(theme)
    applyLayoutUtilities(theme)
    applyVisibilityUtilities(theme)
    applyBorderUtilities(theme, palette, options.radii)
    applyOpacityUtilities(theme)
    applyToneInsetSizeUtilities(theme)
    applyTextUtilities(theme, palette)
    applyFontSizeUtilities(theme, palette)
    applyFontWeightUtilities(theme)
    applyLineHeightUtilities(theme)
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
    styleBuilder.select(`.p-${name}`, theme).padding(value)
    styleBuilder.select(`.pt-${name}`, theme).paddingTop(value)
    styleBuilder.select(`.pr-${name}`, theme).paddingRight(value)
    styleBuilder.select(`.pb-${name}`, theme).paddingBottom(value)
    styleBuilder.select(`.pl-${name}`, theme).paddingLeft(value)
    styleBuilder.select(`.px-${name}`, theme).set('padding-inline', value)
    styleBuilder.select(`.py-${name}`, theme).set('padding-block', value)
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
  styleBuilder.select('.overflow-auto', theme).overflow(force('auto'))
  styleBuilder.select('.overflow-hidden', theme).overflow(force('hidden'))
  styleBuilder.select('.overflow-x-auto', theme).overflowX(force('auto'))
  styleBuilder.select('.overflow-y-auto', theme).overflowY(force('auto'))
  styleBuilder.select('.position-relative', theme).position(force('relative'))
  styleBuilder.select('.position-static', theme).position(force('static'))
  styleBuilder.select('.position-absolute', theme).position(force('absolute'))
  styleBuilder.select('.position-fixed', theme).position(force('fixed'))
  styleBuilder.select('.position-sticky', theme).position(force('sticky'))
  styleBuilder.select('.cursor-pointer', theme).cursor(force('pointer'))
  styleBuilder.select('.ws-normal', theme).whiteSpace(force('normal'))
  styleBuilder.select('.ws-nowrap', theme).whiteSpace(force('nowrap'))
  styleBuilder.select('.col-resize', theme).cursor(force('col-resize'))
  styleBuilder.select('.bg-none', theme).background(force('none'))
}

function applyVisibilityUtilities(theme: string) {
  styleBuilder.select('.hidden', theme).display(force('none'))

  for (const name of getBreakpointNames()) {
    const breakpoint = BREAKPOINTS[name]
    styleBuilder
      .select(`.hidden-${name}`, theme)
      .media(mediaMax(breakpoint))
      .display(force('none'))
    styleBuilder
      .select(`.hidden-${name}-up`, theme)
      .media(mediaMin(breakpoint))
      .display(force('none'))
  }
}

function applyBorderUtilities(
  theme: string,
  palette: ThemePalette,
  radii: ThemeOptions['radii'],
) {
  applyBorderWidthUtilities(theme)

  styleBuilder
    .select('.b-none, .b-none-hover:hover', theme)
    .borderStyle(force('none'))
  styleBuilder
    .select('.b-solid, .b-solid-hover:hover', theme)
    .borderStyle(force('solid'))
  styleBuilder
    .select('.b-dashed, .b-dashed-hover:hover', theme)
    .borderStyle(force('dashed'))
  styleBuilder
    .select('.b-dotted, .b-dotted-hover:hover', theme)
    .borderStyle(force('dotted'))

  styleBuilder
    .select('.b-subtle, .b-subtle-hover:hover', theme)
    .borderColor(force(palette.current.border.subtle))
  styleBuilder
    .select('.b-default, .b-default-hover:hover', theme)
    .borderColor(force(palette.current.border.default))
  styleBuilder
    .select('.b-focus, .b-focus-hover:hover', theme)
    .borderColor(force(palette.current.border.focus))
  styleBuilder
    .select('.b-tone, .b-tone-hover:hover', theme)
    .borderColor(force(palette.current.tone))
  styleBuilder
    .select('.b-transparent, .b-transparent-hover:hover', theme)
    .borderColor(force('transparent'))
  styleBuilder
    .select('.b-current, .b-current-hover:hover', theme)
    .borderColor(force('currentColor'))

  applyRadiusUtility(theme, 'none', '0')
  applyRadiusUtility(theme, 'sm', radii.sm)
  applyRadiusUtility(theme, 'md', radii.md)
  applyRadiusUtility(theme, 'lg', radii.lg)
  applyRadiusUtility(theme, 'pill', radii.pill)
}

function applyBorderWidthUtilities(theme: string) {
  for (const width of BORDER_WIDTH_UTILITIES) {
    const value = force(`${width}px`)

    styleBuilder
      .select(withHover(`b-${width}`), theme)
      .borderStyle(force('solid'))
      .borderWidth(value)
    styleBuilder
      .select(withHover(`bx-${width}`), theme)
      .borderLeftWidth(value)
      .borderRightWidth(value)
      .borderLeftStyle(force('solid'))
      .borderRightStyle(force('solid'))
    styleBuilder
      .select(withHover(`by-${width}`), theme)
      .borderTopWidth(value)
      .borderBottomWidth(value)
      .borderTopStyle(force('solid'))
      .borderBottomStyle(force('solid'))
    styleBuilder
      .select(withHover(`bt-${width}`), theme)
      .borderTopWidth(value)
      .borderTopStyle(force('solid'))
    styleBuilder
      .select(withHover(`br-${width}`), theme)
      .borderRightWidth(value)
      .borderRightStyle(force('solid'))
    styleBuilder
      .select(withHover(`bb-${width}`), theme)
      .borderBottomWidth(value)
      .borderBottomStyle(force('solid'))
    styleBuilder
      .select(withHover(`bl-${width}`), theme)
      .borderLeftWidth(value)
      .borderLeftStyle(force('solid'))
  }

  styleBuilder.select(withHover('b-0'), theme).borderWidth(force('0'))
  styleBuilder
    .select(withHover('bx-0'), theme)
    .borderLeftWidth(force('0'))
    .borderRightWidth(force('0'))
  styleBuilder
    .select(withHover('by-0'), theme)
    .borderTopWidth(force('0'))
    .borderBottomWidth(force('0'))
  styleBuilder.select(withHover('bt-0'), theme).borderTopWidth(force('0'))
  styleBuilder.select(withHover('br-0'), theme).borderRightWidth(force('0'))
  styleBuilder.select(withHover('bb-0'), theme).borderBottomWidth(force('0'))
  styleBuilder.select(withHover('bl-0'), theme).borderLeftWidth(force('0'))
}

function withHover(name: string) {
  return `.${name}, .${name}-hover:hover`
}

function applyOpacityUtilities(theme: string) {
  for (const [name, value] of Object.entries(OPACITY_UTILITIES)) {
    styleBuilder
      .select(withHover(`opacity-${name}`), theme)
      .opacity(force(value))
  }
}

function applyToneInsetSizeUtilities(theme: string) {
  for (const name of getSpacingUtilityNames()) {
    styleBuilder
      .select(`.inset-size-${name}`, theme)
      .set('--tone-inset-size', SPACING_UTILITIES[name])
  }
}

function applyRadiusUtility(theme: string, name: string, value: string) {
  const radius = force(value)
  styleBuilder.select(`.rounded-${name}`, theme).borderRadius(radius)
  styleBuilder
    .select(`.rounded-t-${name}`, theme)
    .borderTopLeftRadius(radius)
    .borderTopRightRadius(radius)
  styleBuilder
    .select(`.rounded-r-${name}`, theme)
    .borderTopRightRadius(radius)
    .borderBottomRightRadius(radius)
  styleBuilder
    .select(`.rounded-b-${name}`, theme)
    .borderBottomRightRadius(radius)
    .borderBottomLeftRadius(radius)
  styleBuilder
    .select(`.rounded-l-${name}`, theme)
    .borderTopLeftRadius(radius)
    .borderBottomLeftRadius(radius)
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

function applyFontWeightUtilities(theme: string) {
  styleBuilder.select('.fw-100', theme).fontWeight(force('100'))
  styleBuilder.select('.fw-200', theme).fontWeight(force('200'))
  styleBuilder.select('.fw-300', theme).fontWeight(force('300'))
  styleBuilder.select('.fw-400', theme).fontWeight(force('400'))
  styleBuilder.select('.fw-500', theme).fontWeight(force('500'))
  styleBuilder.select('.fw-600', theme).fontWeight(force('600'))
  styleBuilder.select('.fw-700', theme).fontWeight(force('700'))
  styleBuilder.select('.fw-800', theme).fontWeight(force('800'))
  styleBuilder.select('.fw-900', theme).fontWeight(force('900'))
}

function applyLineHeightUtilities(theme: string) {
  for (let index = 0; index <= 7; index += 1) {
    styleBuilder
      .select(`.lh-${index}`, theme)
      .lineHeight(force((1 + index * 0.1).toFixed(1)))
  }
}

function applyTextUtilities(theme: string, palette: ThemePalette) {
  styleBuilder
    .select(
      '.underline-hover:hover, .underline-active:active, .underline-active.active',
      theme,
    )
    .textDecoration('underline !important')
  styleBuilder.select('.text-left', theme).textAlign('left !important')
  styleBuilder.select('.text-center', theme).textAlign('center !important')
  styleBuilder.select('.text-right', theme).textAlign('right !important')
  styleBuilder.select('.text-start', theme).textAlign('start !important')
  styleBuilder.select('.text-end', theme).textAlign('end !important')
  styleBuilder.select('.text-justify', theme).textAlign('justify !important')
  styleBuilder.select('.uppercase', theme).textTransform('uppercase !important')

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
