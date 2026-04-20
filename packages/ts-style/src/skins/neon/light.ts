import type { ThemeMode } from '../../themeOptions'
import { createNeonPalette, type NeonCore } from './base'
import {
  accent,
  createColorScale,
  createToneColors,
  type DeltaToneColors,
  danger,
  info,
  neutral,
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
const infoScale = createColorScale(info, mode)
const successScale = createColorScale(success, mode)
const warningScale = createColorScale(warning, mode)
const dangerScale = createColorScale(danger, mode)
const core: NeonCore = {
  neutral: createToneColors(neutral, neutralScale, delta1),
  accent: createToneColors(accent, accentScale, delta2),
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
