import {
  registerSkin,
  type ThemePalette,
  themeSkins,
} from '@purestack/ts-style'
import { type DeepPartial, merge } from '@purestack/ts-util'
import { createStudioLightPalette } from './studioSkinLight'
import { studioSkinShared } from './studioSkinShared'

function createStudioDarkPalette(): ThemePalette {
  return merge(themeSkins.standard.create(['mint']).dark, {
    ...studioSkinShared,
    accent: '#9be7ba',
    semanticTone: {
      accent: {
        tone: '#9be7ba',
        canvas: '#101713',
        canvascolor: '#101713',
        // A deep green field with mint light, calmer than the generated one.
        spotlight: {
          field: 'linear-gradient(165deg, #1e3a2b 0%, #12231a 75%)',
          light: 'rgba(155, 231, 186, 0.2)',
        },
        text: { default: '#9be7ba', subtle: '#91b69d' },
        border: { default: '#3a5944', subtle: '#2e4538', focus: '#9be7ba' },
        surface: {
          rest: {
            background: '#1a2820',
            bgcolor: '#1a2820',
            border: '#34483c',
            text: '#b1d4bc',
          },
          hover: {
            background: '#22392b',
            bgcolor: '#22392b',
            border: '#638269',
            text: '#d0edda',
          },
        },
        surfaceAlt: {
          rest: {
            background: '#1d2a21',
            bgcolor: '#1d2a21',
            border: '#638269',
            text: '#b1d4bc',
          },
        },
        button: {
          rest: {
            background: '#9be7ba',
            bgcolor: '#9be7ba',
            border: '#b6f3cc',
            text: '#102319',
          },
          hover: {
            background: '#b5f2ce',
            bgcolor: '#b5f2ce',
            border: '#c5f8d7',
            text: '#102319',
          },
          active: {
            background: '#82d8a5',
            bgcolor: '#82d8a5',
            border: '#a8ebc3',
            text: '#102319',
          },
          focusRing: '#9be7ba',
        },
      },
      success: {
        text: { default: '#a2d9ad', subtle: '#87a38e' },
        surface: {
          rest: {
            background: '#2b4735',
            bgcolor: '#2b4735',
            border: '#4e6b56',
            text: '#ace6bf',
          },
        },
      },
      info: { text: { default: '#93bad0' }, tone: '#85b0d6' },
      warning: { text: { default: '#d3c18e' }, tone: '#d8bb77' },
      danger: { text: { default: '#f1b692' }, tone: '#c68887' },
      feature: { text: { default: '#b8acd7' } },
    },
  } satisfies DeepPartial<ThemePalette>)
}

export function registerStudioSkin() {
  registerSkin('studio', {
    create: () => ({
      light: createStudioLightPalette(),
      dark: createStudioDarkPalette(),
      light3: themeSkins.standard.create(['mint']).light,
      dark3: themeSkins.standard.create(['mint']).dark,
    }),
  })
}

export const studioTypography = {
  mono: "'Cascadia Code', 'SFMono-Regular', Consolas, monospace",
} as const
