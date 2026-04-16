export type NavigationMode = 'auto' | 'custom' | 'hybrid' | 'none'
export type NavigationSort = 'order' | 'title' | 'path'

export interface NavigationConfig {
  mode?: NavigationMode
  navFileName?: string
  maxDepth?: number
  includeIndex?: boolean
  sortBy?: NavigationSort
}

export interface NavItem {
  title: string
  url?: string
  children?: NavItem[]
  order?: number
  hidden?: boolean
  group?: string
  icon?: string
  tone?: string
}

export interface PageNavigation {
  mode: NavigationMode
  folder: string
  items: NavItem[]
  global: NavItem[]
}
