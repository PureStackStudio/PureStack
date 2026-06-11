import type { SemanticTone } from '@purestack/ts-style'

export type NavigationMode = 'auto' | 'custom' | 'hybrid' | 'none'
export type NavigationSort = 'order' | 'title' | 'path'

export interface NavigationConfig {
  mode?: NavigationMode
  navFileName?: string
  maxDepth?: number
  includeIndex?: boolean
  sortBy?: NavigationSort
  roots?: string[]
  tone?: SemanticTone
}

export interface NavItem {
  id?: string
  title: string
  url?: string
  children?: NavItem[]
  order?: number
  hidden?: boolean
  badge?: string
  icon?: string
  tone?: SemanticTone
}

export interface PageNavigation {
  mode: NavigationMode
  folder: string
  root: string
  items: NavItem[]
  global: NavItem[]
  tone: SemanticTone
}
