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
  red: {
    accent: '#a61717',
    neutral: '#2c3a49',
  },
}
export const { accent, neutral } = bestColors.red
export const feature = '#cb166e'
export const secondary = '#116db4'
export const custom = '#241002'
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
const featureScale = createColorScale(feature, mode)
const secondaryScale = createColorScale(secondary, mode)
const customScale = createColorScale(custom, mode)
const infoScale = createColorScale(info, mode)
const successScale = createColorScale(success, mode)
const warningScale = createColorScale(warning, mode)
const dangerScale = createColorScale(danger, mode)
const core: NeonCore = {
  neutral: createToneColors(neutral, neutralScale, delta),
  accent: createToneColors(accent, accentScale, delta),
  feature: createToneColors(feature, featureScale, delta),
  secondary: createToneColors(secondary, secondaryScale, delta),
  custom: createToneColors(custom, customScale, delta),
  ghost: createToneColors(neutral, neutralScale, delta),
  info: createToneColors(info, infoScale, delta),
  success: createToneColors(success, successScale, delta),
  warning: createToneColors(warning, warningScale, delta),
  danger: createToneColors(danger, dangerScale, delta),
}

function resolveScaleIndex(value: number) {
  return Math.min(Math.max(value, 0), scaleLength - 1)
}

export function createToneColors(
  tone: string,
  scale: string[],
  delta: DeltaToneColors,
): ToneColors {
  return {
    tone,
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
