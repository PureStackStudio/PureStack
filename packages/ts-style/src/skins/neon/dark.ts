import { createNeonPalette } from './base'

const core = {
  baseWhite: '#E1E1E1',
  baseBlack: '#231717',
  canvas: '#352323',
  surface: '#2E2121',
  foreground: '#E1E1E1',
  accent: '#B72727',
  info: '#16BAD4',
  success: '#259740',
  warning: '#CFA320',
  danger: '#DC3545',
} as const

export const neonDark = createNeonPalette({
  mode: 'dark',
  core,
  showcaseAlt: '#151927',
})
