import type { ThemePalette } from '../themePalette'
import { neonDark } from './neon/dark'
import { neonLight } from './neon/light'

export type BuiltInSkinName = 'neon'
export type SkinPresetList = readonly string[]

export interface BuiltInSkinPair {
  light: ThemePalette
  dark: ThemePalette
}

export interface BuiltInSkin {
  create: (presets?: SkinPresetList) => BuiltInSkinPair
}

export type BuiltInSkins = Record<BuiltInSkinName, BuiltInSkin>

export const builtInSkins: BuiltInSkins = {
  neon: {
    create: () => ({
      light: neonLight,
      dark: neonDark,
    }),
  },
}
