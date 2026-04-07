import { getColors, getGradient } from '@purestack/ts-css'

import type { SemanticToneTokens, ThemePalette } from '../../themePalette'

type ToneScale = {
  shadow: string
  deep: string
  base: string
  bright: string
  glow: string
}

type Tone = SemanticToneTokens
type ToneOverrides = {
  background?: Partial<Tone['background']>
  border?: Partial<Tone['border']>
  text?: Partial<Tone['text']>
  button?: Partial<Tone['button']>
  icon?: Partial<Tone['icon']>
  hover?: Tone['hover']
  active?: Tone['active']
  disabled?: Tone['disabled']
  focusRing?: Tone['focusRing']
}

const core = {
  ink: '#171A23',
  abyss: '#10131B',
  panel: '#232A38',
  frost: '#F4F0F4',
  accent: '#832222',
  info: '#1789b2',
  success: '#1F7A43',
  warning: '#A06E16',
  danger: '#A63A24',
} as const

function rgba(hex: string, alphaValue: number) {
  const normalized = hex.replace('#', '')
  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alphaValue.toFixed(2)})`
}

function gradient(angle: string, colors: string[]) {
  if (colors.length === 2) {
    const stops = getGradient(colors[0], colors[1], 4)
    return `linear-gradient(${angle}, ${stops
      .map((stop) => `${stop.color} ${stop.offset}%`)
      .join(', ')})`
  }

  const step = 100 / (colors.length - 1)
  return `linear-gradient(${angle}, ${colors
    .map((color, index) => `${color} ${Math.round(index * step)}%`)
    .join(', ')})`
}

function radial(top: string, bottom: string) {
  return `radial-gradient(${top} 0%, ${bottom} 100%)`
}

function createScale(hex: string, delta = 20): ToneScale {
  const [shadow, deep, base, bright, glow] = getColors(hex, delta, delta, 5)
  return { shadow, deep, base, bright, glow }
}

function createTone(
  scale: ToneScale,
  neutral: Tone,
  overrides: ToneOverrides = {},
): Tone {
  return {
    background: {
      ...neutral.background,
      default: scale.shadow,
      surface: scale.shadow,
      surfaceAlt: scale.deep,
      panel: scale.shadow,
      raised: scale.base,
      muted: scale.deep,
      feature: scale.base,
      ...(overrides.background || {}),
    },
    border: {
      ...neutral.border,
      default: scale.base,
      strong: scale.bright,
      hard: scale.glow,
      focus: scale.glow,
      ...(overrides.border || {}),
    },
    text: {
      ...neutral.text,
      default: scale.glow,
      strong: scale.glow,
      ...(overrides.text || {}),
    },
    button: {
      rest: {
        background: scale.shadow,
        border: scale.base,
        text: scale.glow,
      },
      hover: {
        background: scale.base,
        border: scale.bright,
        text: neutral.text.inverse,
      },
      active: {
        background: scale.deep,
        border: scale.glow,
        text: neutral.text.strong,
      },
      disabled: {
        background: scale.deep,
        border: scale.deep,
        text: scale.base,
      },
      focusRing: scale.glow,
      ...(overrides.button || {}),
    },
    icon: {
      background: scale.glow,
      gradient: gradient('135deg', [scale.glow, scale.bright]),
      color: neutral.text.inverse,
      ring: scale.bright,
      ...(overrides.icon || {}),
    },
    hover: overrides.hover ?? scale.base,
    active: overrides.active ?? scale.deep,
    disabled: overrides.disabled ?? scale.deep,
    focusRing: overrides.focusRing ?? scale.glow,
  }
}

const surface = createScale(core.panel, 10)
const text = createScale(core.frost, 18)
const accent = createScale(core.accent, 20)
const info = createScale(core.info, 18)
const success = createScale(core.success, 18)
const warning = createScale(core.warning, 18)
const danger = createScale(core.danger, 18)

const neutralTone: Tone = {
  background: {
    default: radial(surface.base, surface.deep),
    canvas: radial(surface.shadow, core.abyss),
    surface: radial(surface.base, surface.deep),
    surfaceAlt: radial(surface.deep, surface.shadow),
    panel: radial(surface.base, surface.deep),
    raised: radial(surface.bright, surface.deep),
    overlay: core.ink,
    showcase: gradient('180deg', [core.ink, core.abyss]),
    showcaseAlt: gradient('180deg', [core.abyss, '#151927']),
    muted: surface.deep,
    feature: accent.shadow,
  },
  border: {
    soft: surface.deep,
    subtle: surface.base,
    default: text.shadow,
    strong: text.deep,
    hard: text.base,
    focus: accent.glow,
  },
  text: {
    default: text.base,
    muted: text.shadow,
    subtle: text.shadow,
    soft: text.deep,
    strong: text.glow,
    inverse: core.ink,
  },
  button: {
    rest: {
      background: radial(surface.base, surface.deep),
      border: text.shadow,
      text: text.base,
    },
    hover: {
      background: radial(surface.bright, surface.deep),
      border: text.base,
      text: text.glow,
    },
    active: {
      background: accent.shadow,
      border: text.deep,
      text: text.glow,
    },
    disabled: {
      background: surface.deep,
      border: surface.deep,
      text: text.deep,
    },
    focusRing: accent.base,
  },
  icon: {
    background: text.glow,
    gradient: gradient('135deg', [text.glow, text.base]),
    color: core.ink,
    ring: text.base,
  },
  hover: radial(surface.bright, surface.deep),
  active: accent.shadow,
  disabled: surface.deep,
  focusRing: accent.base,
}

const accentTone = createTone(accent, neutralTone, {
  background: {
    feature: accent.bright,
  },
  button: {
    rest: {
      background: accent.shadow,
      border: accent.base,
      text: accent.glow,
    },
    hover: {
      background: gradient('135deg', [accent.glow, accent.base]),
      border: accent.bright,
      text: neutralTone.text.inverse,
    },
    active: {
      background: gradient('135deg', [accent.bright, accent.deep]),
      border: accent.glow,
      text: neutralTone.text.strong,
    },
    disabled: {
      background: accent.deep,
      border: accent.deep,
      text: accent.base,
    },
    focusRing: accent.glow,
  },
  icon: {
    background: accent.glow,
    gradient: gradient('135deg', [accent.glow, accent.bright]),
    color: neutralTone.text.inverse,
    ring: accent.bright,
  },
  hover: gradient('135deg', [accent.glow, accent.base]),
  active: gradient('135deg', [accent.bright, accent.deep]),
  disabled: accent.deep,
  focusRing: accent.glow,
})

const ghostTone = createTone(accent, neutralTone, {
  background: {
    default: neutralTone.background.surface,
    surface: neutralTone.background.surface,
    surfaceAlt: neutralTone.background.surfaceAlt,
    panel: neutralTone.background.panel,
    raised: neutralTone.background.raised,
    muted: surface.deep,
    feature: accent.shadow,
  },
  border: {
    default: neutralTone.border.soft,
    subtle: neutralTone.border.soft,
    strong: neutralTone.border.soft,
    hard: neutralTone.border.soft,
  },
  text: {
    default: accent.glow,
    strong: accent.glow,
  },
  button: {
    rest: {
      background: neutralTone.background.surface,
      border: neutralTone.border.soft,
      text: accent.glow,
    },
    hover: {
      background: accent.shadow,
      border: accent.base,
      text: accent.glow,
    },
    active: {
      background: accent.deep,
      border: accent.bright,
      text: neutralTone.text.strong,
    },
    disabled: {
      background: surface.deep,
      border: surface.deep,
      text: accent.base,
    },
    focusRing: accent.glow,
  },
  icon: {
    background: text.base,
    gradient: gradient('135deg', [text.glow, accent.base]),
    color: neutralTone.text.inverse,
    ring: accent.base,
  },
  hover: accent.shadow,
  active: accent.deep,
  disabled: surface.deep,
  focusRing: accent.glow,
})

const infoTone = createTone(info, neutralTone)
const successTone = createTone(success, neutralTone)
const warningTone = createTone(warning, neutralTone)
const dangerTone = createTone(danger, neutralTone)

export const neonDark: ThemePalette = {
  semanticTone: {
    neutral: neutralTone,
    accent: accentTone,
    ghost: ghostTone,
    info: infoTone,
    success: successTone,
    warning: warningTone,
    danger: dangerTone,
  },
  effect: {
    glowPrimary: `0 0 28px ${rgba(accent.base, 0.22)}`,
    glowSecondary: `0 0 28px ${rgba(info.base, 0.18)}`,
    floatingShadow: `0 18px 56px ${rgba(core.ink, 0.64)}`,
    panelShadow: `0 14px 40px ${rgba(core.ink, 0.56)}`,
    panelShadowStrong: `0 22px 72px ${rgba(core.ink, 0.68)}`,
    accentShadow: `0 16px 48px ${rgba(accent.base, 0.22)}`,
    interactiveShadow: `0 12px 34px ${rgba(core.ink, 0.52)}`,
    trackShadow: `inset 0 1px 0 ${rgba(text.glow, 0.05)}`,
    thumbShadow: `0 12px 24px ${rgba(core.ink, 0.58)}`,
    overlayScrim: rgba(core.ink, 0.66),
    focusGlow: `0 0 0 2px ${rgba(accent.base, 0.42)}, 0 0 24px ${rgba(accent.base, 0.18)}`,
    insetShadow: `inset 0 10px 28px ${rgba(core.ink, 0.34)}`,
  },
}
