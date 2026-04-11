import { createNeonPalette, type NeonCore } from './base'

const core: NeonCore = {
  baseWhite: '#E1E1E1',
  baseBlack: '#231717',
  canvas: '#352323',
  surface: '#2E2121',
  foreground: '#E1E1E1',
  neutral: { background: '#2E2121', foreground: '#E1E1E1', border: '#E1E1E1' },
  accent: { background: '#B72727', foreground: '#E1E1E1', border: '#B72727' },
  ghost: {
    background: 'transparent',
    foreground: '#E1E1E1',
    border: 'transparent',
  },
  info: { background: '#16BAD4', foreground: '#231717', border: '#16BAD4' },
  success: { background: '#259740', foreground: '#E1E1E1', border: '#259740' },
  warning: { background: '#CFA320', foreground: '#231717', border: '#CFA320' },
  danger: { background: '#DC3545', foreground: '#E1E1E1', border: '#DC3545' },
}

export const neonDark = createNeonPalette({
  core,
})
