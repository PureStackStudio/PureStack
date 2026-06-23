import type { ThemePalette } from '../themePalette'
import { createStandardDark } from './standard/dark'
import { createStandardLight } from './standard/light'

export type ThemeSkinName = string
export type SkinPresetList = readonly string[]

export interface ThemeSkinPair {
  light: ThemePalette
  dark: ThemePalette
}

export interface ThemeSkin {
  create: (presets?: SkinPresetList) => ThemeSkinPair
}

export type ThemeSkinRegistry = Record<ThemeSkinName, ThemeSkin>

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
