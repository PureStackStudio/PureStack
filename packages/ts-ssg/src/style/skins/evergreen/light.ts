import type { ThemePalette } from '../../themePalette'

export const evergreenLight: ThemePalette = {
  background: {
    canvas: '#f4f8f5',
    surface: '#f6fbf7',
    surfaceAlt: '#eef5f0',
    panel: '#f8fcf9',
    showcase:
      'linear-gradient(135deg, rgba(233, 247, 238, 0.96), rgba(218, 240, 227, 0.96))',
    showcaseAlt:
      'linear-gradient(135deg, rgba(241, 251, 245, 0.97), rgba(224, 244, 233, 0.96))',
    accentMuted: '#dcefe2',
    accent: '#c4e3cf',
    feature: '#eaf7ee',
    successMuted: '#daf1e1',
    dangerMuted: '#fdeeed',
    raised: '#ffffff',
    overlay: 'rgba(15, 23, 42, 0.42)',
  },
  text: {
    default: '#193227',
    muted: '#335648',
    subtle: '#4a6e5f',
    accent: '#1f6a4b',
    inverse: '#ffffff',
    success: '#155b3f',
    danger: '#8a3030',
    soft: '#4a6e5f',
    strong: '#193227',
  },
  border: {
    subtle: '#cfe3d8',
    default: '#bdd9ca',
    strong: '#9fc8b3',
    accent: '#83b79b',
    focus: '#5aa382',
    success: '#5ca67e',
    danger: '#d59c9c',
    soft: '#cfe3d8',
    hard: '#9fc8b3',
  },
  action: {
    neutral: {
      background: '#ffffff',
      text: '#1b3a2d',
      hover: '#edf6f0',
      active: '#edf6f0',
      disabled: '#ffffff',
      focusRing: '#5aa382',
    },
    accent: {
      background: '#2f8f66',
      text: '#ffffff',
      hover: '#277a57',
      active: '#277a57',
      disabled: '#2f8f66',
      focusRing: '#5aa382',
    },
    ghost: {
      background: 'transparent',
      text: '#193227',
      hover: 'rgba(0, 0, 0, 0.04)',
      active: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.02)',
      focusRing: '#5aa382',
    },
  },
  status: {
    success: {
      background: '#daf1e1',
      border: '#5ca67e',
      text: '#155b3f',
    },
    danger: {
      background: '#fdeeed',
      border: '#d59c9c',
      text: '#8a3030',
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
      background: '#d4eadc',
      text: '#1e6245',
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
      background: '#e4f4ea',
      gradient: 'linear-gradient(135deg, #dff2e7, #cce8d8)',
      color: '#216a4b',
      ring: '#9dc8b1',
    },
    neutral: {
      background: '#edf7f0',
      gradient: 'linear-gradient(135deg, #e8f5ed, #d9eee2)',
      color: '#3d745d',
      ring: '#bbdbc9',
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
      'radial-gradient(circle at 12% 18%, rgba(77, 153, 113, 0.28), transparent 56%), radial-gradient(circle at 82% 10%, rgba(255, 255, 255, 0.5), transparent 52%)',
    glowSecondary:
      'radial-gradient(circle at 14% 22%, rgba(70, 148, 108, 0.24), transparent 56%), radial-gradient(circle at 84% 8%, rgba(255, 255, 255, 0.5), transparent 60%)',
    floatingShadow: '0 18px 30px rgba(21, 56, 39, 0.16)',
    panelShadow: '0 12px 22px rgba(22, 55, 40, 0.1)',
    panelShadowStrong: '0 18px 32px rgba(24, 66, 47, 0.2)',
    accentShadow: '0 12px 24px rgba(32, 111, 77, 0.28)',
    interactiveShadow: '0 10px 18px rgba(24, 79, 56, 0.14)',
    trackShadow:
      'inset 0 3px 6px rgba(16, 46, 32, 0.14), inset 0 -2px 4px rgba(255, 255, 255, 0.68)',
    thumbShadow:
      '0 10px 18px rgba(18, 52, 36, 0.2), inset 0 3px 6px rgba(255, 255, 255, 0.28)',
    overlayScrim: 'rgba(15, 23, 42, 0.46)',
    focusGlow: '0 0 0 4px rgba(99, 102, 241, 0.22)',
    insetShadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(15, 23, 42, 0.08)',
  },
}
