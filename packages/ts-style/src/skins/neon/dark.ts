import { getColors, getGradient } from '@purestack/ts-css'

import type { SemanticToneTokens, ThemePalette } from '../../themePalette'

type SemanticTone = SemanticToneTokens
type ToneBackground = SemanticTone['background']
type ToneBorder = SemanticTone['border']
type ToneButton = SemanticTone['button']
type ToneButtonState = ToneButton['rest']
type ToneIcon = SemanticTone['icon']
type ToneStates = Pick<
  SemanticTone,
  'hover' | 'active' | 'disabled' | 'focusRing'
>
type ToneOverrides = {
  background?: Partial<ToneBackground>
  border?: Partial<ToneBorder>
  text?: Partial<SemanticTone['text']>
  states?: Partial<ToneStates>
  button?: Partial<ToneButton>
  icon?: Partial<ToneIcon>
}

const core = {
  ink: '#07070B',
  abyss: '#0B0D14',
  panel: '#1B2230',
  frost: '#F6EEF6',
  accent: '#FF2F88',
  info: '#FF8A5B',
  success: '#1EE6A0',
  warning: '#FFC54D',
  danger: '#FF4D6D',
} as const

function rgba(hex: string, alphaValue: number) {
  const normalized = hex.replace('#', '')
  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alphaValue.toFixed(2)})`
}

function linearGradient(
  angle: string,
  colors: string[],
  method: 'hsl' | 'rgb' = 'hsl',
) {
  if (colors.length < 2) return colors[0]

  if (colors.length === 2) {
    return `linear-gradient(${angle}, ${getGradient(
      colors[0],
      colors[1],
      4,
      method,
    )
      .map((stop) => `${stop.color} ${stop.offset}%`)
      .join(', ')})`
  }

  const step = 100 / (colors.length - 1)
  return `linear-gradient(${angle}, ${colors
    .map((color, index) => `${color} ${Math.round(index * step)}%`)
    .join(', ')})`
}

function radialFill(top: string, bottom: string) {
  return `radial-gradient(${top} 0%, ${bottom} 100%)`
}

function radialGlow(
  size: string,
  position: string,
  color: string,
  alphaValue: number,
  fadeAt: number,
) {
  return `radial-gradient(${size} at ${position}, ${rgba(color, alphaValue)} 0%, ${rgba(color, 0)} ${fadeAt}%)`
}

function createHue(hex: string, delta = 24) {
  const [shadow, deep, rich, base, bright, light, glow] = getColors(
    hex,
    delta,
    delta,
    7,
  )

  return { shadow, deep, rich, base, bright, light, glow }
}

function createSoftBackground(
  hue: ReturnType<typeof createHue>,
): ToneBackground {
  return {
    ...neutralTone.background,
    default: rgba(hue.base, 0.14),
    surface: rgba(hue.base, 0.14),
    surfaceAlt: rgba(hue.base, 0.09),
    panel: rgba(hue.base, 0.14),
    raised: rgba(hue.base, 0.18),
    muted: rgba(hue.base, 0.09),
    feature: rgba(hue.base, 0.18),
  }
}

function createSoftBorder(hue: ReturnType<typeof createHue>): ToneBorder {
  return {
    ...neutralTone.border,
    default: rgba(hue.bright, 0.36),
    strong: rgba(hue.light, 0.46),
    hard: rgba(hue.glow, 0.56),
    focus: hue.light,
  }
}

function createSoftTone(
  hue: ReturnType<typeof createHue>,
  overrides: ToneOverrides = {},
): SemanticTone {
  const defaultStates: ToneStates = {
    hover: rgba(hue.bright, 0.32),
    active: rgba(hue.base, 0.18),
    disabled: rgba(hue.base, 0.12),
    focusRing: rgba(hue.light, 0.44),
  }

  const restButton: ToneButtonState = {
    background: rgba(hue.base, 0.14),
    border: rgba(hue.bright, 0.36),
    text: hue.light,
  }
  const hoverButton: ToneButtonState = {
    background: rgba(hue.bright, 0.32),
    border: rgba(hue.bright, 0.36),
    text: core.ink,
  }
  const activeButton: ToneButtonState = {
    background: rgba(hue.base, 0.18),
    border: rgba(hue.bright, 0.36),
    text: hue.glow,
  }
  const disabledButton: ToneButtonState = {
    background: rgba(hue.base, 0.12),
    border: rgba(hue.base, 0.12),
    text: hue.rich,
  }
  const button: ToneButton = {
    rest: restButton,
    hover: hoverButton,
    active: activeButton,
    disabled: disabledButton,
    focusRing: rgba(hue.light, 0.44),
    ...overrides.button,
  }

  return {
    background: {
      ...createSoftBackground(hue),
      ...overrides.background,
    },
    border: {
      ...createSoftBorder(hue),
      ...overrides.border,
    },
    text: {
      ...neutralTone.text,
      default: hue.light,
      strong: hue.glow,
      ...overrides.text,
    },
    icon: {
      background: rgba(hue.base, 0.16),
      gradient: linearGradient('135deg', [hue.light, hue.base]),
      color: hue.light,
      ring: rgba(hue.bright, 0.34),
      ...overrides.icon,
    },
    ...defaultStates,
    ...overrides.states,
    button,
  }
}

const surfaceHue = createHue(core.panel, 10)
const textHue = createHue(core.frost, 28)
const accentHue = createHue(core.accent, 22)
const infoHue = createHue(core.info, 20)
const successHue = createHue(core.success, 18)
const warningHue = createHue(core.warning, 18)
const dangerHue = createHue(core.danger, 20)

const accentBeam = linearGradient('135deg', [
  accentHue.base,
  accentHue.light,
  infoHue.base,
])
const accentPressed = linearGradient('135deg', [
  accentHue.deep,
  accentHue.base,
  infoHue.deep,
])
const vibrantIconGradient = linearGradient('135deg', [
  accentHue.light,
  accentHue.base,
  infoHue.base,
])

const neutralTone: SemanticTone = {
  background: {
    default: radialFill(surfaceHue.rich, surfaceHue.deep),
    canvas: radialFill(surfaceHue.shadow, core.abyss),
    surface: radialFill(surfaceHue.rich, surfaceHue.deep),
    surfaceAlt: radialFill(surfaceHue.deep, surfaceHue.shadow),
    panel: radialFill(surfaceHue.rich, surfaceHue.deep),
    raised: radialFill(surfaceHue.base, surfaceHue.deep),
    overlay: rgba(core.ink, 0.78),
    showcase: [
      radialGlow('920px 540px', '18% 14%', accentHue.base, 0.3, 64),
      radialGlow('760px 520px', '86% 22%', infoHue.base, 0.18, 60),
      linearGradient('180deg', [core.ink, core.abyss], 'rgb'),
    ].join(', '),
    showcaseAlt: [
      radialGlow('900px 520px', '22% 82%', accentHue.deep, 0.24, 60),
      radialGlow('720px 520px', '80% 70%', warningHue.light, 0.12, 58),
      linearGradient('180deg', [core.ink, '#0C0911'], 'rgb'),
    ].join(', '),
    muted: rgba(textHue.base, 0.08),
    feature: rgba(accentHue.base, 0.14),
  },
  border: {
    soft: rgba(textHue.base, 0.08),
    subtle: rgba(textHue.base, 0.16),
    default: rgba(textHue.base, 0.22),
    strong: rgba(textHue.light, 0.3),
    hard: rgba(textHue.glow, 0.42),
    focus: accentHue.light,
  },
  text: {
    default: textHue.base,
    muted: textHue.deep,
    subtle: textHue.deep,
    soft: textHue.rich,
    strong: textHue.glow,
    inverse: core.ink,
  },
  icon: {
    background: rgba(textHue.base, 0.08),
    gradient: linearGradient('135deg', [textHue.light, accentHue.base]),
    color: textHue.base,
    ring: rgba(textHue.base, 0.18),
  },
  hover: radialFill(surfaceHue.base, surfaceHue.deep),
  active: rgba(accentHue.shadow, 0.28),
  disabled: rgba(textHue.base, 0.1),
  focusRing: rgba(accentHue.base, 0.46),
  button: {
    rest: {
      background: radialFill(surfaceHue.rich, surfaceHue.deep),
      border: rgba(textHue.base, 0.22),
      text: textHue.base,
    },
    hover: {
      background: radialFill(surfaceHue.base, surfaceHue.deep),
      border: rgba(textHue.glow, 0.42),
      text: textHue.glow,
    },
    active: {
      background: rgba(accentHue.shadow, 0.28),
      border: rgba(textHue.base, 0.3),
      text: textHue.glow,
    },
    disabled: {
      background: rgba(textHue.base, 0.1),
      border: rgba(textHue.base, 0.1),
      text: textHue.rich,
    },
    focusRing: rgba(accentHue.base, 0.46),
  },
}

const accentTone = createSoftTone(accentHue, {
  background: {
    default: rgba(accentHue.base, 0.18),
    surface: rgba(accentHue.base, 0.18),
    surfaceAlt: rgba(accentHue.base, 0.12),
    panel: rgba(accentHue.base, 0.18),
    raised: rgba(accentHue.base, 0.22),
    muted: rgba(accentHue.base, 0.1),
    feature: rgba(accentHue.base, 0.2),
  },
  border: {
    default: rgba(accentHue.light, 0.46),
    strong: rgba(accentHue.glow, 0.56),
    hard: rgba(accentHue.glow, 0.66),
    focus: accentHue.light,
  },
  text: {
    default: accentHue.light,
    strong: textHue.glow,
  },
  states: {
    hover: accentBeam,
    active: accentPressed,
    disabled: rgba(accentHue.base, 0.18),
    focusRing: rgba(accentHue.glow, 0.6),
  },
  button: {
    rest: {
      background: rgba(accentHue.base, 0.18),
      border: rgba(accentHue.light, 0.46),
      text: accentHue.light,
    },
    hover: {
      background: accentBeam,
      border: rgba(accentHue.glow, 0.56),
      text: core.ink,
    },
    active: {
      background: accentPressed,
      border: rgba(accentHue.glow, 0.66),
      text: textHue.glow,
    },
    disabled: {
      background: rgba(accentHue.base, 0.18),
      border: rgba(accentHue.base, 0.18),
      text: rgba(textHue.base, 0.64),
    },
    focusRing: rgba(accentHue.glow, 0.6),
  },
  icon: {
    background: rgba(accentHue.base, 0.16),
    gradient: vibrantIconGradient,
    color: core.ink,
    ring: rgba(accentHue.light, 0.46),
  },
})

const ghostTone = createSoftTone(accentHue, {
  background: {
    default: 'transparent',
    surface: 'transparent',
    surfaceAlt: 'transparent',
    panel: 'transparent',
    raised: 'transparent',
    muted: rgba(accentHue.base, 0.1),
    feature: rgba(accentHue.base, 0.18),
  },
  border: {
    default: 'transparent',
    subtle: 'transparent',
    strong: 'transparent',
    hard: 'transparent',
    focus: accentHue.light,
  },
  text: {
    default: accentHue.light,
    strong: accentHue.light,
  },
  states: {
    hover: rgba(accentHue.base, 0.18),
    active: rgba(accentHue.base, 0.28),
    disabled: rgba(accentHue.base, 0.12),
    focusRing: rgba(accentHue.light, 0.42),
  },
  button: {
    rest: {
      background: 'transparent',
      border: 'transparent',
      text: accentHue.light,
    },
    hover: {
      background: rgba(accentHue.base, 0.18),
      border: 'transparent',
      text: accentHue.glow,
    },
    active: {
      background: rgba(accentHue.base, 0.28),
      border: 'transparent',
      text: accentHue.glow,
    },
    disabled: {
      background: rgba(accentHue.base, 0.12),
      border: 'transparent',
      text: accentHue.rich,
    },
    focusRing: rgba(accentHue.light, 0.42),
  },
  icon: {
    background: rgba(textHue.base, 0.06),
    gradient: linearGradient('135deg', [textHue.base, accentHue.base]),
    color: textHue.rich,
    ring: rgba(textHue.base, 0.12),
  },
})

const infoTone = createSoftTone(infoHue, {
  text: {
    strong: warningHue.glow,
  },
})

const successTone = createSoftTone(successHue)

const warningTone = createSoftTone(warningHue, {
  states: {
    active: rgba(warningHue.shadow, 0.24),
  },
  button: {
    active: {
      background: rgba(warningHue.shadow, 0.24),
      border: rgba(warningHue.bright, 0.36),
      text: warningHue.glow,
    },
  },
})

const dangerTone = createSoftTone(dangerHue, {
  background: {
    feature: rgba(dangerHue.base, 0.22),
  },
  border: {
    default: rgba(dangerHue.light, 0.42),
    strong: rgba(dangerHue.glow, 0.52),
    hard: rgba(dangerHue.glow, 0.62),
  },
})

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
    glowPrimary: radialGlow('560px 360px', '28% 18%', accentHue.base, 0.34, 66),
    glowSecondary: radialGlow('560px 360px', '72% 24%', infoHue.base, 0.22, 68),
    floatingShadow: `0 18px 56px ${rgba(core.ink, 0.66)}, 0 0 0 1px ${rgba(accentHue.base, 0.12)}`,
    panelShadow: `0 14px 40px ${rgba(core.ink, 0.62)}, 0 0 0 1px ${rgba(textHue.base, 0.08)}`,
    panelShadowStrong: `0 22px 72px ${rgba(core.ink, 0.72)}, 0 0 0 1px ${rgba(accentHue.base, 0.18)}`,
    accentShadow: `0 16px 48px ${rgba(accentHue.base, 0.24)}, 0 8px 28px ${rgba(infoHue.base, 0.16)}`,
    interactiveShadow: `0 12px 34px ${rgba(core.ink, 0.58)}, 0 0 18px ${rgba(accentHue.base, 0.12)}`,
    trackShadow: `inset 0 1px 0 ${rgba(textHue.glow, 0.05)}, inset 0 0 0 1px ${rgba(textHue.base, 0.1)}`,
    thumbShadow: `0 12px 24px ${rgba(core.ink, 0.64)}, 0 0 0 1px ${rgba(accentHue.base, 0.12)}`,
    overlayScrim: rgba(core.ink, 0.72),
    focusGlow: `0 0 0 2px ${rgba(accentHue.base, 0.54)}, 0 0 22px ${rgba(accentHue.base, 0.22)}, 0 0 42px ${rgba(infoHue.base, 0.16)}`,
    insetShadow: `inset 0 10px 28px ${rgba(core.ink, 0.4)}, inset 0 0 0 1px ${rgba(textHue.base, 0.06)}`,
  },
}
