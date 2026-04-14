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

function linear(angle: string, stops: Array<[string, string]>) {
  return `linear-gradient(${angle}, ${stops
    .map(([color, offset]) => `${color} ${offset}`)
    .join(', ')})`
}

function radialAt(position: string, stops: Array<[string, string]>) {
  return `radial-gradient(circle at ${position}, ${stops
    .map(([color, offset]) => `${color} ${offset}`)
    .join(', ')})`
}

function layered(layers: string[]) {
  return layers.filter(Boolean).join(', ')
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

type ChromeState = 'rest' | 'hover' | 'active' | 'disabled'
type ChromeKind = 'button' | 'surface' | 'surfaceAlt' | 'canvas' | 'icon'

function createChrome(
  kind: ChromeKind,
  scale: ToneScale,
  state: ChromeState,
  isGhost = false,
) {
  if (isGhost && (kind === 'button' || kind === 'surface' || kind === 'surfaceAlt')) {
    if (state === 'rest') return 'transparent'
    if (state === 'disabled') return rgba(scale.level1, 0.12)
  }

  const glossAlphaByState: Record<ChromeState, number> = {
    rest: kind === 'button' ? 0.26 : 0.18,
    hover: kind === 'button' ? 0.34 : 0.22,
    active: kind === 'button' ? 0.18 : 0.14,
    disabled: 0.1,
  }

  const hotspotAlphaByState: Record<ChromeState, number> = {
    rest: kind === 'button' ? 0.24 : 0.16,
    hover: kind === 'button' ? 0.32 : 0.2,
    active: kind === 'button' ? 0.16 : 0.12,
    disabled: 0.08,
  }

  const bottomShadeByState: Record<ChromeState, number> = {
    rest: kind === 'button' ? 0.2 : 0.14,
    hover: kind === 'button' ? 0.24 : 0.18,
    active: kind === 'button' ? 0.28 : 0.22,
    disabled: 0.12,
  }

  const edgeAlphaByState: Record<ChromeState, number> = {
    rest: 0.12,
    hover: 0.16,
    active: 0.2,
    disabled: 0.08,
  }

  const hotspotPosition =
    kind === 'button' ? '20% 18%' : kind === 'icon' ? '24% 18%' : '18% 14%'
  const baseStart =
    state === 'active'
      ? scale.level3
      : state === 'disabled'
        ? scale.level1
        : scale.level2
  const baseMid =
    state === 'hover'
      ? scale.level4
      : state === 'active'
        ? scale.level4
        : state === 'disabled'
          ? scale.level2
          : scale.level3
  const baseEnd =
    state === 'hover'
      ? scale.level5
      : state === 'active'
        ? scale.level5
        : state === 'disabled'
          ? scale.level3
          : scale.level4

  const bodyAngle =
    kind === 'button' ? '145deg' : kind === 'icon' ? '150deg' : '160deg'

  const body = linear(bodyAngle, [
    [baseStart, '0%'],
    [baseMid, '46%'],
    [baseEnd, '100%'],
  ])

  const gloss = linear('180deg', [
    [rgba('#ffffff', glossAlphaByState[state]), '0%'],
    [rgba('#ffffff', glossAlphaByState[state] * 0.55), '14%'],
    [rgba('#ffffff', glossAlphaByState[state] * 0.18), '24%'],
    ['transparent', kind === 'button' ? '44%' : '38%'],
  ])

  const hotspot = radialAt(hotspotPosition, [
    [rgba('#ffffff', hotspotAlphaByState[state]), '0%'],
    [rgba(scale.level1, hotspotAlphaByState[state] * 0.75), '18%'],
    [rgba(scale.level2, hotspotAlphaByState[state] * 0.28), '38%'],
    ['transparent', '68%'],
  ])

  const edgeShade = linear('180deg', [
    [rgba('#000000', edgeAlphaByState[state] * 0.1), '0%'],
    ['transparent', '18%'],
    ['transparent', '72%'],
    [rgba('#000000', bottomShadeByState[state]), '100%'],
  ])

  const rim =
    kind === 'button' || kind === 'icon'
      ? linear('90deg', [
          [rgba('#ffffff', edgeAlphaByState[state] * 0.55), '0%'],
          ['transparent', '14%'],
          ['transparent', '86%'],
          [rgba('#000000', edgeAlphaByState[state] * 0.6), '100%'],
        ])
      : ''

  if (kind === 'canvas') {
    return layered([
      radialAt('16% 12%', [
        [rgba('#ffffff', 0.12), '0%'],
        [rgba(scale.level1, 0.08), '18%'],
        ['transparent', '56%'],
      ]),
      linear('165deg', [
        [scale.level2, '0%'],
        [scale.level3, '52%'],
        [scale.level4, '100%'],
      ]),
      linear('180deg', [
        ['transparent', '0%'],
        [rgba('#000000', 0.08), '100%'],
      ]),
    ])
  }

  return layered([gloss, hotspot, rim, edgeShade, body])
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
): Tone['surface'] {
  return {
    rest: {
      background: createChrome(kind, scale, 'rest', isGhost),
      border: isGhost ? 'transparent' : defaultBorder,
      text: isGhost ? 'currentColor' : defaultText,
      ...(groupOverrides?.rest || {}),
    },
    hover: {
      background: createChrome(kind, scale, 'hover', isGhost),
      border: defaultBorder,
      text: defaultText,
      ...(groupOverrides?.hover || {}),
    },
    active: {
      background: createChrome(kind, scale, 'active', isGhost),
      border: defaultBorder,
      text: defaultText,
      ...(groupOverrides?.active || {}),
    },
    disabled: {
      background: createChrome(kind, scale, 'disabled', isGhost),
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

  const button = {
    rest: {
      background: createChrome('button', background, 'rest', isGhost),
      border: isGhost ? 'transparent' : borderTone(border.level2),
      text: isGhost ? 'currentColor' : foreground.level2,
      ...(overrides.button?.rest || {}),
    },
    hover: {
      background: createChrome('button', background, 'hover', isGhost),
      border: borderTone(border.level4),
      text: foreground.level5,
      ...(overrides.button?.hover || {}),
    },
    active: {
      background: createChrome('button', background, 'active', isGhost),
      border: borderTone(border.level5),
      text: foreground.level5,
      ...(overrides.button?.active || {}),
    },
    disabled: {
      background: createChrome('button', background, 'disabled', isGhost),
      border: borderTone(border.level1),
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
    ),
    canvas: overrides.canvas ?? createChrome('canvas', canvas, 'rest'),
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
      gradient: createChrome('icon', background, 'rest'),
      color: foreground.level5,
      border: defaultBorder,
      ...(overrides.icon || {}),
    },
  }
}
