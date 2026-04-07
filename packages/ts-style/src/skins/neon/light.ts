import type { ThemePalette } from '../../themePalette'

const neutralBackground = {
  default: '#f4f4f4',
  canvas: 'radial-gradient(rgb(251 251 251) 0%, rgb(246 246 246) 100%)',
  surface: '#f4f4f4',
  surfaceAlt: '#e9e9e9',
  panel: '#f4f4f4',
  raised: '#f4f4f4',
  overlay: 'rgba(32, 10, 16, 0.22)',
  showcase:
    'radial-gradient(900px 520px at 18% 14%, rgba(255, 46, 72, 0.22) 0%, rgba(255, 46, 72, 0) 62%), radial-gradient(760px 520px at 86% 22%, rgba(255, 122, 84, 0.16) 0%, rgba(255, 122, 84, 0) 60%), linear-gradient(180deg, #F4ECEE 0%, #EFE6E8 100%)',
  showcaseAlt:
    'radial-gradient(880px 520px at 22% 82%, rgba(255, 0, 60, 0.18) 0%, rgba(255, 0, 60, 0) 60%), radial-gradient(720px 520px at 80% 70%, rgba(255, 198, 168, 0.10) 0%, rgba(255, 198, 168, 0) 58%), linear-gradient(180deg, #F4ECEE 0%, #EDE3E6 100%)',
  muted: 'rgba(42, 20, 25, 0.08)',
  feature: 'rgba(42, 20, 25, 0.12)',
}

const neutralText = {
  default: '#2A1419',
  muted: '#4A2A30',
  subtle: '#6A474F',
  soft: '#8B6870',
  strong: '#14080C',
  inverse: '#F4ECEE',
}

const neutralBorder = {
  soft: 'rgba(42, 20, 25, 0.08)',
  subtle: 'rgba(42, 20, 25, 0.12)',
  default: 'rgba(42, 20, 25, 0.18)',
  strong: 'rgba(42, 20, 25, 0.26)',
  hard: 'rgba(42, 20, 25, 0.38)',
  focus: '#D90429',
}

export const neonLight: ThemePalette = {
  semanticTone: {
    neutral: {
      background: neutralBackground,
      text: neutralText,
      border: neutralBorder,
      hover: '#E1D3D7',
      active: '#D9C9CE',
      disabled: 'rgba(42, 20, 25, 0.08)',
      focusRing: 'rgba(217, 4, 41, 0.40)',
      button: {
        rest: {
          background: neutralBackground.surface,
          border: neutralBorder.default,
          text: neutralText.default,
        },
        hover: {
          background: '#E1D3D7',
          border: neutralBorder.hard,
          text: neutralText.strong,
        },
        active: {
          background: '#D9C9CE',
          border: neutralBorder.strong,
          text: neutralText.strong,
        },
        disabled: {
          background: 'rgba(42, 20, 25, 0.08)',
          border: neutralBorder.default,
          text: neutralText.muted,
        },
        focusRing: 'rgba(217, 4, 41, 0.40)',
      },
      icon: {
        background: 'rgba(42, 20, 25, 0.06)',
        gradient:
          'linear-gradient(135deg, rgba(42, 20, 25, 0.10) 0%, rgba(217, 4, 41, 0.08) 70%, rgba(255, 198, 168, 0.08) 100%)',
        color: '#2A1419',
        ring: 'rgba(42, 20, 25, 0.14)',
      },
    },
    accent: {
      background: {
        ...neutralBackground,
        default: 'rgba(255, 46, 72, 0.18)',
        surface: 'rgba(255, 46, 72, 0.18)',
        surfaceAlt: 'rgba(255, 46, 72, 0.12)',
        panel: 'rgba(255, 46, 72, 0.18)',
        raised: 'rgba(255, 46, 72, 0.20)',
        muted: 'rgba(255, 46, 72, 0.12)',
        feature: 'rgba(255, 0, 60, 0.14)',
      },
      text: {
        ...neutralText,
        default: '#D90429',
        strong: '#14080C',
      },
      border: {
        ...neutralBorder,
        default: 'rgba(217, 4, 41, 0.45)',
        strong: 'rgba(217, 4, 41, 0.52)',
        hard: 'rgba(217, 4, 41, 0.58)',
        focus: '#D90429',
      },
      hover: 'linear-gradient(90deg, #F61C3B 0%, #FF2E48 55%, #F96A45 100%)',
      active: 'linear-gradient(90deg, #D90429 0%, #F61C3B 55%, #E85A36 100%)',
      disabled: 'rgba(255, 46, 72, 0.20)',
      focusRing: 'rgba(217, 4, 41, 0.52)',
      button: {
        rest: {
          background: 'rgba(255, 46, 72, 0.18)',
          border: 'rgba(217, 4, 41, 0.45)',
          text: '#D90429',
        },
        hover: {
          background:
            'linear-gradient(90deg, #F61C3B 0%, #FF2E48 55%, #F96A45 100%)',
          border: 'rgba(217, 4, 41, 0.52)',
          text: '#14080C',
        },
        active: {
          background:
            'linear-gradient(90deg, #D90429 0%, #F61C3B 55%, #E85A36 100%)',
          border: 'rgba(217, 4, 41, 0.58)',
          text: '#F4ECEE',
        },
        disabled: {
          background: 'rgba(255, 46, 72, 0.20)',
          border: 'rgba(255, 46, 72, 0.20)',
          text: '#7A0016',
        },
        focusRing: 'rgba(217, 4, 41, 0.52)',
      },
      icon: {
        background: 'rgba(217, 4, 41, 0.14)',
        gradient:
          'linear-gradient(135deg, rgba(255, 46, 72, 0.98) 0%, rgba(255, 61, 94, 0.98) 55%, rgba(255, 122, 84, 0.98) 100%)',
        color: '#14080C',
        ring: 'rgba(217, 4, 41, 0.40)',
      },
    },
    ghost: {
      background: {
        ...neutralBackground,
        default: 'rgba(0, 0, 0, 0)',
        surface: 'rgba(0, 0, 0, 0)',
        surfaceAlt: 'rgba(0, 0, 0, 0)',
        panel: 'rgba(0, 0, 0, 0)',
        raised: 'rgba(0, 0, 0, 0)',
        muted: 'rgba(217, 4, 41, 0.10)',
        feature: 'rgba(217, 4, 41, 0.16)',
      },
      text: {
        ...neutralText,
        default: '#D90429',
        strong: '#D90429',
      },
      border: {
        ...neutralBorder,
        default: 'transparent',
        subtle: 'transparent',
        strong: 'transparent',
        hard: 'transparent',
        focus: '#D90429',
      },
      hover: 'rgba(217, 4, 41, 0.10)',
      active: 'rgba(217, 4, 41, 0.16)',
      disabled: 'rgba(217, 4, 41, 0.22)',
      focusRing: 'rgba(217, 4, 41, 0.44)',
      button: {
        rest: {
          background: 'rgba(0, 0, 0, 0)',
          border: 'transparent',
          text: '#D90429',
        },
        hover: {
          background: 'rgba(217, 4, 41, 0.10)',
          border: 'transparent',
          text: '#B00020',
        },
        active: {
          background: 'rgba(217, 4, 41, 0.16)',
          border: 'transparent',
          text: '#7A0016',
        },
        disabled: {
          background: 'rgba(217, 4, 41, 0.22)',
          border: 'transparent',
          text: '#A66A75',
        },
        focusRing: 'rgba(217, 4, 41, 0.44)',
      },
      icon: {
        background: 'rgba(42, 20, 25, 0.04)',
        gradient:
          'linear-gradient(135deg, rgba(42, 20, 25, 0.08) 0%, rgba(42, 20, 25, 0.03) 100%)',
        color: '#6A474F',
        ring: 'rgba(42, 20, 25, 0.10)',
      },
    },
    info: {
      background: {
        ...neutralBackground,
        default: 'rgba(255, 122, 84, 0.12)',
        surface: 'rgba(255, 122, 84, 0.12)',
        surfaceAlt: 'rgba(255, 122, 84, 0.10)',
        panel: 'rgba(255, 122, 84, 0.12)',
        raised: 'rgba(255, 122, 84, 0.14)',
        muted: 'rgba(255, 122, 84, 0.10)',
        feature: 'rgba(255, 122, 84, 0.16)',
      },
      text: {
        ...neutralText,
        default: '#C2482E',
        strong: '#8E2E1B',
      },
      border: {
        ...neutralBorder,
        default: 'rgba(255, 122, 84, 0.28)',
        strong: 'rgba(255, 122, 84, 0.34)',
        hard: 'rgba(255, 122, 84, 0.40)',
        focus: '#C2482E',
      },
      hover: 'rgba(255, 122, 84, 0.28)',
      active: 'rgba(255, 122, 84, 0.12)',
      disabled: 'rgba(255, 122, 84, 0.12)',
      focusRing: 'rgba(255, 122, 84, 0.36)',
      button: {
        rest: {
          background: 'rgba(255, 122, 84, 0.12)',
          border: 'rgba(255, 122, 84, 0.28)',
          text: '#C2482E',
        },
        hover: {
          background: 'rgba(255, 122, 84, 0.28)',
          border: 'rgba(255, 122, 84, 0.28)',
          text: '#14080C',
        },
        active: {
          background: 'rgba(255, 122, 84, 0.12)',
          border: 'rgba(255, 122, 84, 0.28)',
          text: '#8E2E1B',
        },
        disabled: {
          background: 'rgba(255, 122, 84, 0.12)',
          border: 'rgba(255, 122, 84, 0.28)',
          text: '#C2482E',
        },
        focusRing: 'rgba(255, 122, 84, 0.36)',
      },
      icon: {
        background: 'rgba(255, 122, 84, 0.12)',
        gradient:
          'linear-gradient(135deg, rgba(42, 20, 25, 0.10) 0%, rgba(217, 4, 41, 0.08) 70%, rgba(255, 198, 168, 0.08) 100%)',
        color: '#C2482E',
        ring: 'rgba(255, 122, 84, 0.28)',
      },
    },
    success: {
      background: {
        ...neutralBackground,
        default: 'rgba(0, 180, 110, 0.12)',
        surface: 'rgba(0, 180, 110, 0.12)',
        surfaceAlt: 'rgba(0, 180, 110, 0.10)',
        panel: 'rgba(0, 180, 110, 0.12)',
        raised: 'rgba(0, 180, 110, 0.14)',
        muted: 'rgba(0, 180, 110, 0.10)',
        feature: 'rgba(0, 180, 110, 0.16)',
      },
      text: {
        ...neutralText,
        default: '#007F52',
        strong: '#005236',
      },
      border: {
        ...neutralBorder,
        default: 'rgba(0, 127, 82, 0.30)',
        strong: 'rgba(0, 127, 82, 0.36)',
        hard: 'rgba(0, 127, 82, 0.42)',
        focus: '#007F52',
      },
      hover: 'rgba(0, 127, 82, 0.30)',
      active: 'rgba(0, 180, 110, 0.12)',
      disabled: 'rgba(0, 180, 110, 0.12)',
      focusRing: 'rgba(0, 127, 82, 0.38)',
      button: {
        rest: {
          background: 'rgba(0, 180, 110, 0.12)',
          border: 'rgba(0, 127, 82, 0.30)',
          text: '#007F52',
        },
        hover: {
          background: 'rgba(0, 127, 82, 0.30)',
          border: 'rgba(0, 127, 82, 0.30)',
          text: '#14080C',
        },
        active: {
          background: 'rgba(0, 180, 110, 0.12)',
          border: 'rgba(0, 127, 82, 0.30)',
          text: '#005236',
        },
        disabled: {
          background: 'rgba(0, 180, 110, 0.12)',
          border: 'rgba(0, 127, 82, 0.30)',
          text: '#007F52',
        },
        focusRing: 'rgba(0, 127, 82, 0.38)',
      },
      icon: {
        background: 'rgba(0, 180, 110, 0.12)',
        gradient:
          'linear-gradient(135deg, rgba(42, 20, 25, 0.10) 0%, rgba(217, 4, 41, 0.08) 70%, rgba(255, 198, 168, 0.08) 100%)',
        color: '#007F52',
        ring: 'rgba(0, 127, 82, 0.30)',
      },
    },
    warning: {
      background: {
        ...neutralBackground,
        default: 'rgba(255, 184, 0, 0.14)',
        surface: 'rgba(255, 184, 0, 0.14)',
        surfaceAlt: 'rgba(255, 184, 0, 0.12)',
        panel: 'rgba(255, 184, 0, 0.14)',
        raised: 'rgba(255, 184, 0, 0.16)',
        muted: 'rgba(255, 184, 0, 0.12)',
        feature: 'rgba(255, 184, 0, 0.18)',
      },
      text: {
        ...neutralText,
        default: '#A66A00',
        strong: '#714700',
      },
      border: {
        ...neutralBorder,
        default: 'rgba(255, 184, 0, 0.30)',
        strong: 'rgba(255, 184, 0, 0.36)',
        hard: 'rgba(255, 184, 0, 0.42)',
        focus: '#A66A00',
      },
      hover: 'rgba(255, 184, 0, 0.30)',
      active: '#D9C9CE',
      disabled: 'rgba(255, 184, 0, 0.14)',
      focusRing: 'rgba(255, 184, 0, 0.36)',
      button: {
        rest: {
          background: 'rgba(255, 184, 0, 0.14)',
          border: 'rgba(255, 184, 0, 0.30)',
          text: '#A66A00',
        },
        hover: {
          background: 'rgba(255, 184, 0, 0.30)',
          border: 'rgba(255, 184, 0, 0.30)',
          text: '#14080C',
        },
        active: {
          background: '#D9C9CE',
          border: 'rgba(255, 184, 0, 0.30)',
          text: '#714700',
        },
        disabled: {
          background: 'rgba(255, 184, 0, 0.14)',
          border: 'rgba(255, 184, 0, 0.30)',
          text: '#A66A00',
        },
        focusRing: 'rgba(255, 184, 0, 0.36)',
      },
      icon: {
        background: 'rgba(255, 184, 0, 0.14)',
        gradient:
          'linear-gradient(135deg, rgba(42, 20, 25, 0.10) 0%, rgba(217, 4, 41, 0.08) 70%, rgba(255, 198, 168, 0.08) 100%)',
        color: '#A66A00',
        ring: 'rgba(255, 184, 0, 0.30)',
      },
    },
    danger: {
      background: {
        ...neutralBackground,
        default: 'rgba(217, 4, 41, 0.12)',
        surface: 'rgba(217, 4, 41, 0.12)',
        surfaceAlt: 'rgba(217, 4, 41, 0.10)',
        panel: 'rgba(217, 4, 41, 0.12)',
        raised: 'rgba(217, 4, 41, 0.14)',
        muted: 'rgba(217, 4, 41, 0.10)',
        feature: 'rgba(217, 4, 41, 0.16)',
      },
      text: {
        ...neutralText,
        default: '#B00020',
        strong: '#7A0016',
      },
      border: {
        ...neutralBorder,
        default: 'rgba(217, 4, 41, 0.30)',
        strong: 'rgba(217, 4, 41, 0.36)',
        hard: 'rgba(217, 4, 41, 0.42)',
        focus: '#D90429',
      },
      hover: 'rgba(217, 4, 41, 0.30)',
      active: 'rgba(217, 4, 41, 0.12)',
      disabled: 'rgba(217, 4, 41, 0.12)',
      focusRing: 'rgba(217, 4, 41, 0.40)',
      button: {
        rest: {
          background: 'rgba(217, 4, 41, 0.12)',
          border: 'rgba(217, 4, 41, 0.30)',
          text: '#B00020',
        },
        hover: {
          background: 'rgba(217, 4, 41, 0.30)',
          border: 'rgba(217, 4, 41, 0.30)',
          text: '#14080C',
        },
        active: {
          background: 'rgba(217, 4, 41, 0.12)',
          border: 'rgba(217, 4, 41, 0.30)',
          text: '#7A0016',
        },
        disabled: {
          background: 'rgba(217, 4, 41, 0.12)',
          border: 'rgba(217, 4, 41, 0.30)',
          text: '#B00020',
        },
        focusRing: 'rgba(217, 4, 41, 0.40)',
      },
      icon: {
        background: 'rgba(217, 4, 41, 0.12)',
        gradient:
          'linear-gradient(135deg, rgba(42, 20, 25, 0.10) 0%, rgba(217, 4, 41, 0.08) 70%, rgba(255, 198, 168, 0.08) 100%)',
        color: '#B00020',
        ring: 'rgba(217, 4, 41, 0.30)',
      },
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
