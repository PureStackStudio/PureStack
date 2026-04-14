import { getColors, getGradient, hexToRgba } from '@purestack/ts-css'
import type { SemanticToneTokens } from '../../themePalette'
import { createChrome } from './chrome'

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
  button: string
  surface: string
  surfaceAlt: string
  foreground: string
  border: string
}

type ToneButtonOverrides = {
  rest?: Partial<Tone['button']['rest']>
  hover?: Partial<Tone['button']['hover']>
  active?: Partial<Tone['button']['active']>
  disabled?: Partial<Tone['button']['disabled']>
  focusRing?: Tone['button']['focusRing']
}

type ToneSurfaceOverrides = {
  rest?: Partial<Tone['surface']['rest']>
  hover?: Partial<Tone['surface']['hover']>
  active?: Partial<Tone['surface']['active']>
  disabled?: Partial<Tone['surface']['disabled']>
  focusRing?: Tone['surface']['focusRing']
}

export type ToneOverrides = {
  surface?: ToneSurfaceOverrides
  surfaceAlt?: ToneSurfaceOverrides
  canvas?: Tone['canvas']
  overlay?: Tone['overlay']
  border?: Partial<Tone['border']>
  text?: Partial<Tone['text']>
  button?: ToneButtonOverrides
  icon?: Partial<Tone['icon']>
}

type ToneChromeOptions = {
  lighting?: number
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

function createInteractiveGroup(
  scale: ToneScale,
  defaultBorder: string,
  subtleBorder: string,
  focusBorder: string,
  defaultText: string,
  subtleText: string,
  groupOverrides: ToneSurfaceOverrides | undefined,
  isGhost: boolean,
  kind: 'surface' | 'surfaceAlt',
  chrome: ToneChromeOptions,
): Tone['surface'] {
  return {
    rest: {
      background: createChrome(kind, scale, 'rest', isGhost, chrome),
      border: isGhost ? 'transparent' : defaultBorder,
      text: isGhost ? 'currentColor' : defaultText,
      ...(groupOverrides?.rest || {}),
    },
    hover: {
      background: createChrome(kind, scale, 'hover', isGhost, chrome),
      border: defaultBorder,
      text: defaultText,
      ...(groupOverrides?.hover || {}),
    },
    active: {
      background: createChrome(kind, scale, 'active', isGhost, chrome),
      border: defaultBorder,
      text: defaultText,
      ...(groupOverrides?.active || {}),
    },
    disabled: {
      background: createChrome(kind, scale, 'disabled', isGhost, chrome),
      border: subtleBorder,
      text: subtleText,
      ...(groupOverrides?.disabled || {}),
    },
    focusRing: groupOverrides?.focusRing ?? focusBorder,
  }
}

export function createTone(
  colors: ToneColors,
  borderTone: (hex: string) => string,
  overrides: ToneOverrides = {},
  isGhost = false,
  chrome: ToneChromeOptions = {},
): Tone {
  const canvas = createScale(colors.canvas, 10)
  const background = createScale(colors.button, 10)
  const foreground = createScale(colors.foreground, 1)
  const border = createScale(colors.border, 1)
  const surface = createScale(colors.surface, 10)
  const surfaceAlt = createScale(colors.surfaceAlt, 10)
  const defaultText = foreground.level3
  const subtleText = borderTone(foreground.level1)
  const defaultBorder = borderTone(border.level3)
  const subtleBorder = borderTone(border.level2)
  const focusBorder = borderTone(border.level5)
  const buttonBorderRest = borderTone(background.level1)
  const buttonBorderHover = borderTone(background.level2)
  const buttonBorderActive = borderTone(background.level1)
  const buttonBorderDisabled = borderTone(background.level1)

  const button = {
    rest: {
      background: createChrome('button', background, 'rest', isGhost, chrome),
      border: isGhost ? 'transparent' : buttonBorderRest,
      text: isGhost ? 'currentColor' : foreground.level2,
      ...(overrides.button?.rest || {}),
    },
    hover: {
      background: createChrome('button', background, 'hover', isGhost, chrome),
      border: buttonBorderHover,
      text: foreground.level5,
      ...(overrides.button?.hover || {}),
    },
    active: {
      background: createChrome('button', background, 'active', isGhost, chrome),
      border: buttonBorderActive,
      text: foreground.level5,
      ...(overrides.button?.active || {}),
    },
    disabled: {
      background: createChrome(
        'button',
        background,
        'disabled',
        isGhost,
        chrome,
      ),
      border: buttonBorderDisabled,
      text: foreground.level1,
      ...(overrides.button?.disabled || {}),
    },
    focusRing: overrides.button?.focusRing ?? border.level5,
  }

  return {
    surface: createInteractiveGroup(
      surface,
      defaultBorder,
      subtleBorder,
      focusBorder,
      defaultText,
      subtleText,
      overrides.surface,
      isGhost,
      'surface',
      chrome,
    ),
    surfaceAlt: createInteractiveGroup(
      surfaceAlt,
      defaultBorder,
      subtleBorder,
      focusBorder,
      defaultText,
      subtleText,
      overrides.surfaceAlt,
      isGhost,
      'surfaceAlt',
      chrome,
    ),
    canvas: overrides.canvas ?? createChrome('canvas', canvas, 'rest', false, chrome),
    overlay: overrides.overlay ?? canvas.level1,
    border: {
      subtle: subtleBorder,
      default: defaultBorder,
      focus: focusBorder,
      ...(overrides.border || {}),
    },
    text: {
      default: defaultText,
      subtle: subtleText,
      ...(overrides.text || {}),
    },
    button,
    icon: {
      background: background.level5,
      gradient: createChrome('icon', background, 'rest', false, chrome),
      color: foreground.level5,
      border: defaultBorder,
      ...(overrides.icon || {}),
    },
  }
}
