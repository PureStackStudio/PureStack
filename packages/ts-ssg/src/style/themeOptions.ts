import type { ThemeCardColors, ThemeCardGridColors } from '../regor/components/cardGrid'
import type { ThemeHeroColors } from '../regor/components/hero'
import type { ThemeNavColors } from '../regor/components/navMenu'
import type { ThemeSwitcherColors } from '../regor/components/themeSwitcher'
import type { ThemeTopBarColors } from '../regor/components/topBar'
import { normalizeThemeName, type ThemeName } from './themes'

export type ThemeMode = 'light' | 'dark'

export interface ThemeAppColors {
  background: string
  text: string
}

export interface ThemeSurfaceColors {
  background: string
  border: string
  altBackground: string
  altBorder: string
}

export interface ThemePanelColors {
  background: string
  border: string
  text: string
}

export interface ThemePalette {
  app: ThemeAppColors
  surface: ThemeSurfaceColors
  panel: ThemePanelColors
  nav: ThemeNavColors
  topBar: ThemeTopBarColors
  themeSwitcher: ThemeSwitcherColors
  cardGrid: ThemeCardGridColors
  card: ThemeCardColors
  hero: ThemeHeroColors
}

export interface ThemeOptions {
  colors: Record<ThemeMode, ThemePalette>
  radii: {
    sm: string
    md: string
    lg: string
    pill: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  typography: {
    baseFamily: string
    baseSize: string
    baseLineHeight: string
  }
  shadows: {
    soft: string
    strong: string
  }
}

export type ThemeOptionsInput = Partial<ThemeOptions> & {
  colors?: Partial<Record<ThemeMode, Partial<ThemePalette>>>
  radii?: Partial<ThemeOptions['radii']>
  spacing?: Partial<ThemeOptions['spacing']>
  typography?: Partial<ThemeOptions['typography']>
  shadows?: Partial<ThemeOptions['shadows']>
}

export const DEFAULT_THEME_OPTIONS: ThemeOptions = {
  colors: {
    light: {
      app: {
        background: '#f5f7fb',
        text: '#1f2937',
      },
      surface: {
        background: '#f6f7fb',
        border: '#e1e4ef',
        altBackground: '#f8f9fd',
        altBorder: '#e1e4ef',
      },
      panel: {
        background: '#f6f7fb',
        border: '#e1e4ef',
        text: '#1f2937',
      },
      nav: {
        background: '#f6f7fb',
        border: '#e1e4ef',
        text: '#1f2937',
        textMuted: '#4b5563',
        hoverBackground: '#e9edf7',
        nestedBorder: '#d9deee',
        summaryHoverBackground: '#eef1f8',
        activeBackground: '#d7e2ff',
        activeText: '#0b1a3d',
        focusRing: '#9ab3ff',
        chevron: '#7b8597',
        badgeBackground: '#e6ecfb',
        badgeText: '#3a4a7d',
      },
      topBar: {
        background: '#f8f9fd',
        border: '#e1e4ef',
        logo: '#2f4ea1',
        icon: '#3c4250',
        toggleBackground: '#ffffff',
        toggleBorder: '#d8deee',
        toggleIcon: '#1b2030',
      },
      themeSwitcher: {
        background: '#e7eaef',
        border: '#d1d6e2',
        text: '#8a909c',
        hoverBackground: '#e3e7ee',
        trackBackground: '#d6d9e0',
        trackShadow:
          'inset 0 3px 6px rgba(0, 0, 0, 0.12), inset 0 -2px 4px rgba(255, 255, 255, 0.7)',
        thumbBackground: '#ff9a1f',
        thumbShadow:
          '0 10px 18px rgba(0, 0, 0, 0.18), inset 0 3px 6px rgba(255, 255, 255, 0.3)',
        trackSun: '#f2a02a',
        trackMoon: '#9aa1ad',
        thumbIcon: '#ffffff',
      },
      cardGrid: {
        border: '#e6e6e6',
        title: '#222222',
      },
      card: {
        border: '#ededed',
        title: '#444444',
      },
      hero: {
        background:
          'linear-gradient(135deg, rgba(241, 244, 255, 0.95), rgba(232, 238, 255, 0.95))',
        border: '#d7def2',
        title: '#10162f',
        tagline: '#4b5563',
        eyebrow: '#6b7280',
        focusRing: '#9ab3ff',
        primaryBackground: '#b9c9ff',
        primaryText: '#1b223a',
        primaryHover: '#a7bbff',
        primaryShadow: '0 12px 24px rgba(87, 112, 209, 0.25)',
        secondaryText: '#1f2937',
        secondaryHover: '#e2e8ff',
        secondaryBorder: '#cfd8f5',
        logoBackground: '#ffffff',
        logoBorder: '#e0e6fb',
        logoShadow: '0 18px 30px rgba(25, 35, 70, 0.15)',
        glow:
          'radial-gradient(circle at 10% 20%, rgba(120, 152, 255, 0.45), transparent 55%), radial-gradient(circle at 80% 10%, rgba(255, 255, 255, 0.5), transparent 50%)',
      },
    },
    dark: {
      app: {
        background: '#14171d',
        text: '#e7eaf3',
      },
      surface: {
        background: '#1b1f27',
        border: '#2a2f38',
        altBackground: '#222733',
        altBorder: '#2d3340',
      },
      panel: {
        background: '#1b1f27',
        border: '#2a2f38',
        text: '#e7eaf3',
      },
      nav: {
        background: '#1b1f27',
        border: '#2a2f38',
        text: '#e6e9f2',
        textMuted: '#b0b6c6',
        hoverBackground: '#262b35',
        nestedBorder: '#2b313c',
        summaryHoverBackground: '#252a34',
        activeBackground: '#b7c6ff',
        activeText: '#101a32',
        focusRing: '#91a7ff',
        chevron: '#9aa4b2',
        badgeBackground: '#2a3244',
        badgeText: '#b9c6ff',
      },
      topBar: {
        background: '#222733',
        border: '#2d3340',
        logo: '#a9c1ff',
        icon: '#d2d8e8',
        toggleBackground: '#f3f5fb',
        toggleBorder: '#d7ddef',
        toggleIcon: '#1b2030',
      },
      themeSwitcher: {
        background: '#1b202b',
        border: '#2a313e',
        text: '#8c94a3',
        hoverBackground: '#1f2633',
        trackBackground: '#2a3140',
        trackShadow:
          'inset 0 3px 7px rgba(0, 0, 0, 0.45), inset 0 -2px 4px rgba(255, 255, 255, 0.05)',
        thumbBackground: '#4f6bd5',
        thumbShadow:
          '0 12px 20px rgba(5, 8, 20, 0.55), inset 0 3px 6px rgba(255, 255, 255, 0.2)',
        trackSun: '#7f8796',
        trackMoon: '#b7c5ff',
        thumbIcon: '#ffffff',
      },
      cardGrid: {
        border: '#2f2f2f',
        title: '#f0f0f0',
      },
      card: {
        border: '#353535',
        title: '#d6d6d6',
      },
      hero: {
        background:
          'linear-gradient(135deg, rgba(24, 27, 34, 0.98), rgba(30, 34, 42, 0.98))',
        border: '#2a2f38',
        title: '#f5f7ff',
        tagline: '#c4cad9',
        eyebrow: '#9aa4b2',
        focusRing: '#91a7ff',
        primaryBackground: '#b8c9ff',
        primaryText: '#111827',
        primaryHover: '#a6bbff',
        primaryShadow: '0 14px 26px rgba(15, 20, 35, 0.45)',
        secondaryText: '#e7eaf3',
        secondaryHover: '#2a2f3b',
        secondaryBorder: '#3a4150',
        logoBackground: '#11141c',
        logoBorder: '#2a2f38',
        logoShadow: '0 22px 34px rgba(8, 10, 18, 0.55)',
        glow:
          'radial-gradient(circle at 15% 20%, rgba(74, 111, 255, 0.35), transparent 55%), radial-gradient(circle at 85% 10%, rgba(255, 255, 255, 0.08), transparent 60%)',
      },
    },
  },
  radii: {
    sm: '8px',
    md: '10px',
    lg: '16px',
    pill: '999px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  typography: {
    baseFamily: "'Manrope', 'Segoe UI', system-ui, sans-serif",
    baseSize: '15px',
    baseLineHeight: '1.4',
  },
  shadows: {
    soft: '0 10px 18px rgba(0, 0, 0, 0.18)',
    strong: '0 20px 40px rgba(0, 0, 0, 0.4)',
  },
}

let activeThemeOptions: ThemeOptions = DEFAULT_THEME_OPTIONS

export function resolveThemeOptions(
  ...values: Array<ThemeOptionsInput | undefined>
): ThemeOptions {
  let merged = DEFAULT_THEME_OPTIONS
  for (const value of values) {
    if (value) merged = mergeThemeOptions(merged, value)
  }
  return merged
}

export function setThemeOptions(options: ThemeOptions) {
  activeThemeOptions = options
}

export function getThemeOptions(): ThemeOptions {
  return activeThemeOptions
}

export function getThemePalette(
  theme: ThemeName,
  options: ThemeOptions = activeThemeOptions,
): ThemePalette {
  const normalized = normalizeThemeName(theme)
  return normalized === 'dark' ? options.colors.dark : options.colors.light
}

function mergeThemeOptions(
  base: ThemeOptions,
  override: ThemeOptionsInput,
): ThemeOptions {
  return {
    ...base,
    colors: {
      light: mergePalette(base.colors.light, override.colors?.light),
      dark: mergePalette(base.colors.dark, override.colors?.dark),
    },
    radii: { ...base.radii, ...(override.radii ?? {}) },
    spacing: { ...base.spacing, ...(override.spacing ?? {}) },
    typography: { ...base.typography, ...(override.typography ?? {}) },
    shadows: { ...base.shadows, ...(override.shadows ?? {}) },
  }
}

function mergePalette(base: ThemePalette, override?: Partial<ThemePalette>) {
  if (!override) return base
  return {
    ...base,
    app: { ...base.app, ...(override.app ?? {}) },
    surface: { ...base.surface, ...(override.surface ?? {}) },
    panel: { ...base.panel, ...(override.panel ?? {}) },
    nav: { ...base.nav, ...(override.nav ?? {}) },
    topBar: { ...base.topBar, ...(override.topBar ?? {}) },
    themeSwitcher: {
      ...base.themeSwitcher,
      ...(override.themeSwitcher ?? {}),
    },
    cardGrid: { ...base.cardGrid, ...(override.cardGrid ?? {}) },
    card: { ...base.card, ...(override.card ?? {}) },
    hero: { ...base.hero, ...(override.hero ?? {}) },
  }
}
