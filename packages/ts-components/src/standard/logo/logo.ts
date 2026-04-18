import { defineComponent, html } from 'regor'

const logoTemplate = html`<div class="site-logo">
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

const DEFAULT_BRAND_FILL =
  'var(--ps-semantic-tone-accent-button-rest-background)'
const DEFAULT_SUBTITLE_FILL = 'var(--ps-current-text-subtle)'

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
  href?: string
  icon?: string
  ariaLabel?: string
}

function resolveSiteLogo(props: SiteLogo): SiteLogo {
  const brand = props.brand
  const letterColors = props.letterColors
  const subtitleLetterColors = props.subtitleLetterColors
  const colors = props.colors
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
    href,
    icon,
    ariaLabel,
  }
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

function defineSiteLogoComponent() {
  return defineComponent<SiteLogo>(logoTemplate, {
    props: [
      'brand',
      'letterColors',
      'subtitleLetterColors',
      'colors',
      'logoBackground',
      'logoForeground',
      'subtitle',
      'href',
      'icon',
      'ariaLabel',
    ],
    context: (head) => resolveSiteLogo(head.props),
  })
}

export function defineLogoComponents() {
  return {
    siteLogo: defineSiteLogoComponent(),
  }
}
