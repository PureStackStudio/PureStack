import type { ThemePalette } from '../../themePalette'

/** LIGHT: "Holo Daybreak" — clean luminous surfaces with neon edges; still cyberpunk, but airy. */

export const cyberpunkGlowLight: ThemePalette = {
  background: {
    canvas: '#F7F6FF',
    surface: '#FFFFFF',
    surfaceAlt: '#F1F0FF',
    panel: '#FFFFFF',
    raised: '#FFFFFF',
    overlay: 'rgba(9, 8, 18, 0.32)',
    showcase:
      'radial-gradient(900px 520px at 18% 15%, rgba(0, 255, 240, 0.22) 0%, rgba(0, 0, 0, 0) 60%), radial-gradient(760px 520px at 82% 18%, rgba(255, 46, 192, 0.18) 0%, rgba(0, 0, 0, 0) 58%), linear-gradient(180deg, #F7F6FF 0%, #FFFFFF 100%)',
    showcaseAlt:
      'radial-gradient(900px 520px at 22% 82%, rgba(155, 102, 255, 0.20) 0%, rgba(0, 0, 0, 0) 55%), radial-gradient(720px 480px at 78% 66%, rgba(0, 197, 255, 0.14) 0%, rgba(0, 0, 0, 0) 56%), linear-gradient(180deg, #F7F6FF 0%, #FFFFFF 100%)',
    accentMuted: 'rgba(0, 255, 240, 0.10)',
    accent: 'rgba(0, 255, 240, 0.16)',
    feature: 'rgba(255, 46, 192, 0.10)',
    successMuted: 'rgba(0, 198, 122, 0.12)',
    dangerMuted: 'rgba(255, 72, 122, 0.12)',
  },

  text: {
    default: '#141226',
    muted: '#2C2948',
    subtle: '#4C4770',
    soft: '#6B6796',
    strong: '#07060D',
    accent: '#007CFF', // brighter link ink in light mode (still “neon”)
    inverse: '#FFFFFF',
    success: '#00A86B',
    danger: '#E4175A',
  },

  border: {
    soft: 'rgba(20, 18, 38, 0.10)',
    subtle: 'rgba(20, 18, 38, 0.14)',
    default: 'rgba(20, 18, 38, 0.18)',
    strong: 'rgba(20, 18, 38, 0.26)',
    hard: 'rgba(20, 18, 38, 0.38)',
    accent: 'rgba(0, 255, 240, 0.55)',
    focus: '#00C5FF',
    success: 'rgba(0, 168, 107, 0.45)',
    danger: 'rgba(228, 23, 90, 0.45)',
  },

  action: {
    neutral: {
      background: '#F1F0FF',
      text: '#141226',
      hover: '#E9E7FF',
      active: '#DEDBFF',
      disabled: 'rgba(20, 18, 38, 0.08)',
      focusRing: 'rgba(0, 197, 255, 0.45)',
    },
    accent: {
      background:
        'linear-gradient(90deg, #00C5FF 0%, #9B66FF 50%, #FF2EC0 100%)',
      text: '#FFFFFF',
      hover: 'linear-gradient(90deg, #00B6F0 0%, #8B57FF 50%, #FF1AB6 100%)',
      active: 'linear-gradient(90deg, #00A2D6 0%, #7B48FF 50%, #F200A9 100%)',
      disabled: 'rgba(0, 197, 255, 0.18)',
      focusRing: 'rgba(255, 46, 192, 0.40)',
    },
    ghost: {
      background: 'rgba(0, 0, 0, 0)',
      text: '#007CFF',
      hover: 'rgba(0, 197, 255, 0.14)',
      active: 'rgba(0, 197, 255, 0.20)',
      disabled: 'rgba(20, 18, 38, 0.20)',
      focusRing: 'rgba(0, 197, 255, 0.45)',
    },
  },

  status: {
    success: {
      background: 'rgba(0, 168, 107, 0.10)',
      border: 'rgba(0, 168, 107, 0.30)',
      text: '#007A4E',
    },
    danger: {
      background: 'rgba(228, 23, 90, 0.10)',
      border: 'rgba(228, 23, 90, 0.30)',
      text: '#C20F4A',
    },
    info: {
      background: 'rgba(0, 124, 255, 0.10)',
      border: 'rgba(0, 124, 255, 0.28)',
      text: '#005FE6',
    },
    warning: {
      background: 'rgba(255, 179, 0, 0.14)',
      border: 'rgba(255, 179, 0, 0.34)',
      text: '#A35A00',
    },
  },

  badge: {
    accent: {
      background: 'rgba(0, 197, 255, 0.16)',
      text: '#005FE6',
    },
    muted: {
      background: 'rgba(20, 18, 38, 0.08)',
      text: '#2C2948',
    },
    strong: {
      background: 'rgba(255, 46, 192, 0.14)',
      text: '#B10078',
    },
  },

  icon: {
    accent: {
      background: 'rgba(0, 197, 255, 0.16)',
      gradient:
        'linear-gradient(135deg, rgba(0, 197, 255, 0.95) 0%, rgba(155, 102, 255, 0.95) 55%, rgba(255, 46, 192, 0.95) 100%)',
      color: '#FFFFFF',
      ring: 'rgba(0, 197, 255, 0.40)',
    },
    neutral: {
      background: 'rgba(20, 18, 38, 0.08)',
      gradient:
        'linear-gradient(135deg, rgba(20, 18, 38, 0.10) 0%, rgba(155, 102, 255, 0.14) 60%, rgba(0, 197, 255, 0.12) 100%)',
      color: '#141226',
      ring: 'rgba(20, 18, 38, 0.14)',
    },
    subtle: {
      background: 'rgba(20, 18, 38, 0.05)',
      gradient:
        'linear-gradient(135deg, rgba(20, 18, 38, 0.08) 0%, rgba(20, 18, 38, 0.03) 100%)',
      color: '#4C4770',
      ring: 'rgba(20, 18, 38, 0.10)',
    },
  },

  effect: {
    glowPrimary:
      'radial-gradient(520px 320px at 30% 18%, rgba(0, 197, 255, 0.20) 0%, rgba(0, 197, 255, 0) 65%)',
    glowSecondary:
      'radial-gradient(520px 320px at 70% 22%, rgba(255, 46, 192, 0.16) 0%, rgba(255, 46, 192, 0) 66%)',
    floatingShadow:
      '0 16px 40px rgba(9, 8, 18, 0.14), 0 0 0 1px rgba(0, 197, 255, 0.14)',
    panelShadow:
      '0 12px 30px rgba(9, 8, 18, 0.12), 0 0 0 1px rgba(20, 18, 38, 0.10)',
    panelShadowStrong:
      '0 20px 60px rgba(9, 8, 18, 0.16), 0 0 0 1px rgba(0, 197, 255, 0.16)',
    accentShadow:
      '0 14px 42px rgba(0, 197, 255, 0.18), 0 8px 26px rgba(255, 46, 192, 0.12)',
    interactiveShadow:
      '0 12px 26px rgba(9, 8, 18, 0.12), 0 0 18px rgba(0, 197, 255, 0.10)',
    trackShadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.75), inset 0 0 0 1px rgba(20, 18, 38, 0.10)',
    thumbShadow:
      '0 12px 22px rgba(9, 8, 18, 0.14), 0 0 0 1px rgba(0, 197, 255, 0.14)',
    overlayScrim: 'rgba(9, 8, 18, 0.28)',
    focusGlow:
      '0 0 0 2px rgba(0, 197, 255, 0.40), 0 0 22px rgba(0, 197, 255, 0.18), 0 0 36px rgba(255, 46, 192, 0.10)',
    insetShadow:
      'inset 0 10px 26px rgba(9, 8, 18, 0.08), inset 0 0 0 1px rgba(20, 18, 38, 0.08)',
  },
}
