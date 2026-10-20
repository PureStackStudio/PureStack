import { type ThemePalette, themeSkins } from '@purestack/ts-style'
import { type DeepPartial, merge } from '@purestack/ts-util'
import {
  createGhostTone,
  createStudioTone,
  paint,
  type StudioHues,
  type StudioHue,
  type StudioTone,
  spotlight,
  state,
  studioHues,
  studioSkinShared,
} from './studioSkinShared'
import {
  studioSurfaceProfiles,
  type StudioSurfaceProfile,
} from './studioSurfaceProfiles'

type LightFoundation = ReturnType<typeof createLightFoundation>

function createLightFoundation(hue: StudioHue, layers: StudioSurfaceProfile) {
  const n = paint(hue)
  return {
    n,
    layers,
    shadow: (alpha: number) =>
      n(layers.ink, layers.chroma, alpha * layers.shadow),
    disabled: state(
      n(layers.canvas, layers.chroma),
      n(layers.borderSubtle, layers.chroma),
      n(0.58, 0.12),
    ),
    overlay: n(layers.ink, layers.chroma, 0.25 * layers.shadow),
  }
}

/** Paper-light tints with saturated fills that carry white text. */
function createLightTone(
  hue: StudioHue,
  { overlay, disabled, layers }: LightFoundation,
): StudioTone {
  const at = paint(hue)
  const tint = at(layers.surface, layers.tint)
  const tintActive = at(layers.surfaceAlt - 0.015, layers.tint * 1.3)
  return createStudioTone({
    fill: at(0.53),
    fillHover: at(0.47),
    fillActive: at(0.41),
    onFill: '#ffffff',
    ink: at(0.46, 0.85),
    muted: at(0.52, 0.3),
    body: at(0.46, 0.85),
    tint,
    tintHover: at(layers.surfaceAlt, layers.tint),
    tintActive,
    tintAlt: at(layers.surfaceAlt, layers.tint),
    tintAltHover: at(layers.surfaceAlt - 0.015, layers.tint * 1.15),
    tintAltActive: at(layers.surfaceAlt - 0.03, layers.tint * 1.3),
    border: at(layers.border, layers.tint * 1.5),
    borderSubtle: at(layers.borderSubtle, layers.tint),
    rim: at(0.53),
    canvas: tint,
    spotlight: spotlight(tint, tintActive, '#ffffff66'),
    overlay,
    disabled,
  })
}

function createNeutralTone(
  hues: StudioHues,
  { n, overlay, disabled, layers }: LightFoundation,
): StudioTone {
  const accent = paint(hues.accent)
  const paper = n(layers.surface, layers.chroma * 0.4)
  const ink = n(layers.ink, layers.chroma * 1.5)
  const muted = n(layers.muted, layers.chroma)
  const text = { default: ink, subtle: muted }
  const border = {
    default: n(layers.border, layers.chroma),
    subtle: n(layers.borderSubtle, layers.chroma * 0.7),
    focus: accent(0.53),
  }
  return {
    tone: n(0.5, 0.3),
    canvas: n(layers.canvas, layers.chroma),
    canvascolor: n(layers.canvas, layers.chroma),
    spotlight: spotlight(
      paper,
      n(layers.surfaceAlt, layers.chroma),
      n(layers.surface, layers.chroma * 0.4, 0.4),
    ),
    overlay,
    text,
    border,
    root: { text, border },
    surface: {
      rest: state(paper, border.subtle, ink),
      hover: state(
        n(layers.surface - 0.015, layers.chroma),
        border.default,
        ink,
      ),
      active: state(
        n(layers.surface - 0.03, layers.chroma),
        n(layers.border - 0.05, layers.chroma),
        ink,
      ),
      disabled,
      focusRing: border.focus,
    },
    surfaceAlt: {
      rest: state(
        n(layers.surfaceAlt, layers.chroma),
        border.subtle,
        n(layers.ink + 0.06, layers.chroma),
      ),
      hover: state(
        n(layers.surfaceAlt - 0.015, layers.chroma),
        border.default,
        ink,
      ),
      active: state(
        n(layers.surfaceAlt - 0.03, layers.chroma),
        n(layers.border - 0.05, layers.chroma),
        ink,
      ),
      disabled,
      focusRing: border.focus,
    },
    button: {
      rest: state(n(layers.control, layers.chroma), border.default, ink),
      hover: state(
        n(layers.control - 0.015, layers.chroma),
        n(layers.border - 0.04, layers.chroma),
        ink,
      ),
      active: state(
        n(layers.control - 0.03, layers.chroma),
        n(layers.border - 0.08, layers.chroma),
        ink,
      ),
      disabled,
      focusRing: border.focus,
    },
  }
}

export function createStudioLightPalette(
  hues: StudioHues = studioHues,
  layers: StudioSurfaceProfile = studioSurfaceProfiles.cobalt.light,
): ThemePalette {
  const accent = paint(hues.accent)
  const foundation = createLightFoundation(hues.neutral, layers)
  const { shadow, overlay } = foundation
  const neutral = createNeutralTone(hues, foundation)
  return merge(themeSkins.standard.create().light, {
    ...studioSkinShared,
    accent: accent(0.53),
    effect: {
      glowPrimary: `0 0 1.75rem ${accent(0.53, 1, 0.08)}`,
      glowSecondary: `0 0 1.75rem ${paint(hues.secondary)(0.53, 1, 0.07)}`,
      panelShadow: `0 1px 3px ${shadow(0.05)}, 0 8px 20px ${shadow(0.04)}`,
      panelShadowStrong: `0 8px 24px ${shadow(0.07)}`,
      softShadow: `0 2px 8px ${shadow(0.03)}, 0 8px 24px ${shadow(0.04)}`,
      strongShadow: `0 8px 24px ${shadow(0.08)}, 0 24px 64px ${shadow(0.08)}`,
      floatingShadow: `0 2px 8px ${shadow(0.04)}, 0 20px 60px ${shadow(0.09)}`,
      accentShadow: `0 8px 24px ${accent(0.53, 1, 0.18)}`,
      interactiveShadow: `0 2px 6px ${shadow(0.07)}`,
      trackShadow: `inset 0 1px 2px ${shadow(0.08)}`,
      thumbShadow: `0 2px 5px ${shadow(0.15)}`,
      overlayScrim: overlay,
      focusGlow: `0 0 0 3px ${accent(0.53, 1, 0.22)}`,
      insetShadow: `inset 0 1px 4px ${shadow(0.05)}`,
    },
    semanticTone: {
      neutral,
      ghost: createGhostTone(neutral),
      accent: createLightTone(hues.accent, foundation),
      secondary: createLightTone(hues.secondary, foundation),
      feature: createLightTone(hues.feature, foundation),
      custom: createLightTone(hues.custom, foundation),
      info: createLightTone(hues.info, foundation),
      success: createLightTone(hues.success, foundation),
      warning: createLightTone(hues.warning, foundation),
      danger: createLightTone(hues.danger, foundation),
    },
  } satisfies DeepPartial<ThemePalette>)
}
