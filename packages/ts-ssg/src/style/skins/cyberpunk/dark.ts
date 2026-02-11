import type { ThemePalette } from '../../themePalette'

/** DARK: "Neon Nocturne" — deep ink surfaces, cyan/magenta lasers, high-contrast readable text. */
export const cyberpunkGlowDark: ThemePalette = {
  background: {
    canvas: '#07060D', // near-black violet
    surface: '#0C0A16',
    surfaceAlt: '#111029',
    panel: '#0F0D22',
    raised: '#141239',
    overlay: 'rgba(5, 4, 10, 0.78)',
    showcase:
      'radial-gradient(900px 520px at 15% 12%, rgba(0, 255, 240, 0.22) 0%, rgba(0, 0, 0, 0) 60%), radial-gradient(760px 520px at 85% 18%, rgba(255, 46, 192, 0.18) 0%, rgba(0, 0, 0, 0) 58%), linear-gradient(180deg, #07060D 0%, #05040A 100%)',
    showcaseAlt:
      'radial-gradient(900px 520px at 20% 80%, rgba(155, 102, 255, 0.20) 0%, rgba(0, 0, 0, 0) 55%), radial-gradient(720px 480px at 80% 65%, rgba(0, 197, 255, 0.14) 0%, rgba(0, 0, 0, 0) 56%), linear-gradient(180deg, #07060D 0%, #060512 100%)',
    accentMuted: 'rgba(0, 255, 240, 0.08)',
    accent: 'rgba(0, 255, 240, 0.14)',
    feature: 'rgba(255, 46, 192, 0.10)',
    successMuted: 'rgba(0, 255, 163, 0.10)',
    dangerMuted: 'rgba(255, 72, 122, 0.10)',
  },

  text: {
    default: '#EDEBFF',
    muted: '#B9B6E6',
    subtle: '#8F8BBE',
    soft: '#6B6796',
    strong: '#FFFFFF',
    accent: '#00FFF0',
    inverse: '#07060D',
    success: '#00FFA3',
    danger: '#FF487A',
  },

  border: {
    soft: 'rgba(237, 235, 255, 0.08)',
    subtle: 'rgba(237, 235, 255, 0.12)',
    default: 'rgba(237, 235, 255, 0.18)',
    strong: 'rgba(237, 235, 255, 0.28)',
    hard: 'rgba(237, 235, 255, 0.42)',
    accent: 'rgba(0, 255, 240, 0.45)',
    focus: '#00FFF0',
    success: 'rgba(0, 255, 163, 0.55)',
    danger: 'rgba(255, 72, 122, 0.55)',
  },

  action: {
    neutral: {
      background: '#141239',
      text: '#EDEBFF',
      hover: '#19164A',
      active: '#1E1A5C',
      disabled: 'rgba(237, 235, 255, 0.10)',
      focusRing: 'rgba(0, 255, 240, 0.55)',
    },
    accent: {
      background:
        'linear-gradient(90deg, #00FFF0 0%, #9B66FF 55%, #FF2EC0 100%)',
      text: '#07060D',
      hover: 'linear-gradient(90deg, #00E9DC 0%, #8B57FF 55%, #FF1AB6 100%)',
      active: 'linear-gradient(90deg, #00CFC3 0%, #7B48FF 55%, #F200A9 100%)',
      disabled: 'rgba(0, 255, 240, 0.18)',
      focusRing: 'rgba(255, 46, 192, 0.60)',
    },
    ghost: {
      background: 'rgba(0, 0, 0, 0)',
      text: '#00FFF0',
      hover: 'rgba(0, 255, 240, 0.10)',
      active: 'rgba(0, 255, 240, 0.16)',
      disabled: 'rgba(0, 255, 240, 0.20)',
      focusRing: 'rgba(0, 255, 240, 0.55)',
    },
  },

  status: {
    success: {
      background: 'rgba(0, 255, 163, 0.12)',
      border: 'rgba(0, 255, 163, 0.45)',
      text: '#00FFA3',
    },
    danger: {
      background: 'rgba(255, 72, 122, 0.12)',
      border: 'rgba(255, 72, 122, 0.45)',
      text: '#FF487A',
    },
    info: {
      background: 'rgba(0, 197, 255, 0.12)',
      border: 'rgba(0, 197, 255, 0.45)',
      text: '#00C5FF',
    },
    warning: {
      background: 'rgba(255, 209, 71, 0.12)',
      border: 'rgba(255, 209, 71, 0.45)',
      text: '#FFD147',
    },
  },

  badge: {
    accent: {
      background: 'rgba(0, 255, 240, 0.16)',
      text: '#00FFF0',
    },
    muted: {
      background: 'rgba(237, 235, 255, 0.10)',
      text: '#B9B6E6',
    },
    strong: {
      background: 'rgba(255, 46, 192, 0.18)',
      text: '#FF2EC0',
    },
  },

  icon: {
    accent: {
      background: 'rgba(0, 255, 240, 0.14)',
      gradient:
        'linear-gradient(135deg, rgba(0, 255, 240, 0.95) 0%, rgba(155, 102, 255, 0.95) 55%, rgba(255, 46, 192, 0.95) 100%)',
      color: '#07060D',
      ring: 'rgba(0, 255, 240, 0.55)',
    },
    neutral: {
      background: 'rgba(237, 235, 255, 0.10)',
      gradient:
        'linear-gradient(135deg, rgba(237, 235, 255, 0.30) 0%, rgba(155, 102, 255, 0.22) 60%, rgba(0, 255, 240, 0.18) 100%)',
      color: '#EDEBFF',
      ring: 'rgba(237, 235, 255, 0.22)',
    },
    subtle: {
      background: 'rgba(237, 235, 255, 0.06)',
      gradient:
        'linear-gradient(135deg, rgba(237, 235, 255, 0.16) 0%, rgba(237, 235, 255, 0.06) 100%)',
      color: '#B9B6E6',
      ring: 'rgba(237, 235, 255, 0.12)',
    },
  },

  effect: {
    glowPrimary:
      'radial-gradient(520px 320px at 30% 18%, rgba(0, 255, 240, 0.28) 0%, rgba(0, 255, 240, 0) 65%)',
    glowSecondary:
      'radial-gradient(520px 320px at 70% 22%, rgba(255, 46, 192, 0.22) 0%, rgba(255, 46, 192, 0) 66%)',
    floatingShadow:
      '0 14px 40px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 255, 240, 0.10)',
    panelShadow:
      '0 10px 30px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(237, 235, 255, 0.10)',
    panelShadowStrong:
      '0 18px 60px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(0, 255, 240, 0.16)',
    accentShadow:
      '0 10px 40px rgba(0, 255, 240, 0.22), 0 6px 24px rgba(255, 46, 192, 0.14)',
    interactiveShadow:
      '0 10px 28px rgba(0, 0, 0, 0.50), 0 0 18px rgba(0, 255, 240, 0.10)',
    trackShadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 0 0 1px rgba(237, 235, 255, 0.10)',
    thumbShadow:
      '0 10px 22px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 255, 240, 0.14)',
    overlayScrim: 'rgba(5, 4, 10, 0.72)',
    focusGlow:
      '0 0 0 2px rgba(0, 255, 240, 0.55), 0 0 24px rgba(0, 255, 240, 0.26), 0 0 40px rgba(255, 46, 192, 0.14)',
    insetShadow:
      'inset 0 10px 30px rgba(0, 0, 0, 0.35), inset 0 0 0 1px rgba(237, 235, 255, 0.08)',
  },
}
