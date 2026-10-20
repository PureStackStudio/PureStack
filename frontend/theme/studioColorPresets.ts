import type { StudioHues } from './studioSkinShared'
import {
  studioSurfaceProfiles,
  type StudioSurfaceProfile,
} from './studioSurfaceProfiles'

export const SITE_COLOR_STORAGE_KEY = 'purestack-site-color'
export const DEFAULT_SITE_COLOR = 'cobalt'

/** Complete color families, with quiet neutrals and recognizable semantic roles. */
export const studioColorPresets = [
  {
    id: 'cobalt',
    label: 'Cobalt',
    layers: studioSurfaceProfiles.cobalt,
    neutral: { hue: 262, chroma: 0.1 },
    accent: { hue: 259, chroma: 0.2 },
    secondary: { hue: 280, chroma: 0.17 },
    feature: { hue: 318, chroma: 0.18 },
    custom: { hue: 45, chroma: 0.15 },
    info: { hue: 222, chroma: 0.12 },
    success: { hue: 158, chroma: 0.14 },
    warning: { hue: 78, chroma: 0.14 },
    danger: { hue: 20, chroma: 0.17 },
  },
  {
    id: 'violet',
    label: 'Violet',
    layers: studioSurfaceProfiles.violet,
    neutral: { hue: 300, chroma: 0.14 },
    accent: { hue: 290, chroma: 0.2 },
    secondary: { hue: 265, chroma: 0.17 },
    feature: { hue: 325, chroma: 0.18 },
    custom: { hue: 55, chroma: 0.13 },
    info: { hue: 250, chroma: 0.15 },
    success: { hue: 165, chroma: 0.12 },
    warning: { hue: 82, chroma: 0.13 },
    danger: { hue: 12, chroma: 0.16 },
  },
  {
    id: 'teal',
    label: 'Teal',
    layers: studioSurfaceProfiles.teal,
    neutral: { hue: 195, chroma: 0.12 },
    accent: { hue: 190, chroma: 0.13 },
    secondary: { hue: 225, chroma: 0.15 },
    feature: { hue: 160, chroma: 0.14 },
    custom: { hue: 35, chroma: 0.15 },
    info: { hue: 225, chroma: 0.13 },
    success: { hue: 150, chroma: 0.13 },
    warning: { hue: 85, chroma: 0.13 },
    danger: { hue: 28, chroma: 0.17 },
  },
  {
    id: 'emerald',
    label: 'Emerald',
    layers: studioSurfaceProfiles.emerald,
    neutral: { hue: 152, chroma: 0.11 },
    accent: { hue: 155, chroma: 0.16 },
    secondary: { hue: 190, chroma: 0.13 },
    feature: { hue: 115, chroma: 0.14 },
    custom: { hue: 42, chroma: 0.14 },
    info: { hue: 210, chroma: 0.12 },
    success: { hue: 145, chroma: 0.14 },
    warning: { hue: 88, chroma: 0.13 },
    danger: { hue: 25, chroma: 0.16 },
  },
  {
    id: 'amber',
    label: 'Amber',
    layers: studioSurfaceProfiles.amber,
    neutral: { hue: 70, chroma: 0.13 },
    accent: { hue: 70, chroma: 0.15 },
    secondary: { hue: 40, chroma: 0.16 },
    feature: { hue: 20, chroma: 0.16 },
    custom: { hue: 32, chroma: 0.15 },
    info: { hue: 235, chroma: 0.12 },
    success: { hue: 145, chroma: 0.11 },
    warning: { hue: 78, chroma: 0.13 },
    danger: { hue: 28, chroma: 0.16 },
  },
  {
    id: 'rose',
    label: 'Rose',
    layers: studioSurfaceProfiles.rose,
    neutral: { hue: 15, chroma: 0.12 },
    accent: { hue: 10, chroma: 0.19 },
    secondary: { hue: 335, chroma: 0.17 },
    feature: { hue: 290, chroma: 0.18 },
    custom: { hue: 55, chroma: 0.14 },
    info: { hue: 255, chroma: 0.14 },
    success: { hue: 165, chroma: 0.12 },
    warning: { hue: 80, chroma: 0.13 },
    danger: { hue: 25, chroma: 0.16 },
  },
] as const satisfies readonly (StudioHues & {
  id: string
  label: string
  layers: { light: StudioSurfaceProfile; dark: StudioSurfaceProfile }
})[]

export type SiteColor = (typeof studioColorPresets)[number]['id']

export function isSiteColor(value: unknown): value is SiteColor {
  return studioColorPresets.some((preset) => preset.id === value)
}
