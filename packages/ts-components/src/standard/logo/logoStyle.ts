import type { ThemePalette } from '@purestack/ts-style'
import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerLogoStyles() {
  themes.forEach((theme, palette, options) => {
    registerLogoShellStyles(theme, palette, options)
    registerLogoTextStyles(theme, palette, options)
    registerLogoInteractiveStyles(theme, palette)
  })
}

export function registerLogoShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder.select('.site-logo', theme).display('inline-block')

  styleBuilder
    .select('.site-logo__link', theme)
    .display('inline-flex')
    .alignItems('center')
    .gap('6px')
    .padding('10px 14px')
    .borderRadius(options.radii.pill)
    .border(`1px solid ${palette.semanticTone.neutral.border.subtle}`)
    .textDecoration('none')
    .position('relative')
    .overflow('hidden')
    .background(palette.semanticTone.neutral.background.surface)
    .boxShadow(palette.effect.panelShadow)

  styleBuilder
    .select('.site-logo__link::before', theme)
    .content('""')
    .position('absolute')
    .inset('0')
    .opacity('0.48')
    .pointerEvents('none')
    .background(
      `linear-gradient(135deg, ${palette.semanticTone.accent.icon.gradient} 0%, ${palette.semanticTone.neutral.background.surface} 70%)`,
    )

  styleBuilder
    .select('.site-logo__glyph', theme)
    .width('36px')
    .height('36px')
    .borderRadius(options.radii.md)
    .display('inline-block')
    .position('relative')
    .zIndex('1')
    .background(palette.semanticTone.accent.button.hover.background)
    .border(`1px solid ${palette.semanticTone.accent.icon.ring}`)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.site-logo__glyph--default::before', theme)
    .content('""')
    .position('absolute')
    .inset('9px 10px')
    .borderRadius('4px')
    .background(palette.semanticTone.accent.icon.color)

  styleBuilder
    .select('.site-logo__glyph--custom', theme)
    .display('grid')
    .placeItems('center')
    .overflow('hidden')

  styleBuilder
    .select('.site-logo__glyph--custom svg', theme)
    .width('70%')
    .height('70%')
    .display('block')
    .color(palette.semanticTone.accent.icon.color)
}

export function registerLogoTextStyles(
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
    .color(palette.semanticTone.accent.button.hover.text)

  styleBuilder
    .select('.site-logo__word--accent', theme)
    .display('inline-block')
    .background(palette.semanticTone.accent.button.hover.background)
    .webkitBackgroundClip('text')
    .backgroundClip('text')
    .color('transparent')
    .webkitTextFillColor('transparent')

  styleBuilder
    .select('.site-logo__subtitle', theme)
    .display('block')
    .width('100%')
    .fontSize('7.8px')
    .lineHeight('1.2')
    .fontWeight('700')
    .letterSpacing('0.08em')
    .textTransform('uppercase')
    .color(palette.semanticTone.accent.button.hover.text)
    .whiteSpace('nowrap')
}

export function registerLogoInteractiveStyles(
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
    .borderColor(palette.semanticTone.accent.border.default)
    .boxShadow(palette.effect.accentShadow)

  styleBuilder
    .select('.site-logo__link[href]:focus-visible', theme)
    .outline(`2px solid ${palette.semanticTone.neutral.border.focus}`)
    .outlineOffset('0')
}

export function normalizeWord(
  value: string | undefined,
  fallback: string,
): string {
  const trimmed = normalizeOptionalText(value)
  return trimmed.length > 0 ? trimmed : fallback
}

export function normalizeOptionalText(value: string | undefined): string {
  if (typeof value !== 'string') return ''
  return value.trim()
}

export function normalizeCssSize(value: string | undefined): string {
  const normalized = normalizeOptionalText(value)
  if (normalized.length === 0) return ''
  if (/[;{}]/.test(normalized)) return ''
  return normalized
}

export function buildFontSizeStyle(fontSize: string): Record<string, string> {
  if (!fontSize) return {}
  return { fontSize }
}

export function buildSubtitleStyle(
  fontSize: string,
  subtitleAlign: 'start' | 'center' | 'end' | 'justify',
): Record<string, string> {
  const style: Record<string, string> = {
    textAlign: subtitleAlign,
  }
  if (fontSize) style.fontSize = fontSize
  return style
}

export function buildGlyphSizeStyle(size: string): Record<string, string> {
  if (!size) return {}
  return { width: size, height: size }
}

export function normalizeSubtitleAlign(
  value: 'start' | 'center' | 'end' | 'justify' | undefined,
): 'start' | 'center' | 'end' | 'justify' {
  if (value === 'center' || value === 'end' || value === 'justify') return value
  return 'start'
}
