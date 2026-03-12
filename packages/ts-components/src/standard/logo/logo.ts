import { defineComponent, html } from 'regor'

import { registerLogoStyles } from './logoStyle'

const logoTemplate = html`<div class="site-logo">
  <a class="site-logo__link" :href="href" :aria-label="ariaLabel">
    <span
      class="site-logo__glyph site-logo__glyph--custom"
      :style="glyphStyle"
      aria-hidden="true"
      r-if="hasIconSvg"
      r-html="iconSvg"
    ></span>
    <span class="site-logo__glyph site-logo__glyph--default" :style="glyphStyle" aria-hidden="true" r-else></span>
    <span class="site-logo__stack">
      <span class="site-logo__brand">
        <span class="site-logo__word site-logo__word--primary" :style="wordStyle">{{ wordOne }}</span>
        <span class="site-logo__word site-logo__word--accent" :style="wordStyle">{{ wordTwo }}</span>
      </span>
      <span class="site-logo__subtitle" :style="subtitleStyle" r-if="hasSubtitle">{{ subtitle }}</span>
    </span>
  </a>
</div>`

export interface SiteLogo {
  wordOne?: string
  wordTwo?: string
  subtitle?: string
  subtitleAlign?: 'start' | 'center' | 'end' | 'justify'
  href?: string
  iconSvg?: string
  iconSize?: string
  wordFontSize?: string
  subtitleFontSize?: string
  ariaLabel?: string
  glyphStyle?: Record<string, string>
  wordStyle?: Record<string, string>
  subtitleStyle?: Record<string, string>
  hasIconSvg?: boolean
  hasSubtitle?: boolean
}

function resolveSiteLogo(props: SiteLogo): SiteLogo {
  const wordOne = normalizeWord(props.wordOne, 'Pure')
  const wordTwo = normalizeWord(props.wordTwo, 'Stack')
  const subtitle = normalizeOptionalText(props.subtitle)
  const subtitleAlign = normalizeSubtitleAlign(props.subtitleAlign)
  const href = normalizeOptionalText(props.href) || '/'
  const iconSvg = normalizeOptionalText(props.iconSvg)
  const iconSize = normalizeCssSize(props.iconSize)
  const wordFontSize = normalizeCssSize(props.wordFontSize)
  const subtitleFontSize = normalizeCssSize(props.subtitleFontSize)
  const hasSubtitle = subtitle.length > 0
  const hasIconSvg = iconSvg.length > 0
  const ariaLabel = hasSubtitle
    ? `${wordOne} ${wordTwo}: ${subtitle}`
    : `${wordOne} ${wordTwo}`
  const glyphStyle = buildGlyphSizeStyle(iconSize)
  const wordStyle = buildFontSizeStyle(wordFontSize)
  const subtitleStyle = buildSubtitleStyle(subtitleFontSize, subtitleAlign)
  return {
    wordOne,
    wordTwo,
    subtitle,
    href,
    iconSvg,
    ariaLabel,
    glyphStyle,
    wordStyle,
    subtitleStyle,
    hasIconSvg,
    hasSubtitle,
  }
}

function normalizeWord(value: string | undefined, fallback: string): string {
  const trimmed = normalizeOptionalText(value)
  return trimmed.length > 0 ? trimmed : fallback
}

function normalizeOptionalText(value: string | undefined): string {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function normalizeCssSize(value: string | undefined): string {
  const normalized = normalizeOptionalText(value)
  if (normalized.length === 0) return ''
  if (/[;{}]/.test(normalized)) return ''
  return normalized
}

function buildFontSizeStyle(fontSize: string): Record<string, string> {
  if (!fontSize) return {}
  return { fontSize }
}

function buildSubtitleStyle(
  fontSize: string,
  subtitleAlign: 'start' | 'center' | 'end' | 'justify',
): Record<string, string> {
  const style: Record<string, string> = {
    textAlign: subtitleAlign,
  }
  if (fontSize) style.fontSize = fontSize
  return style
}

function buildGlyphSizeStyle(size: string): Record<string, string> {
  if (!size) return {}
  return { width: size, height: size }
}

function normalizeSubtitleAlign(
  value: 'start' | 'center' | 'end' | 'justify' | undefined,
): 'start' | 'center' | 'end' | 'justify' {
  if (value === 'center' || value === 'end' || value === 'justify') return value
  return 'start'
}

function createSiteLogoComponent() {
  return defineComponent<SiteLogo>(logoTemplate, {
    props: [
      'wordOne',
      'wordTwo',
      'subtitle',
      'subtitleAlign',
      'href',
      'iconSvg',
      'iconSize',
      'wordFontSize',
      'subtitleFontSize',
    ],
    context: (head) => resolveSiteLogo(head.props),
  })
}

export function createLogoComponents() {
  registerLogoStyles()
  return { siteLogo: createSiteLogoComponent() }
}
