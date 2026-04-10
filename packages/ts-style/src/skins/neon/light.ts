import type { ThemePalette } from '../../themePalette'
import {
  createBorderTone,
  createScale,
  createTone,
  gradient,
  radial,
  rgba,
  type Tone,
} from './shared'

const core = {
  baseBlack: '#2c1a1e',
  canvas: '#e7dbdb',
  surface: '#e1d3d3',
  foreground: '#eedddd',
  accent: '#C73838',
  info: '#1B9ED0',
  success: '#2E9A4D',
  warning: '#B88319',
  danger: '#D6493E',
} as const

const borderAlpha = 0.33
const borderTone = createBorderTone(borderAlpha)

const surface = createScale(core.surface, 10)
const text = createScale(core.baseBlack, 16)
const accent = createScale(core.accent, 18)
const info = createScale(core.info, 18)
const success = createScale(core.success, 18)
const warning = createScale(core.warning, 18)
const danger = createScale(core.danger, 18)

const neutralTone: Tone = {
  background: {
    default: radial(surface.level1, surface.level2),
    canvas: radial(core.foreground, core.canvas),
    surface: radial(surface.level1, surface.level2),
    surfaceAlt: radial(surface.level3, surface.level1),
    panel: radial(surface.level1, surface.level2),
    raised: radial(surface.level5, surface.level3),
    overlay: core.foreground,
    showcase: gradient('180deg', [core.foreground, core.canvas]),
    showcaseAlt: gradient('180deg', [core.canvas, '#F2E7EA']),
    muted: surface.level3,
    feature: accent.level1,
  },
  border: {
    soft: borderTone(surface.level3),
    subtle: borderTone(surface.level4),
    default: borderTone(text.level1),
    strong: borderTone(text.level2),
    hard: borderTone(text.level3),
    focus: accent.level3,
  },
  text: {
    default: text.level3,
    muted: text.level2,
    subtle: text.level2,
    soft: text.level4,
    strong: text.level5,
    inverse: core.foreground,
  },
  button: {
    rest: {
      background: radial(surface.level1, surface.level2),
      border: borderTone(text.level1),
      text: text.level3,
    },
    hover: {
      background: radial(surface.level5, surface.level3),
      border: borderTone(text.level3),
      text: text.level5,
    },
    active: {
      background: accent.level1,
      border: borderTone(text.level2),
      text: text.level5,
    },
    disabled: {
      background: surface.level3,
      border: borderTone(surface.level3),
      text: text.level2,
    },
    focusRing: accent.level3,
  },
  icon: {
    background: text.level5,
    gradient: gradient('135deg', [text.level5, text.level3]),
    color: core.foreground,
    ring: text.level3,
  },
  hover: radial(surface.level5, surface.level3),
  active: accent.level1,
  disabled: surface.level3,
  focusRing: accent.level3,
}

const accentTone = createTone(accent, neutralTone, borderTone, {
  background: {
    feature: accent.level3,
  },
  button: {
    rest: {
      background: accent.level1,
      border: borderTone(accent.level3),
      text: accent.level5,
    },
    hover: {
      background: gradient('135deg', [accent.level5, accent.level3]),
      border: borderTone(accent.level4),
      text: neutralTone.text.inverse,
    },
    active: {
      background: gradient('135deg', [accent.level4, accent.level2]),
      border: borderTone(accent.level5),
      text: neutralTone.text.inverse,
    },
    disabled: {
      background: accent.level3,
      border: borderTone(accent.level3),
      text: accent.level2,
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
  disabled: accent.level3,
  focusRing: accent.level5,
})

const ghostTone = createTone(accent, neutralTone, borderTone, {
  background: {
    default: neutralTone.background.surface,
    surface: neutralTone.background.surface,
    surfaceAlt: neutralTone.background.surfaceAlt,
    panel: neutralTone.background.panel,
    raised: neutralTone.background.raised,
    muted: surface.level3,
    feature: accent.level1,
  },
  border: {
    default: borderTone(surface.level3),
    subtle: borderTone(surface.level3),
    strong: borderTone(surface.level3),
    hard: borderTone(surface.level3),
  },
  text: {
    default: accent.level3,
    strong: accent.level3,
  },
  button: {
    rest: {
      background: neutralTone.background.surface,
      border: borderTone(surface.level3),
      text: accent.level3,
    },
    hover: {
      background: accent.level1,
      border: borderTone(accent.level3),
      text: accent.level5,
    },
    active: {
      background: accent.level2,
      border: borderTone(accent.level4),
      text: neutralTone.text.inverse,
    },
    disabled: {
      background: surface.level3,
      border: borderTone(surface.level3),
      text: accent.level2,
    },
    focusRing: accent.level5,
  },
  icon: {
    background: text.level3,
    gradient: gradient('135deg', [text.level5, accent.level3]),
    color: neutralTone.text.inverse,
    ring: accent.level3,
  },
  hover: accent.level1,
  active: accent.level2,
  disabled: surface.level3,
  focusRing: accent.level5,
})

const infoTone = createTone(info, neutralTone, borderTone)
const successTone = createTone(success, neutralTone, borderTone)
const warningTone = createTone(warning, neutralTone, borderTone)
const dangerTone = createTone(danger, neutralTone, borderTone)

export const neonLight: ThemePalette = {
  semanticTone: {
    neutral: neutralTone,
    accent: accentTone,
    ghost: ghostTone,
    info: infoTone,
    success: successTone,
    warning: warningTone,
    danger: dangerTone,
  },
  effect: {
    glowPrimary: `0 0 26px ${rgba(accent.level3, 0.16)}`,
    glowSecondary: `0 0 26px ${rgba(info.level3, 0.14)}`,
    floatingShadow: `0 14px 34px ${rgba(text.level3, 0.18)}`,
    panelShadow: `0 10px 24px ${rgba(text.level3, 0.14)}`,
    panelShadowStrong: `0 18px 46px ${rgba(text.level3, 0.2)}`,
    accentShadow: `0 12px 32px ${rgba(accent.level3, 0.16)}`,
    interactiveShadow: `0 10px 24px ${rgba(text.level3, 0.16)}`,
    trackShadow: `inset 0 1px 0 ${rgba(core.foreground, 0.7)}`,
    thumbShadow: `0 10px 20px ${rgba(text.level3, 0.18)}`,
    overlayScrim: rgba(text.level3, 0.16),
    focusGlow: `0 0 0 2px ${rgba(accent.level3, 0.28)}, 0 0 18px ${rgba(accent.level3, 0.14)}`,
    insetShadow: `inset 0 8px 20px ${rgba(text.level3, 0.08)}`,
  },
}
