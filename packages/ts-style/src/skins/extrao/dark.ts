import type { ThemePalette } from '../../themePalette'

export const extraoDark: ThemePalette = {
  background: {
    canvas: '#011425',
    surface: '#071b2d',
    surfaceAlt: '#0d2235',
    panel: '#092033',
    showcase:
      'linear-gradient(135deg, rgba(1, 20, 37, 0.99), rgba(7, 27, 45, 0.99))',
    showcaseAlt:
      'linear-gradient(135deg, rgba(9, 30, 46, 0.98), rgba(31, 73, 89, 0.86))',
    accentMuted: '#123347',
    accent: '#1f4959',
    feature: '#113044',
    successMuted: '#103228',
    dangerMuted: '#341f2a',
    raised: '#111a24',
    overlay: 'rgba(0, 0, 0, 0.62)',
  },
  text: {
    default: '#f2f6f8',
    muted: '#c6d4dc',
    subtle: '#98adba',
    accent: '#9cc5d8',
    inverse: '#011425',
    success: '#9fd7bf',
    danger: '#ebb3c0',
    soft: '#98adba',
    strong: '#f2f6f8',
  },
  border: {
    subtle: '#1a3a4d',
    default: '#245067',
    strong: '#31627a',
    accent: '#5c7c89',
    focus: '#9cc5d8',
    success: '#3c7b63',
    danger: '#8f5668',
    soft: '#1a3a4d',
    hard: '#31627a',
  },
  action: {
    neutral: {
      background: '#133345',
      text: '#f2f6f8',
      hover: '#1a3f50',
      active: '#1a3f50',
      disabled: '#133345',
      focusRing: '#9cc5d8',
    },
    accent: {
      background: '#5c7c89',
      text: '#011425',
      hover: '#6f8f9c',
      active: '#6f8f9c',
      disabled: '#5c7c89',
      focusRing: '#9cc5d8',
    },
    ghost: {
      background: 'transparent',
      text: '#c6d4dc',
      hover: 'rgba(255, 255, 255, 0.08)',
      active: 'rgba(255, 255, 255, 0.12)',
      disabled: 'rgba(255, 255, 255, 0.04)',
      focusRing: '#9cc5d8',
    },
  },
  status: {
    success: {
      background: '#12352b',
      border: '#3f7f66',
      text: '#9ed9bf',
    },
    danger: {
      background: '#3b1f2c',
      border: '#91556a',
      text: '#efb1c1',
    },
    info: {
      background: '#1a2f49',
      border: '#40608f',
      text: '#bad1f0',
    },
    warning: {
      background: '#3b2b14',
      border: '#8f6a34',
      text: '#f0d39f',
    },
  },
  badge: {
    accent: {
      background: '#183d4d',
      text: '#d6e4ec',
    },
    muted: {
      background: '#1e293b',
      text: '#cbd5e1',
    },
    strong: {
      background: '#94a3b8',
      text: '#0f172a',
    },
  },
  icon: {
    accent: {
      background: '#163a4a',
      gradient: 'linear-gradient(135deg, #1c4557, #133445)',
      color: '#d1e1ea',
      ring: '#335e71',
    },
    neutral: {
      background: '#112f3f',
      gradient: 'linear-gradient(135deg, #17394a, #0d2735)',
      color: '#abc0cc',
      ring: '#284f63',
    },
    subtle: {
      background: '#1f2937',
      gradient: 'linear-gradient(135deg, #263242, #1b2533)',
      color: '#a8b3c7',
      ring: '#334155',
    },
  },
  effect: {
    glowPrimary:
      'radial-gradient(circle at 12% 18%, rgba(31, 73, 89, 0.36), transparent 54%), radial-gradient(circle at 84% 10%, rgba(92, 124, 137, 0.2), transparent 58%)',
    glowSecondary:
      'radial-gradient(circle at 16% 24%, rgba(31, 73, 89, 0.28), transparent 56%), radial-gradient(circle at 86% 8%, rgba(92, 124, 137, 0.14), transparent 60%)',
    floatingShadow: '0 24px 38px rgba(0, 4, 9, 0.66)',
    panelShadow: '0 16px 28px rgba(0, 5, 11, 0.52)',
    panelShadowStrong: '0 22px 40px rgba(0, 5, 11, 0.6)',
    accentShadow: '0 16px 30px rgba(0, 7, 14, 0.58)',
    interactiveShadow: '0 14px 24px rgba(0, 5, 11, 0.44)',
    trackShadow:
      'inset 0 3px 7px rgba(0, 0, 0, 0.56), inset 0 -2px 4px rgba(255, 255, 255, 0.05)',
    thumbShadow:
      '0 12px 20px rgba(0, 0, 0, 0.62), inset 0 3px 6px rgba(255, 255, 255, 0.18)',
    overlayScrim: 'rgba(0, 0, 0, 0.66)',
    focusGlow: '0 0 0 4px rgba(147, 197, 253, 0.28)',
    insetShadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 -1px 0 rgba(0, 0, 0, 0.35)',
  },
}
