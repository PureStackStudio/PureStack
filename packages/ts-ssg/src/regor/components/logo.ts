import { createComponent, html } from 'regor'

import { styleBuilder } from '../../style/styles'
import type { ThemeMode, ThemeOptions } from '../../style/themeOptions'
import { themes } from '../../style/themeOptions'
import type { ThemePalette } from '../../style/themePalette'

const logoTemplate = html`<div class="site-logo">
  <a class="site-logo__link" :href="href" :aria-label="ariaLabel">
    <span
      class="site-logo__glyph site-logo__glyph--custom"
      aria-hidden="true"
      r-if="hasIconSvg"
      r-html="iconSvg"
    ></span>
    <span class="site-logo__glyph site-logo__glyph--default" aria-hidden="true" r-else></span>
    <span class="site-logo__stack">
      <span class="site-logo__brand">
        <span class="site-logo__word site-logo__word--primary" :style="wordStyle">{{ wordOne }}</span>
        <span class="site-logo__word site-logo__word--accent" :style="wordStyle">{{ wordTwo }}</span>
      </span>
      <span class="site-logo__subtitle" :style="subtitleStyle" r-if="hasSubtitle">{{ subtitle }}</span>
    </span>
  </a>
</div>`

interface SiteLogoProps {
  wordOne?: string
  wordTwo?: string
  subtitle?: string
  href?: string
  iconSvg?: string
  wordFontSize?: string
  subtitleFontSize?: string
}

interface SiteLogoContext {
  wordOne: string
  wordTwo: string
  subtitle: string
  href: string
  iconSvg: string
  ariaLabel: string
  wordStyle: Record<string, string>
  subtitleStyle: Record<string, string>
  hasIconSvg: boolean
  hasSubtitle: boolean
}

function registerLogoStyles() {
  themes.forEach((theme, palette, options) => {
    registerLogoShellStyles(theme, palette, options)
    registerLogoTextStyles(theme, palette, options)
    registerLogoInteractiveStyles(theme, palette)
    registerLogoResponsiveStyles(theme)
  })
}

function registerLogoShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder.select('.site-logo', theme).display('inline-block')

  styleBuilder
    .select('.site-logo__link', theme)
    .display('inline-flex')
    .alignItems('center')
    .gap('12px')
    .padding('10px 14px')
    .borderRadius(options.radii.pill)
    .border(`1px solid ${palette.border.subtle}`)
    .textDecoration('none')
    .position('relative')
    .overflow('hidden')
    .background(palette.background.panel)
    .boxShadow(palette.effect.panelShadow)

  styleBuilder
    .select('.site-logo__link::before', theme)
    .content('""')
    .position('absolute')
    .inset('0')
    .opacity('0.48')
    .pointerEvents('none')
    .background(
      `linear-gradient(135deg, ${palette.icon.accent.gradient} 0%, ${palette.background.panel} 70%)`,
    )

  styleBuilder
    .select('.site-logo__glyph', theme)
    .width('36px')
    .height('36px')
    .borderRadius(options.radii.md)
    .display('inline-block')
    .position('relative')
    .zIndex('1')
    .background(palette.icon.accent.gradient)
    .border(`1px solid ${palette.icon.accent.ring}`)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.site-logo__glyph--default::before', theme)
    .content('""')
    .position('absolute')
    .inset('9px 10px')
    .borderRadius('4px')
    .background(palette.icon.accent.color)

  styleBuilder
    .select('.site-logo__glyph--custom', theme)
    .display('grid')
    .placeItems('center')
    .color(palette.icon.accent.color)
    .overflow('hidden')

  styleBuilder
    .select('.site-logo__glyph--custom svg', theme)
    .width('70%')
    .height('70%')
    .display('block')
}

function registerLogoTextStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-logo__stack', theme)
    .display('grid')
    .alignItems('center')
    .gap('1px')
    .position('relative')
    .zIndex('1')

  styleBuilder
    .select('.site-logo__brand', theme)
    .display('inline-flex')
    .alignItems('baseline')
    .gap('3px')
    .whiteSpace('nowrap')

  styleBuilder
    .select('.site-logo__word', theme)
    .fontFamily(options.typography.baseFamily)
    .fontSize('15px')
    .lineHeight('1')
    .fontWeight('800')
    .letterSpacing('0.03em')
    .textTransform('uppercase')
    .whiteSpace('nowrap')

  styleBuilder
    .select('.site-logo__word--primary', theme)
    .color(palette.text.default)

  styleBuilder
    .select('.site-logo__word--accent', theme)
    .color(palette.text.accent)

  styleBuilder
    .select('.site-logo__subtitle', theme)
    .fontSize('7.8px')
    .lineHeight('1.2')
    .fontWeight('700')
    .letterSpacing('0.08em')
    .textTransform('uppercase')
    .color(palette.text.subtle)
    .whiteSpace('nowrap')
}

function registerLogoInteractiveStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.site-logo__link[href]', theme)
    .cursor('pointer')
    .transition(
      'transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
    )

  styleBuilder
    .select('.site-logo__link[href]:hover', theme)
    .transform('translateY(-1px)')
    .borderColor(palette.border.accent)
    .boxShadow(palette.effect.accentShadow)

  styleBuilder
    .select('.site-logo__link[href]:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
}

function registerLogoResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.site-logo__link', theme)
    .media('max-width: 640px')
    .padding('9px 12px')
    .gap('10px')

  styleBuilder
    .select('.site-logo__glyph', theme)
    .media('max-width: 640px')
    .width('32px')
    .height('32px')

  styleBuilder
    .select('.site-logo__word', theme)
    .media('max-width: 640px')
    .fontSize('13px')

  styleBuilder
    .select('.site-logo__subtitle', theme)
    .media('max-width: 640px')
    .fontSize('8px')
}

function resolveLogoContext(props: SiteLogoProps): SiteLogoContext {
  const wordOne = normalizeWord(props.wordOne, 'Pure')
  const wordTwo = normalizeWord(props.wordTwo, 'Stack')
  const subtitle = normalizeOptionalText(props.subtitle)
  const href = normalizeOptionalText(props.href) || '/'
  const iconSvg = normalizeOptionalText(props.iconSvg)
  const wordFontSize = normalizeCssSize(props.wordFontSize)
  const subtitleFontSize = normalizeCssSize(props.subtitleFontSize)
  const hasSubtitle = subtitle.length > 0
  const hasIconSvg = iconSvg.length > 0
  const ariaLabel = hasSubtitle
    ? `${wordOne} ${wordTwo}: ${subtitle}`
    : `${wordOne} ${wordTwo}`
  const wordStyle = buildFontSizeStyle(wordFontSize)
  const subtitleStyle = buildFontSizeStyle(subtitleFontSize)
  return {
    wordOne,
    wordTwo,
    subtitle,
    href,
    iconSvg,
    ariaLabel,
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

function createSiteLogoComponent() {
  return createComponent<SiteLogoContext>(logoTemplate, {
    props: [
      'wordOne',
      'wordTwo',
      'subtitle',
      'href',
      'iconSvg',
      'wordFontSize',
      'subtitleFontSize',
    ],
    context: (head) => resolveLogoContext(head.props),
  })
}

export function createLogoComponents() {
  registerLogoStyles()
  return { siteLogo: createSiteLogoComponent() }
}
