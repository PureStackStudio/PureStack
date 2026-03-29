import type { ThemePalette } from './themePalette'

const THEME_PALETTE_VAR_PREFIX = '--ps'

/**
 * Utilities for turning a semantic {@link ThemePalette} into a CSS custom-property contract.
 *
 * Algorithm:
 * 1. Traverse the palette recursively and treat every string leaf as one token.
 *    Example paths:
 *    - `background.canvas`
 *    - `text.default`
 *    - `status.info.border`
 * 2. Convert each path into a stable CSS variable name by:
 *    - splitting the path into segments
 *    - converting each segment from camelCase to kebab-case
 *    - joining with `-`
 *    - prefixing with `--ps-`
 *    Example:
 *    - `background.canvas` -> `--ps-background-canvas`
 *    - `status.info.border` -> `--ps-status-info-border`
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

export function createThemePaletteVarBindings(palette: ThemePalette): ThemePalette {
  return mapThemePaletteLeaves(palette, (path) => getThemePaletteVar(path))
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

function mapThemePaletteValue<T>(
  value: T,
  mapLeaf: (path: string[]) => string,
  path: string[],
): T {
  if (typeof value === 'string') {
    return mapLeaf(path) as T
  }

  const out: Record<string, unknown> = {}
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    out[key] = mapThemePaletteValue(child, mapLeaf, [...path, key])
  }
  return out as T
}

function toKebabCase(value: string) {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
}
