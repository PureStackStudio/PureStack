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

export function getSemanticToneSurfaceTextBorderClasses(tone: SemanticTone) {
  if (!tone) tone = 'neutral'
  return `tone-surface--${tone} tone-border--${tone} tone-text--${tone}`
}

export function getSemanticToneSurfaceClass(tone: SemanticTone) {
  if (!tone) tone = 'neutral'
  return `tone-surface--${tone}`
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
        .background(tokens.background.surface)
        .borderColor(tokens.border.default)

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
        .borderColor(tokens.icon.ring)
        .color(tokens.icon.color)
    }
  })
}
