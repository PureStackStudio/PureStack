import fs from 'node:fs/promises'
import path from 'node:path'

import matter from 'gray-matter'

import { resolveRouteInfo } from '../build/out-path'
import type { ContentFile } from '../discover/content'

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

export interface NavigationTree {
  mode: NavigationMode
  config: ResolvedNavigationConfig
  byFolder: Record<string, NavItem[]>
  global: NavItem[]
}

export interface PageNavigation {
  mode: NavigationMode
  folder: string
  items: NavItem[]
  global: NavItem[]
}

interface NavFile {
  mode?: 'override' | 'merge'
  items: NavItem[]
}

interface ContentMeta {
  file: ContentFile
  folder: string
  urlPath: string
  title: string
  order?: number
  hidden: boolean
  isIndex: boolean
}

interface FolderNode {
  name: string
  relPath: string
  pages: ContentMeta[]
  children: Map<string, FolderNode>
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

export async function buildNavigation(
  contentDir: string,
  files: ContentFile[],
  navigation?: NavigationConfig,
): Promise<NavigationTree | undefined> {
  const config = resolveNavigationConfig(navigation)
  if (config.mode === 'none') return undefined

  const folderSet = collectFolders(files)
  const contentMeta = await loadContentMeta(files)
  const folderTree = buildFolderTree(contentMeta)
  const autoByFolder =
    config.mode === 'custom' ? {} : buildAutoNavigation(folderTree, config)
  const customByFolder =
    config.mode === 'auto'
      ? {}
      : await loadCustomNavigation(contentDir, folderSet, config)

  const baseByFolder: Record<string, NavItem[]> = {}
  const folders = new Set([
    ...Object.keys(autoByFolder),
    ...Object.keys(customByFolder),
  ])
  folders.add('')

  for (const folder of folders) {
    const autoItems = autoByFolder[folder] ?? []
    const custom = customByFolder[folder]
    if (config.mode === 'auto') {
      baseByFolder[folder] = autoItems
      continue
    }
    if (config.mode === 'custom') {
      baseByFolder[folder] = custom?.items ?? []
      continue
    }

    if (!custom) {
      baseByFolder[folder] = autoItems
      continue
    }

    if (custom.mode === 'override') {
      baseByFolder[folder] = custom.items
      continue
    }

    const merged = [...autoItems, ...custom.items]
    baseByFolder[folder] = sortNavItems(merged, config.sortBy)
  }

  const byFolder = buildNestedNavigation(
    folderTree,
    baseByFolder,
    customByFolder,
    config,
  )
  const global = byFolder[''] ?? []
  return { mode: config.mode, config, byFolder, global }
}

export function resolvePageNavigation(
  tree: NavigationTree | undefined,
  file: ContentFile,
): PageNavigation | undefined {
  if (!tree) return undefined
  const folder = resolveFolderKey(file.relPath)
  const items = tree.byFolder[folder] ?? []
  return { mode: tree.mode, folder, items, global: tree.global }
}

export function resolveFolderKey(relPath: string) {
  const relPosix = toPosixPath(relPath)
  const dir = path.posix.dirname(relPosix)
  return dir === '.' ? '' : dir
}

function collectFolders(files: ContentFile[]) {
  const folders = new Set<string>()
  folders.add('')
  for (const file of files) {
    const folder = resolveFolderKey(file.relPath)
    folders.add(folder)
    if (!folder) continue
    const segments = folder.split('/')
    for (let i = 1; i < segments.length; i += 1) {
      folders.add(segments.slice(0, i).join('/'))
    }
  }
  return folders
}

async function loadContentMeta(files: ContentFile[]): Promise<ContentMeta[]> {
  const result: ContentMeta[] = []
  for (const file of files) {
    const raw = await fs.readFile(file.absPath, 'utf8')
    const parsed = matter(raw)
    const frontmatter = parsed.data as Record<string, unknown>
    const relPosix = toPosixPath(file.relPath)
    const baseName = path.posix.basename(relPosix, file.ext)
    const isIndex = baseName === 'index'
    const folder = resolveFolderKey(file.relPath)
    const { urlPath } = resolveRouteInfo(file)

    const nav = isPlainObject(frontmatter.nav) ? frontmatter.nav : undefined
    const hidden =
      resolveBoolean(nav?.hidden) ||
      resolveBoolean(frontmatter.hidden) ||
      resolveBoolean(frontmatter.draft)
    const title =
      resolveString(nav?.title) ||
      resolveString(frontmatter.title) ||
      extractHeadingTitle(parsed.content) ||
      humanizeSegment(baseName)
    const order = resolveNumber(nav?.order) ?? resolveNumber(frontmatter.order)

    result.push({
      file,
      folder,
      urlPath,
      title,
      order,
      hidden,
      isIndex,
    })
  }
  return result
}

function buildAutoNavigation(
  root: FolderNode,
  config: ResolvedNavigationConfig,
): Record<string, NavItem[]> {
  const byFolder: Record<string, NavItem[]> = {}
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

function buildNestedNavigation(
  root: FolderNode,
  baseByFolder: Record<string, NavItem[]>,
  customByFolder: Record<string, NavFile>,
  config: ResolvedNavigationConfig,
) {
  const byFolder: Record<string, NavItem[]> = {}
  const depth = Math.max(1, config.maxDepth)
  const allowChildren = config.mode !== 'custom'

  const buildNode = (node: FolderNode, remaining: number): NavItem[] => {
    const baseItems = baseByFolder[node.relPath] ?? []
    const items = [...baseItems]
    const overrideMode = customByFolder[node.relPath]?.mode === 'override'

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
        const childItems = buildNode(child, remaining - 1)
        if (childItems.length === 0) continue
        const childOverride = customByFolder[child.relPath]?.mode === 'override'
        const indexMeta = child.pages.find(
          (page) => page.isIndex && !page.hidden,
        )
        if (!childOverride && indexMeta && config.includeIndex) {
          const indexItem = toNavItem(indexMeta)
          const filtered = childItems.filter(
            (item) => item.url !== indexMeta.urlPath,
          )
          items.push(
            filtered.length > 0
              ? { ...indexItem, children: filtered }
              : indexItem,
          )
          continue
        }
        items.push({
          title: humanizeSegment(child.name),
          children: childItems,
        })
      }
    }

    const finalItems = sortNavItems(items, config.sortBy)
    byFolder[node.relPath] = finalItems
    return finalItems
  }

  buildNode(root, depth)
  return byFolder
}

function buildFolderTree(metas: ContentMeta[]): FolderNode {
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

function createPageItems(
  pages: ContentMeta[],
  config: ResolvedNavigationConfig,
) {
  const items: NavItem[] = []
  for (const page of pages) {
    if (page.hidden) continue
    if (!config.includeIndex && page.isIndex) continue
    items.push(toNavItem(page))
  }
  return items
}

function toNavItem(meta: ContentMeta): NavItem {
  const item: NavItem = {
    title: meta.title,
    url: meta.urlPath,
  }
  if (typeof meta.order === 'number') item.order = meta.order
  return item
}

async function loadCustomNavigation(
  contentDir: string,
  folders: Set<string>,
  config: ResolvedNavigationConfig,
): Promise<Record<string, NavFile>> {
  const result: Record<string, NavFile> = {}
  for (const folder of folders) {
    const folderPath = folder ? path.join(contentDir, folder) : contentDir
    const filePath = path.join(folderPath, config.navFileName)
    const navFile = await readNavFile(filePath, folder)
    if (navFile) {
      result[folder] = navFile
    }
  }
  return result
}

async function readNavFile(
  filePath: string,
  folder: string,
): Promise<NavFile | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed)) {
      const items = normalizeNavItems(parsed, folder)
      return { mode: 'override', items }
    }
    if (!isPlainObject(parsed)) {
      throw new Error('nav file must be a JSON object or array.')
    }
    const items = normalizeNavItems(parsed.items, folder)
    const mode =
      parsed.mode === 'merge' || parsed.mode === 'override'
        ? parsed.mode
        : 'merge'
    return { mode, items }
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === 'ENOENT') return null
    const message = err.message ?? String(err)
    throw new Error(`Failed to read nav file ${filePath}: ${message}`)
  }
}

function normalizeNavItems(value: unknown, folder: string): NavItem[] {
  if (!Array.isArray(value)) return []
  const items: NavItem[] = []
  for (const raw of value) {
    if (!isPlainObject(raw)) continue
    const title = resolveString(raw.title)
    if (!title) continue
    if (resolveBoolean(raw.hidden)) continue
    const url = resolveUrl(raw, folder)
    const order = resolveNumber(raw.order)
    const group = resolveString(raw.group)
    const icon = resolveString(raw.icon)
    const children = normalizeNavItems(raw.children, folder)
    const item: NavItem = {
      title,
      ...(url ? { url } : {}),
      ...(typeof order === 'number' ? { order } : {}),
      ...(group ? { group } : {}),
      ...(icon ? { icon } : {}),
      ...(children.length > 0 ? { children } : {}),
    }
    items.push(item)
  }
  return items
}

function resolveUrl(raw: Record<string, unknown>, folder: string) {
  const url =
    resolveString(raw.url) || resolveString(raw.href) || resolveString(raw.path)
  if (!url) return undefined
  if (isExternalUrl(url)) return url
  return resolveInternalUrl(folder, url)
}

function resolveInternalUrl(folder: string, url: string) {
  const { base, suffix } = splitUrlSuffix(url)
  const joined = path.posix.join('/', folder, base)
  const hasExt = path.posix.extname(joined).length > 0
  const normalized = hasExt || joined.endsWith('/') ? joined : `${joined}/`
  return `${normalized}${suffix}`
}

function splitUrlSuffix(url: string) {
  const hashIndex = url.indexOf('#')
  const queryIndex = url.indexOf('?')
  const index =
    hashIndex === -1
      ? queryIndex
      : queryIndex === -1
        ? hashIndex
        : Math.min(hashIndex, queryIndex)
  if (index === -1) return { base: url, suffix: '' }
  return { base: url.slice(0, index), suffix: url.slice(index) }
}

function isExternalUrl(url: string) {
  return (
    url.startsWith('#') ||
    url.startsWith('//') ||
    /^[a-zA-Z][a-zA-Z+.-]*:/.test(url)
  )
}

function sortNavItems(items: NavItem[], sortBy: NavigationSort): NavItem[] {
  const sorted = [...items].sort((a, b) => {
    const orderA =
      typeof a.order === 'number' ? a.order : Number.POSITIVE_INFINITY
    const orderB =
      typeof b.order === 'number' ? b.order : Number.POSITIVE_INFINITY
    if (orderA !== orderB) return orderA - orderB
    if (sortBy === 'path') {
      return (a.url ?? '').localeCompare(b.url ?? '')
    }
    const urlA = a.url ?? ''
    const urlB = b.url ?? ''
    if (urlA && urlB) return urlA.localeCompare(urlB)
    return a.title.localeCompare(b.title)
  })
  return sorted.map((item) => ({
    ...item,
    ...(item.children && item.children.length > 0
      ? { children: sortNavItems(item.children, sortBy) }
      : {}),
  }))
}

function extractHeadingTitle(content: string) {
  const match = content.match(/^\s*#\s+(.+?)\s*$/m)
  if (!match) return undefined
  return match[1]
    .replace(/\s*#+\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function humanizeSegment(segment: string) {
  const cleaned = segment.replace(/[-_]+/g, ' ').trim()
  if (!cleaned) return segment
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ')
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

function resolveString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : undefined
}

function resolveNumber(value: unknown) {
  return typeof value === 'number' && !Number.isNaN(value) ? value : undefined
}

function resolveBoolean(value: unknown) {
  return value === true
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function toPosixPath(filePath: string) {
  return filePath.split(path.sep).join('/')
}
