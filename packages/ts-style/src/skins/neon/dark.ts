import { createNeonPalette, type NeonCore } from './base'
import type { ToneColors } from './shared'

const white = '#E1E1E1'
const baseTone: ToneColors = {
  background: '#3b0a0a',
  foreground: white,
  border: white,
  surface: '#3b0a0a',
  surfaceAlt: '#510d0d',
}
const core: NeonCore = {
  baseBlack: '#231717',
  neutral: baseTone,
  accent: {
    ...baseTone,
    background: '#B72727',
    foreground: white,
    border: '#B72727',
    surface: '#B72727',
    surfaceAlt: '#B72727',
  },
  ghost: {
    ...baseTone,
    background: 'transparent',
    foreground: 'currentColor',
    border: 'transparent',
  },
  info: {
    background: '#16BAD4',
    foreground: white,
    border: '#16BAD4',
    surface: '#16BAD4',
    surfaceAlt: '#16BAD4',
  },
  success: {
    background: '#259740',
    foreground: white,
    border: '#259740',
    surface: '#259740',
    surfaceAlt: '#259740',
  },
  warning: {
    background: '#dbae2a',
    foreground: white,
    border: '#CFA320',
    surface: '#dbae2a',
    surfaceAlt: '#dbae2a',
  },
  danger: {
    background: '#DC3545',
    foreground: white,
    border: '#DC3545',
    surface: '#DC3545',
    surfaceAlt: '#DC3545',
  },
}

export const neonDark = createNeonPalette({
  core,
})
