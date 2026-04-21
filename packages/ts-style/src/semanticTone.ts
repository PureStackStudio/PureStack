import type { Style } from '@purestack/ts-css'
import { styleBuilder } from './styles'
import { themes } from './themeOptions'
import type { SemanticToneTokens, ThemePalette } from './themePalette'
import { getCurrentThemePaletteVarName } from './themePaletteVars'

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
  return style
    .set(getCurrentThemePaletteVarName('tone'), tokens.tone)
    .set(getCurrentThemePaletteVarName('canvas'), tokens.canvas)
    .set(getCurrentThemePaletteVarName('overlay'), tokens.overlay)
    .set(
      getCurrentThemePaletteVarName('surfaceRestBackground'),
      tokens.surface.rest.background,
    )
    .set(
      getCurrentThemePaletteVarName('surfaceRestBorder'),
      tokens.surface.rest.border,
    )
    .set(
      getCurrentThemePaletteVarName('surfaceRestText'),
      tokens.surface.rest.text,
    )
    .set(
      getCurrentThemePaletteVarName('surfaceHoverBackground'),
      tokens.surface.hover.background,
    )
    .set(
      getCurrentThemePaletteVarName('surfaceHoverBorder'),
      tokens.surface.hover.border,
    )
    .set(
      getCurrentThemePaletteVarName('surfaceHoverText'),
      tokens.surface.hover.text,
    )
    .set(
      getCurrentThemePaletteVarName('surfaceActiveBackground'),
      tokens.surface.active.background,
    )
    .set(
      getCurrentThemePaletteVarName('surfaceActiveBorder'),
      tokens.surface.active.border,
    )
    .set(
      getCurrentThemePaletteVarName('surfaceActiveText'),
      tokens.surface.active.text,
    )
    .set(
      getCurrentThemePaletteVarName('surfaceAltRestBackground'),
      tokens.surfaceAlt.rest.background,
    )
    .set(
      getCurrentThemePaletteVarName('surfaceAltRestBorder'),
      tokens.surfaceAlt.rest.border,
    )
    .set(
      getCurrentThemePaletteVarName('surfaceAltRestText'),
      tokens.surfaceAlt.rest.text,
    )
    .set(
      getCurrentThemePaletteVarName('surfaceAltHoverBackground'),
      tokens.surfaceAlt.hover.background,
    )
    .set(
      getCurrentThemePaletteVarName('surfaceAltHoverBorder'),
      tokens.surfaceAlt.hover.border,
    )
    .set(
      getCurrentThemePaletteVarName('surfaceAltHoverText'),
      tokens.surfaceAlt.hover.text,
    )
    .set(
      getCurrentThemePaletteVarName('surfaceAltActiveBackground'),
      tokens.surfaceAlt.active.background,
    )
    .set(
      getCurrentThemePaletteVarName('surfaceAltActiveBorder'),
      tokens.surfaceAlt.active.border,
    )
    .set(
      getCurrentThemePaletteVarName('surfaceAltActiveText'),
      tokens.surfaceAlt.active.text,
    )
    .set(getCurrentThemePaletteVarName('textDefault'), tokens.text.default)
    .set(getCurrentThemePaletteVarName('textSubtle'), tokens.text.subtle)
    .set(getCurrentThemePaletteVarName('borderSubtle'), tokens.border.subtle)
    .set(getCurrentThemePaletteVarName('borderDefault'), tokens.border.default)
    .set(getCurrentThemePaletteVarName('borderFocus'), tokens.border.focus)
    .set(
      getCurrentThemePaletteVarName('buttonRestBackground'),
      tokens.button.rest.background,
    )
    .set(
      getCurrentThemePaletteVarName('buttonRestBorder'),
      tokens.button.rest.border,
    )
    .set(
      getCurrentThemePaletteVarName('buttonRestText'),
      tokens.button.rest.text,
    )
    .set(
      getCurrentThemePaletteVarName('buttonHoverBackground'),
      tokens.button.hover.background,
    )
    .set(
      getCurrentThemePaletteVarName('buttonHoverBorder'),
      tokens.button.hover.border,
    )
    .set(
      getCurrentThemePaletteVarName('buttonHoverText'),
      tokens.button.hover.text,
    )
    .set(
      getCurrentThemePaletteVarName('buttonActiveBackground'),
      tokens.button.active.background,
    )
    .set(
      getCurrentThemePaletteVarName('buttonActiveBorder'),
      tokens.button.active.border,
    )
    .set(
      getCurrentThemePaletteVarName('buttonActiveText'),
      tokens.button.active.text,
    )
    .set(
      getCurrentThemePaletteVarName('iconBackground'),
      tokens.icon.background,
    )
    .set(getCurrentThemePaletteVarName('iconGradient'), tokens.icon.gradient)
    .set(getCurrentThemePaletteVarName('iconColor'), tokens.icon.color)
    .set(getCurrentThemePaletteVarName('iconBorder'), tokens.icon.border)
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
    styleBuilder
      .select(':root', theme)
      .set(getCurrentThemePaletteVarName('tone'), root.tone)
      .set(getCurrentThemePaletteVarName('canvas'), root.canvas)
      .set(getCurrentThemePaletteVarName('overlay'), root.overlay)
      .set(
        getCurrentThemePaletteVarName('surfaceRestBackground'),
        root.surface.rest.background,
      )
      .set(
        getCurrentThemePaletteVarName('surfaceRestBorder'),
        root.surface.rest.border,
      )
      .set(
        getCurrentThemePaletteVarName('surfaceRestText'),
        root.surface.rest.text,
      )
      .set(
        getCurrentThemePaletteVarName('surfaceHoverBackground'),
        root.surface.hover.background,
      )
      .set(
        getCurrentThemePaletteVarName('surfaceHoverBorder'),
        root.surface.hover.border,
      )
      .set(
        getCurrentThemePaletteVarName('surfaceHoverText'),
        root.surface.hover.text,
      )
      .set(
        getCurrentThemePaletteVarName('surfaceActiveBackground'),
        root.surface.active.background,
      )
      .set(
        getCurrentThemePaletteVarName('surfaceActiveBorder'),
        root.surface.active.border,
      )
      .set(
        getCurrentThemePaletteVarName('surfaceActiveText'),
        root.surface.active.text,
      )
      .set(
        getCurrentThemePaletteVarName('surfaceAltRestBackground'),
        root.surfaceAlt.rest.background,
      )
      .set(
        getCurrentThemePaletteVarName('surfaceAltRestBorder'),
        root.surfaceAlt.rest.border,
      )
      .set(
        getCurrentThemePaletteVarName('surfaceAltRestText'),
        root.surfaceAlt.rest.text,
      )
      .set(
        getCurrentThemePaletteVarName('surfaceAltHoverBackground'),
        root.surfaceAlt.hover.background,
      )
      .set(
        getCurrentThemePaletteVarName('surfaceAltHoverBorder'),
        root.surfaceAlt.hover.border,
      )
      .set(
        getCurrentThemePaletteVarName('surfaceAltHoverText'),
        root.surfaceAlt.hover.text,
      )
      .set(
        getCurrentThemePaletteVarName('surfaceAltActiveBackground'),
        root.surfaceAlt.active.background,
      )
      .set(
        getCurrentThemePaletteVarName('surfaceAltActiveBorder'),
        root.surfaceAlt.active.border,
      )
      .set(
        getCurrentThemePaletteVarName('surfaceAltActiveText'),
        root.surfaceAlt.active.text,
      )
      .set(getCurrentThemePaletteVarName('textDefault'), root.root.text.default)
      .set(getCurrentThemePaletteVarName('textSubtle'), root.root.text.subtle)
      .set(
        getCurrentThemePaletteVarName('borderSubtle'),
        root.root.border.subtle,
      )
      .set(
        getCurrentThemePaletteVarName('borderDefault'),
        root.root.border.default,
      )
      .set(getCurrentThemePaletteVarName('borderFocus'), root.root.border.focus)
      .set(
        getCurrentThemePaletteVarName('buttonRestBackground'),
        root.button.rest.background,
      )
      .set(
        getCurrentThemePaletteVarName('buttonRestBorder'),
        root.button.rest.border,
      )
      .set(
        getCurrentThemePaletteVarName('buttonRestText'),
        root.button.rest.text,
      )
      .set(
        getCurrentThemePaletteVarName('buttonHoverBackground'),
        root.button.hover.background,
      )
      .set(
        getCurrentThemePaletteVarName('buttonHoverBorder'),
        root.button.hover.border,
      )
      .set(
        getCurrentThemePaletteVarName('buttonHoverText'),
        root.button.hover.text,
      )
      .set(
        getCurrentThemePaletteVarName('buttonActiveBackground'),
        root.button.active.background,
      )
      .set(
        getCurrentThemePaletteVarName('buttonActiveBorder'),
        root.button.active.border,
      )
      .set(
        getCurrentThemePaletteVarName('buttonActiveText'),
        root.button.active.text,
      )
      .set(
        getCurrentThemePaletteVarName('iconBackground'),
        root.icon.background,
      )
      .set(getCurrentThemePaletteVarName('iconGradient'), root.icon.gradient)
      .set(getCurrentThemePaletteVarName('iconColor'), root.icon.color)
      .set(getCurrentThemePaletteVarName('iconBorder'), root.icon.border)

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
