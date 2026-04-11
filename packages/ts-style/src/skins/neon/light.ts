import { createNeonPalette, type NeonCore } from './base'
import type { ToneColors } from './shared'

const baseTone: ToneColors = {
  background: '#e1d3d3',
  foreground: '#343030',
  border: '#343030',
  surface: '#c4b1b1',
  surfaceAlt: '#af9c9c',
}

const core: NeonCore = {
  baseBlack: '#2c1a1e',
  neutral: baseTone,
  accent: {
    background: '#C73838',
    foreground: '#E1E1E1',
    border: '#C73838',
    surface: '#C73838',
    surfaceAlt: '#C73838',
  },
  ghost: {
    ...baseTone,
    background: 'transparent',
    foreground: 'currentColor',
    border: 'transparent',
  },
  info: {
    background: '#1B9ED0',
    foreground: '#E1E1E1',
    border: '#1B9ED0',
    surface: '#1B9ED0',
    surfaceAlt: '#1B9ED0',
  },
  success: {
    background: '#2E9A4D',
    foreground: '#E1E1E1',
    border: '#2E9A4D',
    surface: '#2E9A4D',
    surfaceAlt: '#2E9A4D',
  },
  warning: {
    background: '#da9d23',
    foreground: '#E1E1E1',
    border: '#B88319',
    surface: '#da9d23',
    surfaceAlt: '#da9d23',
  },
  danger: {
    background: '#D6493E',
    foreground: '#E1E1E1',
    border: '#D6493E',
    surface: '#D6493E',
    surfaceAlt: '#D6493E',
  },
}

export const neonLight = createNeonPalette({
  core,
})
