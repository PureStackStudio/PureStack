import {
  type SkinPresetList,
  type ThemePalette,
  themeSkins,
} from '@purestack/ts-style'

/** Keep Forge's palette choice, then give both modes the same design language. */
export function createStarterPalettes(presets?: SkinPresetList) {
  const selected = presets?.length ? presets : ['orange']
  const palettes = themeSkins.standard.create(selected)
  refinePalette(palettes.light, {
    canvas: '#fafaf9',
    surface: '#ffffff',
    alternate: '#f1f1ef',
    text: '#252523',
    subtle: '#62625d',
    border: '#ddddd8',
    shadow: '0 14px 45px rgba(25, 25, 20, 0.05)',
  })
  refinePalette(palettes.dark, {
    canvas: '#141414',
    surface: '#1c1c1c',
    alternate: '#242423',
    text: '#f1f1ed',
    subtle: '#b5b5af',
    border: '#3a3a37',
    shadow: '0 14px 45px rgba(0, 0, 0, 0.18)',
  })
  if (selected.includes('orange')) {
    refineOrange(palettes.light, '#ae3b12', '#fff0e7')
    refineOrange(palettes.dark, '#ffab80', '#33231d')
  }
  return palettes
}

interface SurfaceColors {
  canvas: string
  surface: string
  alternate: string
  text: string
  subtle: string
  border: string
  shadow: string
}

function refinePalette(palette: ThemePalette, colors: SurfaceColors) {
  palette.font.family.base = "'Segoe UI', ui-sans-serif, system-ui, sans-serif"
  palette.radii.sm = '0.45rem'
  palette.radii.md = '0.85rem'
  palette.radii.lg = '1.35rem'
  palette.effect.panelShadow = colors.shadow
  palette.effect.softShadow = colors.shadow
  const neutral = palette.semanticTone.neutral
  neutral.canvas = colors.canvas
  neutral.canvascolor = colors.text
  neutral.tone = colors.text
  neutral.spotlight.field = colors.surface
  neutral.spotlight.light = `color-mix(in srgb, ${palette.semanticTone.accent.tone} 12%, transparent)`
  for (const tokens of [neutral.text, neutral.root.text]) {
    tokens.default = colors.text
    tokens.subtle = colors.subtle
  }
  for (const tokens of [neutral.border, neutral.root.border]) {
    tokens.default = colors.border
    tokens.subtle = colors.border
  }
  for (const { surface, background } of [
    { surface: neutral.surface, background: colors.surface },
    { surface: neutral.surfaceAlt, background: colors.alternate },
  ]) {
    for (const state of [surface.rest, surface.hover, surface.active]) {
      state.background = background
      state.bgcolor = background
      state.text = colors.text
      state.border = colors.border
    }
  }
}

function refineOrange(palette: ThemePalette, text: string, surface: string) {
  const accent = palette.semanticTone.accent
  accent.tone = text
  accent.text.default = text
  accent.text.subtle = text
  accent.root.text.default = text
  for (const state of [
    accent.surface.rest,
    accent.surface.hover,
    accent.surface.active,
  ]) {
    state.background = surface
    state.bgcolor = surface
    state.text = text
    state.border = `color-mix(in srgb, ${text} 25%, transparent)`
  }
  for (const { state, background } of [
    { state: accent.button.rest, background: '#ff8a50' },
    { state: accent.button.hover, background: '#ff9c6b' },
    { state: accent.button.active, background: '#f5783c' },
  ]) {
    state.background = background
    state.bgcolor = background
    state.border = background
    state.text = '#24150e'
  }
}
