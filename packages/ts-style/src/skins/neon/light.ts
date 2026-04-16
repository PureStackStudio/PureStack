import { getColors } from '@purestack/ts-css'
import { createNeonPalette, type NeonCore } from './base'
import { accent, danger, info, neutral, success, warning } from './dark'
import type { ToneColors } from './shared'

// const white = '#e8f3f8'
const accentScale = getColors(accent, 0, 80, 20, true)
const accentScaleDark = getColors(accent, 40, 0, 20)
const neutralScale = getColors(neutral, 0, 80, 20, true)
const neutralScaleDark = getColors(neutral, 40, 0, 20)
const infoScale = getColors(info, 0, 80, 20, true)
const infoScaleDark = getColors(info, 40, 0, 20)
const successScale = getColors(success, 0, 80, 20, true)
const successScaleDark = getColors(success, 40, 0, 20)
const warningScale = getColors(warning, 0, 80, 20, true)
const warningScaleDark = getColors(warning, 40, 0, 20)
const dangerScale = getColors(danger, 0, 80, 20, true)
const dangerScaleDark = getColors(danger, 40, 0, 20)
const baseTone: ToneColors = {
  canvas: neutralScale[0],
  button: neutralScale[8],
  foreground: neutralScaleDark[8],
  border: neutralScaleDark[17],
  surface: neutralScale[4],
  surfaceAlt: neutralScale[7],
}
const core: NeonCore = {
  neutral: baseTone,
  accent: {
    ...baseTone,
    canvas: accentScale[0],
    button: accent,
    foreground: accentScaleDark[8],
    border: accentScaleDark[17],
    surface: accentScale[4],
    surfaceAlt: accentScale[7],
  },
  ghost: {
    ...baseTone,
  },
  info: {
    canvas: infoScale[0],
    button: info,
    foreground: infoScaleDark[8],
    border: infoScaleDark[17],
    surface: infoScale[4],
    surfaceAlt: infoScale[7],
  },
  success: {
    canvas: successScale[0],
    button: success,
    foreground: successScaleDark[8],
    border: successScaleDark[17],
    surface: successScale[4],
    surfaceAlt: successScale[7],
  },
  warning: {
    canvas: warningScale[0],
    button: warning,
    foreground: warningScaleDark[8],
    border: warningScaleDark[17],
    surface: warningScale[4],
    surfaceAlt: warningScale[7],
  },
  danger: {
    canvas: dangerScale[0],
    button: danger,
    foreground: dangerScaleDark[8],
    border: dangerScaleDark[17],
    surface: dangerScale[4],
    surfaceAlt: dangerScale[7],
  },
}

export const neonLight = createNeonPalette({
  core,
  chromeLighting: 0.33,
})
