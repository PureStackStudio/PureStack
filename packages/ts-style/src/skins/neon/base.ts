import type { ThemePalette } from '../../themePalette'
import {
  createScale,
  createTone,
  gradient,
  radial,
  rgba,
  type Tone,
  type ToneOverrides,
} from './shared'

type NeonCore = {
  baseWhite: string
  baseBlack: string
  canvas: string
  surface: string
  foreground: string
  neutral: {
    background: string
    foreground: string
    border: string
  }
  accent: {
    background: string
    foreground: string
    border: string
  }
  ghost: {
    background: string
    foreground: string
    border: string
  }
  info: {
    background: string
    foreground: string
    border: string
  }
  success: {
    background: string
    foreground: string
    border: string
  }
  warning: {
    background: string
    foreground: string
    border: string
  }
  danger: {
    background: string
    foreground: string
    border: string
  }
}

type NeonPaletteOptions = {
  core: NeonCore
  showcaseAlt: string
  borderAlpha?: number
}

export function createNeonPalette({
  core,
  showcaseAlt,
  borderAlpha = 0.33,
}: NeonPaletteOptions): ThemePalette {
  const borderTone = (hex: string) => rgba(hex, borderAlpha)

  const surface = createScale(core.neutral.background, 10)
  const text = createScale(core.neutral.foreground, 18)
  const accent = createScale(core.accent.background, 20)
  const info = createScale(core.info.background, 18)
  const success = createScale(core.success.background, 18)
  const warning = createScale(core.warning.background, 18)
  const danger = createScale(core.danger.background, 18)

  const neutralTone: Tone = {
    background: {
      default: radial(surface.level3, surface.level2),
      canvas: radial(surface.level1, core.canvas),
      surface: radial(surface.level3, surface.level2),
      surfaceAlt: radial(surface.level2, surface.level1),
      panel: radial(surface.level3, surface.level2),
      raised: radial(surface.level4, surface.level2),
      overlay: core.baseBlack,
      showcase: gradient('180deg', [core.baseBlack, core.canvas]),
      showcaseAlt: gradient('180deg', [core.canvas, showcaseAlt]),
      muted: surface.level2,
      feature: accent.level1,
    },
    border: {
      soft: surface.level2,
      subtle: borderTone(core.neutral.border),
      default: borderTone(core.neutral.border),
      strong: borderTone(text.level2),
      hard: borderTone(text.level3),
      focus: accent.level5,
    },
    text: {
      default: text.level3,
      muted: text.level1,
      subtle: text.level1,
      soft: text.level2,
      strong: text.level5,
      inverse: core.baseBlack,
    },
    button: {
      rest: {
        background: radial(surface.level3, surface.level2),
        border: borderTone(text.level1),
        text: text.level3,
      },
      hover: {
        background: radial(surface.level4, surface.level2),
        border: borderTone(text.level3),
        text: text.level5,
      },
      active: {
        background: accent.level1,
        border: borderTone(text.level2),
        text: text.level5,
      },
      disabled: {
        background: surface.level2,
        border: borderTone(surface.level2),
        text: text.level2,
      },
      focusRing: accent.level3,
    },
    icon: {
      background: text.level5,
      gradient: gradient('135deg', [text.level5, text.level3]),
      color: core.baseBlack,
      ring: text.level3,
    },
    hover: radial(surface.level4, surface.level2),
    active: accent.level1,
    disabled: surface.level2,
    focusRing: accent.level3,
  }

  const accentOverrides: ToneOverrides = {
    background: {
      feature: accent.level4,
    },
    button: {
      rest: {
        background: accent.level1,
        border: borderTone(core.accent.border),
        text: core.accent.foreground,
      },
      hover: {
        background: gradient('135deg', [accent.level5, accent.level3]),
        border: borderTone(core.accent.border),
        text: core.accent.foreground,
      },
      active: {
        background: gradient('135deg', [accent.level4, accent.level2]),
        border: borderTone(core.accent.border),
        text: core.accent.foreground,
      },
      disabled: {
        background: accent.level2,
        border: borderTone(core.accent.border),
        text: core.accent.foreground,
      },
      focusRing: accent.level5,
    },
    icon: {
      background: accent.level5,
      gradient: gradient('135deg', [accent.level5, accent.level4]),
      color: neutralTone.text.inverse,
      ring: accent.level4,
    },
    hover: gradient('135deg', [accent.level5, accent.level3]),
    active: gradient('135deg', [accent.level4, accent.level2]),
    disabled: accent.level2,
    focusRing: accent.level5,
  }

  const accentTone = createTone(
    accent,
    neutralTone,
    borderTone,
    accentOverrides,
    core.accent.foreground,
  )

  const ghostOverrides: ToneOverrides = {
    background: {
      default: neutralTone.background.surface,
      surface: neutralTone.background.surface,
      surfaceAlt: neutralTone.background.surfaceAlt,
      panel: neutralTone.background.panel,
      raised: neutralTone.background.raised,
      muted: surface.level2,
      feature: core.ghost.background,
    },
    border: {
      default: borderTone(core.ghost.border),
      subtle: borderTone(core.ghost.border),
      strong: borderTone(core.ghost.border),
      hard: borderTone(core.ghost.border),
    },
    text: {
      default: core.ghost.foreground,
      strong: core.ghost.foreground,
    },
    button: {
      rest: {
        background: core.ghost.background,
        border: borderTone(core.ghost.border),
        text: core.ghost.foreground,
      },
      hover: {
        background: core.ghost.background,
        border: borderTone(core.ghost.border),
        text: core.ghost.foreground,
      },
      active: {
        background: accent.level2,
        border: borderTone(core.ghost.border),
        text: neutralTone.text.strong,
      },
      disabled: {
        background: surface.level2,
        border: borderTone(core.ghost.border),
        text: core.ghost.foreground,
      },
      focusRing: accent.level5,
    },
    icon: {
      background: text.level3,
      gradient: gradient('135deg', [text.level5, core.ghost.background]),
      color: neutralTone.text.inverse,
      ring: core.ghost.border,
    },
    hover: core.ghost.background,
    active: accent.level2,
    disabled: surface.level2,
    focusRing: accent.level5,
  }

  const ghostTone = createTone(
    accent,
    neutralTone,
    borderTone,
    ghostOverrides,
    core.ghost.foreground,
  )

  const effect: ThemePalette['effect'] = {
    glowPrimary: `0 0 28px ${rgba(accent.level3, 0.22)}`,
    glowSecondary: `0 0 28px ${rgba(info.level3, 0.18)}`,
    floatingShadow: `0 18px 56px ${rgba(core.baseBlack, 0.64)}`,
    panelShadow: `0 14px 40px ${rgba(core.baseBlack, 0.56)}`,
    panelShadowStrong: `0 22px 72px ${rgba(core.baseBlack, 0.68)}`,
    accentShadow: `0 16px 48px ${rgba(accent.level3, 0.22)}`,
    interactiveShadow: `0 12px 34px ${rgba(core.baseBlack, 0.52)}`,
    trackShadow: `inset 0 1px 0 ${rgba(text.level5, 0.05)}`,
    thumbShadow: `0 12px 24px ${rgba(core.baseBlack, 0.58)}`,
    overlayScrim: rgba(core.baseBlack, 0.66),
    focusGlow: `0 0 0 2px ${rgba(accent.level3, 0.42)}, 0 0 24px ${rgba(accent.level3, 0.18)}`,
    insetShadow: `inset 0 10px 28px ${rgba(core.baseBlack, 0.34)}`,
  }

  return {
    semanticTone: {
      neutral: neutralTone,
      accent: accentTone,
      ghost: ghostTone,
      info: createTone(
        info,
        neutralTone,
        borderTone,
        {
          border: {
            default: borderTone(core.info.border),
            strong: borderTone(core.info.border),
            hard: borderTone(core.info.border),
          },
        },
        core.info.foreground,
      ),
      success: createTone(
        success,
        neutralTone,
        borderTone,
        {
          border: {
            default: borderTone(core.success.border),
            strong: borderTone(core.success.border),
            hard: borderTone(core.success.border),
          },
        },
        core.success.foreground,
      ),
      warning: createTone(
        warning,
        neutralTone,
        borderTone,
        {
          border: {
            default: borderTone(core.warning.border),
            strong: borderTone(core.warning.border),
            hard: borderTone(core.warning.border),
          },
        },
        core.warning.foreground,
      ),
      danger: createTone(
        danger,
        neutralTone,
        borderTone,
        {
          border: {
            default: borderTone(core.danger.border),
            strong: borderTone(core.danger.border),
            hard: borderTone(core.danger.border),
          },
        },
        core.danger.foreground,
      ),
    },
    effect,
  }
}
