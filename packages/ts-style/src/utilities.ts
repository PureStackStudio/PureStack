import type { CSSProps } from '@purestack/ts-css'
import { getBreakpointNames } from './breakpoints'
import { styleBuilder } from './styles'
import { BREAKPOINTS, mediaMax, mediaMin, themes } from './themeOptions'
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
type FontWeightValue = CSSProps['fontWeight']
const BORDER_WIDTH_UTILITIES = [1, 2, 3] as const
const OPACITY_UTILITIES = {
  0: '0',
  25: '0.25',
  50: '0.5',
  75: '0.75',
  1: '1',
} as const
const DISPLAY_UTILITIES = {
  none: 'none',
  block: 'block',
  inline: 'inline',
  'inline-block': 'inline-block',
  flex: 'flex',
  'inline-flex': 'inline-flex',
  grid: 'grid',
  'inline-grid': 'inline-grid',
  contents: 'contents',
  table: 'table',
  'table-row': 'table-row',
  'table-cell': 'table-cell',
  'list-item': 'list-item',
} as const
const LARGE_SIZE_BASE_SCALE = 1.25
const LARGE_SIZE_GROWTH = 0.4
const LARGE_LINE_HEIGHT_BASE_SIZE = 0.12
const LARGE_LINE_HEIGHT_GROWTH = 0.4
const MIN_FONT_WEIGHT = 100
const DEFAULT_FONT_WEIGHT = 400
const LARGE_FONT_WEIGHT_BASE_ADJUSTMENT = 25
const LARGE_FONT_WEIGHT_GROWTH = 175
const MAX_FONT_WEIGHT = 900

export function registerUtilityStyles() {
  themes.forEach((theme, palette) => {
    applyMarginUtilities(theme)
    applyPaddingUtilities(theme)
    applyGapUtilities(theme)
    applyDisplayUtilities(theme)
    applyLayoutUtilities(theme)
    applyVisibilityUtilities(theme)
    applyBorderUtilities(theme, palette, palette.radii)
    applyOpacityUtilities(theme)
    applyToneInsetSizeUtilities(theme)
    applyTextUtilities(theme, palette)
    applyFontSizeUtilities(theme, palette)
    applyFontWeightUtilities(theme)
    applyLineHeightUtilities(theme)
    applyShadowUtilities(theme, palette)
    applyMotionUtilities(theme)
  })
}

function applyMarginUtilities(theme: string) {
  for (const name of getSpacingUtilityNames()) {
    const value = SPACING_UTILITIES[name]
    applySpacingUtility(`m-${name}`, value, (selector, utilityValue) =>
      styleBuilder.select(selector, theme).margin(utilityValue),
    )
    applySpacingUtility(`mt-${name}`, value, (selector, utilityValue) =>
      styleBuilder.select(selector, theme).marginTop(utilityValue),
    )
    applySpacingUtility(`mr-${name}`, value, (selector, utilityValue) =>
      styleBuilder.select(selector, theme).marginRight(utilityValue),
    )
    applySpacingUtility(`mb-${name}`, value, (selector, utilityValue) =>
      styleBuilder.select(selector, theme).marginBottom(utilityValue),
    )
    applySpacingUtility(`ml-${name}`, value, (selector, utilityValue) =>
      styleBuilder.select(selector, theme).marginLeft(utilityValue),
    )
    applySpacingUtility(`mx-${name}`, value, (selector, utilityValue) =>
      styleBuilder.select(selector, theme).set('margin-inline', utilityValue),
    )
    applySpacingUtility(`my-${name}`, value, (selector, utilityValue) =>
      styleBuilder.select(selector, theme).set('margin-block', utilityValue),
    )
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
    applySpacingUtility(`p-${name}`, value, (selector, utilityValue) =>
      styleBuilder.select(selector, theme).padding(utilityValue),
    )
    applySpacingUtility(`pt-${name}`, value, (selector, utilityValue) =>
      styleBuilder.select(selector, theme).paddingTop(utilityValue),
    )
    applySpacingUtility(`pr-${name}`, value, (selector, utilityValue) =>
      styleBuilder.select(selector, theme).paddingRight(utilityValue),
    )
    applySpacingUtility(`pb-${name}`, value, (selector, utilityValue) =>
      styleBuilder.select(selector, theme).paddingBottom(utilityValue),
    )
    applySpacingUtility(`pl-${name}`, value, (selector, utilityValue) =>
      styleBuilder.select(selector, theme).paddingLeft(utilityValue),
    )
    applySpacingUtility(`px-${name}`, value, (selector, utilityValue) =>
      styleBuilder.select(selector, theme).set('padding-inline', utilityValue),
    )
    applySpacingUtility(`py-${name}`, value, (selector, utilityValue) =>
      styleBuilder.select(selector, theme).set('padding-block', utilityValue),
    )
  }
}

function applyGapUtilities(theme: string) {
  for (const name of getSpacingUtilityNames()) {
    const value = SPACING_UTILITIES[name]
    applySpacingUtility(`gap-${name}`, value, (selector, utilityValue) =>
      styleBuilder.select(selector, theme).gap(utilityValue),
    )
    applySpacingUtility(`gap-x-${name}`, value, (selector, utilityValue) =>
      styleBuilder.select(selector, theme).columnGap(utilityValue),
    )
    applySpacingUtility(`gap-y-${name}`, value, (selector, utilityValue) =>
      styleBuilder.select(selector, theme).set('row-gap', utilityValue),
    )
  }
}

function applySpacingUtility(
  name: string,
  value: string,
  apply: (selector: string, value: string) => void,
) {
  apply(`.${name}, .medium-fs .${name}`, value)
  apply(`.large-fs .${name}`, scaleLargeSize(value))
}

function applyDisplayUtilities(theme: string) {
  for (const [name, value] of Object.entries(DISPLAY_UTILITIES)) {
    styleBuilder.select(`.d-${name}`, theme).display(force(value))
  }
}

function applyLayoutUtilities(theme: string) {
  styleBuilder.select('.w-full', theme).width(force('100%'))
  styleBuilder.select('.h-full', theme).height(force('100%'))
  styleBuilder.select('.max-h-inspector', theme).maxHeight(force('24rem'))
  styleBuilder.select('.auto-fit', theme).width(force('1%'))
  styleBuilder.select('.min-w-0', theme).minWidth(force('0'))
  styleBuilder.select('.overflow-y-visible', theme).overflow(force('visible')) // this is not a bug, browser sets x and y together silently, so it is safe to set ourselves.
  styleBuilder.select('.overflow-x-visible', theme).overflow(force('visible')) // this is not a bug, browser sets x and y together silently, so it is safe to set ourselves.
  styleBuilder.select('.overflow-visible', theme).overflow(force('visible'))
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
  styleBuilder.select('.ws-pre-wrap', theme).whiteSpace(force('pre-wrap'))
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
  radii: ThemePalette['radii'],
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

/** Shadows read the theme's effect tokens, so depth follows the skin. */
const SHADOW_UTILITIES = {
  panel: 'panelShadow',
  'panel-strong': 'panelShadowStrong',
  soft: 'softShadow',
  interactive: 'interactiveShadow',
  floating: 'floatingShadow',
  strong: 'strongShadow',
  accent: 'accentShadow',
  inset: 'insetShadow',
} as const satisfies Record<string, keyof ThemePalette['effect']>

function applyShadowUtilities(theme: string, palette: ThemePalette) {
  styleBuilder
    .select(withHover('box-shadow-none'), theme)
    .boxShadow(force('none'))
  for (const [name, effect] of Object.entries(SHADOW_UTILITIES)) {
    styleBuilder
      .select(withHover(`box-shadow-${name}`), theme)
      .boxShadow(force(palette.effect[effect]))
  }
}

const LIFT_UTILITIES = {
  1: '-2px',
  2: '-4px',
} as const

const MOTION = '180ms ease'

/**
 * Motion for hover feedback. lift-* raises an element, nudge-hover slides a
 * row's content inward, and transition animates the paint and position
 * changes the other utilities make. All of it stops for reduced motion.
 */
function applyMotionUtilities(theme: string) {
  for (const [name, offset] of Object.entries(LIFT_UTILITIES)) {
    styleBuilder
      .select(withHover(`lift-${name}`), theme)
      .transform(force(`translateY(${offset})`))
  }

  styleBuilder
    .select('.transition', theme)
    .transition(
      ['background', 'border-color', 'box-shadow', 'color', 'transform']
        .map((property) => `${property} ${MOTION}`)
        .join(', '),
    )
  styleBuilder
    .select('.nudge-hover > *', theme)
    .transition(`transform ${MOTION}`)
  styleBuilder
    .select('.nudge-hover:hover > *', theme)
    .transform('translateX(0.5rem)')

  styleBuilder
    .select('.transition, .nudge-hover > *', theme)
    .media('prefers-reduced-motion: reduce')
    .transition(force('none'))
}

function force(val: string) {
  return `${val} !important`
}

function applyFontSizeUtilities(theme: string, palette: ThemePalette) {
  const fontSizes = palette.font.size
  applyFontSizeUtility(theme, 'xxxs', fontSizes.xxxs)
  applyFontSizeUtility(theme, 'xxs', fontSizes.xxs)
  applyFontSizeUtility(theme, 'xs', fontSizes.xs)
  applyFontSizeUtility(theme, 'sm', fontSizes.sm)
  applyFontSizeUtility(theme, 'body', fontSizes.body)
  applyFontSizeUtility(theme, 'h6', fontSizes.h6)
  applyFontSizeUtility(theme, 'h5', fontSizes.h5)
  applyFontSizeUtility(theme, 'h4', fontSizes.h4)
  applyFontSizeUtility(theme, 'h3', fontSizes.h3)
  applyFontSizeUtility(theme, 'h2', fontSizes.h2)
  applyFontSizeUtility(theme, 'h1', fontSizes.h1)
  applyFontSizeUtility(theme, 'display', fontSizes.display)
}

function applyFontSizeUtility(theme: string, name: string, value: string) {
  styleBuilder.select(`.fs-${name}`, theme).fontSize(force(value))
  styleBuilder
    .select(`.large-fs .fs-${name}`, theme)
    .fontSize(force(scaleLargeSize(value)))
    .lineHeight(force(scaleLargeLineHeight(value)))
  styleBuilder
    .select(`.medium-fs .fs-${name}`, theme)
    .fontSize(force(value))
    .lineHeight(force('normal'))
}

function scaleLargeSize(value: string) {
  const parsed = parseSize(value)
  if (!parsed) return value

  const scale = LARGE_SIZE_BASE_SCALE + parsed.size * LARGE_SIZE_GROWTH
  return `${Number((parsed.size * scale).toFixed(4))}${parsed.unit}${parsed.priority}`
}

function scaleLargeLineHeight(value: string) {
  const parsed = parseSize(value)
  if (!parsed) return 'normal'

  const lead =
    LARGE_LINE_HEIGHT_BASE_SIZE + parsed.size * LARGE_LINE_HEIGHT_GROWTH
  return `calc(1em + ${Number(lead.toFixed(4))}${parsed.unit})`
}

function parseSize(value: string) {
  const match = value.trim().match(/^(-?\d*\.?\d+)([a-z%]+)(\s*!important)?$/i)
  if (!match) return undefined

  const [, amount, unit, priority = ''] = match
  return { size: Number(amount), unit, priority }
}

function applyFontWeightUtilities(theme: string) {
  applyFontWeightUtility(theme, '100')
  applyFontWeightUtility(theme, '200')
  applyFontWeightUtility(theme, '300')
  applyFontWeightUtility(theme, '400')
  applyFontWeightUtility(theme, '500')
  applyFontWeightUtility(theme, '600')
  applyFontWeightUtility(theme, '700')
  applyFontWeightUtility(theme, '800')
  applyFontWeightUtility(theme, '900')
}

function applyFontWeightUtility(theme: string, value: string) {
  styleBuilder
    .select(`.fw-${value}, .medium-fs .fw-${value}`, theme)
    .fontWeight(force(value))
  styleBuilder
    .select(`.large-fs .fw-${value}`, theme)
    .fontWeight(force(scaleLargeFontWeight(value)))
}

function scaleLargeFontWeight(value?: FontWeightValue): FontWeightValue {
  const weight = Number(value ?? DEFAULT_FONT_WEIGHT)
  if (!Number.isFinite(weight)) return value ?? `${DEFAULT_FONT_WEIGHT}`

  const progress = Math.max(
    0,
    Math.min(
      1,
      (weight - MIN_FONT_WEIGHT) / (MAX_FONT_WEIGHT - MIN_FONT_WEIGHT),
    ),
  )
  const adjustment =
    LARGE_FONT_WEIGHT_BASE_ADJUSTMENT +
    LARGE_FONT_WEIGHT_GROWTH * progress * progress

  return `${Math.min(Math.round(weight + adjustment), MAX_FONT_WEIGHT)}`
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
  styleBuilder.select('.text-ellipsis', theme).textOverflow('ellipsis')
  styleBuilder.select('.uppercase', theme).textTransform('uppercase !important')
  styleBuilder.select('.lowercase', theme).textTransform('lowercase !important')

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
  applyScaledTextFontUtility(
    theme,
    palette,
    '.text-eyebrow',
    palette.font.size.xs,
    palette.font.weight.w700,
  )

  styleBuilder
    .select('.text-title', theme)
    .apply(palette.applyFont(palette.font.size.h2, palette.font.weight.w700))
    .lineHeight('1.1')
    .margin('0 0 0.45em')
  applyScaledTextFontUtility(
    theme,
    palette,
    '.text-title',
    palette.font.size.h2,
    palette.font.weight.w700,
  )

  styleBuilder
    .select('.text-tagline', theme)
    .apply(palette.applyFont(palette.font.size.sm))
    .color(palette.current.text.subtle)
    .margin('0 0 1em')
  applyScaledTextFontUtility(
    theme,
    palette,
    '.text-tagline',
    palette.font.size.sm,
  )

  styleBuilder
    .select('.text-lead', theme)
    .apply(palette.applyFont(palette.font.size.h4))
    .lineHeight('1.6')
    .margin('0 0 1em')
  applyScaledTextFontUtility(theme, palette, '.text-lead', palette.font.size.h4)

  styleBuilder
    .select('.text-caption', theme)
    .apply(palette.applyFont(palette.font.size.h3))
    .margin('0 0 0.8em')
  applyScaledTextFontUtility(
    theme,
    palette,
    '.text-caption',
    palette.font.size.h3,
  )

  styleBuilder
    .select('.text-quote', theme)
    .apply(palette.applyFont(palette.font.size.h5, palette.font.weight.w600))
    .fontStyle('italic')
    .margin('0 0 0.65em')
  applyScaledTextFontUtility(
    theme,
    palette,
    '.text-quote',
    palette.font.size.h5,
    palette.font.weight.w600,
  )

  styleBuilder
    .select('.text-attribution', theme)
    .apply(palette.applyFont(palette.font.size.xxs, palette.font.weight.w600))
    .letterSpacing('0.08em')
    .textTransform('uppercase')
    .margin('0 0 0.75em')
  applyScaledTextFontUtility(
    theme,
    palette,
    '.text-attribution',
    palette.font.size.xxs,
    palette.font.weight.w600,
  )

  styleBuilder
    .select('.prose-pullquote', theme)
    .apply(palette.applyFont(palette.font.size.h3, palette.font.weight.w100))
    .fontStyle('italic')
    .margin('0 0 1em')
  applyScaledTextFontUtility(
    theme,
    palette,
    '.prose-pullquote',
    palette.font.size.h3,
    palette.font.weight.w100,
  )

  styleBuilder
    .select('.prose-meta', theme)
    .apply(palette.applyFont(palette.font.size.xxs, palette.font.weight.w600))
    .letterSpacing('0.08em')
    .textTransform('uppercase')
    .margin('0 0 0.7em')
  applyScaledTextFontUtility(
    theme,
    palette,
    '.prose-meta',
    palette.font.size.xxs,
    palette.font.weight.w600,
  )
}

function applyScaledTextFontUtility(
  theme: string,
  palette: ThemePalette,
  selector: string,
  value: string,
  weight?: Parameters<ThemePalette['applyFont']>[1],
) {
  styleBuilder
    .select(`.large-fs ${selector}`, theme)
    .apply(
      palette.applyFont(scaleLargeSize(value), scaleLargeFontWeight(weight)),
    )
    .lineHeight(scaleLargeLineHeight(value))
  styleBuilder
    .select(`.medium-fs ${selector}`, theme)
    .apply(palette.applyFont(value, weight))
}

function getSpacingUtilityNames(): SpacingUtilityName[] {
  return Object.keys(SPACING_UTILITIES) as unknown as SpacingUtilityName[]
}
