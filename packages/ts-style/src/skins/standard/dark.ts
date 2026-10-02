import { getColors } from '@purestack/ts-css'
import { merge } from '@purestack/ts-util'
import type { ThemeMode } from '../../themeOptions'
import { createStandardPalette, type StandardCore } from './base'
import type { ToneColors } from './shared'

const bestColors = {
  standardBlue: {
    accent: '#1788f1',
    neutral: '#232525',
    secondary: '#27b789',
    feature: '#cb166e',
    custom: '#e35508',
    info: '#15a9c0',
    success: '#259740',
    warning: '#c49a1c',
    danger: '#a92a37',
  },
  blue: {
    accent: '#2874b7',
    neutral: '#2a435a',
    secondary: '#245e6b',
  },
  orange: {
    accent: '#c7460a',
    neutral: '#260d05',
    secondary: '#821e4b',
  },
  yellow: {
    accent: '#b6a012',
    neutral: '#6d6626',
    secondary: '#d7951a',
  },
  red: {
    accent: '#ea1111',
    neutral: '#495e70',
    secondary: '#9a3a27',
  },
  redSkin: {
    accent: '#ea1111',
    neutral: '#5d2929',
    secondary: '#9a3a27',
  },
  green: {
    accent: '#50b728',
    neutral: '#47452b',
    secondary: '#546f26',
  },
  pink: {
    accent: '#ac21d7',
    neutral: '#302534',
    secondary: '#d72194',
  },
  purestack: {
    accent: '#2874b7',
    neutral: '#2a435a',
    secondary: '#245e6b',
  },
  lightgreen: {
    accent: '#99fac0',
    neutral: '#4e5e55',
    success: '#a2d9ad',
    info: '#85b0d6',
    warning: '#d8bb77',
    danger: '#c68887',
    feature: '#b8acd7',
  },
  mint: {
    accent: '#6dd59a',
    neutral: '#304336',
    secondary: '#5fb39a',
    feature: '#a98ad6',
    custom: '#d98b5f',
    info: '#6aa9d4',
    success: '#6fbf83',
    warning: '#d4ad5c',
    danger: '#d47a7a',
  },
  puregate: {
    accent: '#de6310',
    neutral: '#000000',
    secondary: '#6d2727',
  },
  zonetree: {
    accent: '#14d79c',
    neutral: '#294a40',
    secondary: '#6d2727',
  },
}
export type StandardColors = (typeof bestColors)['standardBlue']
export type StandardColorPreset = Partial<StandardColors>

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
  foreground: 7,
  border: 0,
  surface: 0,
  surfaceAlt: 0,
}

const mode: ThemeMode = 'dark'
const scaleLength = 101
export function createColorScale(hex: string, mode: ThemeMode) {
  return getColors(hex, 80, 80, scaleLength, mode === 'light')
}

const toneIndex = 50

function resolveScaleIndex(value: number) {
  return Math.min(Math.max(value, 0), scaleLength - 1)
}

export function createToneColors(
  tone: string,
  scale: string[],
  delta: DeltaToneColors,
): ToneColors {
  if (!tone) throw new Error('tone is not defined.')
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

export function getStandardColors(
  presets?: readonly string[] | StandardColorPreset,
): StandardColors {
  const defaultColors = bestColors.standardBlue
  if (!presets) return defaultColors
  if (!Array.isArray(presets)) {
    return merge(defaultColors, presets)
  }
  let colors: StandardColors = defaultColors
  for (const preset of presets) {
    colors = merge(
      defaultColors,
      bestColors[preset as keyof typeof bestColors] ?? defaultColors,
    )
  }
  return colors
}

function applyDeltaPresets(
  presets: readonly string[] | undefined,
  delta: DeltaToneColors,
) {
  for (const preset of presets ?? []) {
    void preset
    void delta
  }
}

function createStandardDarkCore(
  colors: StandardColors,
  presets: readonly string[] | undefined,
): StandardCore {
  applyDeltaPresets(presets, delta)
  const accentScale = createColorScale(colors.accent, mode)
  const neutralScale = createColorScale(colors.neutral, mode)
  const featureScale = createColorScale(colors.feature, mode)
  const secondaryScale = createColorScale(colors.secondary, mode)
  const customScale = createColorScale(colors.custom, mode)
  const infoScale = createColorScale(colors.info, mode)
  const successScale = createColorScale(colors.success, mode)
  const warningScale = createColorScale(colors.warning, mode)
  const dangerScale = createColorScale(colors.danger, mode)

  return {
    neutral: createToneColors(neutralScale[toneIndex], neutralScale, delta),
    accent: createToneColors(accentScale[toneIndex], accentScale, delta),
    feature: createToneColors(featureScale[toneIndex], featureScale, delta),
    secondary: createToneColors(
      secondaryScale[toneIndex],
      secondaryScale,
      delta,
    ),
    custom: createToneColors(customScale[toneIndex], customScale, delta),
    ghost: createToneColors(neutralScale[toneIndex], neutralScale, delta),
    info: createToneColors(infoScale[toneIndex], infoScale, delta),
    success: createToneColors(successScale[toneIndex], successScale, delta),
    warning: createToneColors(warningScale[toneIndex], warningScale, delta),
    danger: createToneColors(dangerScale[toneIndex], dangerScale, delta),
  }
}

export function createStandardDark(
  presets?: readonly string[] | StandardColorPreset,
) {
  const colors = getStandardColors(presets)
  return createStandardPalette({
    mode: 'dark',
    core: createStandardDarkCore(
      colors,
      Array.isArray(presets) ? presets : undefined,
    ),
    accent: colors.accent,
    chromeLighting: 0.33,
    borderAlpha: 0.66,
  })
}
