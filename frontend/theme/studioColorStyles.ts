import type { Style } from '@purestack/ts-css'
import {
  listThemePaletteVarEntries,
  styleBuilder,
  themes,
  type ThemeMode,
  type ThemePalette,
} from '@purestack/ts-style'
import { studioColorPresets } from './studioColorPresets'
import { createStudioLandingPalette } from './studioLandingColors'
import { createStudioDarkPalette } from './studioSkinDark'
import { createStudioLightPalette } from './studioSkinLight'

/** Presets only override changed tokens; existing components keep using their palette. */
export function registerStudioColorStyles() {
  themes.forEach((theme, palette) => {
    const createPalette =
      theme === 'dark' ? createStudioDarkPalette : createStudioLightPalette
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
    for (const preset of studioColorPresets) {
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
    ':is(:root:has(> body.studio), body.studio, body.studio *)'
  const landing = styleBuilder
    .get(theme)
    .select(
      `:scope${landingScope}:not(:where([data-site-color], [data-site-color] *))`,
    )
  setChangedPaletteVariables(
    landing,
    createStudioLandingPalette(theme),
    defaults,
  )

  for (const preset of studioColorPresets) {
    const root = styleBuilder
      .get(theme)
      .select(
        `:scope:is([data-site-color="${preset.id}"], [data-site-color="${preset.id}"] *)${landingScope}`,
      )
    // Compare with the active preset, since its declarations also match descendants.
    const createPalette =
      theme === 'dark' ? createStudioDarkPalette : createStudioLightPalette
    const presetDefaults = paletteValues(
      createPalette(preset, preset.layers[theme]),
    )
    setChangedPaletteVariables(
      root,
      createStudioLandingPalette(theme, preset),
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
