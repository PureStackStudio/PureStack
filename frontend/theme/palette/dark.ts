import { type ThemePalette, themeSkins } from '@purestack/ts-style'
import { type DeepPartial, merge } from '@purestack/ts-util'
import { type SurfaceProfile, surfaceProfiles } from '../surfaces'
import {
  createGhostTone,
  createTone,
  defaultHues,
  type Hue,
  type Hues,
  type PaletteTone,
  paint,
  sharedTokens,
  spotlight,
  state,
} from './shared'

type DarkFoundation = ReturnType<typeof createDarkFoundation>

function createDarkFoundation(hue: Hue, layers: SurfaceProfile) {
  const n = paint(hue)
  return {
    n,
    layers,
    shadow: (alpha: number) =>
      n(layers.canvas - 0.13, layers.chroma, alpha * layers.shadow),
    disabled: state(
      n(layers.canvas + 0.015, layers.chroma),
      n(layers.surfaceAlt, layers.chroma),
      n(0.6, 0.12),
    ),
    overlay: n(
      layers.canvas - 0.13,
      layers.chroma,
      Math.min(0.8, 0.65 * layers.shadow),
    ),
  }
}

/** Deep ink fields lit by luminous fills that carry dark text. */
function createDarkTone(
  hue: Hue,
  { overlay, disabled, layers }: DarkFoundation,
): PaletteTone {
  const at = paint(hue)
  return createTone({
    fill: at(0.74),
    fillHover: at(0.8, 0.95),
    fillActive: at(0.68),
    onFill: at(0.2, 0.4),
    ink: at(0.9, 0.65),
    muted: at(0.86, 0.16),
    body: at(0.94, 0.12),
    tint: at(layers.surface, layers.tint),
    tintHover: at(layers.surface + 0.02, layers.tint * 1.15),
    tintActive: at(layers.surface + 0.035, layers.tint * 1.3),
    tintAlt: at(layers.surfaceAlt, layers.tint * 0.8),
    tintAltHover: at(layers.surfaceAlt + 0.02, layers.tint),
    tintAltActive: at(layers.surfaceAlt + 0.035, layers.tint * 1.15),
    border: at(layers.border, layers.tint * 1.3),
    borderSubtle: at(layers.borderSubtle, layers.tint),
    rim: at(layers.border + 0.08, 0.4),
    canvas: at(layers.canvas + 0.015, layers.tint),
    spotlight: spotlight(
      at(layers.surface + 0.035, layers.tint * 1.5),
      at(layers.canvas + 0.015, layers.tint),
      at(0.74, 1, 0.18),
    ),
    overlay,
    disabled,
  })
}

function createNeutralTone(
  hues: Hues,
  { n, overlay, disabled, layers }: DarkFoundation,
): PaletteTone {
  const accent = paint(hues.accent)
  const ink = n(layers.ink, 0.08)
  const muted = n(layers.muted, layers.chroma * 0.7)
  const text = { default: ink, subtle: muted }
  const border = {
    default: n(layers.border, layers.chroma),
    subtle: n(layers.borderSubtle, layers.chroma * 0.8),
    focus: accent(0.74),
  }
  return {
    tone: n(0.6, 0.3),
    canvas: n(layers.canvas, layers.chroma),
    canvascolor: n(layers.canvas, layers.chroma),
    spotlight: spotlight(
      n(layers.surface + 0.035, layers.chroma * 1.25),
      n(layers.canvas + 0.015, layers.chroma),
      accent(0.8, 0.5, 0.1),
    ),
    overlay,
    text,
    border,
    root: { text, border },
    surface: {
      rest: state(n(layers.surface, layers.chroma), border.subtle, ink),
      hover: state(
        n(layers.surface + 0.02, layers.chroma),
        border.default,
        ink,
      ),
      active: state(
        n(layers.surface + 0.035, layers.chroma),
        n(layers.border + 0.04, layers.chroma),
        ink,
      ),
      disabled,
      focusRing: border.focus,
    },
    surfaceAlt: {
      rest: state(
        n(layers.surfaceAlt, layers.chroma * 0.8),
        border.subtle,
        n(layers.ink - 0.04, 0.08),
      ),
      hover: state(
        n(layers.surfaceAlt + 0.02, layers.chroma),
        border.default,
        ink,
      ),
      active: state(
        n(layers.surfaceAlt + 0.035, layers.chroma),
        n(layers.border + 0.04, layers.chroma),
        ink,
      ),
      disabled,
      focusRing: border.focus,
    },
    button: {
      rest: state(n(layers.control, layers.chroma), border.default, ink),
      hover: state(
        n(layers.control + 0.015, layers.chroma),
        n(layers.border + 0.04, layers.chroma),
        ink,
      ),
      active: state(
        n(layers.control + 0.025, layers.chroma),
        n(layers.border + 0.08, layers.chroma),
        ink,
      ),
      disabled,
      focusRing: border.focus,
    },
  }
}

export function createDarkPalette(
  hues: Hues = defaultHues,
  layers: SurfaceProfile = surfaceProfiles.cobalt.dark,
): ThemePalette {
  const accent = paint(hues.accent)
  const foundation = createDarkFoundation(hues.neutral, layers)
  const { n, shadow, overlay } = foundation
  const neutral = createNeutralTone(hues, foundation)
  return merge(themeSkins.standard.create().dark, {
    ...sharedTokens,
    accent: accent(0.74),
    effect: {
      glowPrimary: `0 0 1.75rem ${accent(0.74, 1, 0.2)}`,
      glowSecondary: `0 0 1.75rem ${paint(hues.secondary)(0.74, 1, 0.16)}`,
      panelShadow: `0 1px 0 ${n(layers.ink, 0.04, 0.04)}, 0 6px 16px ${shadow(0.14)}`,
      panelShadowStrong: `0 12px 32px ${shadow(0.4)}`,
      softShadow: `0 2px 8px ${shadow(0.25)}, 0 8px 24px ${shadow(0.3)}`,
      strongShadow: `0 12px 32px ${shadow(0.5)}, 0 32px 80px ${shadow(0.5)}`,
      floatingShadow: `0 2px 8px ${shadow(0.3)}, 0 24px 64px ${shadow(0.5)}`,
      accentShadow: `0 8px 28px ${accent(0.74, 1, 0.28)}`,
      interactiveShadow: `0 2px 6px ${shadow(0.35)}`,
      trackShadow: `inset 0 1px 2px ${shadow(0.5)}`,
      thumbShadow: `0 2px 6px ${shadow(0.5)}`,
      overlayScrim: overlay,
      focusGlow: `0 0 0 3px ${accent(0.74, 1, 0.35)}`,
      insetShadow: `inset 0 1px 4px ${shadow(0.4)}`,
    },
    semanticTone: {
      neutral,
      ghost: createGhostTone(neutral),
      accent: createDarkTone(hues.accent, foundation),
      secondary: createDarkTone(hues.secondary, foundation),
      feature: createDarkTone(hues.feature, foundation),
      custom: createDarkTone(hues.custom, foundation),
      info: createDarkTone(hues.info, foundation),
      success: createDarkTone(hues.success, foundation),
      warning: createDarkTone(hues.warning, foundation),
      danger: createDarkTone(hues.danger, foundation),
    },
  } satisfies DeepPartial<ThemePalette>)
}
