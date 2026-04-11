import { createNeonPalette, type NeonCore } from './base'

const white = '#E1E1E1'
const core: NeonCore = {
  baseBlack: '#231717',
  neutral: { background: '#3b0a0a', foreground: white, border: white },
  accent: { background: '#B72727', foreground: white, border: '#B72727' },
  ghost: {
    background: 'transparent',
    foreground: 'currentColor',
    border: 'transparent',
  },
  info: { background: '#16BAD4', foreground: white, border: '#16BAD4' },
  success: { background: '#259740', foreground: white, border: '#259740' },
  warning: { background: '#dbae2a', foreground: white, border: '#CFA320' },
  danger: { background: '#DC3545', foreground: white, border: '#DC3545' },
}

export const neonDark = createNeonPalette({
  core,
})
