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
const shadow = (alpha: number) => n(0.12, 0.3, alpha)
const disabled = state(n(0.19, 0.2), n(0.25, 0.2), n(0.5, 0.2))
const overlay = n(0.1, 0.2, 0.72)

/** Deep ink fields lit by luminous fills that carry dark text. */
function createDarkTone(hue: StudioHue): StudioTone {
  const at = paint(hue)
  return createStudioTone({
    fill: at(0.74),
    fillHover: at(0.8, 0.95),
    fillActive: at(0.68),
    onFill: at(0.2, 0.4),
    ink: at(0.8, 0.8),
    muted: at(0.72, 0.32),
    body: at(0.88, 0.28),
    tint: at(0.235, 0.22),
    tintHover: at(0.265, 0.28),
    tintActive: at(0.3, 0.34),
    border: at(0.34, 0.3),
    borderSubtle: at(0.29, 0.25),
    rim: at(0.48, 0.45),
    canvas: at(0.2, 0.2),
    spotlight: spotlight(at(0.31, 0.45), at(0.205, 0.22), at(0.74, 1, 0.24)),
    overlay,
    disabled,
  })
}

function createNeutralTone(): StudioTone {
  const ink = n(0.93, 0.08)
  const muted = n(0.71, 0.22)
  const text = { default: ink, subtle: muted }
  const border = {
    default: n(0.33, 0.28),
    subtle: n(0.27, 0.25),
    focus: accent(0.74),
  }
  return {
    tone: n(0.6, 0.3),
    canvas: n(0.17, 0.22),
    canvascolor: n(0.17, 0.22),
    spotlight: spotlight(n(0.26, 0.35), n(0.19, 0.25), accent(0.8, 0.5, 0.14)),
    overlay,
    text,
    border,
    root: { text, border },
    surface: {
      rest: state(n(0.205, 0.25), n(0.27, 0.25), ink),
      hover: state(n(0.23, 0.28), n(0.36, 0.3), ink),
      active: state(n(0.255, 0.3), n(0.44, 0.32), ink),
      disabled,
      focusRing: border.focus,
    },
    surfaceAlt: {
      rest: state(n(0.19, 0.24), n(0.255, 0.24), n(0.84, 0.12)),
      hover: state(n(0.215, 0.26), n(0.33, 0.28), ink),
      active: state(n(0.245, 0.3), n(0.42, 0.3), ink),
      disabled,
      focusRing: border.focus,
    },
    button: {
      rest: state(n(0.26, 0.28), n(0.34, 0.3), ink),
      hover: state(n(0.295, 0.3), n(0.42, 0.32), n(0.97, 0.06)),
      active: state(n(0.32, 0.32), n(0.5, 0.34), n(0.97, 0.06)),
      disabled,
      focusRing: border.focus,
    },
  }
}

export function createStudioDarkPalette(): ThemePalette {
  const neutral = createNeutralTone()
  return merge(themeSkins.standard.create().dark, {
    ...studioSkinShared,
    accent: accent(0.74),
    effect: {
      glowPrimary: `0 0 1.75rem ${accent(0.74, 1, 0.2)}`,
      glowSecondary: `0 0 1.75rem ${paint(studioHues.secondary)(0.74, 1, 0.16)}`,
      panelShadow: 'none',
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
      accent: createDarkTone(studioHues.accent),
      secondary: createDarkTone(studioHues.secondary),
      feature: createDarkTone(studioHues.feature),
      custom: createDarkTone(studioHues.custom),
      info: createDarkTone(studioHues.info),
      success: createDarkTone(studioHues.success),
      warning: createDarkTone(studioHues.warning),
      danger: createDarkTone(studioHues.danger),
    },
  } satisfies DeepPartial<ThemePalette>)
}
