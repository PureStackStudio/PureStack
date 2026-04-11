import { createNeonPalette, type NeonCore } from './base'
import type { ToneColors } from './shared'

const white = '#c9c9c9'
const accent = '#2771b7'
const baseTone: ToneColors = {
  background: '#021a3e',
  foreground: white,
  border: white,
  surface: '#0b3655',
  surfaceAlt: '#0d2e4b',
}
const core: NeonCore = {
  baseBlack: '#171c23',
  neutral: baseTone,
  accent: {
    ...baseTone,
    background: accent,
    foreground: white,
    border: accent,
    surface: accent,
    surfaceAlt: accent,
  },
  ghost: {
    ...baseTone,
    background: 'transparent',
    foreground: 'currentColor',
    border: 'transparent',
  },
  info: {
    background: '#15a9c0',
    foreground: white,
    border: '#16BAD4',
    surface: '#1292a6',
    surfaceAlt: '#15a9c0',
  },
  success: {
    background: '#259740',
    foreground: white,
    border: '#259740',
    surface: '#259740',
    surfaceAlt: '#259740',
  },
  warning: {
    background: '#c49a1c',
    foreground: white,
    border: '#c49a1c',
    surface: '#c49a1c',
    surfaceAlt: '#c49a1c',
  },
  danger: {
    background: '#a92a37',
    foreground: white,
    border: '#a92a37',
    surface: '#a92a37',
    surfaceAlt: '#a92a37',
  },
}

export const neonDark = createNeonPalette({
  core,
})
