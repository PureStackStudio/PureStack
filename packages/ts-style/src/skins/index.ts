import type { ThemePalette } from '../themePalette'
import { neonDark } from './neon/dark'
import { neonLight } from './neon/light'

export type BuiltInSkinName = 'neon'

export interface BuiltInSkinPair {
  light: ThemePalette
  dark: ThemePalette
}

export type BuiltInSkins = Record<BuiltInSkinName, BuiltInSkinPair>

export const builtInSkins: BuiltInSkins = {
  neon: {
    light: neonLight,
    dark: neonDark,
  },
}
