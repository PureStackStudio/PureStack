import { createNeonPalette } from './base'

const core = {
  baseWhite: '#E1E1E1',
  baseBlack: '#2c1a1e',
  canvas: '#e7dbdb',
  surface: '#e1d3d3',
  foreground: '#343030',
  neutral: { background: '#e1d3d3', foreground: '#343030', border: '#343030' },
  accent: { background: '#C73838', foreground: '#E1E1E1', border: '#C73838' },
  ghost: {
    background: 'transparent',
    foreground: '#343030',
    border: 'transparent',
  },
  info: { background: '#1B9ED0', foreground: '#E1E1E1', border: '#1B9ED0' },
  success: { background: '#2E9A4D', foreground: '#E1E1E1', border: '#2E9A4D' },
  warning: { background: '#B88319', foreground: '#E1E1E1', border: '#B88319' },
  danger: { background: '#D6493E', foreground: '#E1E1E1', border: '#D6493E' },
} as const

export const neonLight = createNeonPalette({
  core,
  showcaseAlt: '#F2E7EA',
})
