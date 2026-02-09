import type { ThemePalette } from '../../themeOptions'

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
  },
  text: {
    default: '#193227',
    muted: '#335648',
    subtle: '#4a6e5f',
    accent: '#1f6a4b',
    inverse: '#ffffff',
    success: '#155b3f',
    danger: '#8a3030',
  },
  border: {
    subtle: '#cfe3d8',
    default: '#bdd9ca',
    strong: '#9fc8b3',
    accent: '#83b79b',
    focus: '#5aa382',
    success: '#5ca67e',
    danger: '#d59c9c',
  },
  action: {
    neutral: {
      background: '#ffffff',
      text: '#1b3a2d',
      hover: '#edf6f0',
    },
    accent: {
      background: '#2f8f66',
      text: '#ffffff',
      hover: '#277a57',
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
  },
  badge: {
    accent: {
      background: '#d4eadc',
      text: '#1e6245',
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
  },
}
