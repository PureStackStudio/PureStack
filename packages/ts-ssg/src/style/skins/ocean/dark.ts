import type { ThemePalette } from '../../themeOptions'

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
  },
  text: {
    default: '#e7eaf3',
    muted: '#c4cad9',
    subtle: '#9aa4b2',
    accent: '#a9c1ff',
    inverse: '#101827',
    success: '#93f0bf',
    danger: '#ffb0b0',
  },
  border: {
    subtle: '#2a2f38',
    default: '#2d3340',
    strong: '#3a4150',
    accent: '#4b5cc4',
    focus: '#91a7ff',
    success: '#2f8f63',
    danger: '#9f4848',
  },
  action: {
    neutral: {
      background: '#1a2235',
      text: '#e7eaf3',
      hover: '#202a40',
    },
    accent: {
      background: '#b8c9ff',
      text: '#101827',
      hover: '#a6bbff',
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
  },
  badge: {
    accent: {
      background: '#2b3560',
      text: '#c7d2ff',
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
  },
}
