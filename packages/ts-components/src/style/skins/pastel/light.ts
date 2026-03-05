import type { ThemePalette } from '../../themePalette'

export const pastelLight: ThemePalette = {
  background: {
    canvas: '#fbf8ff',
    surface: '#fdfbff',
    surfaceAlt: '#f6f1ff',
    panel: '#fffaff',
    showcase:
      'linear-gradient(135deg, rgba(247, 239, 255, 0.96), rgba(238, 247, 255, 0.96))',
    showcaseAlt:
      'linear-gradient(135deg, rgba(255, 245, 252, 0.96), rgba(241, 248, 255, 0.96))',
    accentMuted: '#efe6ff',
    accent: '#dfd1ff',
    feature: '#f5efff',
    successMuted: '#e8f6ee',
    dangerMuted: '#ffeff2',
    raised: '#ffffff',
    overlay: 'rgba(15, 23, 42, 0.42)',
  },
  text: {
    default: '#2c2a3e',
    muted: '#4f4a66',
    subtle: '#6d6788',
    accent: '#6f5ea9',
    inverse: '#ffffff',
    success: '#2f7a57',
    danger: '#a14d5f',
    soft: '#6d6788',
    strong: '#2c2a3e',
  },
  border: {
    subtle: '#e5dcf7',
    default: '#d8cdef',
    strong: '#c8bae6',
    accent: '#b4a2da',
    focus: '#9e8bd0',
    success: '#9ccfb0',
    danger: '#e0a9b5',
    soft: '#e5dcf7',
    hard: '#c8bae6',
  },
  action: {
    neutral: {
      background: '#ffffff',
      text: '#312d45',
      hover: '#f6f1ff',
      active: '#f6f1ff',
      disabled: '#ffffff',
      focusRing: '#9e8bd0',
    },
    accent: {
      background: '#a893d8',
      text: '#ffffff',
      hover: '#947fca',
      active: '#947fca',
      disabled: '#a893d8',
      focusRing: '#9e8bd0',
    },
    ghost: {
      background: 'transparent',
      text: '#2c2a3e',
      hover: 'rgba(0, 0, 0, 0.04)',
      active: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.02)',
      focusRing: '#9e8bd0',
    },
  },
  status: {
    success: {
      background: '#e8f6ee',
      border: '#9ccfb0',
      text: '#2f7a57',
    },
    danger: {
      background: '#ffeff2',
      border: '#e0a9b5',
      text: '#a14d5f',
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
      background: '#ebe2ff',
      text: '#5e4d98',
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
      background: '#f0e9ff',
      gradient: 'linear-gradient(135deg, #eee4ff, #dcd0ff)',
      color: '#6e5ca8',
      ring: '#c7b5ea',
    },
    neutral: {
      background: '#f8f2ff',
      gradient: 'linear-gradient(135deg, #f5ecff, #e9dcff)',
      color: '#7b709e',
      ring: '#d9caef',
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
      'radial-gradient(circle at 12% 20%, rgba(171, 145, 224, 0.28), transparent 56%), radial-gradient(circle at 84% 10%, rgba(163, 214, 245, 0.24), transparent 54%)',
    glowSecondary:
      'radial-gradient(circle at 15% 22%, rgba(180, 157, 230, 0.24), transparent 56%), radial-gradient(circle at 84% 8%, rgba(255, 196, 223, 0.24), transparent 60%)',
    floatingShadow: '0 18px 30px rgba(71, 59, 107, 0.14)',
    panelShadow: '0 12px 20px rgba(70, 60, 104, 0.09)',
    panelShadowStrong: '0 18px 32px rgba(77, 63, 120, 0.18)',
    accentShadow: '0 12px 24px rgba(118, 96, 180, 0.24)',
    interactiveShadow: '0 10px 18px rgba(84, 70, 132, 0.12)',
    trackShadow:
      'inset 0 3px 6px rgba(63, 50, 105, 0.12), inset 0 -2px 4px rgba(255, 255, 255, 0.7)',
    thumbShadow:
      '0 10px 18px rgba(68, 54, 114, 0.18), inset 0 3px 6px rgba(255, 255, 255, 0.28)',
    overlayScrim: 'rgba(15, 23, 42, 0.46)',
    focusGlow: '0 0 0 4px rgba(99, 102, 241, 0.22)',
    insetShadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(15, 23, 42, 0.08)',
  },
}
