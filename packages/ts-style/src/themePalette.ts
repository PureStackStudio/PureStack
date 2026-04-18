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

export interface SemanticToneTokens {
  surface: {
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
  surfaceAlt: {
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
  canvas: string
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
    border: string
  }
}

/*export interface TypographyToken {
  fontFamily?: string
  fontSize: string
  fontWeight: string
  lineHeight: string
  letterSpacing?: string
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
}*/
/**
 * 
 *   styleBuilder
     .select('.doc-content :where(h1, h2, h3, h4, h5, h6)', theme)
     .fontWeight('700')
     .letterSpacing('-0.015em')
     .lineHeight('1.15')
     .margin('0 0 0.6em')
     .scrollMarginTop('96px')
 
   styleBuilder
     .select('.doc-content :where(h1)', theme)
     .fontSize('2.4rem')
     .margin('0 0 0.5em')
   styleBuilder.select('.doc-content :where(h2)', theme).fontSize('1.9rem')
   styleBuilder.select('.doc-content :where(h3)', theme).fontSize('1.5rem')
   styleBuilder.select('.doc-content :where(h4)', theme).fontSize('1.25rem')
 
   styleBuilder
     .select('.doc-content :where(h5, h6)', theme)
     .textTransform('uppercase')
 
   styleBuilder
     .select('.doc-content :where(h5)', theme)
     .fontSize('1.05rem')
     .letterSpacing('0.04em')
   styleBuilder
     .select('.doc-content :where(h6)', theme)
     .fontSize('0.95rem')
     .letterSpacing('0.06em')
     .color(palette.current.text.subtle)
 */
export interface ThemeTypography {
  fontSize: {
    body: string
    h1: string
    h2: string
    h3: string
    h4: string
    h5: string
    h6: string
  }
}

export interface ThemePaletteCurrent {
  text: {
    default: string
    subtle: string
  }
  border: {
    subtle: string
    default: string
    focus: string
  }
}

export interface ThemePalette {
  accent: string
  current: ThemePaletteCurrent
  typography: ThemeTypography
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
