import { styleBuilder } from './styles'
import { themes } from './themeOptions'
import type { ThemePalette } from './themePalette'

export type SemanticTone =
  | 'neutral'
  | 'accent'
  | 'ghost'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'

export interface SemanticToneTokens {
  background: string
  border: string
  text: string
  icon: {
    background: string
    gradient: string
    color: string
    ring: string
  }
}

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
  switch (tone) {
    case 'accent':
      return {
        background: palette.background.accent,
        border: palette.border.accent,
        text: palette.text.accent,
        icon: palette.icon.accent,
      }
    case 'ghost':
      return {
        background: palette.action.ghost.background,
        border: 'transparent',
        text: palette.action.ghost.text,
        icon: palette.icon.subtle,
      }
    case 'info':
      return {
        background: palette.status.info.background,
        border: palette.status.info.border,
        text: palette.status.info.text,
        icon: {
          background: palette.status.info.background,
          gradient: palette.icon.neutral.gradient,
          color: palette.status.info.text,
          ring: palette.status.info.border,
        },
      }
    case 'success':
      return {
        background: palette.status.success.background,
        border: palette.status.success.border,
        text: palette.status.success.text,
        icon: {
          background: palette.status.success.background,
          gradient: palette.icon.neutral.gradient,
          color: palette.status.success.text,
          ring: palette.status.success.border,
        },
      }
    case 'warning':
      return {
        background: palette.status.warning.background,
        border: palette.status.warning.border,
        text: palette.status.warning.text,
        icon: {
          background: palette.status.warning.background,
          gradient: palette.icon.neutral.gradient,
          color: palette.status.warning.text,
          ring: palette.status.warning.border,
        },
      }
    case 'danger':
      return {
        background: palette.status.danger.background,
        border: palette.status.danger.border,
        text: palette.status.danger.text,
        icon: {
          background: palette.status.danger.background,
          gradient: palette.icon.neutral.gradient,
          color: palette.status.danger.text,
          ring: palette.status.danger.border,
        },
      }
    case 'neutral':
    default:
      return {
        background: palette.background.raised,
        border: palette.border.default,
        text: palette.text.default,
        icon: palette.icon.neutral,
      }
  }
}

export function getSemanticToneSurfaceClass(tone: SemanticTone) {
  return `tone-surface--${tone}`
}

export function getSemanticToneIconClass(tone: SemanticTone) {
  return `tone-icon--${tone}`
}

export function getSemanticToneBorderClass(tone: SemanticTone) {
  return `tone-border--${tone}`
}

export function getSemanticToneTextClass(tone: SemanticTone) {
  return `tone-text--${tone}`
}

export function registerSemanticToneUtilityStyles() {
  themes.forEach((theme, palette) => {
    for (const tone of SEMANTIC_TONES) {
      const tokens = getSemanticToneTokens(palette, tone)

      styleBuilder
        .select(`.${getSemanticToneSurfaceClass(tone)}`, theme)
        .background(tokens.background)
        .borderColor(tokens.border)

      styleBuilder
        .select(`.${getSemanticToneBorderClass(tone)}`, theme)
        .borderColor(tokens.border)

      styleBuilder
        .select(`.${getSemanticToneTextClass(tone)}`, theme)
        .color(tokens.text)

      styleBuilder
        .select(`.${getSemanticToneIconClass(tone)}`, theme)
        .background(tokens.icon.gradient)
        .backgroundColor(tokens.icon.background)
        .borderColor(tokens.icon.ring)
        .color(tokens.icon.color)
    }
  })
}
