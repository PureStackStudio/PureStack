import { styleBuilder } from './styles'
import type { ThemeMode } from './themeOptions'
import type { ThemePalette } from './themePalette'

export type SemanticTone =
  | 'neutral'
  | 'accent'
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

export interface SemanticToneStyleSelectors {
  surfaceSelector?: (tone: SemanticTone) => string
  iconSelector?: (tone: SemanticTone) => string
}

const SEMANTIC_TONES: SemanticTone[] = [
  'neutral',
  'accent',
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

export function forEachSemanticTone(iteratee: (tone: SemanticTone) => void) {
  for (const tone of SEMANTIC_TONES) {
    iteratee(tone)
  }
}

export function applySemanticToneStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  selectors: SemanticToneStyleSelectors,
) {
  forEachSemanticTone((tone) => {
    const tokens = getSemanticToneTokens(palette, tone)

    if (selectors.surfaceSelector) {
      styleBuilder
        .select(selectors.surfaceSelector(tone), theme)
        .background(tokens.background)
        .borderColor(tokens.border)
    }

    if (selectors.iconSelector) {
      styleBuilder
        .select(selectors.iconSelector(tone), theme)
        .background(tokens.icon.gradient)
        .backgroundColor(tokens.icon.background)
        .borderColor(tokens.icon.ring)
        .color(tokens.icon.color)
    }
  })
}
