export type NavigationMode = 'auto' | 'custom' | 'hybrid' | 'none'
export type NavigationSort = 'order' | 'title' | 'path'

export interface NavigationConfig {
  mode?: NavigationMode
  navFileName?: string
  maxDepth?: number
  includeIndex?: boolean
  sortBy?: NavigationSort
}

export interface ResolvedNavigationConfig {
  mode: NavigationMode
  navFileName: string
  maxDepth: number
  includeIndex: boolean
  sortBy: NavigationSort
}

export interface NavItem {
  title: string
  url?: string
  children?: NavItem[]
  order?: number
  hidden?: boolean
  group?: string
  icon?: string
}

export interface PageNavigation {
  mode: NavigationMode
  folder: string
  items: NavItem[]
  global: NavItem[]
}

const DEFAULT_NAV_CONFIG: ResolvedNavigationConfig = {
  mode: 'auto',
  navFileName: '_nav.json',
  maxDepth: 1,
  includeIndex: true,
  sortBy: 'order',
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
  return { mode, navFileName, maxDepth, includeIndex, sortBy }
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
