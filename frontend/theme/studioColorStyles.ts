import {
  listThemePaletteVarEntries,
  styleBuilder,
  themes,
  type ThemePalette,
} from '@purestack/ts-style'
import { studioColorPresets } from './studioColorPresets'
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
  })
}

function paletteValues(palette: ThemePalette) {
  return new Map(
    listThemePaletteVarEntries(palette).map((token) => [
      token.name,
      token.value,
    ]),
  )
}
