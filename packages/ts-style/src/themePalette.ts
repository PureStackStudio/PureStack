/**
 * Semantic color contract consumed by all ts-ssg styles.
 *
 * What this is:
 * - A role-based palette, not a brand palette.
 * - Components should read from these semantic roles (`semanticTone`, etc.)
 *   instead of hard-coding color intent locally.
 *
 * Why this exists:
 * - Keeps component styling consistent as component count grows.
 * - Makes skin creation predictable: each skin fills the same semantic slots.
 * - Avoids random per-component color drift while still allowing expressive themes.
 *
 * How to use:
 * - Component code should pick colors by UI intent.
 * - Example:
 *   - primary CTA background: `palette.semanticTone.accent.button.rest.background`
 *   - primary CTA hover: `palette.semanticTone.accent.button.hover.background`
 *   - semantic callout surface: `palette.semanticTone.info.surface.rest.background`
 *   - secondary text: `palette.current.text.subtle`
 *   - active/focus border: `palette.current.border.focus`
 *
 * Example (in a component):
 * ```ts
 * styleBuilder
 *   .select('.btn--primary', theme)
 *   .background(palette.semanticTone.accent.button.rest.background)
 *   .color(palette.semanticTone.accent.button.rest.text)
 *
 * styleBuilder
 *   .select('.btn--primary:hover', theme)
 *   .background(palette.semanticTone.accent.button.hover.background)
 *   .color(palette.semanticTone.accent.button.hover.text)
 *
 * styleBuilder
 *   .select('.btn--primary:focus-visible', theme)
 *   .outline(`2px solid ${palette.semanticTone.accent.button.focusRing}`)
 * ```
 */

import type { CSSProps } from '@purestack/ts-css'

interface InteractiveToneState {
  background: string
  bgcolor: string
  border: string
  text: string
}

/**
 * A calm field for feature bands and showcase panels, lit softly from one
 * point. The skin decides the colors; the page decides where the light falls.
 */
export interface SpotlightTokens {
  /** Background of the field, without the light. */
  field: string
  /** Color of the light at its brightest point. */
  light: string
}

export interface SemanticToneTokens {
  tone: string
  surface: {
    rest: InteractiveToneState
    hover: InteractiveToneState
    active: InteractiveToneState
    disabled: InteractiveToneState
    focusRing: string
  }
  surfaceAlt: {
    rest: InteractiveToneState
    hover: InteractiveToneState
    active: InteractiveToneState
    disabled: InteractiveToneState
    focusRing: string
  }
  canvas: string
  spotlight: SpotlightTokens
  canvascolor: string
  root: {
    border: {
      subtle: string
      default: string
      focus: string
    }
    text: {
      default: string
      subtle: string
    }
  }
  overlay: string
  border: {
    subtle: string
    default: string
    focus: string
  }
  text: {
    default: string
    subtle: string
  }
  button: {
    rest: InteractiveToneState
    hover: InteractiveToneState
    active: InteractiveToneState
    disabled: InteractiveToneState
    focusRing: string
  }
}

export interface ThemeTypography {
  family: {
    base: string
  }
  size: {
    xxxs: string
    xxs: string
    xs: string
    sm: string
    body: string
    h6: string
    h5: string
    h4: string
    h3: string
    h2: string
    h1: string
    display: string
  }
  weight: {
    w100: CSSProps['fontWeight']
    w400: CSSProps['fontWeight']
    w500: CSSProps['fontWeight']
    w600: CSSProps['fontWeight']
    w700: CSSProps['fontWeight']
  }
}

export interface ThemeRadii {
  sm: string
  md: string
  lg: string
  pill: string
}

export interface ThemePaletteCurrent {
  tone: string
  canvas: string
  spotlight: SpotlightTokens
  canvascolor: string
  overlay: string
  surface: {
    rest: InteractiveToneState
    hover: InteractiveToneState
    active: InteractiveToneState
    disabled: InteractiveToneState
    focusRing: string
  }
  surfaceAlt: {
    rest: InteractiveToneState
    hover: InteractiveToneState
    active: InteractiveToneState
    disabled: InteractiveToneState
    focusRing: string
  }
  text: {
    default: string
    subtle: string
  }
  border: {
    subtle: string
    default: string
    focus: string
  }
  button: {
    rest: InteractiveToneState
    hover: InteractiveToneState
    active: InteractiveToneState
    disabled: InteractiveToneState
    focusRing: string
  }
}

export interface ThemePalette {
  accent: string
  current: ThemePaletteCurrent
  font: ThemeTypography
  radii: ThemeRadii
  applyFont: (
    fontSize: string,
    fontWeight?: CSSProps['fontWeight'],
  ) => () => Partial<CSSProps>
  semanticTone: {
    neutral: SemanticToneTokens
    accent: SemanticToneTokens
    feature: SemanticToneTokens
    secondary: SemanticToneTokens
    custom: SemanticToneTokens
    ghost: SemanticToneTokens
    info: SemanticToneTokens
    success: SemanticToneTokens
    warning: SemanticToneTokens
    danger: SemanticToneTokens
  }
  effect: {
    /** Primary atmospheric glow used in hero/section effects. */
    glowPrimary: string
    /** Secondary atmospheric glow variant. */
    glowSecondary: string
    /** Floating element shadow (cards/media blocks). */
    floatingShadow: string
    /** Soft shadow migrated from the former theme options shadow token. */
    softShadow: string
    /** Strong shadow migrated from the former theme options shadow token. */
    strongShadow: string
    /** Default panel shadow. */
    panelShadow: string
    /** Stronger panel shadow for featured cards. */
    panelShadowStrong: string
    /** Accent-colored shadow for primary actions/elements. */
    accentShadow: string
    /** Standard interactive control shadow. */
    interactiveShadow: string
    /** Inset track shadow (e.g. switches/sliders). */
    trackShadow: string
    /** Thumb/knob shadow (e.g. switches/sliders). */
    thumbShadow: string
    /** Overlay scrim shadow/color for layered UI. */
    overlayScrim: string
    /** Focus glow for high-visibility focus patterns. */
    focusGlow: string
    /** Inset surface shadow for recessed elements. */
    insetShadow: string
  }
}
