import type { Style } from '@purestack/ts-css'
import { createPresets } from './semanticPresets'
import { styleBuilder } from './styles'
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
      styleBuilder.select(':root', theme),
      createCurrentPalette(root, true),
    )

    for (const tone of SEMANTIC_TONES) {
      const tokens = getSemanticToneTokens(palette, tone)
      applySemanticToneVars(
        styleBuilder.select(`.${getSemanticToneClass(tone)}`, theme),
        tokens,
      )
    }

    styleBuilder
      .select('.tone-surface, .tone-surface-interactive', theme)
      .background(current.surface.rest.background)
      .borderColor(current.surface.rest.border)
      .color(current.surface.rest.text)
      .backgroundSize('calc(100% + 10px) calc(100% + 10px)')
      .backgroundPosition('center')

    styleBuilder
      .select('.tone-surface-interactive:hover', theme)
      .backgroundImage(current.surface.hover.background)
      .borderColor(current.surface.hover.border)
      .color(current.surface.hover.text)

    styleBuilder
      .select(
        '.tone-surface-interactive:active, .tone-surface-interactive.active',
        theme,
      )
      .backgroundImage(current.surface.active.background)
      .borderColor(current.surface.active.border)
      .color(current.surface.active.text)

    styleBuilder
      .select('.tone-surface-interactive:disabled', theme)
      .backgroundImage(current.surface.disabled.background)
      .borderColor(current.surface.disabled.border)
      .color(current.surface.disabled.text)

    styleBuilder
      .select('.tone-surface-interactive:focus-visible', theme)
      .outline('none')
      .boxShadow(`0 0 0 2px ${current.surface.focusRing}`)

    styleBuilder
      .select('.tone-surface-alt, .tone-surface-alt-interactive', theme)
      .background(current.surfaceAlt.rest.background)
      .borderColor(current.surfaceAlt.rest.border)
      .color(current.surfaceAlt.rest.text)
      .backgroundSize('calc(100% + 10px) calc(100% + 10px)')
      .backgroundPosition('center')

    styleBuilder
      .select('.tone-surface-alt-interactive:hover', theme)
      .backgroundImage(current.surfaceAlt.hover.background)
      .borderColor(current.surfaceAlt.hover.border)
      .color(current.surfaceAlt.hover.text)

    styleBuilder
      .select(
        '.tone-surface-alt-interactive:active, .tone-surface-alt-interactive.active',
        theme,
      )
      .backgroundImage(current.surfaceAlt.active.background)
      .borderColor(current.surfaceAlt.active.border)
      .color(current.surfaceAlt.active.text)

    styleBuilder
      .select('.tone-surface-alt-interactive:disabled', theme)
      .backgroundImage(current.surfaceAlt.disabled.background)
      .borderColor(current.surfaceAlt.disabled.border)
      .color(current.surfaceAlt.disabled.text)

    styleBuilder
      .select('.tone-surface-alt-interactive:focus-visible', theme)
      .outline('none')
      .boxShadow(`0 0 0 2px ${current.surfaceAlt.focusRing}`)

    styleBuilder
      .select('.tone-button, .tone-button-interactive', theme)
      .background(current.button.rest.background)
      .borderColor(current.button.rest.border)
      .color(current.button.rest.text)
      .backgroundSize('calc(100% + 10px) calc(100% + 10px)')
      .backgroundPosition('center')

    styleBuilder
      .select('.tone-interactive', theme)
      .color(current.button.rest.text)
      .backgroundSize('calc(100% + 10px) calc(100% + 10px)')
      .backgroundPosition('center')

    styleBuilder
      .select('.tone-button-interactive:hover, .tone-interactive:hover', theme)
      .backgroundImage(current.button.hover.background)
      .borderColor(current.button.hover.border)
      .color(current.button.hover.text)

    styleBuilder
      .select(
        '.tone-button-interactive:active, .tone-button-interactive.active, .tone-interactive:active, .tone-interactive.active',
        theme,
      )
      .backgroundImage(current.button.active.background)
      .borderColor(current.button.active.border)
      .color(current.button.active.text)

    styleBuilder
      .select(
        '.tone-button-interactive[aria-selected="true"], .tone-button-interactive[aria-pressed="true"], .tone-button-interactive[aria-current="true"], .tone-button-interactive.is-active',
        theme,
      )
      .backgroundImage(current.button.active.background)
      .borderColor(current.button.active.border)
      .color(current.button.active.text)

    styleBuilder
      .select(
        '.tone-button-interactive:disabled, .tone-interactive:disabled',
        theme,
      )
      .backgroundImage(current.button.disabled.background)
      .borderColor(current.button.disabled.border)
      .color(current.button.disabled.text)

    styleBuilder
      .select(
        '.tone-button-interactive:focus-visible, .tone-interactive:focus-visible',
        theme,
      )
      .outline('none')
      .boxShadow(`0 0 0 2px ${current.button.focusRing}`)

    styleBuilder
      .select('.tone-icon', theme)
      .background(current.icon.gradient)
      .backgroundColor(current.icon.background)
      .borderColor(current.icon.border)
      .color(current.icon.color)

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
    icon: {
      background: tokens.icon.background,
      gradient: tokens.icon.gradient,
      color: tokens.icon.color,
      border: tokens.icon.border,
    },
  }
}
