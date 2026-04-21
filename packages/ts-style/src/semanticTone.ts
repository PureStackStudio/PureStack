import type { Style } from '@purestack/ts-css'
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
    .set('--ps-current-tone', tokens.tone)
    .set('--ps-current-canvas', tokens.canvas)
    .set('--ps-current-overlay', tokens.overlay)
    .set('--ps-current-surface-rest-background', tokens.surface.rest.background)
    .set('--ps-current-surface-rest-border', tokens.surface.rest.border)
    .set('--ps-current-surface-rest-text', tokens.surface.rest.text)
    .set(
      '--ps-current-surface-hover-background',
      tokens.surface.hover.background,
    )
    .set('--ps-current-surface-hover-border', tokens.surface.hover.border)
    .set('--ps-current-surface-hover-text', tokens.surface.hover.text)
    .set(
      '--ps-current-surface-active-background',
      tokens.surface.active.background,
    )
    .set('--ps-current-surface-active-border', tokens.surface.active.border)
    .set('--ps-current-surface-active-text', tokens.surface.active.text)
    .set(
      '--ps-current-surface-alt-rest-background',
      tokens.surfaceAlt.rest.background,
    )
    .set('--ps-current-surface-alt-rest-border', tokens.surfaceAlt.rest.border)
    .set('--ps-current-surface-alt-rest-text', tokens.surfaceAlt.rest.text)
    .set(
      '--ps-current-surface-alt-hover-background',
      tokens.surfaceAlt.hover.background,
    )
    .set(
      '--ps-current-surface-alt-hover-border',
      tokens.surfaceAlt.hover.border,
    )
    .set('--ps-current-surface-alt-hover-text', tokens.surfaceAlt.hover.text)
    .set(
      '--ps-current-surface-alt-active-background',
      tokens.surfaceAlt.active.background,
    )
    .set(
      '--ps-current-surface-alt-active-border',
      tokens.surfaceAlt.active.border,
    )
    .set('--ps-current-surface-alt-active-text', tokens.surfaceAlt.active.text)
    .set('--ps-current-text-default', tokens.text.default)
    .set('--ps-current-text-subtle', tokens.text.subtle)
    .set('--ps-current-border-subtle', tokens.border.subtle)
    .set('--ps-current-border-default', tokens.border.default)
    .set('--ps-current-border-focus', tokens.border.focus)
    .set('--ps-current-button-rest-background', tokens.button.rest.background)
    .set('--ps-current-button-rest-border', tokens.button.rest.border)
    .set('--ps-current-button-rest-text', tokens.button.rest.text)
    .set('--ps-current-button-hover-background', tokens.button.hover.background)
    .set('--ps-current-button-hover-border', tokens.button.hover.border)
    .set('--ps-current-button-hover-text', tokens.button.hover.text)
    .set(
      '--ps-current-button-active-background',
      tokens.button.active.background,
    )
    .set('--ps-current-button-active-border', tokens.button.active.border)
    .set('--ps-current-button-active-text', tokens.button.active.text)
    .set('--ps-current-icon-background', tokens.icon.background)
    .set('--ps-current-icon-gradient', tokens.icon.gradient)
    .set('--ps-current-icon-color', tokens.icon.color)
    .set('--ps-current-icon-border', tokens.icon.border)
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
      .set('--ps-current-tone', root.tone)
      .set('--ps-current-canvas', root.canvas)
      .set('--ps-current-overlay', root.overlay)
      .set('--ps-current-surface-rest-background', root.surface.rest.background)
      .set('--ps-current-surface-rest-border', root.surface.rest.border)
      .set('--ps-current-surface-rest-text', root.surface.rest.text)
      .set(
        '--ps-current-surface-hover-background',
        root.surface.hover.background,
      )
      .set('--ps-current-surface-hover-border', root.surface.hover.border)
      .set('--ps-current-surface-hover-text', root.surface.hover.text)
      .set(
        '--ps-current-surface-active-background',
        root.surface.active.background,
      )
      .set('--ps-current-surface-active-border', root.surface.active.border)
      .set('--ps-current-surface-active-text', root.surface.active.text)
      .set(
        '--ps-current-surface-alt-rest-background',
        root.surfaceAlt.rest.background,
      )
      .set('--ps-current-surface-alt-rest-border', root.surfaceAlt.rest.border)
      .set('--ps-current-surface-alt-rest-text', root.surfaceAlt.rest.text)
      .set(
        '--ps-current-surface-alt-hover-background',
        root.surfaceAlt.hover.background,
      )
      .set(
        '--ps-current-surface-alt-hover-border',
        root.surfaceAlt.hover.border,
      )
      .set('--ps-current-surface-alt-hover-text', root.surfaceAlt.hover.text)
      .set(
        '--ps-current-surface-alt-active-background',
        root.surfaceAlt.active.background,
      )
      .set(
        '--ps-current-surface-alt-active-border',
        root.surfaceAlt.active.border,
      )
      .set('--ps-current-surface-alt-active-text', root.surfaceAlt.active.text)
      .set('--ps-current-text-default', root.root.text.default)
      .set('--ps-current-text-subtle', root.root.text.subtle)
      .set('--ps-current-border-subtle', root.root.border.subtle)
      .set('--ps-current-border-default', root.root.border.default)
      .set('--ps-current-border-focus', root.root.border.focus)
      .set('--ps-current-button-rest-background', root.button.rest.background)
      .set('--ps-current-button-rest-border', root.button.rest.border)
      .set('--ps-current-button-rest-text', root.button.rest.text)
      .set('--ps-current-button-hover-background', root.button.hover.background)
      .set('--ps-current-button-hover-border', root.button.hover.border)
      .set('--ps-current-button-hover-text', root.button.hover.text)
      .set(
        '--ps-current-button-active-background',
        root.button.active.background,
      )
      .set('--ps-current-button-active-border', root.button.active.border)
      .set('--ps-current-button-active-text', root.button.active.text)
      .set('--ps-current-icon-background', root.icon.background)
      .set('--ps-current-icon-gradient', root.icon.gradient)
      .set('--ps-current-icon-color', root.icon.color)
      .set('--ps-current-icon-border', root.icon.border)

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
