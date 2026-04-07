import type { ThemePalette } from '../../themePalette'

const neutralBackground = {
  default: 'radial-gradient(rgb(31 34 38) 0%, rgb(24 26 34) 100%)',
  canvas: 'radial-gradient(rgb(19 20 21) 0%, rgb(22 24 31) 100%)',
  surface: 'radial-gradient(rgb(31 34 38) 0%, rgb(24 26 34) 100%)',
  surfaceAlt: 'radial-gradient(rgb(15 17 19) 0%, rgb(23 25 33) 100%)',
  panel: 'radial-gradient(rgb(31 34 38) 0%, rgb(24 26 34) 100%)',
  raised: 'radial-gradient(rgb(31 34 38) 0%, rgb(24 26 34) 100%)',
  overlay: 'rgba(8, 4, 6, 0.76)',
  showcase:
    'radial-gradient(900px 520px at 18% 14%, rgba(255, 46, 72, 0.28) 0%, rgba(255, 46, 72, 0) 62%), radial-gradient(760px 520px at 86% 22%, rgba(255, 120, 84, 0.18) 0%, rgba(255, 120, 84, 0) 60%), linear-gradient(180deg, #0B0608 0%, #090507 100%)',
  showcaseAlt:
    'radial-gradient(880px 520px at 22% 82%, rgba(255, 0, 60, 0.22) 0%, rgba(255, 0, 60, 0) 60%), radial-gradient(720px 520px at 80% 70%, rgba(255, 198, 168, 0.10) 0%, rgba(255, 198, 168, 0) 58%), linear-gradient(180deg, #0B0608 0%, #0A0608 100%)',
  muted: 'rgba(247, 238, 240, 0.08)',
  feature: 'rgba(247, 238, 240, 0.12)',
}

const neutralText = {
  default: '#F7EEF0',
  muted: '#7d7d85',
  subtle: '#7d7d85',
  soft: '#7d7d85',
  strong: '#FFFFFF',
  inverse: '#0B0608',
}

const neutralBorder = {
  soft: 'rgba(247, 238, 240, 0.08)',
  subtle: 'rgba(247, 238, 240, 0.24)',
  default: 'rgba(247, 238, 240, 0.18)',
  strong: 'rgba(247, 238, 240, 0.28)',
  hard: 'rgba(247, 238, 240, 0.42)',
  focus: '#FF2E48',
}

export const neonDark: ThemePalette = {
  semanticTone: {
    neutral: {
      background: neutralBackground,
      text: neutralText,
      border: neutralBorder,
      hover: 'radial-gradient(rgb(35 38 42) 0%, rgb(27 29 37) 100%)',
      active: '#2A1820',
      disabled: 'rgba(247, 238, 240, 0.10)',
      focusRing: 'rgba(255, 46, 72, 0.46)',
      icon: {
        background: 'rgba(247, 238, 240, 0.10)',
        gradient:
          'linear-gradient(135deg, rgba(247, 238, 240, 0.22) 0%, rgba(255, 46, 72, 0.10) 70%, rgba(255, 198, 168, 0.10) 100%)',
        color: '#F7EEF0',
        ring: 'rgba(247, 238, 240, 0.18)',
      },
    },
    accent: {
      background: {
        ...neutralBackground,
        default: 'rgba(255, 46, 72, 0.16)',
        surface: 'rgba(255, 46, 72, 0.16)',
        surfaceAlt: 'rgba(255, 46, 72, 0.10)',
        panel: 'rgba(255, 46, 72, 0.16)',
        raised: 'rgba(255, 46, 72, 0.18)',
        muted: 'rgba(255, 46, 72, 0.10)',
        feature: 'rgba(255, 0, 60, 0.14)',
      },
      text: {
        ...neutralText,
        default: '#FF2E48',
        strong: '#FFFFFF',
      },
      border: {
        ...neutralBorder,
        default: 'rgba(255, 46, 72, 0.52)',
        strong: 'rgba(255, 46, 72, 0.58)',
        hard: 'rgba(255, 46, 72, 0.66)',
        focus: '#FF2E48',
      },
      hover: 'linear-gradient(90deg, #FF1636 0%, #FF2E48 100%)',
      active: 'linear-gradient(90deg, #E9002E 0%, #FF1F3F 100%)',
      disabled: 'rgba(255, 46, 72, 0.18)',
      focusRing: 'rgba(255, 46, 72, 0.62)',
      icon: {
        background: 'rgba(255, 46, 72, 0.14)',
        gradient:
          'linear-gradient(135deg, rgba(255, 46, 72, 0.98) 0%, rgba(255, 61, 94, 0.98) 55%, rgba(255, 122, 84, 0.98) 100%)',
        color: '#0B0608',
        ring: 'rgba(255, 46, 72, 0.52)',
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
        muted: 'rgba(255, 46, 72, 0.16)',
        feature: 'rgba(255, 46, 72, 0.22)',
      },
      text: {
        ...neutralText,
        default: '#FF2E48',
        strong: '#FF2E48',
      },
      border: {
        ...neutralBorder,
        default: 'transparent',
        subtle: 'transparent',
        strong: 'transparent',
        hard: 'transparent',
        focus: '#FF2E48',
      },
      hover: 'rgba(255, 46, 72, 0.40)',
      active: 'rgba(255, 46, 72, 0.16)',
      disabled: 'rgba(255, 46, 72, 0.20)',
      focusRing: 'rgba(255, 46, 72, 0.52)',
      icon: {
        background: 'rgba(247, 238, 240, 0.06)',
        gradient:
          'linear-gradient(135deg, rgba(247, 238, 240, 0.14) 0%, rgba(247, 238, 240, 0.06) 100%)',
        color: '#D8BFC4',
        ring: 'rgba(247, 238, 240, 0.12)',
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
        feature: 'rgba(255, 122, 84, 0.18)',
      },
      text: {
        ...neutralText,
        default: '#FF7A54',
        strong: '#FFB19A',
      },
      border: {
        ...neutralBorder,
        default: 'rgba(255, 122, 84, 0.38)',
        strong: 'rgba(255, 122, 84, 0.42)',
        hard: 'rgba(255, 122, 84, 0.48)',
        focus: '#FF7A54',
      },
      hover: 'rgba(255, 122, 84, 0.38)',
      active: 'rgba(255, 122, 84, 0.12)',
      disabled: 'rgba(255, 122, 84, 0.12)',
      focusRing: 'rgba(255, 122, 84, 0.42)',
      icon: {
        background: 'rgba(255, 122, 84, 0.12)',
        gradient:
          'linear-gradient(135deg, rgba(247, 238, 240, 0.22) 0%, rgba(255, 46, 72, 0.10) 70%, rgba(255, 198, 168, 0.10) 100%)',
        color: '#FF7A54',
        ring: 'rgba(255, 122, 84, 0.38)',
      },
    },
    success: {
      background: {
        ...neutralBackground,
        default: 'rgba(0, 210, 120, 0.12)',
        surface: 'rgba(0, 210, 120, 0.12)',
        surfaceAlt: 'rgba(0, 210, 120, 0.10)',
        panel: 'rgba(0, 210, 120, 0.12)',
        raised: 'rgba(0, 210, 120, 0.14)',
        muted: 'rgba(0, 210, 120, 0.10)',
        feature: 'rgba(0, 210, 120, 0.18)',
      },
      text: {
        ...neutralText,
        default: '#00D278',
        strong: '#A4FFD5',
      },
      border: {
        ...neutralBorder,
        default: 'rgba(0, 210, 120, 0.40)',
        strong: 'rgba(0, 210, 120, 0.46)',
        hard: 'rgba(0, 210, 120, 0.52)',
        focus: '#00D278',
      },
      hover: 'rgba(0, 210, 120, 0.40)',
      active: 'rgba(0, 210, 120, 0.12)',
      disabled: 'rgba(0, 210, 120, 0.12)',
      focusRing: 'rgba(0, 210, 120, 0.44)',
      icon: {
        background: 'rgba(0, 210, 120, 0.12)',
        gradient:
          'linear-gradient(135deg, rgba(247, 238, 240, 0.22) 0%, rgba(255, 46, 72, 0.10) 70%, rgba(255, 198, 168, 0.10) 100%)',
        color: '#00D278',
        ring: 'rgba(0, 210, 120, 0.40)',
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
        feature: 'rgba(255, 184, 0, 0.20)',
      },
      text: {
        ...neutralText,
        default: '#FFB800',
        strong: '#FFE8A4',
      },
      border: {
        ...neutralBorder,
        default: 'rgba(255, 184, 0, 0.42)',
        strong: 'rgba(255, 184, 0, 0.48)',
        hard: 'rgba(255, 184, 0, 0.54)',
        focus: '#FFB800',
      },
      hover: 'rgba(255, 184, 0, 0.42)',
      active: '#2A1820',
      disabled: 'rgba(255, 184, 0, 0.14)',
      focusRing: 'rgba(255, 184, 0, 0.46)',
      icon: {
        background: 'rgba(255, 184, 0, 0.14)',
        gradient:
          'linear-gradient(135deg, rgba(247, 238, 240, 0.22) 0%, rgba(255, 46, 72, 0.10) 70%, rgba(255, 198, 168, 0.10) 100%)',
        color: '#FFB800',
        ring: 'rgba(255, 184, 0, 0.42)',
      },
    },
    danger: {
      background: {
        ...neutralBackground,
        default: 'rgba(255, 46, 72, 0.12)',
        surface: 'rgba(255, 46, 72, 0.12)',
        surfaceAlt: 'rgba(255, 46, 72, 0.10)',
        panel: 'rgba(255, 46, 72, 0.12)',
        raised: 'rgba(255, 46, 72, 0.14)',
        muted: 'rgba(255, 46, 72, 0.10)',
        feature: 'rgba(255, 46, 72, 0.18)',
      },
      text: {
        ...neutralText,
        default: '#FF2E48',
        strong: '#FFB3BE',
      },
      border: {
        ...neutralBorder,
        default: 'rgba(255, 46, 72, 0.44)',
        strong: 'rgba(255, 46, 72, 0.50)',
        hard: 'rgba(255, 46, 72, 0.56)',
        focus: '#FF2E48',
      },
      hover: 'rgba(255, 46, 72, 0.44)',
      active: 'rgba(255, 46, 72, 0.12)',
      disabled: 'rgba(255, 46, 72, 0.12)',
      focusRing: 'rgba(255, 46, 72, 0.48)',
      icon: {
        background: 'rgba(255, 46, 72, 0.12)',
        gradient:
          'linear-gradient(135deg, rgba(247, 238, 240, 0.22) 0%, rgba(255, 46, 72, 0.10) 70%, rgba(255, 198, 168, 0.10) 100%)',
        color: '#FF2E48',
        ring: 'rgba(255, 46, 72, 0.44)',
      },
    },
  },
  effect: {
    glowPrimary:
      'radial-gradient(560px 360px at 28% 18%, rgba(255, 46, 72, 0.30) 0%, rgba(255, 46, 72, 0) 66%)',
    glowSecondary:
      'radial-gradient(560px 360px at 72% 24%, rgba(255, 122, 84, 0.20) 0%, rgba(255, 122, 84, 0) 68%)',
    floatingShadow:
      '0 16px 48px rgba(0, 0, 0, 0.62), 0 0 0 1px rgba(255, 46, 72, 0.10)',
    panelShadow:
      '0 12px 36px rgba(0, 0, 0, 0.62), 0 0 0 1px rgba(247, 238, 240, 0.10)',
    panelShadowStrong:
      '0 20px 64px rgba(0, 0, 0, 0.70), 0 0 0 1px rgba(255, 46, 72, 0.14)',
    accentShadow:
      '0 14px 46px rgba(255, 46, 72, 0.22), 0 8px 26px rgba(255, 122, 84, 0.14)',
    interactiveShadow:
      '0 12px 32px rgba(0, 0, 0, 0.58), 0 0 18px rgba(255, 46, 72, 0.10)',
    trackShadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 0 0 1px rgba(247, 238, 240, 0.10)',
    thumbShadow:
      '0 12px 24px rgba(0, 0, 0, 0.62), 0 0 0 1px rgba(255, 46, 72, 0.12)',
    overlayScrim: 'rgba(8, 4, 6, 0.70)',
    focusGlow:
      '0 0 0 2px rgba(255, 46, 72, 0.56), 0 0 22px rgba(255, 46, 72, 0.22), 0 0 44px rgba(255, 122, 84, 0.14)',
    insetShadow:
      'inset 0 10px 28px rgba(0, 0, 0, 0.38), inset 0 0 0 1px rgba(247, 238, 240, 0.08)',
  },
}
