import type { ThemePalette } from '../themeOptions'
import { evergreenDark } from './evergreen/dark'
import { evergreenLight } from './evergreen/light'
import { oceanDark } from './ocean/dark'
import { oceanLight } from './ocean/light'
import { pastelDark } from './pastel/dark'
import { pastelLight } from './pastel/light'

export { evergreenDark } from './evergreen/dark'
export { evergreenLight } from './evergreen/light'
export { oceanDark } from './ocean/dark'
export { oceanLight } from './ocean/light'
export { pastelDark } from './pastel/dark'
export { pastelLight } from './pastel/light'

export type BuiltInSkinName = 'ocean' | 'evergreen' | 'pastel'

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
  evergreen: {
    light: evergreenLight,
    dark: evergreenDark,
  },
  pastel: {
    light: pastelLight,
    dark: pastelDark,
  },
}
