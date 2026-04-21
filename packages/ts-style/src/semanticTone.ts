import type { Style } from '@purestack/ts-css'
import { styleBuilder } from './styles'
import { themes } from './themeOptions'
import type { SemanticToneTokens, ThemePalette } from './themePalette'
import { listCurrentThemePaletteVarEntries } from './themePaletteVars'

export type SemanticTone =
  | 'neutral'
  | 'accent'
  | 'ghost'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'

export const SEMANTIC_TONES: SemanticTone[] = [
  'neutral',
  'accent',
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

export function resolveSemanticTone(
  value: unknown,
  fallback: SemanticTone = 'neutral',
): SemanticTone {
  return pickSemanticTone(value) ?? fallback
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

function getSemanticTonePrefix(isInteractive = false) {
  return isInteractive ? 'tone-interactive-' : 'tone-'
}

export function getSemanticToneInteractiveClass(
  tone: SemanticTone | undefined,
  fallback: SemanticTone = 'neutral',
) {
  return `${getSemanticTonePrefix(true)}-${resolveSemanticTone(tone, fallback)}`
}

export function getSemanticToneSurfaceClass(
  tone: SemanticTone | undefined,
  isInteractive = false,
  fallback: SemanticTone = 'neutral',
) {
  return `${getSemanticTonePrefix(isInteractive)}surface--${resolveSemanticTone(tone, fallback)}`
}

export function getSemanticToneSurfaceAltClass(
  tone: SemanticTone | undefined,
  isInteractive = false,
  fallback: SemanticTone = 'neutral',
) {
  return `${getSemanticTonePrefix(isInteractive)}surface-alt--${resolveSemanticTone(tone, fallback)}`
}

export function getSemanticToneButtonClass(
  tone: SemanticTone | undefined,
  isInteractive = false,
  fallback: SemanticTone = 'neutral',
) {
  return `${getSemanticTonePrefix(isInteractive)}button--${resolveSemanticTone(tone, fallback)}`
}

export function getSemanticToneIconClass(
  tone: SemanticTone | undefined,
  fallback: SemanticTone = 'neutral',
) {
  return `tone-icon--${resolveSemanticTone(tone, fallback)}`
}

export function getSemanticToneBorderClass(
  tone: SemanticTone | undefined,
  fallback: SemanticTone = 'neutral',
) {
  return `tone-border--${resolveSemanticTone(tone, fallback)}`
}

export function getSemanticToneTextClass(
  tone: SemanticTone | undefined,
  fallback: SemanticTone = 'neutral',
) {
  return `tone-text--${resolveSemanticTone(tone, fallback)}`
}

export function registerSemanticToneUtilityStyles() {
  themes.forEach((theme, palette) => {
    const root = getSemanticToneTokens(palette, 'neutral')
    applyCurrentPaletteVars(
      styleBuilder.select(':root', theme),
      createCurrentPalette(root, true),
    )

    for (const tone of SEMANTIC_TONES) {
      const tokens = getSemanticToneTokens(palette, tone)
      const interactiveClass = getSemanticToneInteractiveClass(tone)
      const surfaceClass = getSemanticToneSurfaceClass(tone)
      const interactiveSurfaceClass = getSemanticToneSurfaceClass(tone, true)
      const surfaceAltClass = getSemanticToneSurfaceAltClass(tone)
      const interactiveSurfaceAltClass = getSemanticToneSurfaceAltClass(
        tone,
        true,
      )
      const buttonClass = getSemanticToneButtonClass(tone)
      const interactiveButtonClass = getSemanticToneButtonClass(tone, true)

      applySemanticToneVars(
        styleBuilder.select(
          `.${surfaceClass}, .${interactiveSurfaceClass}`,
          theme,
        ),
        tokens,
      )
        .background(tokens.surface.rest.background)
        .borderColor(tokens.surface.rest.border)
        .color(tokens.surface.rest.text)
        .backgroundSize('calc(100% + 10px) calc(100% + 10px)')
        .backgroundPosition('center')

      styleBuilder
        .select(`.${interactiveSurfaceClass}:hover`, theme)
        .backgroundImage(tokens.surface.hover.background)
        .borderColor(tokens.surface.hover.border)
        .color(tokens.surface.hover.text)

      styleBuilder
        .select(
          `.${interactiveSurfaceClass}:active, .${interactiveSurfaceClass}.active`,
          theme,
        )
        .backgroundImage(tokens.surface.active.background)
        .borderColor(tokens.surface.active.border)
        .color(tokens.surface.active.text)

      styleBuilder
        .select(`.${interactiveSurfaceClass}:disabled`, theme)
        .backgroundImage(tokens.surface.disabled.background)
        .borderColor(tokens.surface.disabled.border)
        .color(tokens.surface.disabled.text)

      styleBuilder
        .select(`.${interactiveSurfaceClass}:focus-visible`, theme)
        .outline('none')
        .boxShadow(`0 0 0 2px ${tokens.surface.focusRing}`)

      applySemanticToneVars(
        styleBuilder.select(
          `.${surfaceAltClass}, .${interactiveSurfaceAltClass}`,
          theme,
        ),
        tokens,
      )
        .background(tokens.surfaceAlt.rest.background)
        .borderColor(tokens.surfaceAlt.rest.border)
        .color(tokens.surfaceAlt.rest.text)
        .backgroundSize('calc(100% + 10px) calc(100% + 10px)')
        .backgroundPosition('center')

      styleBuilder
        .select(`.${interactiveSurfaceAltClass}:hover`, theme)
        .backgroundImage(tokens.surfaceAlt.hover.background)
        .borderColor(tokens.surfaceAlt.hover.border)
        .color(tokens.surfaceAlt.hover.text)

      styleBuilder
        .select(
          `.${interactiveSurfaceAltClass}:active, .${interactiveSurfaceAltClass}.active`,
          theme,
        )
        .backgroundImage(tokens.surfaceAlt.active.background)
        .borderColor(tokens.surfaceAlt.active.border)
        .color(tokens.surfaceAlt.active.text)

      styleBuilder
        .select(`.${interactiveSurfaceAltClass}:disabled`, theme)
        .backgroundImage(tokens.surfaceAlt.disabled.background)
        .borderColor(tokens.surfaceAlt.disabled.border)
        .color(tokens.surfaceAlt.disabled.text)

      styleBuilder
        .select(`.${interactiveSurfaceAltClass}:focus-visible`, theme)
        .outline('none')
        .boxShadow(`0 0 0 2px ${tokens.surfaceAlt.focusRing}`)

      applySemanticToneVars(
        styleBuilder.select(
          `.${buttonClass}, .${interactiveButtonClass}`,
          theme,
        ),
        tokens,
      )
        .background(tokens.button.rest.background)
        .borderColor(tokens.button.rest.border)
        .color(tokens.button.rest.text)
        .backgroundSize('calc(100% + 10px) calc(100% + 10px)')
        .backgroundPosition('center')

      styleBuilder
        .select(`.${interactiveClass}`, theme)
        .color(tokens.button.rest.text)
        .backgroundSize('calc(100% + 10px) calc(100% + 10px)')
        .backgroundPosition('center')

      styleBuilder
        .select(
          `.${interactiveButtonClass}:hover, .${interactiveClass}:hover`,
          theme,
        )
        .backgroundImage(tokens.button.hover.background)
        .borderColor(tokens.button.hover.border)
        .color(tokens.button.hover.text)

      styleBuilder
        .select(
          `.${interactiveButtonClass}:active, .${interactiveButtonClass}.active, .${interactiveClass}:active, .${interactiveClass}.active`,
          theme,
        )
        .backgroundImage(tokens.button.active.background)
        .borderColor(tokens.button.active.border)
        .color(tokens.button.active.text)

      styleBuilder
        .select(
          `.${interactiveButtonClass}[aria-selected="true"], .${interactiveButtonClass}[aria-pressed="true"], .${interactiveButtonClass}[aria-current="true"], .${interactiveButtonClass}.is-active`,
          theme,
        )
        .backgroundImage(tokens.button.active.background)
        .borderColor(tokens.button.active.border)
        .color(tokens.button.active.text)

      styleBuilder
        .select(
          `.${interactiveButtonClass}:disabled, .${interactiveClass}:disabled`,
          theme,
        )
        .backgroundImage(tokens.button.disabled.background)
        .borderColor(tokens.button.disabled.border)
        .color(tokens.button.disabled.text)

      styleBuilder
        .select(
          `.${interactiveButtonClass}:focus-visible, .${interactiveClass}:focus-visible`,
          theme,
        )
        .outline('none')
        .boxShadow(`0 0 0 2px ${tokens.button.focusRing}`)

      applySemanticToneVars(
        styleBuilder.select(`.${getSemanticToneBorderClass(tone)}`, theme),
        tokens,
      ).borderColor(tokens.border.default)

      applySemanticToneVars(
        styleBuilder.select(`.${getSemanticToneTextClass(tone)}`, theme),
        tokens,
      ).color(tokens.text.default)

      applySemanticToneVars(
        styleBuilder.select(`.${getSemanticToneIconClass(tone)}`, theme),
        tokens,
      )
        .background(tokens.icon.gradient)
        .backgroundColor(tokens.icon.background)
        .borderColor(tokens.icon.border)
        .color(tokens.icon.color)
    }
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
    },
    surfaceAlt: {
      rest: { ...tokens.surfaceAlt.rest },
      hover: { ...tokens.surfaceAlt.hover },
      active: { ...tokens.surfaceAlt.active },
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
    },
    icon: {
      background: tokens.icon.background,
      gradient: tokens.icon.gradient,
      color: tokens.icon.color,
      border: tokens.icon.border,
    },
  }
}
