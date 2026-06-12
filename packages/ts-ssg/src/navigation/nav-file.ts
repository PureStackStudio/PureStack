import fs from 'node:fs/promises'
import path from 'node:path'
import type {
  InternalNavItem,
  NavFile,
  ResolvedNavigationConfig,
} from './model'
import {
  buildCustomSequenceKeys,
  normalizeNavIcons,
  normalizeNavSequence,
} from './sequence'
import {
  isExternalUrl,
  isPlainObject,
  resolveBoolean,
  resolveNumber,
  resolveString,
  splitUrlSuffix,
} from './utils'

export async function loadCustomNavigation(
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
      return { mode: 'override', items, sequence: [], icons: [] }
    }
    if (!isPlainObject(parsed)) {
      throw new Error('nav file must be a JSON object or array.')
    }
    const items = normalizeNavItems(parsed.items, folder)
    const sequence = normalizeNavSequence(parsed.sequence, folder)
    const icons = normalizeNavIcons(parsed.icons, folder)
    const mode =
      parsed.mode === 'merge' || parsed.mode === 'override'
        ? parsed.mode
        : 'merge'
    return { mode, items, sequence, icons }
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === 'ENOENT') return null
    const message = err.message ?? String(err)
    throw new Error(`Failed to read nav file ${filePath}: ${message}`, {
      cause: error,
    })
  }
}

function normalizeNavItems(value: unknown, folder: string): InternalNavItem[] {
  if (!Array.isArray(value)) return []
  const items: InternalNavItem[] = []
  for (const raw of value) {
    if (!isPlainObject(raw)) continue
    const id = resolveString(raw.id)
    const title = resolveString(raw.title)
    if (!title) continue
    if (resolveBoolean(raw.hidden)) continue
    const url = resolveUrl(raw, folder)
    const order = resolveNumber(raw.order)
    const badge = resolveString(raw.badge)
    const icon = resolveString(raw.icon)
    const children = normalizeNavItems(raw.children, folder)
    const item: InternalNavItem = {
      ...(id ? { id } : {}),
      title,
      ...(url ? { url } : {}),
      ...(typeof order === 'number' ? { order } : {}),
      ...(badge ? { badge } : {}),
      ...(icon ? { icon } : {}),
      ...(children.length > 0 ? { children } : {}),
      sequenceKeys: buildCustomSequenceKeys({ id, title, url }),
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
