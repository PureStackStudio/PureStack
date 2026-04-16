import { getColors } from '@purestack/ts-css'
import { createNeonPalette, type NeonCore } from './base'
import type { ToneColors } from './shared'

const white = '#c9c9c9'
export const accent = '#3f7eab'
export const info = '#15a9c0'
export const success = '#259740'
export const warning = '#c49a1c'
export const danger = '#a92a37'
const accentScale = getColors(accent, 80, 0, 20)
const infoScale = getColors(info, 80, 0, 20)
const successScale = getColors(success, 80, 0, 20)
const warningScale = getColors(warning, 80, 0, 20)
const dangerScale = getColors(danger, 80, 0, 20)
const baseTone: ToneColors = {
  canvas: accentScale[3],
  button: accentScale[15],
  foreground: white,
  border: white,
  surface: accentScale[7],
  surfaceAlt: accentScale[4],
}
const core: NeonCore = {
  neutral: baseTone,
  accent: {
    ...baseTone,
    canvas: accentScale[3],
    button: accent,
    foreground: white,
    border: accent,
    surface: accentScale[12],
    surfaceAlt: accentScale[7],
  },
  ghost: {
    ...baseTone,
  },
  info: {
    canvas: infoScale[3],
    button: info,
    foreground: white,
    border: info,
    surface: infoScale[12],
    surfaceAlt: infoScale[7],
  },
  success: {
    canvas: successScale[3],
    button: success,
    foreground: white,
    border: success,
    surface: successScale[12],
    surfaceAlt: successScale[7],
  },
  warning: {
    canvas: warningScale[3],
    button: warning,
    foreground: white,
    border: warning,
    surface: warningScale[12],
    surfaceAlt: warningScale[7],
  },
  danger: {
    canvas: dangerScale[3],
    button: danger,
    foreground: white,
    border: danger,
    surface: dangerScale[12],
    surfaceAlt: dangerScale[7],
  },
}

export const neonDark = createNeonPalette({
  core,
})
