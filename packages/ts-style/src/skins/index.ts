import type { ThemePalette } from '../themePalette'
import { createStandardDark, type StandardColorPreset } from './standard/dark'
import { createStandardLight } from './standard/light'

export type { StandardColorPreset } from './standard/dark'

export type ThemeSkinName = string
export type SkinPresetList = readonly string[]

export interface ThemeSkinPair {
  light: ThemePalette
  dark: ThemePalette
}

export interface ThemeSkin<TPresets = SkinPresetList> {
  create: (presets?: TPresets) => ThemeSkinPair
}

export type ThemeSkinRegistry = Record<ThemeSkinName, ThemeSkin> & {
  standard: ThemeSkin<SkinPresetList | StandardColorPreset>
}

export const themeSkins: ThemeSkinRegistry = {
  standard: {
    create: (presets) => ({
      light: createStandardLight(presets),
      dark: createStandardDark(presets),
    }),
  },
}

export function registerSkin(name: ThemeSkinName, skin: ThemeSkin) {
  themeSkins[name] = skin
}
