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
 *   - semantic callout surface: `palette.semanticTone.info.background.panel`
 *   - secondary text: `palette.semanticTone.neutral.text.subtle`
 *   - active/focus border: `palette.semanticTone.neutral.border.focus`
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

export interface SemanticToneTokens {
  background: {
    canvas: string
    surface: string
    surfaceAlt: string
    overlay: string
    showcase: string
    showcaseAlt: string
  }
  border: {
    subtle: string
    default: string
    focus: string
  }
  text: {
    default: string
    subtle: string
    soft: string
    strong: string
    inverse: string
  }
  button: {
    rest: {
      background: string
      border: string
      text: string
    }
    hover: {
      background: string
      border: string
      text: string
    }
    active: {
      background: string
      border: string
      text: string
    }
    disabled: {
      background: string
      border: string
      text: string
    }
    focusRing: string
  }
  icon: {
    background: string
    gradient: string
    color: string
    ring: string
  }
  hover: string
  active: string
  disabled: string
  focusRing: string
}

export interface ThemePalette {
  semanticTone: {
    neutral: SemanticToneTokens
    accent: SemanticToneTokens
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
