import path from 'node:path'
import type {
  NavigationConfig,
  NavigationMode,
  NavigationSort,
} from '@purestack/ts-common'
import { pickSemanticTone } from '@purestack/ts-style'
import type { ResolvedNavigationConfig } from './model'

const DEFAULT_NAV_CONFIG: ResolvedNavigationConfig = {
  mode: 'auto',
  navFileName: '_nav.json',
  maxDepth: 1,
  includeIndex: true,
  sortBy: 'order',
  roots: [],
  tone: 'neutral',
}

export function resolveNavigationConfig(
  ...inputs: Array<NavigationConfig | undefined>
): ResolvedNavigationConfig {
  const merged: NavigationConfig = {}
  for (const input of inputs) {
    if (!input) continue
    Object.assign(merged, input)
  }

  const mode = resolveMode(merged.mode)
  const navFileName =
    typeof merged.navFileName === 'string' &&
    merged.navFileName.trim().length > 0
      ? merged.navFileName.trim()
      : DEFAULT_NAV_CONFIG.navFileName
  const maxDepth = resolveMaxDepth(merged.maxDepth)
  const includeIndex =
    typeof merged.includeIndex === 'boolean'
      ? merged.includeIndex
      : DEFAULT_NAV_CONFIG.includeIndex
  const sortBy = resolveSort(merged.sortBy)
  const roots = resolveNavigationRoots(merged.roots)
  const tone = pickSemanticTone(merged.tone) ?? DEFAULT_NAV_CONFIG.tone
  const variant = resolveText(merged.variant)
  const className = resolveText(merged.class)
  return {
    mode,
    navFileName,
    maxDepth,
    includeIndex,
    sortBy,
    roots,
    tone,
    ...(variant ? { variant } : {}),
    ...(className ? { class: className } : {}),
  }
}

function resolveText(value: unknown) {
  if (typeof value !== 'string') return undefined
  return value.trim() || undefined
}

function resolveMode(mode: NavigationMode | undefined): NavigationMode {
  if (
    mode === 'auto' ||
    mode === 'custom' ||
    mode === 'hybrid' ||
    mode === 'none'
  ) {
    return mode
  }
  return DEFAULT_NAV_CONFIG.mode
}

function resolveMaxDepth(value: number | undefined) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return DEFAULT_NAV_CONFIG.maxDepth
  }
  return Math.max(1, Math.floor(value))
}

function resolveSort(value: NavigationSort | undefined): NavigationSort {
  if (value === 'order' || value === 'title' || value === 'path') return value
  return DEFAULT_NAV_CONFIG.sortBy
}

function resolveNavigationRoots(value: unknown): string[] {
  if (!Array.isArray(value)) return DEFAULT_NAV_CONFIG.roots
  const roots = new Set<string>()
  for (const entry of value) {
    const root = normalizeNavigationRoot(entry)
    if (root) roots.add(root)
  }
  return [...roots].sort((a, b) => b.length - a.length)
}

function normalizeNavigationRoot(value: unknown) {
  if (typeof value !== 'string') return undefined
  const trimmed = value
    .trim()
    .replaceAll('\\', '/')
    .replace(/^\/+|\/+$/g, '')
  if (!trimmed) return undefined
  const normalized = path.posix.normalize(trimmed)
  if (
    normalized === '.' ||
    normalized === '..' ||
    normalized.startsWith('../')
  ) {
    throw new Error(
      `Invalid navigation root "${value}". Navigation roots must stay inside the content root.`,
    )
  }
  return normalized
}
