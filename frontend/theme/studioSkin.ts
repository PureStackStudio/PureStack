import {
  registerSkin,
  type ThemePalette,
  themeSkins,
} from '@purestack/ts-style'
import { type DeepPartial, merge } from '@purestack/ts-util'

function createStudioPalette(mode: 'dark' | 'light'): ThemePalette {
  return merge(themeSkins.standard.create(['lightgreen'])[mode], {
    accent: '#9be7ba',
    font: {
      family: {
        base: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      },
      size: {
        xxxs: '0.5625rem',
        xxs: '0.625rem',
        xs: '0.6875rem',
        sm: '0.75rem',
        body: '0.875rem',
        h6: '1rem',
        h5: '1.0625rem',
        h4: '1.1875rem',
        h3: '1.5rem',
        h2: '2.125rem',
        h1: '2.6875rem',
        display: '5rem',
      },
    },
    //radii: { sm: '4px', md: '6px', lg: '8px' },
    effect: {
      panelShadow: 'none',
      panelShadowStrong: 'none',
      softShadow: '0 8px 25px #0005',
      floatingShadow: '0 12px 70px #0005',
    },
    semanticTone: {
      neutral: {
        tone: '#9aabaa',
        canvas: '#0b0e11',
        canvascolor: '#0b0e11',
        text: { default: '#ecefee', subtle: '#9aabaa' },
        root: {
          text: { default: '#ecefee', subtle: '#80958a' },
          border: { default: '#2c3730', subtle: '#252c30', focus: '#9be7ba' },
        },
        border: { default: '#2c3730', subtle: '#252c30', focus: '#9be7ba' },
        surface: {
          rest: {
            background: '#111619',
            bgcolor: '#111619',
            border: '#2c3730',
            text: '#ecefee',
          },
          hover: {
            background: '#17201a',
            bgcolor: '#17201a',
            border: '#415149',
            text: '#ecefee',
          },
          active: {
            background: '#1d2721',
            bgcolor: '#1d2721',
            border: '#677b6c',
            text: '#ecefee',
          },
        },
        surfaceAlt: {
          rest: {
            background: '#171e1a',
            bgcolor: '#171e1a',
            border: '#35443a',
            text: '#c6d3cb',
          },
        },
        button: {
          rest: {
            background: '#151b19',
            bgcolor: '#151b19',
            border: '#35403a',
            text: '#dfe6e2',
          },
          hover: {
            background: '#1d2721',
            bgcolor: '#1d2721',
            border: '#677b6c',
            text: '#ecefee',
          },
          active: {
            background: '#243329',
            bgcolor: '#243329',
            border: '#9be7ba',
            text: '#ecefee',
          },
          focusRing: '#9be7ba',
        },
      },
      accent: {
        tone: '#9be7ba',
        canvas: '#101713',
        canvascolor: '#101713',
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
      light: createStudioPalette('light'),
      dark: createStudioPalette('dark'),
      light2: themeSkins.standard.create(['green']).light,
      dark2: themeSkins.standard.create(['green']).dark,
    }),
  })
}

export const studioTypography = {
  mono: "'Cascadia Code', 'SFMono-Regular', Consolas, monospace",
} as const
