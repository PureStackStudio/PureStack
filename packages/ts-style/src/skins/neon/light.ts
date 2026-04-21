import type { ThemeMode } from '../../themeOptions'
import { createNeonPalette, type NeonCore } from './base'
import {
  accent,
  createColorScale,
  createToneColors,
  custom,
  type DeltaToneColors,
  danger,
  feature,
  info,
  neutral,
  secondary,
  success,
  warning,
} from './dark'

const delta1: DeltaToneColors = {
  canvas: 0,
  button: -10,
  foreground: 0,
  border: 0,
  surface: 0,
  surfaceAlt: 0,
}
const delta2: DeltaToneColors = {
  canvas: 0,
  button: -10,
  foreground: 0,
  border: 0,
  surface: 10,
  surfaceAlt: 30,
}
const mode: ThemeMode = 'light'
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
  neutral: createToneColors(neutral, neutralScale, delta1),
  accent: createToneColors(accent, accentScale, delta2),
  feature: createToneColors(feature, featureScale, delta2),
  secondary: createToneColors(secondary, secondaryScale, delta2),
  custom: createToneColors(custom, customScale, delta2),
  ghost: createToneColors(neutral, neutralScale, delta1),
  info: createToneColors(info, infoScale, delta2),
  success: createToneColors(success, successScale, delta2),
  warning: createToneColors(warning, warningScale, delta2),
  danger: createToneColors(danger, dangerScale, delta2),
}

export const neonLight = createNeonPalette({
  mode: 'light',
  core,
  accent,
  chromeLighting: 0.33,
})
