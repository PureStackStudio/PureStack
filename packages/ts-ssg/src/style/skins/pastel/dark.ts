import type { ThemePalette } from '../../themePalette'

export const pastelDark: ThemePalette = {
  background: {
    canvas: '#161522',
    surface: '#1d1b2d',
    surfaceAlt: '#242138',
    panel: '#211f33',
    showcase:
      'linear-gradient(135deg, rgba(33, 29, 52, 0.98), rgba(28, 40, 58, 0.98))',
    showcaseAlt:
      'linear-gradient(135deg, rgba(36, 30, 56, 0.98), rgba(34, 41, 62, 0.98))',
    accentMuted: '#302a49',
    accent: '#3b3457',
    feature: '#2d2947',
    successMuted: '#1b3128',
    dangerMuted: '#3a232b',
    raised: '#111a24',
    overlay: 'rgba(0, 0, 0, 0.62)',
  },
  text: {
    default: '#eeeaff',
    muted: '#cfc8ea',
    subtle: '#a99fc7',
    accent: '#c9b8ff',
    inverse: '#1a1728',
    success: '#9fe0be',
    danger: '#f0b8c4',
    soft: '#a99fc7',
    strong: '#eeeaff',
  },
  border: {
    subtle: '#3a3551',
    default: '#4a4367',
    strong: '#5e5582',
    accent: '#7568a3',
    focus: '#9181c5',
    success: '#4f8d70',
    danger: '#956272',
    soft: '#3a3551',
    hard: '#5e5582',
  },
  action: {
    neutral: {
      background: '#2a2540',
      text: '#eeeaff',
      hover: '#352f4f',
      active: '#352f4f',
      disabled: '#2a2540',
      focusRing: '#9181c5',
    },
    accent: {
      background: '#c1b0f7',
      text: '#1c182d',
      hover: '#b09de8',
      active: '#b09de8',
      disabled: '#c1b0f7',
      focusRing: '#9181c5',
    },
    ghost: {
      background: 'transparent',
      text: '#cfc8ea',
      hover: 'rgba(255, 255, 255, 0.08)',
      active: 'rgba(255, 255, 255, 0.12)',
      disabled: 'rgba(255, 255, 255, 0.04)',
      focusRing: '#9181c5',
    },
  },
  status: {
    success: {
      background: '#1b3128',
      border: '#4f8d70',
      text: '#9fe0be',
    },
    danger: {
      background: '#3a232b',
      border: '#956272',
      text: '#f0b8c4',
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
      background: '#3a325b',
      text: '#d8ccff',
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
      background: '#342d52',
      gradient: 'linear-gradient(135deg, #403565, #30294c)',
      color: '#d8caff',
      ring: '#5a4f86',
    },
    neutral: {
      background: '#312c4b',
      gradient: 'linear-gradient(135deg, #3a3358, #2f2948)',
      color: '#beb1dd',
      ring: '#534a78',
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
      'radial-gradient(circle at 14% 20%, rgba(165, 142, 226, 0.24), transparent 56%), radial-gradient(circle at 86% 12%, rgba(132, 186, 224, 0.18), transparent 60%)',
    glowSecondary:
      'radial-gradient(circle at 14% 22%, rgba(181, 157, 237, 0.2), transparent 56%), radial-gradient(circle at 86% 8%, rgba(228, 152, 190, 0.16), transparent 60%)',
    floatingShadow: '0 22px 34px rgba(9, 8, 16, 0.56)',
    panelShadow: '0 16px 26px rgba(9, 8, 17, 0.42)',
    panelShadowStrong: '0 22px 38px rgba(10, 8, 18, 0.5)',
    accentShadow: '0 14px 26px rgba(15, 12, 28, 0.48)',
    interactiveShadow: '0 14px 24px rgba(12, 10, 24, 0.4)',
    trackShadow:
      'inset 0 3px 7px rgba(8, 6, 16, 0.5), inset 0 -2px 4px rgba(255, 255, 255, 0.05)',
    thumbShadow:
      '0 12px 20px rgba(9, 7, 18, 0.56), inset 0 3px 6px rgba(255, 255, 255, 0.18)',
    overlayScrim: 'rgba(0, 0, 0, 0.66)',
    focusGlow: '0 0 0 4px rgba(147, 197, 253, 0.28)',
    insetShadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 -1px 0 rgba(0, 0, 0, 0.35)',
  },
}
