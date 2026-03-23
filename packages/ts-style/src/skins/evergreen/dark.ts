import type { ThemePalette } from '../../themePalette'

export const evergreenDark: ThemePalette = {
  background: {
    canvas: '#0f1713',
    surface: '#15211b',
    surfaceAlt: '#1a2a22',
    panel: '#17261f',
    showcase:
      'linear-gradient(135deg, rgba(18, 30, 24, 0.98), rgba(24, 38, 31, 0.98))',
    showcaseAlt:
      'linear-gradient(135deg, rgba(17, 28, 23, 0.98), rgba(26, 41, 33, 0.98))',
    accentMuted: '#20342a',
    accent: '#294437',
    feature: '#1e3128',
    successMuted: '#163427',
    dangerMuted: '#3b2222',
    raised: '#111a24',
    overlay: 'rgba(0, 0, 0, 0.62)',
  },
  text: {
    default: '#e4f0e9',
    muted: '#bfd5c8',
    subtle: '#94b0a2',
    accent: '#8fd5b3',
    inverse: '#0f1a15',
    success: '#97e5bf',
    danger: '#f0b4b4',
    soft: '#94b0a2',
    strong: '#e4f0e9',
  },
  border: {
    subtle: '#2a3d33',
    default: '#31483c',
    strong: '#426352',
    accent: '#5d8c75',
    focus: '#7ec3a0',
    success: '#4f8c6d',
    danger: '#905656',
    soft: '#2a3d33',
    hard: '#426352',
  },
  action: {
    neutral: {
      background: '#1f3329',
      text: '#e4f0e9',
      hover: '#274136',
      active: '#274136',
      disabled: '#1f3329',
      focusRing: '#7ec3a0',
    },
    accent: {
      background: '#86cfab',
      text: '#0f1b15',
      hover: '#74ba98',
      active: '#74ba98',
      disabled: '#86cfab',
      focusRing: '#7ec3a0',
    },
    ghost: {
      background: 'transparent',
      text: '#bfd5c8',
      hover: 'rgba(255, 255, 255, 0.08)',
      active: 'rgba(255, 255, 255, 0.12)',
      disabled: 'rgba(255, 255, 255, 0.04)',
      focusRing: '#7ec3a0',
    },
  },
  status: {
    success: {
      background: '#163427',
      border: '#4f8c6d',
      text: '#97e5bf',
    },
    danger: {
      background: '#3b2222',
      border: '#905656',
      text: '#f0b4b4',
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
      background: '#2c4a3c',
      text: '#bfe8d2',
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
      background: '#243a30',
      gradient: 'linear-gradient(135deg, #2b4538, #21362c)',
      color: '#b9e8d0',
      ring: '#3f6654',
    },
    neutral: {
      background: '#26382f',
      gradient: 'linear-gradient(135deg, #2c4236, #22352c)',
      color: '#a8cfbb',
      ring: '#3b5a4c',
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
      'radial-gradient(circle at 14% 20%, rgba(91, 175, 132, 0.28), transparent 56%), radial-gradient(circle at 86% 12%, rgba(255, 255, 255, 0.07), transparent 60%)',
    glowSecondary:
      'radial-gradient(circle at 14% 22%, rgba(87, 168, 127, 0.24), transparent 56%), radial-gradient(circle at 86% 8%, rgba(255, 255, 255, 0.06), transparent 60%)',
    floatingShadow: '0 22px 34px rgba(4, 11, 8, 0.56)',
    panelShadow: '0 16px 26px rgba(4, 12, 9, 0.44)',
    panelShadowStrong: '0 22px 38px rgba(4, 12, 9, 0.5)',
    accentShadow: '0 14px 26px rgba(7, 22, 16, 0.5)',
    interactiveShadow: '0 14px 24px rgba(5, 16, 11, 0.4)',
    trackShadow:
      'inset 0 3px 7px rgba(3, 10, 7, 0.5), inset 0 -2px 4px rgba(255, 255, 255, 0.05)',
    thumbShadow:
      '0 12px 20px rgba(3, 10, 7, 0.56), inset 0 3px 6px rgba(255, 255, 255, 0.18)',
    overlayScrim: 'rgba(0, 0, 0, 0.66)',
    focusGlow: '0 0 0 4px rgba(147, 197, 253, 0.28)',
    insetShadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 -1px 0 rgba(0, 0, 0, 0.35)',
  },
}
