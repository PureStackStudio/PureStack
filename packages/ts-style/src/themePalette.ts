/**
 * Semantic color contract consumed by all ts-ssg styles.
 *
 * What this is:
 * - A role-based palette, not a brand palette.
 * - Components should read from these semantic roles (`action`, `status`, `text`, etc.)
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
 *   - primary CTA background: `palette.action.accent.background`
 *   - primary CTA hover: `palette.action.accent.hover`
 *   - secondary text: `palette.text.subtle`
 *   - active/focus border: `palette.border.focus`
 *
 * Example (in a component):
 * ```ts
 * styleBuilder
 *   .select('.btn--primary', theme)
 *   .background(palette.action.accent.background)
 *   .color(palette.action.accent.text)
 *
 * styleBuilder
 *   .select('.btn--primary:hover', theme)
 *   .background(palette.action.accent.active)
 *
 * styleBuilder
 *   .select('.btn--primary:focus-visible', theme)
 *   .outline(`2px solid ${palette.action.accent.focusRing}`)
 * ```
 */

export interface ThemePalette {
  background: {
    /** Page-level app canvas. */
    canvas: string
    /** Default container surface. */
    surface: string
    /** Alternate surface for subtle contrast separation. */
    surfaceAlt: string
    /** Standard panel/card background. */
    panel: string
    /** Elevated panel surface for stronger layering. */
    raised: string
    /** Scrim/overlay color for modal/backdrop contexts. */
    overlay: string
    /** Decorative large-surface gradient (hero/section). */
    showcase: string
    /** Secondary decorative gradient for variation. */
    showcaseAlt: string
    /** Soft accent-tinted background. */
    accentMuted: string
    /** Stronger accent-tinted background. */
    accent: string
    /** Feature-highlight background (active section/callout). */
    feature: string
    /** Success-toned muted background. */
    successMuted: string
    /** Danger-toned muted background. */
    dangerMuted: string
  }
  text: {
    /** Default body text color. */
    default: string
    /** Secondary supportive text. */
    muted: string
    /** Tertiary low-emphasis text. */
    subtle: string
    /** Extra-low emphasis text for dense/quiet UI. */
    soft: string
    /** High-emphasis text for prominent labels. */
    strong: string
    /** Accent text (links/emphasized labels). */
    accent: string
    /** Text placed on strong/accent backgrounds. */
    inverse: string
    /** Semantic success text. */
    success: string
    /** Semantic danger text. */
    danger: string
  }
  border: {
    /** Lowest emphasis border. */
    soft: string
    /** Standard subtle divider/border. */
    subtle: string
    /** Default control/card border. */
    default: string
    /** Strong border for active blocks or hierarchy edges. */
    strong: string
    /** Extra-strong border for highly prominent outlines. */
    hard: string
    /** Accent border for highlighted states. */
    accent: string
    /** Focus-visible outline color. */
    focus: string
    /** Semantic success border. */
    success: string
    /** Semantic danger border. */
    danger: string
  }
  action: {
    /** Neutral action family (secondary buttons, less dominant controls). */
    neutral: {
      background: string
      text: string
      hover: string
      /** Pressed/active state. */
      active: string
      /** Disabled state background. */
      disabled: string
      /** Focus ring override for neutral actions. */
      focusRing: string
    }
    /** Accent action family (primary CTAs). */
    accent: {
      background: string
      text: string
      hover: string
      /** Pressed/active state. */
      active: string
      /** Disabled state background. */
      disabled: string
      /** Focus ring override for accent actions. */
      focusRing: string
    }
    /** Ghost action family (minimal chrome, text-forward controls). */
    ghost: {
      background: string
      text: string
      hover: string
      active: string
      disabled: string
      focusRing: string
    }
  }
  status: {
    /** Positive feedback colors. */
    success: {
      background: string
      border: string
      text: string
    }
    /** Negative feedback colors. */
    danger: {
      background: string
      border: string
      text: string
    }
    /** Informational feedback colors. */
    info: {
      background: string
      border: string
      text: string
    }
    /** Warning/caution feedback colors. */
    warning: {
      background: string
      border: string
      text: string
    }
  }
  badge: {
    /** Primary/accent badge colors. */
    accent: {
      background: string
      text: string
    }
    /** Muted badge style for low emphasis tags. */
    muted: {
      background: string
      text: string
    }
    /** Strong badge style for urgent/pinned tags. */
    strong: {
      background: string
      text: string
    }
  }
  icon: {
    /** Accent icon treatment for featured/important glyphs. */
    accent: {
      background: string
      gradient: string
      color: string
      ring: string
    }
    /** Neutral icon treatment for standard glyphs. */
    neutral: {
      background: string
      gradient: string
      color: string
      ring: string
    }
    /** Subtle icon treatment for very low emphasis iconography. */
    subtle: {
      background: string
      gradient: string
      color: string
      ring: string
    }
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
