import { oklchToHex } from '@purestack/ts-css'
import type { SpotlightTokens, ThemePalette } from '@purestack/ts-style'
import type { DeepPartial } from '@purestack/ts-util'

export const sharedTokens = {
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
  radii: { sm: '4px', md: '6px', lg: '8px' },
} satisfies DeepPartial<ThemePalette>

export interface Hue {
  /** OKLCH hue angle in degrees. */
  hue: number
  /** Peak OKLCH chroma; each step takes a fraction of it. */
  chroma: number
}

/**
 * The website identity: one hue per role. A cobalt accent over blue-slate
 * neutrals, with indigo and violet as its companions. Each mode turns every
 * hue into a full tone with the same perceptual lightness steps, so all roles
 * read equally bright and a hue can change without retuning anything else.
 */
export const defaultHues = {
  neutral: { hue: 262, chroma: 0.1 },
  accent: { hue: 259, chroma: 0.2 },
  secondary: { hue: 280, chroma: 0.17 },
  feature: { hue: 318, chroma: 0.18 },
  custom: { hue: 45, chroma: 0.15 },
  info: { hue: 222, chroma: 0.12 },
  success: { hue: 158, chroma: 0.14 },
  warning: { hue: 78, chroma: 0.14 },
  danger: { hue: 20, chroma: 0.17 },
} satisfies Record<string, Hue>

export type Hues = Record<keyof typeof defaultHues, Hue>

/** Returns a painter for one hue: lightness, chroma share and optional alpha. */
export function paint({ hue, chroma }: Hue) {
  return (l: number, share = 1, alpha?: number) =>
    oklchToHex({ l, c: chroma * share, h: hue, alpha })
}

export type PaletteTone = ThemePalette['semanticTone']['neutral']
type PaletteToneState = PaletteTone['surface']['rest']

export function state(
  background: string,
  border: string,
  text: string,
): PaletteToneState {
  return { background, bgcolor: background, border, text }
}

export function spotlight(
  lit: string,
  deep: string,
  light: string,
): SpotlightTokens {
  return { field: `linear-gradient(165deg, ${lit} 0%, ${deep} 75%)`, light }
}

/** Everything a colored tone needs; each mode decides the actual colors. */
export interface PaletteToneRecipe {
  fill: string
  fillHover: string
  fillActive: string
  onFill: string
  ink: string
  muted: string
  body: string
  tint: string
  tintHover: string
  tintActive: string
  tintAlt: string
  tintAltHover: string
  tintAltActive: string
  border: string
  borderSubtle: string
  rim: string
  canvas: string
  spotlight: SpotlightTokens
  overlay: string
  disabled: PaletteToneState
}

/**
 * A tinted field for surfaces, a solid fill for buttons, and an edge that
 * wakes up on hover.
 */
export function createTone(recipe: PaletteToneRecipe): PaletteTone {
  const { fill, ink, muted, body, rim, disabled } = recipe
  const text = { default: ink, subtle: muted }
  const border = {
    default: recipe.border,
    subtle: recipe.borderSubtle,
    focus: fill,
  }
  return {
    tone: fill,
    canvas: recipe.canvas,
    canvascolor: recipe.canvas,
    spotlight: recipe.spotlight,
    overlay: recipe.overlay,
    text,
    border,
    root: { text, border },
    surface: {
      rest: state(recipe.tint, recipe.border, body),
      hover: state(recipe.tintHover, rim, body),
      active: state(recipe.tintActive, rim, body),
      disabled,
      focusRing: fill,
    },
    surfaceAlt: {
      rest: state(recipe.tintAlt, recipe.border, body),
      hover: state(recipe.tintAltHover, rim, body),
      active: state(recipe.tintAltActive, fill, body),
      disabled,
      focusRing: fill,
    },
    button: {
      rest: state(fill, fill, recipe.onFill),
      hover: state(recipe.fillHover, recipe.fillHover, recipe.onFill),
      active: state(recipe.fillActive, recipe.fillActive, recipe.onFill),
      disabled,
      focusRing: fill,
    },
  }
}

/** Ghost rests invisible and borrows the neutral states once touched. */
export function createGhostTone(neutral: PaletteTone): PaletteTone {
  const invisible = state('transparent', 'transparent', 'currentColor')
  return {
    ...neutral,
    tone: 'currentColor',
    canvas: 'transparent',
    canvascolor: 'transparent',
    spotlight: { field: 'transparent', light: 'transparent' },
    surface: { ...neutral.surface, rest: invisible },
    surfaceAlt: { ...neutral.surfaceAlt, rest: invisible },
    button: { ...neutral.button, rest: invisible },
  }
}
