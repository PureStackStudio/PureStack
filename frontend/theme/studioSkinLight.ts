import { type ThemePalette, themeSkins } from '@purestack/ts-style'
import { type DeepPartial, merge } from '@purestack/ts-util'
import {
  createGhostTone,
  createStudioTone,
  paint,
  type StudioHue,
  type StudioTone,
  spotlight,
  state,
  studioHues,
  studioSkinShared,
} from './studioSkinShared'

const n = paint(studioHues.neutral)
const accent = paint(studioHues.accent)
const shadow = (alpha: number) => n(0.25, 0.4, alpha)
const disabled = state(n(0.965, 0.04), n(0.91, 0.06), n(0.58, 0.15))
const overlay = n(0.25, 0.3, 0.25)

/** Paper-light tints with saturated fills that carry white text. */
function createLightTone(hue: StudioHue): StudioTone {
  const at = paint(hue)
  const tint = at(0.975, 0.1)
  const tintActive = at(0.925, 0.24)
  return createStudioTone({
    fill: at(0.53),
    fillHover: at(0.47),
    fillActive: at(0.41),
    onFill: '#ffffff',
    ink: at(0.46, 0.85),
    muted: at(0.52, 0.3),
    body: at(0.46, 0.85),
    tint,
    tintHover: at(0.955, 0.16),
    tintActive,
    border: at(0.84, 0.3),
    borderSubtle: at(0.9, 0.2),
    rim: at(0.53),
    canvas: tint,
    spotlight: spotlight(tint, tintActive, '#ffffff66'),
    overlay,
    disabled,
  })
}

function createNeutralTone(): StudioTone {
  const ink = n(0.24, 0.3)
  const muted = n(0.5, 0.25)
  const text = { default: ink, subtle: muted }
  const border = {
    default: n(0.86, 0.12),
    subtle: n(0.92, 0.08),
    focus: accent(0.53),
  }
  return {
    tone: n(0.5, 0.3),
    canvas: n(0.984, 0.04),
    canvascolor: n(0.984, 0.04),
    spotlight: spotlight('#ffffff', n(0.94, 0.12), '#ffffff66'),
    overlay,
    text,
    border,
    root: { text, border },
    surface: {
      rest: state('#ffffff', border.subtle, ink),
      hover: state(n(0.97, 0.06), n(0.84, 0.14), ink),
      active: state(n(0.945, 0.1), n(0.74, 0.2), ink),
      disabled,
      focusRing: border.focus,
    },
    surfaceAlt: {
      rest: state(n(0.965, 0.07), n(0.91, 0.08), n(0.34, 0.3)),
      hover: state(n(0.95, 0.09), n(0.84, 0.14), ink),
      active: state(n(0.93, 0.12), n(0.74, 0.2), ink),
      disabled,
      focusRing: border.focus,
    },
    button: {
      rest: state(n(0.955, 0.08), n(0.87, 0.12), ink),
      hover: state(n(0.935, 0.1), n(0.78, 0.16), ink),
      active: state(n(0.91, 0.13), n(0.68, 0.22), ink),
      disabled,
      focusRing: border.focus,
    },
  }
}

export function createStudioLightPalette(): ThemePalette {
  const neutral = createNeutralTone()
  return merge(themeSkins.standard.create().light, {
    ...studioSkinShared,
    accent: accent(0.53),
    effect: {
      glowPrimary: `0 0 1.75rem ${accent(0.53, 1, 0.08)}`,
      glowSecondary: `0 0 1.75rem ${paint(studioHues.secondary)(0.53, 1, 0.07)}`,
      panelShadow: 'none',
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
      accent: createLightTone(studioHues.accent),
      secondary: createLightTone(studioHues.secondary),
      feature: createLightTone(studioHues.feature),
      custom: createLightTone(studioHues.custom),
      info: createLightTone(studioHues.info),
      success: createLightTone(studioHues.success),
      warning: createLightTone(studioHues.warning),
      danger: createLightTone(studioHues.danger),
    },
  } satisfies DeepPartial<ThemePalette>)
}
