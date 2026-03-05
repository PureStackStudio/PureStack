import type { ThemePalette } from '../../themePalette'

export const oceanDark: ThemePalette = {
  background: {
    canvas: '#14171d',
    surface: '#1b1f27',
    surfaceAlt: '#222733',
    panel: '#1b1f27',
    showcase:
      'linear-gradient(135deg, rgba(24, 27, 34, 0.98), rgba(30, 34, 42, 0.98))',
    showcaseAlt:
      'linear-gradient(135deg, rgba(20, 23, 32, 0.98), rgba(28, 33, 45, 0.98))',
    accentMuted: '#262b35',
    accent: '#2a3244',
    feature: '#20283a',
    successMuted: '#0f3325',
    dangerMuted: '#3a1717',
    raised: '#111a24',
    overlay: 'rgba(0, 0, 0, 0.62)',
  },
  text: {
    default: '#e7eaf3',
    muted: '#c4cad9',
    subtle: '#9aa4b2',
    accent: '#a9c1ff',
    inverse: '#101827',
    success: '#93f0bf',
    danger: '#ffb0b0',
    soft: '#9aa4b2',
    strong: '#e7eaf3',
  },
  border: {
    subtle: '#2a2f38',
    default: '#2d3340',
    strong: '#3a4150',
    accent: '#4b5cc4',
    focus: '#91a7ff',
    success: '#2f8f63',
    danger: '#9f4848',
    soft: '#2a2f38',
    hard: '#3a4150',
  },
  action: {
    neutral: {
      background: '#1a2235',
      text: '#e7eaf3',
      hover: '#202a40',
      active: '#202a40',
      disabled: '#1a2235',
      focusRing: '#91a7ff',
    },
    accent: {
      background: '#b8c9ff',
      text: '#101827',
      hover: '#a6bbff',
      active: '#a6bbff',
      disabled: '#b8c9ff',
      focusRing: '#91a7ff',
    },
    ghost: {
      background: 'transparent',
      text: '#c4cad9',
      hover: 'rgba(255, 255, 255, 0.08)',
      active: 'rgba(255, 255, 255, 0.12)',
      disabled: 'rgba(255, 255, 255, 0.04)',
      focusRing: '#91a7ff',
    },
  },
  status: {
    success: {
      background: '#0f3325',
      border: '#2f8f63',
      text: '#93f0bf',
    },
    danger: {
      background: '#3a1717',
      border: '#9f4848',
      text: '#ffb0b0',
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
      background: '#2b3560',
      text: '#c7d2ff',
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
      background: '#2a3557',
      gradient: 'linear-gradient(135deg, #2d3d67, #243052)',
      color: '#c7d2ff',
      ring: '#3b4f84',
    },
    neutral: {
      background: '#2c3552',
      gradient: 'linear-gradient(135deg, #324068, #2a3553)',
      color: '#b7c6ff',
      ring: '#3a4d7d',
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
      'radial-gradient(circle at 15% 20%, rgba(74, 111, 255, 0.35), transparent 55%), radial-gradient(circle at 85% 10%, rgba(255, 255, 255, 0.08), transparent 60%)',
    glowSecondary:
      'radial-gradient(circle at 15% 20%, rgba(74, 111, 255, 0.28), transparent 55%), radial-gradient(circle at 85% 5%, rgba(255, 255, 255, 0.08), transparent 60%)',
    floatingShadow: '0 22px 34px rgba(8, 10, 18, 0.55)',
    panelShadow: '0 16px 26px rgba(5, 10, 22, 0.4)',
    panelShadowStrong: '0 20px 36px rgba(5, 10, 22, 0.45)',
    accentShadow: '0 14px 26px rgba(15, 20, 35, 0.45)',
    interactiveShadow: '0 14px 24px rgba(5, 10, 22, 0.35)',
    trackShadow:
      'inset 0 3px 7px rgba(0, 0, 0, 0.45), inset 0 -2px 4px rgba(255, 255, 255, 0.05)',
    thumbShadow:
      '0 12px 20px rgba(5, 8, 20, 0.55), inset 0 3px 6px rgba(255, 255, 255, 0.2)',
    overlayScrim: 'rgba(0, 0, 0, 0.66)',
    focusGlow: '0 0 0 4px rgba(147, 197, 253, 0.28)',
    insetShadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 -1px 0 rgba(0, 0, 0, 0.35)',
  },
}
