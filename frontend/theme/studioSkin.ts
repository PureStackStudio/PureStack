import type { ThemeSkin } from '@purestack/ts-style'
import { createStudioDarkPalette } from './studioSkinDark'
import { createStudioLightPalette } from './studioSkinLight'

export const studioSkin: ThemeSkin = {
  create: () => ({
    light: createStudioLightPalette(),
    dark: createStudioDarkPalette(),
  }),
}

export const studioTypography = {
  mono: "'Cascadia Code', 'SFMono-Regular', Consolas, monospace",
} as const
