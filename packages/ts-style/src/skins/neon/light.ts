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

const delta: DeltaToneColors = {
  canvas: 0,
  button: 0,
  foreground: -3,
  border: 0,
  surface: -5,
  surfaceAlt: 15,
}
const delta1: DeltaToneColors = {
  canvas: 0,
  button: 10,
  foreground: 7,
  border: 0,
  surface: 30,
  surfaceAlt: 30,
}
const mode: ThemeMode = 'dark'
const accentScale = createColorScale(accent, mode)
const neutralScale = createColorScale(neutral, 'light')
const featureScale = createColorScale(feature, mode)
const secondaryScale = createColorScale(secondary, mode)
const customScale = createColorScale(custom, mode)
const infoScale = createColorScale(info, mode)
const successScale = createColorScale(success, mode)
const warningScale = createColorScale(warning, mode)
const dangerScale = createColorScale(danger, mode)
const core: NeonCore = {
  neutral: createToneColors(neutral, neutralScale, delta),
  accent: createToneColors(accent, accentScale, delta1),
  feature: createToneColors(feature, featureScale, delta1),
  secondary: createToneColors(secondary, secondaryScale, delta1),
  custom: createToneColors(custom, customScale, delta1),
  ghost: createToneColors(neutral, neutralScale, delta),
  info: createToneColors(info, infoScale, delta1),
  success: createToneColors(success, successScale, delta1),
  warning: createToneColors(warning, warningScale, delta1),
  danger: createToneColors(danger, dangerScale, delta1),
}

export const neonLight = createNeonPalette({
  mode: 'light',
  core,
  accent,
  chromeLighting: 0.33,
  borderAlpha: 1,
})
