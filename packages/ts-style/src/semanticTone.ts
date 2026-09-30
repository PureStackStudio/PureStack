import type { Style } from '@purestack/ts-css'
import { createPresets } from './semanticPresets'
import { styleBuilder, THEME_ROOT_SELECTOR } from './styles'
import { themes } from './themeOptions'
import type { SemanticToneTokens, ThemePalette } from './themePalette'
import {
  getCurrentThemePalette,
  listCurrentThemePaletteVarEntries,
} from './themePaletteVars'

export type SemanticTone =
  | 'neutral'
  | 'accent'
  | 'feature'
  | 'secondary'
  | 'custom'
  | 'ghost'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'

export const SEMANTIC_TONES: SemanticTone[] = [
  'neutral',
  'accent',
  'feature',
  'secondary',
  'custom',
  'ghost',
  'info',
  'success',
  'warning',
  'danger',
]

export function pickSemanticTone(
  ...values: Array<unknown>
): SemanticTone | undefined {
  for (const value of values) {
    if (typeof value !== 'string') continue
    const normalized = value.toLowerCase()
    if (isSemanticTone(normalized)) return normalized
  }
  return undefined
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

function applySemanticToneVars(style: Style, tokens: SemanticToneTokens) {
  return applyCurrentPaletteVars(style, createCurrentPalette(tokens))
}

export function getSemanticToneClass(
  tone: SemanticTone | undefined,
  fallback?: SemanticTone,
) {
  tone = pickSemanticTone(tone)
  if (!tone) return fallback ?? ''
  return `tone--${tone}`
}

export function registerSemanticToneUtilityStyles() {
  const current = getCurrentThemePalette()

  themes.forEach((theme, palette) => {
    const root = getSemanticToneTokens(palette, 'neutral')
    applyCurrentPaletteVars(
      styleBuilder.select(THEME_ROOT_SELECTOR, theme),
      createCurrentPalette(root, true),
    )
    // A nested theme--* region must not inherit text color or form control
    // rendering from the surrounding mode.
    styleBuilder
      .select(':where(:scope:not(:root))', theme)
      .color(palette.current.text.default)
      .set('color-scheme', theme)

    for (const tone of SEMANTIC_TONES) {
      const tokens = getSemanticToneTokens(palette, tone)
      applySemanticToneVars(
        styleBuilder.select(`.${getSemanticToneClass(tone)}`, theme),
        tokens,
      )
    }

    createPresets(styleBuilder, current, theme)
  })
}

function applyCurrentPaletteVars(
  style: Style,
  current: ThemePalette['current'],
) {
  for (const entry of listCurrentThemePaletteVarEntries(current)) {
    style.set(entry.name, entry.value)
  }
  return style
}

function createCurrentPalette(
  tokens: SemanticToneTokens,
  useRootAliases = false,
): ThemePalette['current'] {
  const text = useRootAliases ? tokens.root.text : tokens.text
  const border = useRootAliases ? tokens.root.border : tokens.border

  return {
    tone: tokens.tone,
    canvas: tokens.canvas,
    canvascolor: tokens.canvascolor,
    overlay: tokens.overlay,
    surface: {
      rest: { ...tokens.surface.rest },
      hover: { ...tokens.surface.hover },
      active: { ...tokens.surface.active },
      disabled: { ...tokens.surface.disabled },
      focusRing: tokens.surface.focusRing,
    },
    surfaceAlt: {
      rest: { ...tokens.surfaceAlt.rest },
      hover: { ...tokens.surfaceAlt.hover },
      active: { ...tokens.surfaceAlt.active },
      disabled: { ...tokens.surfaceAlt.disabled },
      focusRing: tokens.surfaceAlt.focusRing,
    },
    text: {
      default: text.default,
      subtle: text.subtle,
    },
    border: {
      subtle: border.subtle,
      default: border.default,
      focus: border.focus,
    },
    button: {
      rest: { ...tokens.button.rest },
      hover: { ...tokens.button.hover },
      active: { ...tokens.button.active },
      disabled: { ...tokens.button.disabled },
      focusRing: tokens.button.focusRing,
    },
  }
}
