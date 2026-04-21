import type { ThemePalette, ThemePaletteCurrent } from './themePalette'

const THEME_PALETTE_VAR_PREFIX = '--ps'

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
  return `${THEME_PALETTE_VAR_PREFIX}-${parts.map(toKebabCase).join('-')}`
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
    tone: 'var(--ps-current-tone)',
    canvas: 'var(--ps-current-canvas)',
    overlay: 'var(--ps-current-overlay)',
    surface: {
      rest: {
        background: 'var(--ps-current-surface-rest-background)',
        border: 'var(--ps-current-surface-rest-border)',
        text: 'var(--ps-current-surface-rest-text)',
      },
      hover: {
        background: 'var(--ps-current-surface-hover-background)',
        border: 'var(--ps-current-surface-hover-border)',
        text: 'var(--ps-current-surface-hover-text)',
      },
      active: {
        background: 'var(--ps-current-surface-active-background)',
        border: 'var(--ps-current-surface-active-border)',
        text: 'var(--ps-current-surface-active-text)',
      },
    },
    surfaceAlt: {
      rest: {
        background: 'var(--ps-current-surface-alt-rest-background)',
        border: 'var(--ps-current-surface-alt-rest-border)',
        text: 'var(--ps-current-surface-alt-rest-text)',
      },
      hover: {
        background: 'var(--ps-current-surface-alt-hover-background)',
        border: 'var(--ps-current-surface-alt-hover-border)',
        text: 'var(--ps-current-surface-alt-hover-text)',
      },
      active: {
        background: 'var(--ps-current-surface-alt-active-background)',
        border: 'var(--ps-current-surface-alt-active-border)',
        text: 'var(--ps-current-surface-alt-active-text)',
      },
    },
    text: {
      default: 'var(--ps-current-text-default)',
      subtle: 'var(--ps-current-text-subtle)',
    },
    border: {
      subtle: 'var(--ps-current-border-subtle)',
      default: 'var(--ps-current-border-default)',
      focus: 'var(--ps-current-border-focus)',
    },
    button: {
      rest: {
        background: 'var(--ps-current-button-rest-background)',
        border: 'var(--ps-current-button-rest-border)',
        text: 'var(--ps-current-button-rest-text)',
      },
      hover: {
        background: 'var(--ps-current-button-hover-background)',
        border: 'var(--ps-current-button-hover-border)',
        text: 'var(--ps-current-button-hover-text)',
      },
      active: {
        background: 'var(--ps-current-button-active-background)',
        border: 'var(--ps-current-button-active-border)',
        text: 'var(--ps-current-button-active-text)',
      },
    },
    icon: {
      background: 'var(--ps-current-icon-background)',
      gradient: 'var(--ps-current-icon-gradient)',
      color: 'var(--ps-current-icon-color)',
      border: 'var(--ps-current-icon-border)',
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
