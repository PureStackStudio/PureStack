import path from 'node:path'
import type { NavigationSort } from '@purestack/ts-common'
import type {
  ContentMeta,
  FolderNode,
  InternalNavItem,
  NavIconEntry,
  NavSequenceEntry,
} from './model'
import {
  isExternalUrl,
  isPlainObject,
  splitUrlSuffix,
  stripPathExtension,
  toPosixPath,
} from './utils'

export function normalizeNavSequence(
  value: unknown,
  folder: string,
): NavSequenceEntry[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .map((entry) => ({
      value: entry,
      keys: buildSequenceEntryKeys(entry, folder),
    }))
}

export function normalizeNavIcons(
  value: unknown,
  folder: string,
): NavIconEntry[] {
  if (!isPlainObject(value)) return []
  const entries: NavIconEntry[] = []
  for (const [rawKey, rawIcon] of Object.entries(value)) {
    const key = rawKey.trim()
    const icon = typeof rawIcon === 'string' ? rawIcon.trim() : ''
    if (!key || !icon) continue
    entries.push({
      value: key,
      icon,
      keys: buildSequenceEntryKeys(key, folder),
    })
  }
  return entries
}

export function applySequence(
  items: InternalNavItem[],
  sequence: NavSequenceEntry[],
  sortBy: NavigationSort,
): InternalNavItem[] {
  if (sequence.length === 0 || items.length === 0) return items

  const remaining = [...items]
  const ordered: InternalNavItem[] = []
  for (const entry of sequence) {
    const entryKeys = buildSequenceKeyCandidates(entry)
    const itemIndex = remaining.findIndex((item) =>
      itemMatchesSequence(item, entryKeys),
    )
    if (itemIndex < 0) continue
    const [item] = remaining.splice(itemIndex, 1)
    if (item) ordered.push(item)
  }

  return [...ordered, ...sortNavItems(remaining, sortBy)]
}

export function applyIcons(
  items: InternalNavItem[],
  icons: NavIconEntry[],
): InternalNavItem[] {
  if (icons.length === 0 || items.length === 0) return items
  return items.map((item) => {
    const icon = resolveIcon(item, icons)
    return icon ? { ...item, icon } : item
  })
}

export function sortNavItems(
  items: InternalNavItem[],
  sortBy: NavigationSort,
): InternalNavItem[] {
  return [...items].sort((a, b) => {
    const orderA = typeof a.order === 'number' ? a.order : 0
    const orderB = typeof b.order === 'number' ? b.order : 0
    if (orderA !== orderB) return orderA - orderB
    if (sortBy === 'path') {
      return (a.url ?? '').localeCompare(b.url ?? '')
    }
    const urlA = a.url ?? ''
    const urlB = b.url ?? ''
    if (urlA && urlB) return urlA.localeCompare(urlB)
    return a.title.localeCompare(b.title)
  })
}

export function buildPageSequenceKeys(meta: ContentMeta): string[] {
  const relPath = toPosixPath(meta.file.relPath)
  const fileName = path.posix.basename(relPath)
  const baseRelPath = stripPathExtension(relPath)
  const baseFileName = stripPathExtension(fileName)
  return [relPath, baseRelPath, fileName, baseFileName, meta.urlPath]
}

export function buildFolderSequenceKeys(folder: FolderNode): string[] {
  const routePath = folder.relPath ? `/${folder.relPath}/` : '/'
  return [
    folder.relPath,
    `${folder.relPath}/`,
    folder.name,
    `${folder.name}/`,
    routePath,
  ]
}

export function buildCustomSequenceKeys(input: {
  id?: string
  title: string
  url?: string
}): string[] {
  return [
    input.id ?? '',
    input.url ?? '',
    input.title,
    slugifySequenceTitle(input.title),
  ]
}

function itemMatchesSequence(
  item: InternalNavItem,
  entryKeys: Set<string>,
): boolean {
  if (itemMatchesNavKeys(item, entryKeys)) return true
  for (const child of item.children ?? []) {
    if (itemMatchesSequence(child, entryKeys)) return true
  }
  return false
}

function resolveIcon(
  item: InternalNavItem,
  icons: NavIconEntry[],
): string | undefined {
  for (const entry of icons) {
    if (itemMatchesNavKeys(item, buildSequenceKeyCandidates(entry))) {
      return entry.icon
    }
  }
  return item.icon
}

function itemMatchesNavKeys(
  item: InternalNavItem,
  entryKeys: Set<string>,
): boolean {
  for (const key of buildItemSequenceKeySet(item)) {
    if (entryKeys.has(key)) return true
  }
  return false
}

function buildItemSequenceKeySet(item: InternalNavItem): Set<string> {
  const keys = new Set<string>()
  for (const key of item.sequenceKeys ?? []) {
    addSequenceKey(keys, key)
  }
  addSequenceKey(keys, item.id)
  addSequenceKey(keys, item.url)
  addSequenceKey(keys, item.title)
  addSequenceKey(keys, slugifySequenceTitle(item.title))
  return keys
}

function buildSequenceEntryKeys(value: string, folder: string): string[] {
  const keys = [value]
  const { base, suffix } = splitUrlSuffix(value)
  if (folder && base && !isExternalUrl(base) && !base.startsWith('/')) {
    keys.push(`${path.posix.normalize(path.posix.join(folder, base))}${suffix}`)
  }
  return [...new Set(keys)]
}

function buildSequenceKeyCandidates(entry: NavSequenceEntry): Set<string> {
  const keys = new Set<string>()
  for (const key of entry.keys) {
    addSequenceKey(keys, key)
  }
  return keys
}

function addSequenceKey(keys: Set<string>, value: string | undefined) {
  const key = normalizeSequenceKey(value)
  if (!key) return
  keys.add(key)
  if (key.startsWith('/')) keys.add(key.replace(/^\/+/, ''))
  else keys.add(`/${key}`)
  if (key.endsWith('/')) keys.add(key.replace(/\/+$/, ''))
  else keys.add(`${key}/`)

  const ext = path.posix.extname(key).toLowerCase()
  if (ext === '.md' || ext === '.mdx') {
    const withoutExt = key.slice(0, -ext.length)
    keys.add(withoutExt)
    keys.add(ext === '.md' ? `${withoutExt}.mdx` : `${withoutExt}.md`)
  }
}

function normalizeSequenceKey(value: string | undefined) {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const { base } = splitUrlSuffix(trimmed)
  const normalized = base
    .replaceAll('\\', '/')
    .replace(/^\.\//, '')
    .replace(/\/{2,}/g, '/')
    .toLowerCase()
  return normalized.length > 0 ? normalized : undefined
}

function slugifySequenceTitle(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
