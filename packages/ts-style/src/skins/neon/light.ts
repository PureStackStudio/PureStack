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
  ink: '#2c1a1e',
  abyss: '#e7dbdb',
  panel: '#e1d3d3',
  frost: '#eedddd',
  accent: '#C73838',
  info: '#1B9ED0',
  success: '#2E9A4D',
  warning: '#B88319',
  danger: '#D6493E',
} as const

const borderAlpha = 0.33
const borderTone = createBorderTone(borderAlpha)

const surface = createScale(core.panel, 10)
const text = createScale(core.ink, 16)
const accent = createScale(core.accent, 18)
const info = createScale(core.info, 18)
const success = createScale(core.success, 18)
const warning = createScale(core.warning, 18)
const danger = createScale(core.danger, 18)

const neutralTone: Tone = {
  background: {
    default: radial(surface.shadow, surface.deep),
    canvas: radial(core.frost, core.abyss),
    surface: radial(surface.shadow, surface.deep),
    surfaceAlt: radial(surface.base, surface.shadow),
    panel: radial(surface.shadow, surface.deep),
    raised: radial(surface.glow, surface.base),
    overlay: core.frost,
    showcase: gradient('180deg', [core.frost, core.abyss]),
    showcaseAlt: gradient('180deg', [core.abyss, '#F2E7EA']),
    muted: surface.base,
    feature: accent.shadow,
  },
  border: {
    soft: borderTone(surface.base),
    subtle: borderTone(surface.bright),
    default: borderTone(text.shadow),
    strong: borderTone(text.deep),
    hard: borderTone(text.base),
    focus: accent.base,
  },
  text: {
    default: text.base,
    muted: text.deep,
    subtle: text.deep,
    soft: text.bright,
    strong: text.glow,
    inverse: core.frost,
  },
  button: {
    rest: {
      background: radial(surface.shadow, surface.deep),
      border: borderTone(text.shadow),
      text: text.base,
    },
    hover: {
      background: radial(surface.glow, surface.base),
      border: borderTone(text.base),
      text: text.glow,
    },
    active: {
      background: accent.shadow,
      border: borderTone(text.deep),
      text: text.glow,
    },
    disabled: {
      background: surface.base,
      border: borderTone(surface.base),
      text: text.deep,
    },
    focusRing: accent.base,
  },
  icon: {
    background: text.glow,
    gradient: gradient('135deg', [text.glow, text.base]),
    color: core.frost,
    ring: text.base,
  },
  hover: radial(surface.glow, surface.base),
  active: accent.shadow,
  disabled: surface.base,
  focusRing: accent.base,
}

const accentTone = createTone(accent, neutralTone, borderTone, {
  background: {
    feature: accent.base,
  },
  button: {
    rest: {
      background: accent.shadow,
      border: borderTone(accent.base),
      text: accent.glow,
    },
    hover: {
      background: gradient('135deg', [accent.glow, accent.base]),
      border: borderTone(accent.bright),
      text: neutralTone.text.inverse,
    },
    active: {
      background: gradient('135deg', [accent.bright, accent.deep]),
      border: borderTone(accent.glow),
      text: neutralTone.text.inverse,
    },
    disabled: {
      background: accent.base,
      border: borderTone(accent.base),
      text: accent.deep,
    },
    focusRing: accent.glow,
  },
  icon: {
    background: accent.glow,
    gradient: gradient('135deg', [accent.glow, accent.bright]),
    color: neutralTone.text.inverse,
    ring: accent.bright,
  },
  hover: gradient('135deg', [accent.glow, accent.base]),
  active: gradient('135deg', [accent.bright, accent.deep]),
  disabled: accent.base,
  focusRing: accent.glow,
})

const ghostTone = createTone(accent, neutralTone, borderTone, {
  background: {
    default: neutralTone.background.surface,
    surface: neutralTone.background.surface,
    surfaceAlt: neutralTone.background.surfaceAlt,
    panel: neutralTone.background.panel,
    raised: neutralTone.background.raised,
    muted: surface.base,
    feature: accent.shadow,
  },
  border: {
    default: borderTone(surface.base),
    subtle: borderTone(surface.base),
    strong: borderTone(surface.base),
    hard: borderTone(surface.base),
  },
  text: {
    default: accent.base,
    strong: accent.base,
  },
  button: {
    rest: {
      background: neutralTone.background.surface,
      border: borderTone(surface.base),
      text: accent.base,
    },
    hover: {
      background: accent.shadow,
      border: borderTone(accent.base),
      text: accent.glow,
    },
    active: {
      background: accent.deep,
      border: borderTone(accent.bright),
      text: neutralTone.text.inverse,
    },
    disabled: {
      background: surface.base,
      border: borderTone(surface.base),
      text: accent.deep,
    },
    focusRing: accent.glow,
  },
  icon: {
    background: text.base,
    gradient: gradient('135deg', [text.glow, accent.base]),
    color: neutralTone.text.inverse,
    ring: accent.base,
  },
  hover: accent.shadow,
  active: accent.deep,
  disabled: surface.base,
  focusRing: accent.glow,
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
    glowPrimary: `0 0 26px ${rgba(accent.base, 0.16)}`,
    glowSecondary: `0 0 26px ${rgba(info.base, 0.14)}`,
    floatingShadow: `0 14px 34px ${rgba(text.base, 0.18)}`,
    panelShadow: `0 10px 24px ${rgba(text.base, 0.14)}`,
    panelShadowStrong: `0 18px 46px ${rgba(text.base, 0.2)}`,
    accentShadow: `0 12px 32px ${rgba(accent.base, 0.16)}`,
    interactiveShadow: `0 10px 24px ${rgba(text.base, 0.16)}`,
    trackShadow: `inset 0 1px 0 ${rgba(core.frost, 0.7)}`,
    thumbShadow: `0 10px 20px ${rgba(text.base, 0.18)}`,
    overlayScrim: rgba(text.base, 0.16),
    focusGlow: `0 0 0 2px ${rgba(accent.base, 0.28)}, 0 0 18px ${rgba(accent.base, 0.14)}`,
    insetShadow: `inset 0 8px 20px ${rgba(text.base, 0.08)}`,
  },
}
