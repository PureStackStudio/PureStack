import { createNeonPalette, type NeonCore } from './base'
import type { ToneColors } from './shared'

const white = '#e8f3f8'
const accent = '#307fca'
const baseTone: ToneColors = {
  canvas: '#f3f9ff',
  background: '#9bc7ff',
  foreground: '#052b3d',
  border: '#323e44',
  surface: '#f1f9ff',
  surfaceAlt: '#b9ddf7',
}
const core: NeonCore = {
  baseBlack: '#171c23',
  neutral: baseTone,
  accent: {
    ...baseTone,
    canvas: accent,
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
    canvas: '#15a9c0',
    background: '#15a9c0',
    foreground: white,
    border: '#16BAD4',
    surface: '#1292a6',
    surfaceAlt: '#15a9c0',
  },
  success: {
    canvas: '#259740',
    background: '#259740',
    foreground: white,
    border: '#259740',
    surface: '#259740',
    surfaceAlt: '#259740',
  },
  warning: {
    canvas: '#c49a1c',
    background: '#c49a1c',
    foreground: white,
    border: '#c49a1c',
    surface: '#c49a1c',
    surfaceAlt: '#c49a1c',
  },
  danger: {
    canvas: '#a92a37',
    background: '#a92a37',
    foreground: white,
    border: '#a92a37',
    surface: '#a92a37',
    surfaceAlt: '#a92a37',
  },
}

export const neonLight = createNeonPalette({
  core,
})
