import { createNeonPalette } from './base'

const core = {
  baseWhite: '#E1E1E1',
  baseBlack: '#2c1a1e',
  canvas: '#e7dbdb',
  surface: '#e1d3d3',
  foreground: '#343030',
  accent: '#C73838',
  info: '#1B9ED0',
  success: '#2E9A4D',
  warning: '#B88319',
  danger: '#D6493E',
} as const

export const neonLight = createNeonPalette({
  mode: 'light',
  core,
  showcaseAlt: '#F2E7EA',
})
