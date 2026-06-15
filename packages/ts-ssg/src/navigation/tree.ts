import type { NavItem } from '@purestack/ts-common'
import type {
  ContentMeta,
  FolderNode,
  InternalNavItem,
  NavFile,
  NavSequenceEntry,
  ResolvedNavigationConfig,
} from './model'
import {
  applyIcons,
  applySequence,
  buildFolderSequenceKeys,
  buildPageSequenceKeys,
  sortNavItems,
} from './sequence'
import { humanizeSegment } from './utils'

export function buildBaseFolderNavigation(
  autoByFolder: Record<string, InternalNavItem[]>,
  customByFolder: Record<string, NavFile>,
  config: ResolvedNavigationConfig,
) {
  const byFolder: Record<string, InternalNavItem[]> = {}
  const folders = new Set([
    ...Object.keys(autoByFolder),
    ...Object.keys(customByFolder),
  ])
  folders.add('')
  for (const folder of folders) {
    byFolder[folder] = resolveBaseFolderItems(
      folder,
      autoByFolder,
      customByFolder,
      config,
    )
  }
  return byFolder
}

export function buildAutoNavigation(
  root: FolderNode,
  config: ResolvedNavigationConfig,
): Record<string, InternalNavItem[]> {
  const byFolder: Record<string, InternalNavItem[]> = {}
  const stack = [root]
  while (stack.length > 0) {
    const current = stack.pop()
    if (!current) break
    byFolder[current.relPath] = sortNavItems(
      createPageItems(current.pages, config),
      config.sortBy,
    )
    for (const child of current.children.values()) {
      stack.push(child)
    }
  }
  return byFolder
}

export function buildNestedNavigation(
  root: FolderNode,
  baseByFolder: Record<string, InternalNavItem[]>,
  customByFolder: Record<string, NavFile>,
  config: ResolvedNavigationConfig,
) {
  const byFolder: Record<string, InternalNavItem[]> = {}
  const depth = Math.max(1, config.maxDepth)
  const allowChildren = config.mode !== 'custom'

  const buildNode = (
    node: FolderNode,
    remaining: number,
    inheritedSequence: NavSequenceEntry[],
    inheritedIcons: NavFile['icons'],
  ): InternalNavItem[] => {
    const baseItems = baseByFolder[node.relPath] ?? []
    const items = [...baseItems]
    const custom = customByFolder[node.relPath]
    const overrideMode = custom?.mode === 'override'
    const sequence = [...(custom?.sequence ?? []), ...inheritedSequence]
    const icons = [...(custom?.icons ?? []), ...inheritedIcons]

    if (
      allowChildren &&
      !overrideMode &&
      remaining > 1 &&
      node.children.size > 0
    ) {
      const children = [...node.children.values()].sort((a, b) =>
        a.name.localeCompare(b.name),
      )
      for (const child of children) {
        const childItem = buildNestedChildNavItem(
          child,
          buildNode,
          remaining,
          sequence,
          icons,
          customByFolder,
          config,
        )
        if (childItem) {
          items.push(childItem)
        }
      }
    }

    const sortedItems = sortNavItems(items, config.sortBy)
    const sequencedItems = applySequence(sortedItems, sequence, config.sortBy)
    const finalItems = applyIcons(sequencedItems, icons)
    byFolder[node.relPath] = finalItems
    return finalItems
  }

  buildNode(root, depth, [], [])
  return byFolder
}

export function buildFolderTree(metas: ContentMeta[]): FolderNode {
  const root: FolderNode = {
    name: '',
    relPath: '',
    pages: [],
    children: new Map(),
  }

  for (const meta of metas) {
    const segments = meta.folder ? meta.folder.split('/') : []
    let node = root
    for (const segment of segments) {
      let child = node.children.get(segment)
      if (!child) {
        child = {
          name: segment,
          relPath: node.relPath ? `${node.relPath}/${segment}` : segment,
          pages: [],
          children: new Map(),
        }
        node.children.set(segment, child)
      }
      node = child
    }
    node.pages.push(meta)
  }

  return root
}

export function stripInternalNavByFolder(
  byFolder: Record<string, InternalNavItem[]>,
): Record<string, NavItem[]> {
  const result: Record<string, NavItem[]> = {}
  for (const [folder, items] of Object.entries(byFolder)) {
    result[folder] = items.map(stripInternalNavItem)
  }
  return result
}

function resolveBaseFolderItems(
  folder: string,
  autoByFolder: Record<string, InternalNavItem[]>,
  customByFolder: Record<string, NavFile>,
  config: ResolvedNavigationConfig,
) {
  const autoItems = autoByFolder[folder] ?? []
  const custom = customByFolder[folder]
  if (config.mode === 'auto') return autoItems
  if (config.mode === 'custom') return custom?.items ?? []
  if (!custom) return autoItems
  if (custom.mode === 'override') return custom.items
  const merged = [...autoItems, ...custom.items]
  return sortNavItems(merged, config.sortBy)
}

function buildNestedChildNavItem(
  child: FolderNode,
  buildNode: (
    node: FolderNode,
    remaining: number,
    inheritedSequence: NavSequenceEntry[],
    inheritedIcons: NavFile['icons'],
  ) => InternalNavItem[],
  remaining: number,
  inheritedSequence: NavSequenceEntry[],
  inheritedIcons: NavFile['icons'],
  customByFolder: Record<string, NavFile>,
  config: ResolvedNavigationConfig,
): InternalNavItem | null {
  const childItems = buildNode(
    child,
    remaining - 1,
    inheritedSequence,
    inheritedIcons,
  )
  if (childItems.length === 0) return null
  const childOverride = customByFolder[child.relPath]?.mode === 'override'
  const folderIndexMeta = child.pages.find(
    (page) => page.isFolderIndex && !page.hidden,
  )
  if (!childOverride && folderIndexMeta && config.includeIndex) {
    const indexItem = toNavItem(folderIndexMeta)
    const filtered = childItems.filter(
      (item) => item.url !== folderIndexMeta.urlPath,
    )
    const folderIndexItem = {
      ...indexItem,
      sequenceKeys: [
        ...(indexItem.sequenceKeys ?? []),
        ...buildFolderSequenceKeys(child),
      ],
    }
    return filtered.length > 0
      ? { ...folderIndexItem, children: filtered }
      : folderIndexItem
  }
  return {
    title: humanizeSegment(child.name),
    sequenceKeys: buildFolderSequenceKeys(child),
    children: childItems,
  }
}

function createPageItems(
  pages: ContentMeta[],
  config: ResolvedNavigationConfig,
) {
  const items: InternalNavItem[] = []
  for (const page of pages) {
    if (page.hidden) continue
    if (!config.includeIndex && page.isFolderIndex) continue
    items.push(toNavItem(page))
  }
  return items
}

function toNavItem(meta: ContentMeta): InternalNavItem {
  const item: InternalNavItem = {
    title: meta.title,
    url: meta.urlPath,
    sequenceKeys: buildPageSequenceKeys(meta),
  }
  if (typeof meta.order === 'number') item.order = meta.order
  if (meta.badge) item.badge = meta.badge
  if (meta.icon) item.icon = meta.icon
  return item
}

function stripInternalNavItem(item: InternalNavItem): NavItem {
  const result: NavItem = {
    ...(item.id ? { id: item.id } : {}),
    title: item.title,
    ...(item.url ? { url: item.url } : {}),
    ...(item.children && item.children.length > 0
      ? { children: item.children.map(stripInternalNavItem) }
      : {}),
    ...(typeof item.order === 'number' ? { order: item.order } : {}),
    ...(item.hidden ? { hidden: item.hidden } : {}),
    ...(item.badge ? { badge: item.badge } : {}),
    ...(item.icon ? { icon: item.icon } : {}),
    ...(item.tone ? { tone: item.tone } : {}),
  }
  return result
}
