import type {
  NavItem,
  NavigationMode,
  NavigationSort,
} from '@purestack/ts-common'
import type { SemanticTone } from '@purestack/ts-style'
import type { ContentFile } from '../discover/content'

export interface ResolvedNavigationConfig {
  mode: NavigationMode
  navFileName: string
  maxDepth: number
  includeIndex: boolean
  sortBy: NavigationSort
  roots: string[]
  tone: SemanticTone
}

export interface NavigationTree {
  mode: NavigationMode
  config: ResolvedNavigationConfig
  byFolder: Record<string, NavItem[]>
  global: NavItem[]
}

export interface NavFile {
  mode?: 'override' | 'merge'
  items: InternalNavItem[]
  sequence: NavSequenceEntry[]
}

export type InternalNavItem = Omit<NavItem, 'children'> & {
  children?: InternalNavItem[]
  sequenceKeys?: string[]
}

export interface NavSequenceEntry {
  value: string
  keys: string[]
}

export interface ContentMeta {
  file: ContentFile
  folder: string
  urlPath: string
  title: string
  order?: number
  badge?: string
  icon?: string
  hidden: boolean
  isIndex: boolean
}

export interface FolderNode {
  name: string
  relPath: string
  pages: ContentMeta[]
  children: Map<string, FolderNode>
}
