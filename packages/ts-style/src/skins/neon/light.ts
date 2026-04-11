import { createNeonPalette, type NeonCore } from './base'

const core: NeonCore = {
  baseBlack: '#2c1a1e',
  neutral: { background: '#e1d3d3', foreground: '#343030', border: '#343030' },
  accent: { background: '#C73838', foreground: '#E1E1E1', border: '#C73838' },
  ghost: {
    background: 'transparent',
    foreground: 'currentColor',
    border: 'transparent',
  },
  info: { background: '#1B9ED0', foreground: '#E1E1E1', border: '#1B9ED0' },
  success: { background: '#2E9A4D', foreground: '#E1E1E1', border: '#2E9A4D' },
  warning: { background: '#da9d23', foreground: '#E1E1E1', border: '#B88319' },
  danger: { background: '#D6493E', foreground: '#E1E1E1', border: '#D6493E' },
}

export const neonLight = createNeonPalette({
  core,
})
