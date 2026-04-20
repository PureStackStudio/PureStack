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

export interface ThemeTypography {
  /**
   *  xxxs: '0.72rem',
      xxs: '0.85rem',
      xs: '0.9rem',
      sm: '0.94rem',
      body: '1rem', // body, h6
      md: '1.06rem', // captions, h5
      lg: '1.309rem', // h3 h4
      xl: '2.118rem', //h2
      xxl: '3.427rem', //h1
      xxxl: '5.545rem', //display
   */
  size: {
    xxxs: string
    xxs: string
    xs: string
    sm: string
    body: string
    md: string
    lg: string
    xl: string
    xxl: string
    xxxl: string
  }
  weight: {
    w400: CSSProps['fontWeight']
    w500: CSSProps['fontWeight']
    w600: CSSProps['fontWeight']
    w700: CSSProps['fontWeight']
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
  font: ThemeTypography
  applyFont: (
    fontSize: string,
    fontWeight?: CSSProps['fontWeight'],
  ) => () => Partial<CSSProps>
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
