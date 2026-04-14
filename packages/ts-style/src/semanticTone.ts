import { styleBuilder } from './styles'
import { themes } from './themeOptions'
import type { SemanticToneTokens, ThemePalette } from './themePalette'

export type SemanticTone =
  | 'neutral'
  | 'accent'
  | 'ghost'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'

const SEMANTIC_TONES: SemanticTone[] = [
  'neutral',
  'accent',
  'ghost',
  'info',
  'success',
  'warning',
  'danger',
]

export function resolveSemanticTone(
  value: string | undefined,
  fallback: SemanticTone = 'neutral',
): SemanticTone {
  const normalized = value?.toLowerCase() || ''
  return isSemanticTone(normalized) ? normalized : fallback
}

export function isSemanticTone(value: string): value is SemanticTone {
  return SEMANTIC_TONES.includes(value as SemanticTone)
}

export function getSemanticToneTokens(
  palette: ThemePalette,
  tone: SemanticTone,
): SemanticToneTokens {
  return palette.semanticTone[tone]
}

export function getSemanticToneSurfaceClass(tone: SemanticTone) {
  if (!tone) tone = 'neutral'
  return `tone-surface--${tone}`
}

export function getSemanticToneSurfaceAltClass(tone: SemanticTone) {
  if (!tone) tone = 'neutral'
  return `tone-surface-alt--${tone}`
}

export function getSemanticToneButtonClass(tone: SemanticTone) {
  if (!tone) tone = 'neutral'
  return `tone-button--${tone}`
}

export function getSemanticToneIconClass(tone: SemanticTone) {
  if (!tone) tone = 'neutral'
  return `tone-icon--${tone}`
}

export function getSemanticToneBorderClass(tone: SemanticTone) {
  if (!tone) tone = 'neutral'
  return `tone-border--${tone}`
}

export function getSemanticToneTextClass(tone: SemanticTone) {
  if (!tone) tone = 'neutral'
  return `tone-text--${tone}`
}

export function registerSemanticToneUtilityStyles() {
  themes.forEach((theme, palette) => {
    for (const tone of SEMANTIC_TONES) {
      const tokens = getSemanticToneTokens(palette, tone)

      styleBuilder
        .select(`.${getSemanticToneSurfaceClass(tone)}`, theme)
        .background(tokens.surface.rest.background)
        .borderColor(tokens.surface.rest.border)
        .color(tokens.surface.rest.text)

      styleBuilder
        .select(`.${getSemanticToneSurfaceAltClass(tone)}`, theme)
        .background(tokens.surfaceAlt.rest.background)
        .borderColor(tokens.surfaceAlt.rest.border)
        .color(tokens.surfaceAlt.rest.text)

      styleBuilder
        .select(`.${getSemanticToneButtonClass(tone)}`, theme)
        .background(tokens.button.rest.background)
        .borderColor(tokens.button.rest.border)
        .color(tokens.button.rest.text)

      styleBuilder
        .select(`.${getSemanticToneButtonClass(tone)}:hover`, theme)
        .background(tokens.button.hover.background)
        .borderColor(tokens.button.hover.border)
        .color(tokens.button.hover.text)

      styleBuilder
        .select(`.${getSemanticToneButtonClass(tone)}:active`, theme)
        .background(tokens.button.active.background)
        .borderColor(tokens.button.active.border)
        .color(tokens.button.active.text)

      styleBuilder
        .select(`.${getSemanticToneButtonClass(tone)}:disabled`, theme)
        .background(tokens.button.disabled.background)
        .borderColor(tokens.button.disabled.border)
        .color(tokens.button.disabled.text)

      styleBuilder
        .select(`.${getSemanticToneButtonClass(tone)}:focus-visible`, theme)
        .outline('none')
        .boxShadow(`0 0 0 2px ${tokens.button.focusRing}`)

      styleBuilder
        .select(`.${getSemanticToneBorderClass(tone)}`, theme)
        .borderColor(tokens.border.default)

      styleBuilder
        .select(`.${getSemanticToneTextClass(tone)}`, theme)
        .color(tokens.text.default)

      styleBuilder
        .select(`.${getSemanticToneIconClass(tone)}`, theme)
        .background(tokens.icon.gradient)
        .backgroundColor(tokens.icon.background)
        .borderColor(tokens.icon.border)
        .color(tokens.icon.color)
    }
  })
}
