import { getColors } from '@purestack/ts-css'
import type { ThemeMode } from '../../themeOptions'
import { createNeonPalette, type NeonCore } from './base'
import type { ToneColors } from './shared'

const bestColors = {
  standardBlue: {
    accent: '#1788f1',
    neutral: '#232c38',
  },
  orangeBlue: {
    accent: '#c7690a',
    neutral: '#2a5b68',
  },
  orangeDarkBlue: {
    accent: '#c7690a',
    neutral: '#232c38',
  },
  yellow: {
    accent: '#b6a012',
    neutral: '#6d6626',
  },
}
export const { accent, neutral } = bestColors.orangeBlue
export const info = '#15a9c0'
export const success = '#259740'
export const warning = '#c49a1c'
export const danger = '#a92a37'

export interface DeltaToneColors {
  canvas: number
  button: number
  foreground: number
  border: number
  surface: number
  surfaceAlt: number
}

const delta: DeltaToneColors = {
  canvas: 0,
  button: 0,
  foreground: 0,
  border: 0,
  surface: 0,
  surfaceAlt: 0,
}

const mode: ThemeMode = 'dark'
const scaleLength = 101
export function createColorScale(hex: string, mode: ThemeMode) {
  return getColors(hex, 80, 80, scaleLength, mode === 'light')
}

const accentScale = createColorScale(accent, mode)
const neutralScale = createColorScale(neutral, mode)
const infoScale = createColorScale(info, mode)
const successScale = createColorScale(success, mode)
const warningScale = createColorScale(warning, mode)
const dangerScale = createColorScale(danger, mode)
const core: NeonCore = {
  neutral: createToneColors(neutralScale, delta),
  accent: createToneColors(accentScale, delta),
  ghost: createToneColors(neutralScale, delta),
  info: createToneColors(infoScale, delta),
  success: createToneColors(successScale, delta),
  warning: createToneColors(warningScale, delta),
  danger: createToneColors(dangerScale, delta),
}

function resolveScaleIndex(value: number) {
  return Math.min(Math.max(value, 0), scaleLength - 1)
}

export function createToneColors(
  scale: string[],
  delta: DeltaToneColors,
): ToneColors {
  return {
    canvas: scale[resolveScaleIndex(12 + delta.canvas)],
    button: scale[resolveScaleIndex(40 + delta.button)],
    foreground: scale[resolveScaleIndex(80 + delta.foreground)],
    border: scale[resolveScaleIndex(30 + delta.border)],
    surface: scale[resolveScaleIndex(14 + delta.surface)],
    surfaceAlt: scale[resolveScaleIndex(8 + delta.surfaceAlt)],
  }
}

export const neonDark = createNeonPalette({
  mode: 'dark',
  core,
  accent,
  chromeLighting: 0.22,
})
