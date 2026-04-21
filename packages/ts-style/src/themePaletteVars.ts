import type { ThemePalette, ThemePaletteCurrent } from './themePalette'

const THEME_PALETTE_VAR_PREFIX = '--ps'
export const MINIFY_THEME_VARIABLE_NAMES = false

const CURRENT_THEME_PALETTE_VAR_PATHS = {
  tone: ['tone'],
  canvas: ['canvas'],
  overlay: ['overlay'],
  surfaceRestBackground: ['surface', 'rest', 'background'],
  surfaceRestBorder: ['surface', 'rest', 'border'],
  surfaceRestText: ['surface', 'rest', 'text'],
  surfaceHoverBackground: ['surface', 'hover', 'background'],
  surfaceHoverBorder: ['surface', 'hover', 'border'],
  surfaceHoverText: ['surface', 'hover', 'text'],
  surfaceActiveBackground: ['surface', 'active', 'background'],
  surfaceActiveBorder: ['surface', 'active', 'border'],
  surfaceActiveText: ['surface', 'active', 'text'],
  surfaceAltRestBackground: ['surfaceAlt', 'rest', 'background'],
  surfaceAltRestBorder: ['surfaceAlt', 'rest', 'border'],
  surfaceAltRestText: ['surfaceAlt', 'rest', 'text'],
  surfaceAltHoverBackground: ['surfaceAlt', 'hover', 'background'],
  surfaceAltHoverBorder: ['surfaceAlt', 'hover', 'border'],
  surfaceAltHoverText: ['surfaceAlt', 'hover', 'text'],
  surfaceAltActiveBackground: ['surfaceAlt', 'active', 'background'],
  surfaceAltActiveBorder: ['surfaceAlt', 'active', 'border'],
  surfaceAltActiveText: ['surfaceAlt', 'active', 'text'],
  textDefault: ['text', 'default'],
  textSubtle: ['text', 'subtle'],
  borderSubtle: ['border', 'subtle'],
  borderDefault: ['border', 'default'],
  borderFocus: ['border', 'focus'],
  buttonRestBackground: ['button', 'rest', 'background'],
  buttonRestBorder: ['button', 'rest', 'border'],
  buttonRestText: ['button', 'rest', 'text'],
  buttonHoverBackground: ['button', 'hover', 'background'],
  buttonHoverBorder: ['button', 'hover', 'border'],
  buttonHoverText: ['button', 'hover', 'text'],
  buttonActiveBackground: ['button', 'active', 'background'],
  buttonActiveBorder: ['button', 'active', 'border'],
  buttonActiveText: ['button', 'active', 'text'],
  iconBackground: ['icon', 'background'],
  iconGradient: ['icon', 'gradient'],
  iconColor: ['icon', 'color'],
  iconBorder: ['icon', 'border'],
} as const

type CurrentThemePaletteVarPathKey =
  keyof typeof CURRENT_THEME_PALETTE_VAR_PATHS
const CURRENT_THEME_PALETTE_VAR_PATH_ENTRIES = Object.entries(
  CURRENT_THEME_PALETTE_VAR_PATHS,
) as Array<[CurrentThemePaletteVarPathKey, readonly string[]]>
const LEGACY_THEME_VARIABLE_NAME_ALIASES: Record<string, string[]> = {
  '--ps-semantic-tone-accent-button-rest-background': [
    'semanticTone',
    'accent',
    'button',
    'rest',
    'background',
  ],
}

/**
 * Utilities for turning a semantic {@link ThemePalette} into a CSS custom-property contract.
 *
 * Algorithm:
 * 1. Traverse the palette recursively and treat every string leaf as one token.
 *    Exception:
 *    - `current` is a special runtime alias surface and is not part of generated
 *      theme variable declarations.
 *    Example paths:
 *    - `canvas`
 *    - `text.default`
 *    - `semanticTone.info.surface.rest.background`
 * 2. Convert each path into a stable CSS variable name by:
 *    - splitting the path into segments
 *    - converting each segment from camelCase to kebab-case
 *    - joining with `-`
 *    - prefixing with `--ps-`
 *    Example:
 *    - `canvas` -> `--ps-canvas`
 *    - `semanticTone.info.surface.rest.background` -> `--ps-semantic-tone-info-surface-rest-background`
 * 3. Support two outputs from the same source palette:
 *    - declaration output:
 *      `buildThemePaletteVariableCss(...)` emits a `:root` block assigning raw values
 *      to those variable names
 *    - binding output:
 *      `createThemePaletteVarBindings(...)` recreates the same `ThemePalette` shape,
 *      but replaces each leaf string value with `var(--ps-...)`
 *
 * This keeps authored skins as the raw source of truth while allowing component styles
 * to consume semantic tokens through CSS variables.
 */
export interface ThemePaletteVarEntry {
  name: string
  path: string[]
  value: string
}

export function createThemePaletteVarBindings(
  palette: ThemePalette,
): ThemePalette {
  return {
    ...mapThemePaletteLeaves(palette, (path) => getThemePaletteVar(path)),
    current: getCurrentThemePalette(),
  }
}

export function getThemePaletteVar(path: string | string[]) {
  return `var(${getThemePaletteVarName(path)})`
}

export function getThemePaletteVarName(path: string | string[]) {
  const parts = Array.isArray(path) ? path : path.split('.')
  return buildThemeVariableName('theme', parts)
}

export function getCurrentThemePaletteVar(
  path: CurrentThemePaletteVarPathKey | readonly string[] | string[],
) {
  return `var(${getCurrentThemePaletteVarName(path)})`
}

export function getCurrentThemePaletteVarName(
  path: CurrentThemePaletteVarPathKey | readonly string[] | string[],
) {
  const parts =
    typeof path === 'string' && path in CURRENT_THEME_PALETTE_VAR_PATHS
      ? [
          ...CURRENT_THEME_PALETTE_VAR_PATHS[
            path as CurrentThemePaletteVarPathKey
          ],
        ]
      : [...path]
  return buildThemeVariableName('current', parts)
}

export function normalizeThemeVariableReference(value: string) {
  return value.replace(
    /var\((--ps-[A-Za-z0-9-]+)\)/g,
    (match, variableName: string) => {
      const normalizedTheme = normalizeLegacyThemeVariableName(variableName)
      if (normalizedTheme) return `var(${normalizedTheme})`
      const normalizedCurrent = normalizeCurrentThemeVariableName(variableName)
      if (normalizedCurrent) return `var(${normalizedCurrent})`
      return match
    },
  )
}

export function listThemePaletteVarEntries(
  palette: ThemePalette,
): ThemePaletteVarEntry[] {
  const entries: ThemePaletteVarEntry[] = []
  collectThemePaletteEntries(palette, [], entries)
  return entries
}

export function buildThemePaletteVariableCss(
  palette: ThemePalette,
  pretty: boolean = true,
  selector: string = ':root',
) {
  const entries = listThemePaletteVarEntries(palette)
  if (entries.length === 0) return ''
  if (!pretty) {
    const declarations = entries
      .map((entry) => `${entry.name}:${entry.value};`)
      .join('')
    return `${selector}{${declarations}}`
  }

  const lines = [`${selector} {`]
  for (const entry of entries) {
    lines.push(`  ${entry.name}: ${entry.value};`)
  }
  lines.push('}')
  return lines.join('\n')
}

function collectThemePaletteEntries(
  value: unknown,
  path: string[],
  entries: ThemePaletteVarEntry[],
) {
  if (typeof value === 'string') {
    entries.push({
      name: getThemePaletteVarName(path),
      path,
      value,
    })
    return
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return
  }

  for (const [key, child] of Object.entries(value)) {
    if (isCurrentPaletteKey(path, key) || isFontPaletteKey(path, key)) continue
    collectThemePaletteEntries(child, [...path, key], entries)
  }
}

function mapThemePaletteLeaves(
  value: ThemePalette,
  mapLeaf: (path: string[]) => string,
  path: string[] = [],
): ThemePalette {
  return mapThemePaletteValue(value, mapLeaf, path)
}

export function getCurrentThemePalette(): ThemePaletteCurrent {
  return {
    tone: getCurrentThemePaletteVar('tone'),
    canvas: getCurrentThemePaletteVar('canvas'),
    overlay: getCurrentThemePaletteVar('overlay'),
    surface: {
      rest: {
        background: getCurrentThemePaletteVar('surfaceRestBackground'),
        border: getCurrentThemePaletteVar('surfaceRestBorder'),
        text: getCurrentThemePaletteVar('surfaceRestText'),
      },
      hover: {
        background: getCurrentThemePaletteVar('surfaceHoverBackground'),
        border: getCurrentThemePaletteVar('surfaceHoverBorder'),
        text: getCurrentThemePaletteVar('surfaceHoverText'),
      },
      active: {
        background: getCurrentThemePaletteVar('surfaceActiveBackground'),
        border: getCurrentThemePaletteVar('surfaceActiveBorder'),
        text: getCurrentThemePaletteVar('surfaceActiveText'),
      },
    },
    surfaceAlt: {
      rest: {
        background: getCurrentThemePaletteVar('surfaceAltRestBackground'),
        border: getCurrentThemePaletteVar('surfaceAltRestBorder'),
        text: getCurrentThemePaletteVar('surfaceAltRestText'),
      },
      hover: {
        background: getCurrentThemePaletteVar('surfaceAltHoverBackground'),
        border: getCurrentThemePaletteVar('surfaceAltHoverBorder'),
        text: getCurrentThemePaletteVar('surfaceAltHoverText'),
      },
      active: {
        background: getCurrentThemePaletteVar('surfaceAltActiveBackground'),
        border: getCurrentThemePaletteVar('surfaceAltActiveBorder'),
        text: getCurrentThemePaletteVar('surfaceAltActiveText'),
      },
    },
    text: {
      default: getCurrentThemePaletteVar('textDefault'),
      subtle: getCurrentThemePaletteVar('textSubtle'),
    },
    border: {
      subtle: getCurrentThemePaletteVar('borderSubtle'),
      default: getCurrentThemePaletteVar('borderDefault'),
      focus: getCurrentThemePaletteVar('borderFocus'),
    },
    button: {
      rest: {
        background: getCurrentThemePaletteVar('buttonRestBackground'),
        border: getCurrentThemePaletteVar('buttonRestBorder'),
        text: getCurrentThemePaletteVar('buttonRestText'),
      },
      hover: {
        background: getCurrentThemePaletteVar('buttonHoverBackground'),
        border: getCurrentThemePaletteVar('buttonHoverBorder'),
        text: getCurrentThemePaletteVar('buttonHoverText'),
      },
      active: {
        background: getCurrentThemePaletteVar('buttonActiveBackground'),
        border: getCurrentThemePaletteVar('buttonActiveBorder'),
        text: getCurrentThemePaletteVar('buttonActiveText'),
      },
    },
    icon: {
      background: getCurrentThemePaletteVar('iconBackground'),
      gradient: getCurrentThemePaletteVar('iconGradient'),
      color: getCurrentThemePaletteVar('iconColor'),
      border: getCurrentThemePaletteVar('iconBorder'),
    },
  }
}

function mapThemePaletteValue<T>(
  value: T,
  mapLeaf: (path: string[]) => string,
  path: string[],
): T {
  if (typeof value === 'string') {
    return mapLeaf(path) as T
  }

  if (typeof value === 'function') {
    return value
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return value
  }

  const out: Record<string, unknown> = {}
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (isCurrentPaletteKey(path, key) || isFontPaletteKey(path, key)) {
      out[key] = child
      continue
    }
    out[key] = mapThemePaletteValue(child, mapLeaf, [...path, key])
  }
  return out as T
}

function isCurrentPaletteKey(path: string[], key: string) {
  return path.length === 0 && key === 'current'
}

function isFontPaletteKey(path: string[], key: string) {
  return path.length === 0 && key === 'font'
}

function toKebabCase(value: string) {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
}

function buildThemeVariableName(scope: 'theme' | 'current', parts: string[]) {
  const normalized = parts.map(toKebabCase)
  if (!MINIFY_THEME_VARIABLE_NAMES) {
    return buildReadableThemeVariableName(scope, parts)
  }
  return `${THEME_PALETTE_VAR_PREFIX}-${scope === 'current' ? 'c' : 't'}-${hashThemeVariablePath(normalized)}`
}

function normalizeCurrentThemeVariableName(variableName: string) {
  for (const [key, parts] of CURRENT_THEME_PALETTE_VAR_PATH_ENTRIES) {
    const readableName = buildReadableThemeVariableName('current', [...parts])
    if (variableName === readableName) {
      return getCurrentThemePaletteVarName(key)
    }
  }
  return ''
}

function normalizeLegacyThemeVariableName(variableName: string) {
  const path = LEGACY_THEME_VARIABLE_NAME_ALIASES[variableName]
  return path ? getThemePaletteVarName(path) : ''
}

function buildReadableThemeVariableName(
  scope: 'theme' | 'current',
  parts: string[],
) {
  const normalized = parts.map(toKebabCase)
  return `${THEME_PALETTE_VAR_PREFIX}-${scope === 'current' ? 'current-' : ''}${normalized.join('-')}`
}

function hashThemeVariablePath(parts: string[]) {
  let hash = 2166136261
  for (const char of parts.join('.')) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(36)
}
