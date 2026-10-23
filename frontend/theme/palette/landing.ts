import type { ThemeMode } from '@purestack/ts-style'
import type { SurfaceProfile } from '../surfaces'
import { createDarkPalette } from './dark'
import { createLightPalette } from './light'
import type { Hues } from './shared'

/** Keep the landing page's original light paper and deep slate brightness. */
const landingSurfaces = {
  light: {
    canvas: 0.984,
    surface: 1,
    surfaceAlt: 0.965,
    control: 0.955,
    border: 0.86,
    borderSubtle: 0.92,
    ink: 0.24,
    muted: 0.5,
    chroma: 0.04,
    tint: 0.1,
    shadow: 1,
  },
  dark: {
    canvas: 0.17,
    surface: 0.205,
    surfaceAlt: 0.19,
    control: 0.26,
    border: 0.33,
    borderSubtle: 0.27,
    ink: 0.93,
    muted: 0.71,
    chroma: 0.22,
    tint: 0.22,
    shadow: 1,
  },
} satisfies Record<ThemeMode, SurfaceProfile>

export function createLandingPalette(theme: ThemeMode, hues?: Hues) {
  const createPalette =
    theme === 'dark' ? createDarkPalette : createLightPalette
  return createPalette(hues, landingSurfaces[theme])
}
