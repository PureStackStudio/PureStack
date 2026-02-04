import type { ThemeCardColors, ThemeCardGridColors } from '../regor/components/cardGrid'
import type { ThemeHeroColors } from '../regor/components/hero'
import type { ThemeNavColors } from '../regor/components/navMenu'
import type { ThemePricingColors } from '../regor/components/pricing'
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
  pricing: ThemePricingColors
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
        toggleBackground: '#e7eaef',
        toggleBorder: '#d1d6e2',
        toggleIcon: '#3c4250',
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
      pricing: {
        background:
          'linear-gradient(135deg, rgba(248, 249, 255, 0.96), rgba(233, 239, 255, 0.96))',
        border: '#d8e0f5',
        title: '#0f172a',
        subtitle: '#4b5563',
        eyebrow: '#6b7280',
        footnote: '#6b7280',
        glow:
          'radial-gradient(circle at 15% 20%, rgba(124, 152, 255, 0.35), transparent 55%), radial-gradient(circle at 80% 5%, rgba(255, 255, 255, 0.6), transparent 60%)',
        planBackground: '#ffffff',
        planBorder: '#e2e8f5',
        planShadow: '0 12px 20px rgba(15, 23, 42, 0.08)',
        planTitle: '#0f172a',
        planSummary: '#4b5563',
        planPrice: '#111827',
        planPeriod: '#6b7280',
        planIconBackground: '#eef2ff',
        planIconGradient: 'linear-gradient(135deg, #e9eeff, #d8e2ff)',
        planIconColor: '#3f57bf',
        planIconRing: '#c8d5ff',
        planFeature: '#1f2937',
        planFeatureIconBackground: '#eef2ff',
        planFeatureIconGradient: 'linear-gradient(135deg, #eff3ff, #e1e9ff)',
        planFeatureIconColor: '#5b6fe0',
        planFeatureIconRing: '#d2ddff',
        planBadgeBackground: '#eef2ff',
        planBadgeText: '#3730a3',
        planNote: '#6b7280',
        planCtaBackground: '#ffffff',
        planCtaText: '#1f3a8a',
        planCtaBorder: '#c7d2fe',
        planCtaHover: '#eef2ff',
        planCtaShadow: '0 10px 18px rgba(46, 64, 130, 0.12)',
        planHighlightBackground: '#f3f6ff',
        planHighlightBorder: '#b7c6ff',
        planHighlightShadow: '0 18px 30px rgba(53, 78, 170, 0.18)',
        planHighlightCtaBackground: '#1f4ed8',
        planHighlightCtaText: '#ffffff',
        planHighlightCtaHover: '#1b45c2',
        focusRing: '#93a9ff',
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
        toggleBackground: '#1b202b',
        toggleBorder: '#2a313e',
        toggleIcon: '#d2d8e8',
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
      pricing: {
        background:
          'linear-gradient(135deg, rgba(20, 23, 32, 0.98), rgba(28, 33, 45, 0.98))',
        border: '#2b3240',
        title: '#f5f7ff',
        subtitle: '#c4cad9',
        eyebrow: '#9aa4b2',
        footnote: '#9aa4b2',
        glow:
          'radial-gradient(circle at 15% 20%, rgba(74, 111, 255, 0.28), transparent 55%), radial-gradient(circle at 85% 5%, rgba(255, 255, 255, 0.08), transparent 60%)',
        planBackground: '#181c24',
        planBorder: '#2a313f',
        planShadow: '0 16px 26px rgba(5, 10, 22, 0.4)',
        planTitle: '#f5f7ff',
        planSummary: '#b8c0d2',
        planPrice: '#f5f7ff',
        planPeriod: '#9aa4b2',
        planIconBackground: '#2a3557',
        planIconGradient: 'linear-gradient(135deg, #2d3d67, #243052)',
        planIconColor: '#c7d2ff',
        planIconRing: '#3b4f84',
        planFeature: '#d6dbea',
        planFeatureIconBackground: '#2c3552',
        planFeatureIconGradient: 'linear-gradient(135deg, #324068, #2a3553)',
        planFeatureIconColor: '#b7c6ff',
        planFeatureIconRing: '#3a4d7d',
        planBadgeBackground: '#2b3560',
        planBadgeText: '#c7d2ff',
        planNote: '#9aa4b2',
        planCtaBackground: '#1a2235',
        planCtaText: '#cfd8ff',
        planCtaBorder: '#334166',
        planCtaHover: '#202a40',
        planCtaShadow: '0 14px 24px rgba(5, 10, 22, 0.35)',
        planHighlightBackground: '#20283a',
        planHighlightBorder: '#4b5cc4',
        planHighlightShadow: '0 20px 36px rgba(5, 10, 22, 0.45)',
        planHighlightCtaBackground: '#b8c9ff',
        planHighlightCtaText: '#101827',
        planHighlightCtaHover: '#a6bbff',
        focusRing: '#91a7ff',
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
    pricing: { ...base.pricing, ...(override.pricing ?? {}) },
  }
}
