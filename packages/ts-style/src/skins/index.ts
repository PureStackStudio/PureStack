import type { ThemePalette } from '../themePalette'
import { createNeonDark } from './neon/dark'
import { createNeonLight } from './neon/light'

export type BuiltInSkinName = string
export type SkinPresetList = readonly string[]

export interface BuiltInSkinPair {
  light: ThemePalette
  dark: ThemePalette
}

export interface BuiltInSkin {
  create: (presets?: SkinPresetList) => BuiltInSkinPair
}

export type BuiltInSkins = Record<string, BuiltInSkin>

export const builtInSkins: BuiltInSkins = {
  neon: {
    create: (presets) => ({
      light: createNeonLight(presets),
      dark: createNeonDark(presets),
    }),
  },
}

export function registerSkin(name: string, skin: BuiltInSkin) {
  builtInSkins[name] = skin
}
