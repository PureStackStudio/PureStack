import { merge } from '@logpot/utils'

import { builtInSkins } from './skins'
import { normalizeThemeName, type ThemeName } from './themeAssets'

export const THEME_MODES = ['light', 'dark'] as const
export type ThemeMode = (typeof THEME_MODES)[number]

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown>
    ? DeepPartial<T[K]>
    : T[K]
}

export interface ThemePalette {
  background: {
    canvas: string
    surface: string
    surfaceAlt: string
    panel: string
    showcase: string
    showcaseAlt: string
    accentMuted: string
    accent: string
    feature: string
    successMuted: string
    dangerMuted: string
  }
  text: {
    default: string
    muted: string
    subtle: string
    accent: string
    inverse: string
    success: string
    danger: string
  }
  border: {
    subtle: string
    default: string
    strong: string
    accent: string
    focus: string
    success: string
    danger: string
  }
  action: {
    neutral: {
      background: string
      text: string
      hover: string
    }
    accent: {
      background: string
      text: string
      hover: string
    }
  }
  status: {
    success: {
      background: string
      border: string
      text: string
    }
    danger: {
      background: string
      border: string
      text: string
    }
  }
  badge: {
    accent: {
      background: string
      text: string
    }
  }
  icon: {
    accent: {
      background: string
      gradient: string
      color: string
      ring: string
    }
    neutral: {
      background: string
      gradient: string
      color: string
      ring: string
    }
  }
  effect: {
    glowPrimary: string
    glowSecondary: string
    floatingShadow: string
    panelShadow: string
    panelShadowStrong: string
    accentShadow: string
    interactiveShadow: string
    trackShadow: string
    thumbShadow: string
  }
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

export type ThemeOptionsInput = {
  colors?: Partial<Record<ThemeMode, DeepPartial<ThemePalette>>>
  radii?: Partial<ThemeOptions['radii']>
  spacing?: Partial<ThemeOptions['spacing']>
  typography?: Partial<ThemeOptions['typography']>
  shadows?: Partial<ThemeOptions['shadows']>
}

export const DEFAULT_THEME_OPTIONS: ThemeOptions = {
  colors: {
    ...builtInSkins.ocean,
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

function resolveThemeOptions(
  ...values: Array<ThemeOptionsInput | undefined>
): ThemeOptions {
  let merged = DEFAULT_THEME_OPTIONS
  for (const value of values) {
    if (value) merged = mergeThemeOptions(merged, value)
  }
  return merged
}

function setThemeOptions(options: ThemeOptions) {
  activeThemeOptions = options
}

function getThemeOptions(): ThemeOptions {
  return activeThemeOptions
}

function getThemePalette(theme: ThemeName): ThemePalette {
  const mode = resolveThemeMode(theme)
  return activeThemeOptions.colors[mode]
}

function resolveThemeMode(theme: ThemeName): ThemeMode {
  const normalized = normalizeThemeName(theme)
  if (normalized === 'dark') return 'dark'
  if (normalized === 'light') return 'light'
  if (
    normalized.startsWith('dark-') ||
    normalized.endsWith('-dark') ||
    normalized.includes('dark')
  ) {
    return 'dark'
  }
  if (
    normalized.startsWith('light-') ||
    normalized.endsWith('-light') ||
    normalized.includes('light')
  ) {
    return 'light'
  }
  return 'light'
}

function forEachTheme(run: (theme: ThemeMode, palette: ThemePalette) => void) {
  for (const theme of THEME_MODES) {
    run(theme, activeThemeOptions.colors[theme])
  }
}

export interface Themes {
  readonly modes: readonly ThemeMode[]
  readonly defaults: ThemeOptions
  resolve: (...values: Array<ThemeOptionsInput | undefined>) => ThemeOptions
  setOptions: (options: ThemeOptions) => void
  getOptions: () => ThemeOptions
  palette: (theme: ThemeName) => ThemePalette
  forEach: (
    run: (
      theme: ThemeMode,
      palette: ThemePalette,
      options: ThemeOptions,
    ) => void,
  ) => void
}

export const themes: Themes = {
  modes: THEME_MODES,
  defaults: DEFAULT_THEME_OPTIONS,
  resolve: (...values) => resolveThemeOptions(...values),
  setOptions: (options) => setThemeOptions(options),
  getOptions: () => getThemeOptions(),
  palette: (theme) => getThemePalette(theme),
  forEach: (run) =>
    forEachTheme((theme, palette) => run(theme, palette, activeThemeOptions)),
}

function mergeThemeOptions(
  base: ThemeOptions,
  override: ThemeOptionsInput,
): ThemeOptions {
  return merge(base, override)
}
