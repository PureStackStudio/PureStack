import type { Style } from '@purestack/ts-css'
import {
  listThemePaletteVarEntries,
  styleBuilder,
  type ThemeMode,
  type ThemePalette,
  themes,
} from '@purestack/ts-style'
import { createDarkPalette } from './palette/dark'
import { createLandingPalette } from './palette/landing'
import { createLightPalette } from './palette/light'
import { palettePresets } from './presets'

/** Presets only override changed tokens; existing components keep using their palette. */
export function registerPaletteStyles() {
  themes.forEach((theme, palette) => {
    const createPalette =
      theme === 'dark' ? createDarkPalette : createLightPalette
    const defaults = paletteValues(createPalette())
    styleBuilder
      .get(theme)
      .select(':scope:root')
      .background(palette.semanticTone.neutral.canvas)
      .color(palette.semanticTone.neutral.text.default)
    styleBuilder
      .get(theme)
      .select('body')
      .background(palette.semanticTone.neutral.canvas)
      .color(palette.semanticTone.neutral.text.default)
    for (const preset of palettePresets) {
      const presetPalette = createPalette(preset, preset.layers[theme])
      const root = styleBuilder
        .get(theme)
        .select(
          `:scope:is([data-site-color="${preset.id}"], [data-site-color="${preset.id}"] *)`,
        )
      for (const token of listThemePaletteVarEntries(presetPalette)) {
        if (token.value !== defaults.get(token.name))
          root.set(token.name, token.value)
      }
    }
    registerLandingColorStyles(theme, defaults)
  })
}

function registerLandingColorStyles(
  theme: ThemeMode,
  defaults: Map<string, string>,
) {
  const landingScope =
    ':is(:root:has(> body.landing-page), body.landing-page, body.landing-page *)'
  const landing = styleBuilder
    .get(theme)
    .select(
      `:scope${landingScope}:not(:where([data-site-color], [data-site-color] *))`,
    )
  setChangedPaletteVariables(landing, createLandingPalette(theme), defaults)

  for (const preset of palettePresets) {
    const root = styleBuilder
      .get(theme)
      .select(
        `:scope:is([data-site-color="${preset.id}"], [data-site-color="${preset.id}"] *)${landingScope}`,
      )
    // Compare with the active preset, since its declarations also match descendants.
    const createPalette =
      theme === 'dark' ? createDarkPalette : createLightPalette
    const presetDefaults = paletteValues(
      createPalette(preset, preset.layers[theme]),
    )
    setChangedPaletteVariables(
      root,
      createLandingPalette(theme, preset),
      presetDefaults,
    )
  }
}

function setChangedPaletteVariables(
  root: Style,
  palette: ThemePalette,
  defaults: Map<string, string>,
) {
  for (const token of listThemePaletteVarEntries(palette)) {
    if (token.value !== defaults.get(token.name))
      root.set(token.name, token.value)
  }
}

function paletteValues(palette: ThemePalette) {
  return new Map(
    listThemePaletteVarEntries(palette).map((token) => [
      token.name,
      token.value,
    ]),
  )
}
