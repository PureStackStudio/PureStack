import { type ThemePalette, themeSkins } from '@purestack/ts-style'

export function createPalettes() {
  const palettes = themeSkins.standard.create({
    accent: '#ff8a34',
    neutral: '#383838',
    secondary: '#f4ad55',
    feature: '#ee7043',
  })
  refinePalette(palettes.light, {
    canvas: '#f7f7f7',
    surface: '#ffffff',
    surfaceAlt: '#f0f0f0',
    text: '#242424',
    subtle: '#686868',
    border: '#dedede',
    shadow: '0 8px 28px rgba(0, 0, 0, 0.045)',
  })
  refinePalette(palettes.dark, {
    canvas: '#121212',
    surface: '#1c1c1c',
    surfaceAlt: '#171717',
    text: '#ededed',
    subtle: '#adadad',
    border: '#373737',
    shadow: '0 12px 32px rgba(0, 0, 0, 0.16)',
  })
  refineAccent(palettes.light, {
    text: '#a34408',
    surface: '#fff0e4',
    border: '#f0bd94',
    button: '#ff8a34',
    hover: '#f07824',
    active: '#df6818',
    buttonText: '#171717',
  })
  refineAccent(palettes.dark, {
    text: '#ffad6b',
    surface: '#252525',
    border: '#ff8a34',
    button: '#ff8a34',
    hover: '#ffa45c',
    active: '#f07824',
    buttonText: '#171717',
  })
  return palettes
}

interface AccentColors {
  text: string
  surface: string
  border: string
  button: string
  hover: string
  active: string
  buttonText: string
}

function refineAccent(palette: ThemePalette, colors: AccentColors) {
  const accent = palette.semanticTone.accent
  accent.tone = colors.text
  accent.text.default = colors.text
  accent.text.subtle = colors.text
  accent.root.text.default = colors.text
  accent.root.text.subtle = colors.text
  for (const surface of [accent.surface, accent.surfaceAlt]) {
    surface.rest.background = colors.surface
    surface.rest.bgcolor = colors.surface
    surface.rest.text = colors.text
    surface.rest.border = colors.border
  }
  for (const [state, background] of [
    [accent.button.rest, colors.button],
    [accent.button.hover, colors.hover],
    [accent.button.active, colors.active],
  ] as const) {
    state.background = background
    state.bgcolor = background
    state.border = background
    state.text = colors.buttonText
  }
}

interface SurfaceColors {
  canvas: string
  surface: string
  surfaceAlt: string
  text: string
  subtle: string
  border: string
  shadow: string
}

function refinePalette(palette: ThemePalette, colors: SurfaceColors) {
  palette.font.family.base = "'Segoe UI', ui-sans-serif, system-ui, sans-serif"
  palette.radii.sm = '0.45rem'
  palette.radii.md = '0.7rem'
  palette.radii.lg = '1rem'
  palette.effect.panelShadow = colors.shadow
  palette.effect.softShadow = colors.shadow
  for (const tone of [palette.current, palette.semanticTone.neutral]) {
    tone.tone = colors.text
    tone.canvas = colors.canvas
    tone.canvascolor = colors.text
    tone.text.default = colors.text
    tone.text.subtle = colors.subtle
    tone.border.default = colors.border
    tone.border.subtle = colors.border
    for (const [surface, background] of [
      [tone.surface, colors.surface],
      [tone.surfaceAlt, colors.surfaceAlt],
    ] as const) {
      surface.rest.background = background
      surface.rest.bgcolor = background
      surface.rest.border = colors.border
      surface.rest.text = colors.text
    }
  }
  const neutralRoot = palette.semanticTone.neutral.root
  neutralRoot.text.default = colors.text
  neutralRoot.text.subtle = colors.subtle
  neutralRoot.border.default = colors.border
  neutralRoot.border.subtle = colors.border
}
