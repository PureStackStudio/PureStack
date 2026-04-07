import { getColors, getGradient } from '@purestack/ts-css'

import type { SemanticToneTokens } from '../../themePalette'

export type ToneScale = {
  shadow: string
  deep: string
  base: string
  bright: string
  glow: string
}

export type Tone = SemanticToneTokens

export type ToneOverrides = {
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

export function rgba(hex: string, alphaValue: number) {
  const normalized = hex.replace('#', '')
  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alphaValue.toFixed(2)})`
}

export function createBorderTone(borderAlpha: number) {
  return (hex: string) => rgba(hex, borderAlpha)
}

export function gradient(angle: string, colors: string[]) {
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

export function radial(top: string, bottom: string) {
  return `radial-gradient(${top} 0%, ${bottom} 100%)`
}

export function createScale(hex: string, delta = 20): ToneScale {
  const [shadow, deep, base, bright, glow] = getColors(hex, delta, delta, 5)
  return { shadow, deep, base, bright, glow }
}

export function createTone(
  scale: ToneScale,
  neutral: Tone,
  borderTone: (hex: string) => string,
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
      default: borderTone(scale.base),
      strong: borderTone(scale.bright),
      hard: borderTone(scale.glow),
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
        border: borderTone(scale.base),
        text: scale.glow,
      },
      hover: {
        background: scale.base,
        border: borderTone(scale.bright),
        text: neutral.text.inverse,
      },
      active: {
        background: scale.deep,
        border: borderTone(scale.glow),
        text: neutral.text.strong,
      },
      disabled: {
        background: scale.deep,
        border: borderTone(scale.deep),
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
