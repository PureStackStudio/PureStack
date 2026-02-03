import { normalizeThemeName, type ThemeName } from './themes'

export type ThemeMode = 'light' | 'dark'

export type ThemeColorToken =
  | 'appBackground'
  | 'appText'
  | 'surfaceBackground'
  | 'surfaceBorder'
  | 'surfaceAltBackground'
  | 'surfaceAltBorder'
  | 'panelBackground'
  | 'panelBorder'
  | 'panelText'
  | 'border'
  | 'text'
  | 'textMuted'
  | 'textSubtle'
  | 'brand'
  | 'brandSoft'
  | 'navBackground'
  | 'navBorder'
  | 'navText'
  | 'navTextMuted'
  | 'navHoverBackground'
  | 'navNestedBorder'
  | 'navSummaryHoverBackground'
  | 'navActiveBackground'
  | 'navActiveText'
  | 'navFocusRing'
  | 'navChevron'
  | 'navBadgeBackground'
  | 'navBadgeText'
  | 'topBarBackground'
  | 'topBarBorder'
  | 'topBarLogo'
  | 'topBarIcon'
  | 'topBarToggleBackground'
  | 'topBarToggleBorder'
  | 'topBarToggleIcon'
  | 'themeSwitcherBackground'
  | 'themeSwitcherBorder'
  | 'themeSwitcherText'
  | 'themeSwitcherHoverBackground'
  | 'themeSwitcherTrackBackground'
  | 'themeSwitcherTrackShadow'
  | 'themeSwitcherThumbBackground'
  | 'themeSwitcherThumbShadow'
  | 'themeSwitcherTrackSun'
  | 'themeSwitcherTrackMoon'
  | 'themeSwitcherThumbIcon'
  | 'cardGridBorder'
  | 'cardGridTitle'
  | 'cardBorder'
  | 'cardTitle'

export type ThemeColorPalette = Record<ThemeColorToken, string>

export interface ThemeOptions {
  colors: Record<ThemeMode, ThemeColorPalette>
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
  colors?: Partial<Record<ThemeMode, Partial<ThemeColorPalette>>>
  radii?: Partial<ThemeOptions['radii']>
  spacing?: Partial<ThemeOptions['spacing']>
  typography?: Partial<ThemeOptions['typography']>
  shadows?: Partial<ThemeOptions['shadows']>
}

export const DEFAULT_THEME_OPTIONS: ThemeOptions = {
  colors: {
    light: {
      appBackground: '#f5f7fb',
      appText: '#1f2937',
      surfaceBackground: '#f6f7fb',
      surfaceBorder: '#e1e4ef',
      surfaceAltBackground: '#f8f9fd',
      surfaceAltBorder: '#e1e4ef',
      panelBackground: '#f6f7fb',
      panelBorder: '#e1e4ef',
      panelText: '#1f2937',
      border: '#d8deee',
      text: '#1f2937',
      textMuted: '#4b5563',
      textSubtle: '#3c4250',
      brand: '#2f4ea1',
      brandSoft: '#3a4a7d',
      navBackground: '#f6f7fb',
      navBorder: '#e1e4ef',
      navText: '#1f2937',
      navTextMuted: '#4b5563',
      navHoverBackground: '#e9edf7',
      navNestedBorder: '#d9deee',
      navSummaryHoverBackground: '#eef1f8',
      navActiveBackground: '#d7e2ff',
      navActiveText: '#0b1a3d',
      navFocusRing: '#9ab3ff',
      navChevron: '#7b8597',
      navBadgeBackground: '#e6ecfb',
      navBadgeText: '#3a4a7d',
      topBarBackground: '#f8f9fd',
      topBarBorder: '#e1e4ef',
      topBarLogo: '#2f4ea1',
      topBarIcon: '#3c4250',
      topBarToggleBackground: '#ffffff',
      topBarToggleBorder: '#d8deee',
      topBarToggleIcon: '#1b2030',
      themeSwitcherBackground: '#e7eaef',
      themeSwitcherBorder: '#d1d6e2',
      themeSwitcherText: '#8a909c',
      themeSwitcherHoverBackground: '#e3e7ee',
      themeSwitcherTrackBackground: '#d6d9e0',
      themeSwitcherTrackShadow:
        'inset 0 3px 6px rgba(0, 0, 0, 0.12), inset 0 -2px 4px rgba(255, 255, 255, 0.7)',
      themeSwitcherThumbBackground: '#ff9a1f',
      themeSwitcherThumbShadow:
        '0 10px 18px rgba(0, 0, 0, 0.18), inset 0 3px 6px rgba(255, 255, 255, 0.3)',
      themeSwitcherTrackSun: '#f2a02a',
      themeSwitcherTrackMoon: '#9aa1ad',
      themeSwitcherThumbIcon: '#ffffff',
      cardGridBorder: '#e6e6e6',
      cardGridTitle: '#222222',
      cardBorder: '#ededed',
      cardTitle: '#444444',
    },
    dark: {
      appBackground: '#14171d',
      appText: '#e7eaf3',
      surfaceBackground: '#1b1f27',
      surfaceBorder: '#2a2f38',
      surfaceAltBackground: '#222733',
      surfaceAltBorder: '#2d3340',
      panelBackground: '#1b1f27',
      panelBorder: '#2a2f38',
      panelText: '#e7eaf3',
      border: '#2a313e',
      text: '#e7eaf3',
      textMuted: '#b0b6c6',
      textSubtle: '#d2d8e8',
      brand: '#a9c1ff',
      brandSoft: '#b9c6ff',
      navBackground: '#1b1f27',
      navBorder: '#2a2f38',
      navText: '#e6e9f2',
      navTextMuted: '#b0b6c6',
      navHoverBackground: '#262b35',
      navNestedBorder: '#2b313c',
      navSummaryHoverBackground: '#252a34',
      navActiveBackground: '#b7c6ff',
      navActiveText: '#101a32',
      navFocusRing: '#91a7ff',
      navChevron: '#9aa4b2',
      navBadgeBackground: '#2a3244',
      navBadgeText: '#b9c6ff',
      topBarBackground: '#222733',
      topBarBorder: '#2d3340',
      topBarLogo: '#a9c1ff',
      topBarIcon: '#d2d8e8',
      topBarToggleBackground: '#f3f5fb',
      topBarToggleBorder: '#d7ddef',
      topBarToggleIcon: '#1b2030',
      themeSwitcherBackground: '#1b202b',
      themeSwitcherBorder: '#2a313e',
      themeSwitcherText: '#8c94a3',
      themeSwitcherHoverBackground: '#1f2633',
      themeSwitcherTrackBackground: '#2a3140',
      themeSwitcherTrackShadow:
        'inset 0 3px 7px rgba(0, 0, 0, 0.45), inset 0 -2px 4px rgba(255, 255, 255, 0.05)',
      themeSwitcherThumbBackground: '#4f6bd5',
      themeSwitcherThumbShadow:
        '0 12px 20px rgba(5, 8, 20, 0.55), inset 0 3px 6px rgba(255, 255, 255, 0.2)',
      themeSwitcherTrackSun: '#7f8796',
      themeSwitcherTrackMoon: '#b7c5ff',
      themeSwitcherThumbIcon: '#ffffff',
      cardGridBorder: '#2f2f2f',
      cardGridTitle: '#f0f0f0',
      cardBorder: '#353535',
      cardTitle: '#d6d6d6',
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
): ThemeColorPalette {
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
      light: { ...base.colors.light, ...(override.colors?.light ?? {}) },
      dark: { ...base.colors.dark, ...(override.colors?.dark ?? {}) },
    },
    radii: { ...base.radii, ...(override.radii ?? {}) },
    spacing: { ...base.spacing, ...(override.spacing ?? {}) },
    typography: { ...base.typography, ...(override.typography ?? {}) },
    shadows: { ...base.shadows, ...(override.shadows ?? {}) },
  }
}
