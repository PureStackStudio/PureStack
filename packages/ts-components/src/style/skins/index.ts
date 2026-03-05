import type { ThemePalette } from '../themePalette'
import { cyberpunkGlowDark } from './cyberpunk/dark'
import { cyberpunkGlowLight } from './cyberpunk/light'
import { evergreenDark } from './evergreen/dark'
import { evergreenLight } from './evergreen/light'
import { extraoDark } from './extrao/dark'
import { extraoLight } from './extrao/light'
import { neonDark } from './neon/dark'
import { neonLight } from './neon/light'
import { oceanDark } from './ocean/dark'
import { oceanLight } from './ocean/light'
import { pastelDark } from './pastel/dark'
import { pastelLight } from './pastel/light'

export { evergreenDark } from './evergreen/dark'
export { evergreenLight } from './evergreen/light'
export { extraoDark } from './extrao/dark'
export { extraoLight } from './extrao/light'
export { oceanDark } from './ocean/dark'
export { oceanLight } from './ocean/light'
export { pastelDark } from './pastel/dark'
export { pastelLight } from './pastel/light'

export type BuiltInSkinName =
  | 'ocean'
  | 'evergreen'
  | 'pastel'
  | 'extrao'
  | 'cyberpunk'
  | 'neon'

export interface BuiltInSkinPair {
  light: ThemePalette
  dark: ThemePalette
}

export type BuiltInSkins = Record<BuiltInSkinName, BuiltInSkinPair>

export const builtInSkins: BuiltInSkins = {
  ocean: {
    light: oceanLight,
    dark: oceanDark,
  },
  extrao: {
    light: extraoLight,
    dark: extraoDark,
  },
  evergreen: {
    light: evergreenLight,
    dark: evergreenDark,
  },
  pastel: {
    light: pastelLight,
    dark: pastelDark,
  },
  cyberpunk: {
    light: cyberpunkGlowLight,
    dark: cyberpunkGlowDark,
  },
  neon: {
    light: neonLight,
    dark: neonDark,
  },
}
