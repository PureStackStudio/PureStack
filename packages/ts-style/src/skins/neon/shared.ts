import { getColors, getGradient } from '@purestack/ts-css'
import { hexToRgba } from '../../../../ts-css/src/colors'
import type { SemanticToneTokens } from '../../themePalette'

export type ToneScale = {
  level1: string
  level2: string
  level3: string
  level4: string
  level5: string
}

export type Tone = SemanticToneTokens

export type ToneColors = {
  canvas: string
  background: string
  foreground: string
  border: string
  surface: string
  surfaceAlt: string
}

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
  const { r, g, b, a } = hexToRgba(hex)
  return `rgba(${r}, ${g}, ${b}, ${(a ?? alphaValue).toFixed(2)})`
}

export function gradient(angle: string, colors: string[]) {
  if (colors.every((v) => v === 'transparent')) return 'transparent'
  if (colors.every((v) => v === 'currentColor')) return 'currentColor'
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
  if (hex === 'transparent' || hex === 'currentColor')
    return { level1: hex, level2: hex, level3: hex, level4: hex, level5: hex }
  const [level1, level2, level3, level4, level5] = getColors(
    hex,
    delta,
    delta,
    5,
  )
  return { level1, level2, level3, level4, level5 }
}

export function createTone(
  colors: ToneColors,
  borderTone: (hex: string) => string,
  overrides: ToneOverrides = {},
): Tone {
  const canvas = createScale(colors.canvas, 10)
  const background = createScale(colors.background, 10)
  const foreground = createScale(colors.foreground, 1)
  const border = createScale(colors.border, 1)
  const surface = createScale(colors.surface, 10)
  const surfaceAlt = createScale(colors.surfaceAlt, 10)

  const button = {
    rest: {
      background: gradient('135deg', [background.level2, background.level3]),
      border: borderTone(border.level2),
      text: foreground.level2,
      ...(overrides.button?.rest || {}),
    },
    hover: {
      background: gradient('135deg', [background.level3, background.level4]),
      border: borderTone(border.level4),
      text: foreground.level5,
      ...(overrides.button?.hover || {}),
    },
    active: {
      background: gradient('135deg', [background.level3, background.level4]),
      border: borderTone(border.level5),
      text: foreground.level5,
      ...(overrides.button?.active || {}),
    },
    disabled: {
      background: background.level1,
      border: borderTone(border.level1),
      text: foreground.level1,
      ...(overrides.button?.disabled || {}),
    },
    focusRing: overrides.button?.focusRing ?? border.level5,
  }

  return {
    background: {
      canvas: radial(canvas.level2, canvas.level3),
      surface: radial(surface.level2, surface.level3),
      surfaceAlt: radial(surfaceAlt.level3, surfaceAlt.level4),
      overlay: canvas.level1,
      showcase: gradient('180deg', [background.level3, background.level5]),
      showcaseAlt: gradient('180deg', [background.level1, background.level5]),
      ...(overrides.background || {}),
    },
    border: {
      soft: borderTone(border.level1),
      subtle: borderTone(border.level2),
      default: borderTone(border.level3),
      strong: borderTone(border.level4),
      hard: borderTone(border.level5),
      focus: borderTone(border.level5),
      ...(overrides.border || {}),
    },
    text: {
      default: foreground.level3,
      subtle: foreground.level1,
      soft: foreground.level2,
      strong: foreground.level5,
      inverse: canvas.level3,
      ...(overrides.text || {}),
    },
    button,
    icon: {
      background: background.level5,
      gradient: gradient('135deg', [background.level5, background.level4]),
      color: foreground.level5,
      ring: border.level5,
      ...(overrides.icon || {}),
    },
    hover: overrides.hover ?? surfaceAlt.level3,
    active: overrides.active ?? background.level3,
    disabled: overrides.disabled ?? background.level1,
    focusRing: overrides.focusRing ?? border.level5,
  }
}
