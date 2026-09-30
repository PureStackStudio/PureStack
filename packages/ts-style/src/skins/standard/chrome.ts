import { hexToRgba } from '@purestack/ts-css'
import { clamp } from '@purestack/ts-util'
import type { ToneScale } from './shared'

export type ChromeState = 'rest' | 'hover' | 'active' | 'disabled'
export type ChromeKind = 'button' | 'surface' | 'surfaceAlt' | 'canvas' | 'icon'
export type ChromeOptions = {
  lighting?: number
}

function rgba(hex: string, alphaValue: number) {
  const { r, g, b, a } = hexToRgba(hex)
  return `rgba(${r}, ${g}, ${b}, ${(a ?? alphaValue).toFixed(2)})`
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

function luminance(hex: string) {
  const { r, g, b } = hexToRgba(hex)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function mix(from: string, to: string, amount: number) {
  const a = hexToRgba(from)
  const b = hexToRgba(to)
  const channel = (x: number, y: number) =>
    Math.round(x + (y - x) * amount)
      .toString(16)
      .padStart(2, '0')
  return `#${channel(a.r, b.r)}${channel(a.g, b.g)}${channel(a.b, b.b)}`
}

export type SpotlightColors = {
  surface: string
  surfaceAlt: string
  button: string
}

/**
 * A deep field lit from one corner, for feature bands and showcase panels.
 * Unlike surfaces it has no gloss, hotspot, or edge shading, so large areas
 * stay calm. The field runs from a lit edge down into the alternate surface.
 * Light comes from the button color when it is brighter than the surface, so
 * dark fields keep their hue, and from white on light fields.
 */
export function createSpotlight(
  { surface, surfaceAlt, button }: SpotlightColors,
  options: ChromeOptions = {},
) {
  const lighting = clamp(options.lighting ?? 0.72, 0, 1.5)
  const light = luminance(button) > luminance(surface) ? button : '#ffffff'
  return layered([
    radialAt('8% 0%', [
      [rgba(mix(light, '#ffffff', 0.4), 0.7 * lighting), '0%'],
      ['transparent', '38%'],
    ]),
    linear('135deg', [
      [mix(surface, light, 0.35), '0%'],
      [mix(surface, surfaceAlt, 0.3), '75%'],
    ]),
  ])
}

export function createChrome(
  kind: ChromeKind,
  scale: ToneScale,
  state: ChromeState,
  isGhost = false,
  options: ChromeOptions = {},
) {
  const lighting = clamp(options.lighting ?? 0.72, 0, 1.5)

  if (
    isGhost &&
    (kind === 'button' || kind === 'surface' || kind === 'surfaceAlt')
  ) {
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
  const bases = {
    hover: {
      baseStart: scale.level4,
      baseMid: scale.level5,
      baseEnd: scale.level4,
    },
    active: {
      baseStart: scale.level4,
      baseMid: scale.level5,
      baseEnd: scale.level4,
    },
    disabled: {
      baseStart: scale.level1,
      baseMid: scale.level2,
      baseEnd: scale.level1,
    },
    rest: {
      baseStart: scale.level3,
      baseMid: scale.level4,
      baseEnd: scale.level3,
    },
  }
  const { baseStart, baseMid, baseEnd } = bases[state]
  const bodyAngle =
    kind === 'button' ? '145deg' : kind === 'icon' ? '150deg' : '160deg'

  const body = linear(bodyAngle, [
    [baseStart, '0%'],
    [baseMid, '46%'],
    [baseEnd, '100%'],
  ])

  const gloss = linear('180deg', [
    [rgba('#ffffff', glossAlphaByState[state] * lighting), '0%'],
    [rgba('#ffffff', glossAlphaByState[state] * 0.55 * lighting), '14%'],
    [rgba('#ffffff', glossAlphaByState[state] * 0.18 * lighting), '24%'],
    ['transparent', kind === 'button' ? '44%' : '38%'],
  ])

  const hotspot = radialAt(hotspotPosition, [
    [rgba('#ffffff', hotspotAlphaByState[state] * lighting), '0%'],
    [rgba(scale.level4, hotspotAlphaByState[state] * 0.75 * lighting), '18%'],
    [rgba(scale.level2, hotspotAlphaByState[state] * 0.28 * lighting), '38%'],
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
          [rgba('#ffffff', edgeAlphaByState[state] * 0.55 * lighting), '0%'],
          ['transparent', '14%'],
          ['transparent', '86%'],
          [rgba('#000000', edgeAlphaByState[state] * 0.6), '100%'],
        ])
      : ''

  if (kind === 'canvas') {
    return layered([
      radialAt('16% 12%', [
        [rgba('#ffffff', 0.12 * lighting), '0%'],
        [rgba(scale.level1, 0.08 * lighting), '18%'],
        ['transparent', '56%'],
      ]),
      linear('165deg', [
        [scale.level1, '0%'],
        [scale.level3, '52%'],
        [scale.level5, '100%'],
      ]),
      linear('180deg', [
        ['transparent', '0%'],
        [rgba('#000000', 0.08), '100%'],
      ]),
    ])
  }

  return layered([gloss, hotspot, rim, edgeShade, body])
}
