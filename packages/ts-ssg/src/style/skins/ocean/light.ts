import type { ThemePalette } from '../../themePalette'

export const oceanLight: ThemePalette = {
  background: {
    canvas: '#f5f7fb',
    surface: '#f6f7fb',
    surfaceAlt: '#f8f9fd',
    panel: '#f6f7fb',
    showcase:
      'linear-gradient(135deg, rgba(241, 244, 255, 0.95), rgba(232, 238, 255, 0.95))',
    showcaseAlt:
      'linear-gradient(135deg, rgba(248, 249, 255, 0.96), rgba(233, 239, 255, 0.96))',
    accentMuted: '#e9edf7',
    accent: '#d7e2ff',
    feature: '#f3f6ff',
    successMuted: '#e8f8ef',
    dangerMuted: '#fff0f0',
    raised: '#ffffff',
    overlay: 'rgba(15, 23, 42, 0.42)',
  },
  text: {
    default: '#1f2937',
    muted: '#4b5563',
    subtle: '#6b7280',
    accent: '#2f4ea1',
    inverse: '#ffffff',
    success: '#0f6a3f',
    danger: '#8b1d1d',
    soft: '#6b7280',
    strong: '#1f2937',
  },
  border: {
    subtle: '#e1e4ef',
    default: '#d1d6e2',
    strong: '#cfd8f5',
    accent: '#b9c9ff',
    focus: '#9ab3ff',
    success: '#7ecb9c',
    danger: '#e0a1a1',
    soft: '#e1e4ef',
    hard: '#cfd8f5',
  },
  action: {
    neutral: {
      background: '#ffffff',
      text: '#1f2937',
      hover: '#eef2ff',
      active: '#eef2ff',
      disabled: '#ffffff',
      focusRing: '#9ab3ff',
    },
    accent: {
      background: '#b9c9ff',
      text: '#1b223a',
      hover: '#a7bbff',
      active: '#a7bbff',
      disabled: '#b9c9ff',
      focusRing: '#9ab3ff',
    },
    ghost: {
      background: 'transparent',
      text: '#1f2937',
      hover: 'rgba(0, 0, 0, 0.04)',
      active: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.02)',
      focusRing: '#9ab3ff',
    },
  },
  status: {
    success: {
      background: '#e8f8ef',
      border: '#7ecb9c',
      text: '#0f6a3f',
    },
    danger: {
      background: '#fff0f0',
      border: '#e0a1a1',
      text: '#8b1d1d',
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
      background: '#e6ecfb',
      text: '#3a4a7d',
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
      background: '#eef2ff',
      gradient: 'linear-gradient(135deg, #e9eeff, #d8e2ff)',
      color: '#3f57bf',
      ring: '#c8d5ff',
    },
    neutral: {
      background: '#eef2ff',
      gradient: 'linear-gradient(135deg, #eff3ff, #e1e9ff)',
      color: '#5b6fe0',
      ring: '#d2ddff',
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
      'radial-gradient(circle at 10% 20%, rgba(120, 152, 255, 0.45), transparent 55%), radial-gradient(circle at 80% 10%, rgba(255, 255, 255, 0.5), transparent 50%)',
    glowSecondary:
      'radial-gradient(circle at 15% 20%, rgba(124, 152, 255, 0.35), transparent 55%), radial-gradient(circle at 80% 5%, rgba(255, 255, 255, 0.6), transparent 60%)',
    floatingShadow: '0 18px 30px rgba(25, 35, 70, 0.15)',
    panelShadow: '0 12px 20px rgba(15, 23, 42, 0.08)',
    panelShadowStrong: '0 18px 30px rgba(53, 78, 170, 0.18)',
    accentShadow: '0 12px 24px rgba(87, 112, 209, 0.25)',
    interactiveShadow: '0 10px 18px rgba(46, 64, 130, 0.12)',
    trackShadow:
      'inset 0 3px 6px rgba(0, 0, 0, 0.12), inset 0 -2px 4px rgba(255, 255, 255, 0.7)',
    thumbShadow:
      '0 10px 18px rgba(0, 0, 0, 0.18), inset 0 3px 6px rgba(255, 255, 255, 0.3)',
    overlayScrim: 'rgba(15, 23, 42, 0.46)',
    focusGlow: '0 0 0 4px rgba(99, 102, 241, 0.22)',
    insetShadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(15, 23, 42, 0.08)',
  },
}
