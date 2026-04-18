import { defineComponent, html } from 'regor'

const logoTemplate = html`<div class="site-logo">
  <a class="site-logo__link" :href="href ?? '/'" :aria-label="ariaLabel">
    <span class="site-logo__glyph" aria-hidden="true">
      <Icon class="site-logo__icon" :name="icon" r-if="icon"/>
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

export interface SiteLogo {
  brand?: string
  letterColors?: string
  subtitleLetterColors?: string
  colors?: string[]
  brandLetters?: LogoLetter[]
  subtitle?: string
  subtitleLetters?: LogoLetter[]
  href?: string
  icon?: string
  ariaLabel?: string
}

function resolveSiteLogo(props: SiteLogo): SiteLogo {
  const brand = props.brand
  const letterColors = props.letterColors
  const subtitleLetterColors = props.subtitleLetterColors
  const colors = props.colors
  const brandLetters = buildBrandLetters(brand, letterColors, colors)
  const subtitle = props.subtitle
  const subtitleLetters = buildLogoLetters(
    subtitle,
    subtitleLetterColors,
    colors,
  )
  const href = props.href
  const icon = props.icon
  const ariaLabel = props.ariaLabel

  return {
    brand,
    letterColors,
    subtitleLetterColors,
    colors,
    brandLetters,
    subtitle,
    subtitleLetters,
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
  return buildLogoLetters(brand, letterColors, colors)
}

function buildLogoLetters(
  text: string | undefined,
  letterColors: string | undefined,
  colors: string[] | undefined,
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
        style: resolveBrandLetterStyle(letterColors, colors, colorCursor),
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
): Record<string, string> | undefined {
  const colorIndexLiteral =
    letterColors?.[letterIndex] ??
    (letterColors && letterColors.length > 0
      ? letterColors[letterColors.length - 1]
      : undefined)
  if (colorIndexLiteral === undefined) return undefined
  const colorIndex = Number.parseInt(colorIndexLiteral, 10)
  if (Number.isNaN(colorIndex) || colorIndex < 0) return undefined
  const color = colors?.[colorIndex]
  if (!color) return undefined
  return {
    backgroundImage: color,
    backgroundColor: color,
  }
}

function defineSiteLogoComponent() {
  return defineComponent<SiteLogo>(logoTemplate, {
    props: [
      'brand',
      'letterColors',
      'subtitleLetterColors',
      'colors',
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
