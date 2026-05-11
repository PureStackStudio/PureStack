import {
  getCurrentThemePaletteVar,
  getThemePaletteVar,
  normalizeThemeVariableReference,
} from '@purestack/ts-style'
import { defineComponent, flatten, html } from 'regor'

const logoTemplate = html`<div class="site-logo" :style="layoutStyle">
  <a class="site-logo__link" :href="href ?? '/'" :aria-label="ariaLabel">
    <span class="site-logo__glyph" :style="glyphStyle" aria-hidden="true">
      <Icon :name="icon" r-if="icon"/>
      <span class="site-logo__glyph-mark" r-else></span>
    </span>
    <span class="site-logo__stack">
      <span class="site-logo__brand">
        <span
          r-for="brandLetter in brandLetters"
          class="site-logo__brand-letter"
          :style="brandLetter.style"
        >
          {{ brandLetter.value }}
        </span>
      </span>
      <span class="site-logo__subtitle" r-if="subtitle">
        <span
          r-for="subtitleLetter in subtitleLetters"
          class="site-logo__subtitle-letter"
          :style="subtitleLetter.style"
        >
          {{ subtitleLetter.value }}
        </span>
      </span>
    </span>
  </a>
</div>`

interface LogoLetter {
  value: string
  isSpace?: boolean
  style?: Record<string, string>
}

type LogoResponsiveLength = {
  base?: string
  sm?: string
  md?: string
  lg?: string
  xl?: string
}

const DEFAULT_BRAND_FILL = getThemePaletteVar(
  'semanticTone.accent.button.rest.background',
)
const DEFAULT_SUBTITLE_FILL = getCurrentThemePaletteVar('text.subtle')

export interface SiteLogo {
  brand?: string
  letterColors?: string
  subtitleLetterColors?: string
  colors?: string[]
  logoBackground?: number
  logoForeground?: number
  brandLetters?: LogoLetter[]
  subtitle?: string
  subtitleLetters?: LogoLetter[]
  glyphStyle?: Record<string, string>
  layoutStyle?: Record<string, string>
  brandSize?: string
  brandSizeSm?: string
  brandSizeMd?: string
  brandSizeLg?: string
  brandSizeXl?: string
  subtitleSize?: string
  subtitleSizeSm?: string
  subtitleSizeMd?: string
  subtitleSizeLg?: string
  subtitleSizeXl?: string
  iconSize?: string
  iconSizeSm?: string
  iconSizeMd?: string
  iconSizeLg?: string
  iconSizeXl?: string
  subtitleInset?: string
  subtitleInsetSm?: string
  subtitleInsetMd?: string
  subtitleInsetLg?: string
  subtitleInsetXl?: string
  href?: string
  icon?: string
  ariaLabel?: string
}

function resolveSiteLogo(props: SiteLogo): SiteLogo {
  const brand = props.brand
  const letterColors = props.letterColors
  const subtitleLetterColors = props.subtitleLetterColors
  const colors = normalizeLogoColors(props.colors)
  const logoBackground = props.logoBackground
  const logoForeground = props.logoForeground
  const brandLetters = buildBrandLetters(brand, letterColors, colors)
  const subtitle = props.subtitle
  const subtitleLetters = buildLogoLetters(
    subtitle,
    subtitleLetterColors,
    colors,
    DEFAULT_SUBTITLE_FILL,
  )
  const glyphStyle = resolveGlyphStyle(colors, logoBackground, logoForeground)
  const layoutStyle = resolveLogoLayoutStyle(props)
  const href = props.href
  const icon = props.icon
  const ariaLabel = props.ariaLabel

  return {
    brand,
    letterColors,
    subtitleLetterColors,
    colors,
    logoBackground,
    logoForeground,
    brandLetters,
    subtitle,
    subtitleLetters,
    glyphStyle,
    layoutStyle,
    brandSize: props.brandSize,
    brandSizeSm: props.brandSizeSm,
    brandSizeMd: props.brandSizeMd,
    brandSizeLg: props.brandSizeLg,
    brandSizeXl: props.brandSizeXl,
    subtitleSize: props.subtitleSize,
    subtitleSizeSm: props.subtitleSizeSm,
    subtitleSizeMd: props.subtitleSizeMd,
    subtitleSizeLg: props.subtitleSizeLg,
    subtitleSizeXl: props.subtitleSizeXl,
    iconSize: props.iconSize,
    iconSizeSm: props.iconSizeSm,
    iconSizeMd: props.iconSizeMd,
    iconSizeLg: props.iconSizeLg,
    iconSizeXl: props.iconSizeXl,
    subtitleInset: props.subtitleInset,
    subtitleInsetSm: props.subtitleInsetSm,
    subtitleInsetMd: props.subtitleInsetMd,
    subtitleInsetLg: props.subtitleInsetLg,
    subtitleInsetXl: props.subtitleInsetXl,
    href,
    icon,
    ariaLabel,
  }
}

function normalizeLogoColors(colors: string[] | undefined) {
  return colors?.map((color) => normalizeThemeVariableReference(color))
}

function buildBrandLetters(
  brand: string | undefined,
  letterColors: string | undefined,
  colors: string[] | undefined,
): LogoLetter[] | undefined {
  return buildLogoLetters(brand, letterColors, colors, DEFAULT_BRAND_FILL)
}

function buildLogoLetters(
  text: string | undefined,
  letterColors: string | undefined,
  colors: string[] | undefined,
  defaultFill: string,
): LogoLetter[] | undefined {
  const letters: LogoLetter[] = []
  let colorCursor = 0

  if (text) {
    for (const character of [...text]) {
      if (character === ' ') {
        letters.push({
          value: '\u00A0',
          isSpace: true,
        })
        continue
      }
      letters.push({
        value: character,
        style: resolveBrandLetterStyle(
          letterColors,
          colors,
          colorCursor,
          defaultFill,
        ),
      })
      colorCursor += 1
    }
  }

  return letters.length > 0 ? letters : undefined
}

function resolveBrandLetterStyle(
  letterColors: string | undefined,
  colors: string[] | undefined,
  letterIndex: number,
  defaultFill: string,
): Record<string, string> | undefined {
  if (!letterColors) {
    return {
      backgroundImage: defaultFill,
      backgroundColor: defaultFill,
    }
  }
  const colorIndexLiteral =
    letterColors?.[letterIndex] ??
    (letterColors && letterColors.length > 0
      ? letterColors[letterColors.length - 1]
      : undefined)
  if (colorIndexLiteral === undefined) return undefined
  const colorIndex = Number.parseInt(colorIndexLiteral, 10)
  if (Number.isNaN(colorIndex) || colorIndex < 0) return undefined
  const color = colors?.[colorIndex]
  if (!color) {
    return {
      backgroundImage: defaultFill,
      backgroundColor: defaultFill,
    }
  }
  return {
    backgroundImage: color,
    backgroundColor: color,
  }
}

function resolveGlyphStyle(
  colors: string[] | undefined,
  logoBackground: number | undefined,
  logoForeground: number | undefined,
): Record<string, string> | undefined {
  const style: Record<string, string> = {}
  const background = resolveIndexedLogoColor(colors, logoBackground)
  const foreground = resolveIndexedLogoColor(colors, logoForeground)

  if (background) {
    style['--ps-logo-glyph-background'] = background
  }

  if (foreground) {
    style['--ps-logo-glyph-foreground'] = foreground
  }

  return Object.keys(style).length > 0 ? style : undefined
}

function resolveIndexedLogoColor(
  colors: string[] | undefined,
  colorIndex: number | undefined,
): string | undefined {
  if (colorIndex === undefined) return undefined
  if (!Number.isInteger(colorIndex) || colorIndex < 0) return undefined
  return colors?.[colorIndex]
}

function resolveLogoLayoutStyle(
  props: SiteLogo,
): Record<string, string> | undefined {
  const style: Record<string, string> = {}

  assignResponsiveLengthVars(
    style,
    '--ps-logo-brand-size',
    resolveResponsiveLogoLength({
      base: props.brandSize,
      sm: props.brandSizeSm,
      md: props.brandSizeMd,
      lg: props.brandSizeLg,
      xl: props.brandSizeXl,
    }),
  )
  assignResponsiveLengthVars(
    style,
    '--ps-logo-subtitle-size',
    resolveResponsiveLogoLength({
      base: props.subtitleSize,
      sm: props.subtitleSizeSm,
      md: props.subtitleSizeMd,
      lg: props.subtitleSizeLg,
      xl: props.subtitleSizeXl,
    }),
  )
  assignResponsiveLengthVars(
    style,
    '--ps-logo-icon-size',
    resolveResponsiveLogoLength({
      base: props.iconSize,
      sm: props.iconSizeSm,
      md: props.iconSizeMd,
      lg: props.iconSizeLg,
      xl: props.iconSizeXl,
    }),
  )
  assignResponsiveLengthVars(
    style,
    '--ps-logo-subtitle-inset',
    resolveResponsiveLogoLength({
      base: props.subtitleInset,
      sm: props.subtitleInsetSm,
      md: props.subtitleInsetMd,
      lg: props.subtitleInsetLg,
      xl: props.subtitleInsetXl,
    }),
  )

  return Object.keys(style).length > 0 ? style : undefined
}

function resolveResponsiveLogoLength(
  value: LogoResponsiveLength,
): LogoResponsiveLength | undefined {
  const base = resolveOptionalCssLength(value.base)
  const sm = resolveOptionalCssLength(value.sm) ?? base
  const md = resolveOptionalCssLength(value.md) ?? sm
  const lg = resolveOptionalCssLength(value.lg) ?? md
  const xl = resolveOptionalCssLength(value.xl) ?? lg

  if (!base && !sm && !md && !lg && !xl) return undefined

  return { base, sm, md, lg, xl }
}

function resolveOptionalCssLength(
  value: string | undefined,
): string | undefined {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : undefined
}

function assignResponsiveLengthVars(
  style: Record<string, string>,
  variableName: string,
  value: LogoResponsiveLength | undefined,
) {
  if (!value) return
  if (value.base) style[variableName] = value.base
  if (value.sm) style[`${variableName}-sm`] = value.sm
  if (value.md) style[`${variableName}-md`] = value.md
  if (value.lg) style[`${variableName}-lg`] = value.lg
  if (value.xl) style[`${variableName}-xl`] = value.xl
}

function defineSiteLogoComponent() {
  return defineComponent<SiteLogo>(logoTemplate, {
    props: [
      'brand',
      'letterColors',
      'subtitleLetterColors',
      'colors',
      'logoBackground',
      'logoForeground',
      'brandSize',
      'brandSizeSm',
      'brandSizeMd',
      'brandSizeLg',
      'brandSizeXl',
      'subtitleSize',
      'subtitleSizeSm',
      'subtitleSizeMd',
      'subtitleSizeLg',
      'subtitleSizeXl',
      'iconSize',
      'iconSizeSm',
      'iconSizeMd',
      'iconSizeLg',
      'iconSizeXl',
      'subtitleInset',
      'subtitleInsetSm',
      'subtitleInsetMd',
      'subtitleInsetLg',
      'subtitleInsetXl',
      'subtitle',
      'href',
      'icon',
      'ariaLabel',
    ],
    context: (head) => resolveSiteLogo(flatten(head.props)),
  })
}

export function defineLogoComponents() {
  return {
    siteLogo: defineSiteLogoComponent(),
  }
}
