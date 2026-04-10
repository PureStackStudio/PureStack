import { getColors, getGradient } from '@purestack/ts-css'

import type { SemanticToneTokens } from '../../themePalette'

export type ToneScale = {
  level1: string
  level2: string
  level3: string
  level4: string
  level5: string
}

export type Tone = SemanticToneTokens

type ToneButtonOverrides = {
  rest?: Partial<Tone['button']['rest']>
  hover?: Partial<Tone['button']['hover']>
  active?: Partial<Tone['button']['active']>
  disabled?: Partial<Tone['button']['disabled']>
  focusRing?: Tone['button']['focusRing']
}

export type ToneOverrides = {
  background?: Partial<Tone['background']>
  border?: Partial<Tone['border']>
  text?: Partial<Tone['text']>
  button?: ToneButtonOverrides
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
  const [level1, level2, level3, level4, level5] = getColors(hex, delta, delta, 5)
  return { level1, level2, level3, level4, level5 }
}

export function createTone(
  scale: ToneScale,
  neutral: Tone,
  borderTone: (hex: string) => string,
  overrides: ToneOverrides = {},
): Tone {
  const button = {
    rest: {
      background: scale.level1,
      border: borderTone(scale.level3),
      text: scale.level5,
      ...(overrides.button?.rest || {}),
    },
    hover: {
      background: scale.level3,
      border: borderTone(scale.level4),
      text: neutral.text.inverse,
      ...(overrides.button?.hover || {}),
    },
    active: {
      background: scale.level2,
      border: borderTone(scale.level5),
      text: neutral.text.strong,
      ...(overrides.button?.active || {}),
    },
    disabled: {
      background: scale.level2,
      border: borderTone(scale.level2),
      text: scale.level3,
      ...(overrides.button?.disabled || {}),
    },
    focusRing: overrides.button?.focusRing ?? scale.level5,
  }

  return {
    background: {
      ...neutral.background,
      default: scale.level1,
      surface: scale.level1,
      surfaceAlt: scale.level2,
      panel: scale.level1,
      raised: scale.level3,
      muted: scale.level2,
      feature: scale.level3,
      ...(overrides.background || {}),
    },
    border: {
      ...neutral.border,
      default: borderTone(scale.level3),
      strong: borderTone(scale.level4),
      hard: borderTone(scale.level5),
      focus: scale.level5,
      ...(overrides.border || {}),
    },
    text: {
      ...neutral.text,
      default: scale.level5,
      strong: scale.level5,
      ...(overrides.text || {}),
    },
    button,
    icon: {
      background: scale.level5,
      gradient: gradient('135deg', [scale.level5, scale.level4]),
      color: neutral.text.inverse,
      ring: scale.level4,
      ...(overrides.icon || {}),
    },
    hover: overrides.hover ?? scale.level3,
    active: overrides.active ?? scale.level2,
    disabled: overrides.disabled ?? scale.level2,
    focusRing: overrides.focusRing ?? scale.level5,
  }
}
