import { registerSkin } from '@purestack/ts-style'
import { createStudioDarkPalette } from './studioSkinDark'
import { createStudioLightPalette } from './studioSkinLight'

export function registerStudioSkin() {
  registerSkin('studio', {
    create: () => ({
      light: createStudioLightPalette(),
      dark: createStudioDarkPalette(),
    }),
  })
}

export const studioTypography = {
  mono: "'Cascadia Code', 'SFMono-Regular', Consolas, monospace",
} as const
