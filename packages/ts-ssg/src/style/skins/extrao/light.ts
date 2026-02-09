import type { ThemePalette } from '../../themePalette'

export const extraoLight: ThemePalette = {
  background: {
    canvas: '#ffffff',
    surface: '#f7fafc',
    surfaceAlt: '#edf3f6',
    panel: '#ffffff',
    showcase:
      'linear-gradient(135deg, rgba(92, 124, 137, 0.24), rgba(31, 73, 89, 0.22))',
    showcaseAlt:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(92, 124, 137, 0.16))',
    accentMuted: '#d8e4ea',
    accent: '#b7cbd5',
    feature: '#e8f0f4',
    successMuted: '#e9f4ef',
    dangerMuted: '#f9edef',
    raised: '#ffffff',
    overlay: 'rgba(15, 23, 42, 0.42)',
  },
  text: {
    default: '#242424',
    muted: '#384850',
    subtle: '#5c7c89',
    accent: '#1f4959',
    inverse: '#ffffff',
    success: '#205e46',
    danger: '#842f42',
    soft: '#5c7c89',
    strong: '#242424',
  },
  border: {
    subtle: '#d7e1e7',
    default: '#c0d0d9',
    strong: '#9fb8c5',
    accent: '#6f92a3',
    focus: '#1f4959',
    success: '#89b5a1',
    danger: '#d2a0ac',
    soft: '#d7e1e7',
    hard: '#9fb8c5',
  },
  action: {
    neutral: {
      background: '#ffffff',
      text: '#242424',
      hover: '#eef3f6',
      active: '#eef3f6',
      disabled: '#ffffff',
      focusRing: '#1f4959',
    },
    accent: {
      background: '#1f4959',
      text: '#ffffff',
      hover: '#173846',
      active: '#173846',
      disabled: '#1f4959',
      focusRing: '#1f4959',
    },
    ghost: {
      background: 'transparent',
      text: '#242424',
      hover: 'rgba(0, 0, 0, 0.04)',
      active: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.02)',
      focusRing: '#1f4959',
    },
  },
  status: {
    success: {
      background: '#e5f2ec',
      border: '#8eb8a5',
      text: '#1f6a4d',
    },
    danger: {
      background: '#fbeff1',
      border: '#d6a1af',
      text: '#8a3448',
    },
    info: {
      background: '#e8f1ff',
      border: '#9bbcf0',
      text: '#1d4f91',
    },
    warning: {
      background: '#fff4e5',
      border: '#e1b878',
      text: '#8a5b16',
    },
  },
  badge: {
    accent: {
      background: '#d6e4eb',
      text: '#1f4959',
    },
    muted: {
      background: '#f1f5f9',
      text: '#475569',
    },
    strong: {
      background: '#334155',
      text: '#ffffff',
    },
  },
  icon: {
    accent: {
      background: '#dfeaf0',
      gradient: 'linear-gradient(135deg, #e7f0f4, #cfdfe7)',
      color: '#1f4959',
      ring: '#9eb8c6',
    },
    neutral: {
      background: '#f0f5f8',
      gradient: 'linear-gradient(135deg, #f5f9fc, #e5eef3)',
      color: '#516b78',
      ring: '#c1d2dc',
    },
    subtle: {
      background: '#f8fafc',
      gradient: 'linear-gradient(135deg, #f8fafc, #eef2f7)',
      color: '#64748b',
      ring: '#cbd5e1',
    },
  },
  effect: {
    glowPrimary:
      'radial-gradient(circle at 12% 18%, rgba(31, 73, 89, 0.24), transparent 54%), radial-gradient(circle at 86% 12%, rgba(92, 124, 137, 0.2), transparent 52%)',
    glowSecondary:
      'radial-gradient(circle at 16% 24%, rgba(31, 73, 89, 0.18), transparent 56%), radial-gradient(circle at 84% 8%, rgba(92, 124, 137, 0.18), transparent 58%)',
    floatingShadow: '0 20px 34px rgba(8, 22, 31, 0.2)',
    panelShadow: '0 12px 24px rgba(9, 26, 36, 0.12)',
    panelShadowStrong: '0 20px 34px rgba(8, 23, 33, 0.24)',
    accentShadow: '0 14px 26px rgba(31, 73, 89, 0.28)',
    interactiveShadow: '0 10px 18px rgba(9, 26, 36, 0.16)',
    trackShadow:
      'inset 0 3px 6px rgba(36, 36, 36, 0.14), inset 0 -2px 4px rgba(255, 255, 255, 0.72)',
    thumbShadow:
      '0 10px 18px rgba(8, 23, 33, 0.22), inset 0 3px 6px rgba(255, 255, 255, 0.28)',
    overlayScrim: 'rgba(15, 23, 42, 0.46)',
    focusGlow: '0 0 0 4px rgba(99, 102, 241, 0.22)',
    insetShadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(15, 23, 42, 0.08)',
  },
}
