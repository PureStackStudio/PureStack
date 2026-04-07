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
  ink: '#231717',
  abyss: '#352323',
  panel: '#2E2121',
  frost: '#E1E1E1',
  accent: '#B72727',
  info: '#16BAD4',
  success: '#259740',
  warning: '#CFA320',
  danger: '#DC3545',
} as const

const borderAlpha = 0.33
const borderTone = createBorderTone(borderAlpha)

const surface = createScale(core.panel, 10)
const text = createScale(core.frost, 18)
const accent = createScale(core.accent, 20)
const info = createScale(core.info, 18)
const success = createScale(core.success, 18)
const warning = createScale(core.warning, 18)
const danger = createScale(core.danger, 18)

const neutralTone: Tone = {
  background: {
    default: radial(surface.base, surface.deep),
    canvas: radial(surface.shadow, core.abyss),
    surface: radial(surface.base, surface.deep),
    surfaceAlt: radial(surface.deep, surface.shadow),
    panel: radial(surface.base, surface.deep),
    raised: radial(surface.bright, surface.deep),
    overlay: core.ink,
    showcase: gradient('180deg', [core.ink, core.abyss]),
    showcaseAlt: gradient('180deg', [core.abyss, '#151927']),
    muted: surface.deep,
    feature: accent.shadow,
  },
  border: {
    soft: surface.deep,
    subtle: borderTone(surface.base),
    default: borderTone(text.shadow),
    strong: borderTone(text.deep),
    hard: borderTone(text.base),
    focus: accent.glow,
  },
  text: {
    default: text.base,
    muted: text.shadow,
    subtle: text.shadow,
    soft: text.deep,
    strong: text.glow,
    inverse: core.ink,
  },
  button: {
    rest: {
      background: radial(surface.base, surface.deep),
      border: borderTone(text.shadow),
      text: text.base,
    },
    hover: {
      background: radial(surface.bright, surface.deep),
      border: borderTone(text.base),
      text: text.glow,
    },
    active: {
      background: accent.shadow,
      border: borderTone(text.deep),
      text: text.glow,
    },
    disabled: {
      background: surface.deep,
      border: borderTone(surface.deep),
      text: text.deep,
    },
    focusRing: accent.base,
  },
  icon: {
    background: text.glow,
    gradient: gradient('135deg', [text.glow, text.base]),
    color: core.ink,
    ring: text.base,
  },
  hover: radial(surface.bright, surface.deep),
  active: accent.shadow,
  disabled: surface.deep,
  focusRing: accent.base,
}

const accentTone = createTone(accent, neutralTone, borderTone, {
  background: {
    feature: accent.bright,
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
      text: text.glow,
    },
    active: {
      background: gradient('135deg', [accent.bright, accent.deep]),
      border: borderTone(accent.glow),
      text: neutralTone.text.strong,
    },
    disabled: {
      background: accent.deep,
      border: borderTone(accent.deep),
      text: accent.base,
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
  disabled: accent.deep,
  focusRing: accent.glow,
})

const ghostTone = createTone(accent, neutralTone, borderTone, {
  background: {
    default: neutralTone.background.surface,
    surface: neutralTone.background.surface,
    surfaceAlt: neutralTone.background.surfaceAlt,
    panel: neutralTone.background.panel,
    raised: neutralTone.background.raised,
    muted: surface.deep,
    feature: accent.shadow,
  },
  border: {
    default: neutralTone.border.soft,
    subtle: neutralTone.border.soft,
    strong: neutralTone.border.soft,
    hard: neutralTone.border.soft,
  },
  text: {
    default: accent.glow,
    strong: accent.glow,
  },
  button: {
    rest: {
      background: neutralTone.background.surface,
      border: borderTone(surface.deep),
      text: accent.glow,
    },
    hover: {
      background: accent.shadow,
      border: borderTone(accent.base),
      text: accent.glow,
    },
    active: {
      background: accent.deep,
      border: borderTone(accent.bright),
      text: neutralTone.text.strong,
    },
    disabled: {
      background: surface.deep,
      border: borderTone(surface.deep),
      text: accent.base,
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
  disabled: surface.deep,
  focusRing: accent.glow,
})

const infoTone = createTone(info, neutralTone, borderTone)
const successTone = createTone(success, neutralTone, borderTone)
const warningTone = createTone(warning, neutralTone, borderTone)
const dangerTone = createTone(danger, neutralTone, borderTone)

export const neonDark: ThemePalette = {
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
    glowPrimary: `0 0 28px ${rgba(accent.base, 0.22)}`,
    glowSecondary: `0 0 28px ${rgba(info.base, 0.18)}`,
    floatingShadow: `0 18px 56px ${rgba(core.ink, 0.64)}`,
    panelShadow: `0 14px 40px ${rgba(core.ink, 0.56)}`,
    panelShadowStrong: `0 22px 72px ${rgba(core.ink, 0.68)}`,
    accentShadow: `0 16px 48px ${rgba(accent.base, 0.22)}`,
    interactiveShadow: `0 12px 34px ${rgba(core.ink, 0.52)}`,
    trackShadow: `inset 0 1px 0 ${rgba(text.glow, 0.05)}`,
    thumbShadow: `0 12px 24px ${rgba(core.ink, 0.58)}`,
    overlayScrim: rgba(core.ink, 0.66),
    focusGlow: `0 0 0 2px ${rgba(accent.base, 0.42)}, 0 0 24px ${rgba(accent.base, 0.18)}`,
    insetShadow: `inset 0 10px 28px ${rgba(core.ink, 0.34)}`,
  },
}
