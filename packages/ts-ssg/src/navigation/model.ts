import type {
  NavItem,
  NavigationMode,
  NavigationSort,
} from '@purestack/ts-common'
import type { SemanticTone } from '@purestack/ts-style'
import type { ContentFile } from '../discover/content'
import type { ResolvedContentFile } from '../i18n/content'

export type NavigationContentFile = ContentFile | ResolvedContentFile

export interface ResolvedNavigationConfig {
  mode: NavigationMode
  navFileName: string
  maxDepth: number
  includeIndex: boolean
  sortBy: NavigationSort
  roots: string[]
  tone: SemanticTone
  variant?: string
  class?: string
}

export interface NavigationTree {
  mode: NavigationMode
  config: ResolvedNavigationConfig
  byFolder: Record<string, NavItem[]>
  rootByFolder: Record<string, string>
  pageLinksByFolder: Record<string, boolean>
  global: NavItem[]
}

export interface NavFile {
  mode?: 'override' | 'merge'
  root?: string
  items: InternalNavItem[]
  sequence: NavSequenceEntry[]
  icons: NavIconEntry[]
  pageLinks?: boolean
}

export type InternalNavItem = Omit<NavItem, 'children'> & {
  children?: InternalNavItem[]
  sequenceKeys?: string[]
}

export interface NavSequenceEntry {
  value: string
  keys: string[]
}

export interface NavIconEntry {
  value: string
  icon: string
  keys: string[]
}

export interface ContentMeta {
  file: NavigationContentFile
  folder: string
  urlPath: string
  title: string
  order?: number
  badge?: string
  icon?: string
  hidden: boolean
  isFolderIndex: boolean
}

export interface FolderNode {
  name: string
  relPath: string
  pages: ContentMeta[]
  children: Map<string, FolderNode>
}
