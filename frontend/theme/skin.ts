import type { ThemeSkin } from '@purestack/ts-style'
import { createDarkPalette } from './palette/dark'
import { createLightPalette } from './palette/light'

export const skin: ThemeSkin = {
  create: () => ({
    light: createLightPalette(),
    dark: createDarkPalette(),
  }),
}

export const typography = {
  mono: "'Cascadia Code', 'SFMono-Regular', Consolas, monospace",
} as const
