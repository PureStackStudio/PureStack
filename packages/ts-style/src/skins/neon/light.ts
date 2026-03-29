import type { ThemePalette } from '../../themePalette'

export const neonLight: ThemePalette = {
  background: {
    canvas: 'radial-gradient(rgb(233 233 233) 0%, rgb(206 206 206) 100%)',
    surface: '#dcdcdc',
    surfaceAlt: '#d9d9d9',
    panel: '#dcdcdc',
    raised: '#dcdcdc',
    overlay: 'rgba(32, 10, 16, 0.22)',

    showcase:
      'radial-gradient(900px 520px at 18% 14%, rgba(255, 46, 72, 0.22) 0%, rgba(255, 46, 72, 0) 62%), radial-gradient(760px 520px at 86% 22%, rgba(255, 122, 84, 0.16) 0%, rgba(255, 122, 84, 0) 60%), linear-gradient(180deg, #F4ECEE 0%, #EFE6E8 100%)',

    showcaseAlt:
      'radial-gradient(880px 520px at 22% 82%, rgba(255, 0, 60, 0.18) 0%, rgba(255, 0, 60, 0) 60%), radial-gradient(720px 520px at 80% 70%, rgba(255, 198, 168, 0.10) 0%, rgba(255, 198, 168, 0) 58%), linear-gradient(180deg, #F4ECEE 0%, #EDE3E6 100%)',

    accentMuted: 'rgba(255, 46, 72, 0.12)',
    accent: 'rgba(255, 46, 72, 0.18)',
    feature: 'rgba(255, 0, 60, 0.14)',

    successMuted: 'rgba(0, 180, 110, 0.10)',
    dangerMuted: 'rgba(255, 46, 72, 0.14)',
  },

  text: {
    default: '#2A1419',
    muted: '#4A2A30',
    subtle: '#6A474F',
    soft: '#8B6870',
    strong: '#14080C',

    accent: '#D90429', // neon red ink tuned for light bg
    inverse: '#F4ECEE',

    success: '#007F52',
    danger: '#D90429',
  },

  border: {
    soft: 'rgba(42, 20, 25, 0.08)',
    subtle: 'rgba(42, 20, 25, 0.12)',
    default: 'rgba(42, 20, 25, 0.18)',
    strong: 'rgba(42, 20, 25, 0.26)',
    hard: 'rgba(42, 20, 25, 0.38)',

    accent: 'rgba(217, 4, 41, 0.45)',
    focus: '#D90429',

    success: 'rgba(0, 127, 82, 0.40)',
    danger: 'rgba(217, 4, 41, 0.42)',
  },

  action: {
    neutral: {
      background: '#E8DDE0',
      text: '#2A1419',
      hover: '#E1D3D7',
      active: '#D9C9CE',
      disabled: 'rgba(42, 20, 25, 0.08)',
      focusRing: 'rgba(217, 4, 41, 0.40)',
    },

    accent: {
      background:
        'linear-gradient(90deg, #FF2E48 0%, #FF3D5E 55%, #FF7A54 100%)',
      text: '#14080C',
      hover: 'linear-gradient(90deg, #F61C3B 0%, #FF2E48 55%, #F96A45 100%)',
      active: 'linear-gradient(90deg, #D90429 0%, #F61C3B 55%, #E85A36 100%)',
      disabled: 'rgba(255, 46, 72, 0.20)',
      focusRing: 'rgba(217, 4, 41, 0.52)',
    },

    ghost: {
      background: 'rgba(0, 0, 0, 0)',
      text: '#D90429',
      hover: 'rgba(217, 4, 41, 0.10)',
      active: 'rgba(217, 4, 41, 0.16)',
      disabled: 'rgba(217, 4, 41, 0.22)',
      focusRing: 'rgba(217, 4, 41, 0.44)',
    },
  },

  status: {
    success: {
      background: 'rgba(0, 180, 110, 0.12)',
      border: 'rgba(0, 127, 82, 0.30)',
      text: '#007F52',
    },
    danger: {
      background: 'rgba(217, 4, 41, 0.12)',
      border: 'rgba(217, 4, 41, 0.30)',
      text: '#B00020',
    },
    info: {
      background: 'rgba(255, 122, 84, 0.12)',
      border: 'rgba(255, 122, 84, 0.28)',
      text: '#C2482E',
    },
    warning: {
      background: 'rgba(255, 184, 0, 0.14)',
      border: 'rgba(255, 184, 0, 0.30)',
      text: '#A66A00',
    },
  },

  badge: {
    accent: {
      background: 'rgba(217, 4, 41, 0.14)',
      text: '#B00020',
    },
    muted: {
      background: 'rgba(42, 20, 25, 0.08)',
      text: '#4A2A30',
    },
    strong: {
      background: 'rgba(255, 0, 60, 0.16)',
      text: '#A80028',
    },
  },

  icon: {
    accent: {
      background: 'rgba(217, 4, 41, 0.14)',
      gradient:
        'linear-gradient(135deg, rgba(255, 46, 72, 0.98) 0%, rgba(255, 61, 94, 0.98) 55%, rgba(255, 122, 84, 0.98) 100%)',
      color: '#14080C',
      ring: 'rgba(217, 4, 41, 0.40)',
    },
    neutral: {
      background: 'rgba(42, 20, 25, 0.06)',
      gradient:
        'linear-gradient(135deg, rgba(42, 20, 25, 0.10) 0%, rgba(217, 4, 41, 0.08) 70%, rgba(255, 198, 168, 0.08) 100%)',
      color: '#2A1419',
      ring: 'rgba(42, 20, 25, 0.14)',
    },
    subtle: {
      background: 'rgba(42, 20, 25, 0.04)',
      gradient:
        'linear-gradient(135deg, rgba(42, 20, 25, 0.08) 0%, rgba(42, 20, 25, 0.03) 100%)',
      color: '#6A474F',
      ring: 'rgba(42, 20, 25, 0.10)',
    },
  },

  effect: {
    glowPrimary:
      'radial-gradient(560px 360px at 28% 18%, rgba(255, 46, 72, 0.22) 0%, rgba(255, 46, 72, 0) 66%)',
    glowSecondary:
      'radial-gradient(560px 360px at 72% 24%, rgba(255, 122, 84, 0.16) 0%, rgba(255, 122, 84, 0) 68%)',

    floatingShadow:
      '0 14px 36px rgba(42, 20, 25, 0.14), 0 0 0 1px rgba(217, 4, 41, 0.10)',
    panelShadow:
      '0 10px 28px rgba(42, 20, 25, 0.12), 0 0 0 1px rgba(42, 20, 25, 0.08)',
    panelShadowStrong:
      '0 18px 52px rgba(42, 20, 25, 0.16), 0 0 0 1px rgba(217, 4, 41, 0.12)',

    accentShadow:
      '0 12px 38px rgba(255, 46, 72, 0.18), 0 6px 22px rgba(255, 122, 84, 0.12)',
    interactiveShadow:
      '0 10px 26px rgba(42, 20, 25, 0.12), 0 0 16px rgba(217, 4, 41, 0.10)',

    trackShadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.60), inset 0 0 0 1px rgba(42, 20, 25, 0.10)',
    thumbShadow:
      '0 10px 20px rgba(42, 20, 25, 0.14), 0 0 0 1px rgba(217, 4, 41, 0.12)',

    overlayScrim: 'rgba(32, 10, 16, 0.18)',

    focusGlow:
      '0 0 0 2px rgba(217, 4, 41, 0.46), 0 0 20px rgba(255, 46, 72, 0.18), 0 0 40px rgba(255, 122, 84, 0.12)',

    insetShadow:
      'inset 0 8px 24px rgba(42, 20, 25, 0.08), inset 0 0 0 1px rgba(42, 20, 25, 0.06)',
  },
}
