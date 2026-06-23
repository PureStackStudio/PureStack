import type { ThemeMode } from '../../themeOptions'
import { createNeonPalette, type NeonCore } from './base'
import {
  createColorScale,
  createToneColors,
  custom,
  type DeltaToneColors,
  danger,
  feature,
  getNeonColors,
  info,
  type NeonColors,
  success,
  warning,
} from './dark'

const mode: ThemeMode = 'dark'
const toneIndex = 25

function applyDeltaPresets(
  presets: readonly string[] | undefined,
  delta: DeltaToneColors,
  delta1: DeltaToneColors,
) {
  void delta
  for (const preset of presets ?? []) {
    if (preset === 'puregate') {
      delta1.button = 0
    }
  }
}

function createNeonLightCore(
  colors: NeonColors,
  presets: readonly string[] | undefined,
): NeonCore {
  const delta: DeltaToneColors = {
    canvas: -5,
    button: 0,
    foreground: -3,
    border: 0,
    surface: -5,
    surfaceAlt: 15,
  }
  const delta1: DeltaToneColors = {
    canvas: 30,
    button: 10,
    foreground: 7,
    border: 30,
    surface: 30,
    surfaceAlt: 25,
  }
  applyDeltaPresets(presets, delta, delta1)
  const accentScale = createColorScale(colors.accent, mode)
  const neutralScale = createColorScale(colors.neutral, 'light')
  const featureScale = createColorScale(feature, mode)
  const secondaryScale = createColorScale(colors.secondary, mode)
  const customScale = createColorScale(custom, mode)
  const infoScale = createColorScale(info, mode)
  const successScale = createColorScale(success, mode)
  const warningScale = createColorScale(warning, mode)
  const dangerScale = createColorScale(danger, mode)

  return {
    neutral: createToneColors(neutralScale[70], neutralScale, delta),
    accent: createToneColors(accentScale[toneIndex], accentScale, delta1),
    feature: createToneColors(featureScale[toneIndex], featureScale, delta1),
    secondary: createToneColors(
      secondaryScale[toneIndex],
      secondaryScale,
      delta1,
    ),
    custom: createToneColors(customScale[toneIndex], customScale, delta1),
    ghost: createToneColors(neutralScale[70], neutralScale, delta),
    info: createToneColors(infoScale[toneIndex], infoScale, delta1),
    success: createToneColors(successScale[toneIndex], successScale, delta1),
    warning: createToneColors(warningScale[toneIndex], warningScale, delta1),
    danger: createToneColors(dangerScale[toneIndex], dangerScale, delta1),
  }
}

export function createNeonLight(presets?: readonly string[]) {
  const colors = getNeonColors(presets)
  return createNeonPalette({
    mode: 'light',
    core: createNeonLightCore(colors, presets),
    accent: colors.accent,
    chromeLighting: 0.33,
    borderAlpha: 1,
    subtleAlpha: 0.8,
  })
}
