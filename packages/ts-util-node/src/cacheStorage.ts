import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'

// proper-lockfile is CommonJS. Keep its small, private boundary out of the public declarations.
const lockfile = createRequire(import.meta.url)('proper-lockfile') as {
  lock(
    file: string,
    options: {
      realpath: boolean
      retries: { retries: number; minTimeout: number; maxTimeout: number }
      onCompromised(error: Error): void
    },
  ): Promise<() => Promise<void>>
}

export const CACHE_SHARDS = 32
export const CACHE_DAY_MS = 86_400_000
const INLINE_LIMIT = 64 * 1024

/** Null data points to a separate blob; text stays directly in the JSON shard. */
export type StoredCacheEntry = [day: number, data: string | null]
export type CacheShard = Record<string, StoredCacheEntry>
export type CacheChange =
  | { kind: 'put'; entry: StoredCacheEntry; blob?: Uint8Array }
  | { kind: 'touch'; day: number }
  | { kind: 'delete' }

export function cacheShardIndex(id: string) {
  return Number.parseInt(id.slice(0, 2), 16) % CACHE_SHARDS
}

export function cacheShardFile(directory: string, index: number) {
  return path.join(directory, `${index.toString(16).padStart(2, '0')}.json`)
}

export function cacheBlobFile(directory: string, id: string) {
  return path.join(directory, 'blobs', `${id}.cache`)
}

export function encodeCacheChange(
  data: string | Uint8Array,
  day: number,
): CacheChange & { kind: 'put' } {
  return typeof data === 'string' && Buffer.byteLength(data) <= INLINE_LIMIT
    ? { kind: 'put', entry: [day, data] }
    : {
        kind: 'put',
        entry: [day, null],
        blob: typeof data === 'string' ? Buffer.from(data) : data,
      }
}

export async function readCacheShard(file: string): Promise<CacheShard> {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8')) as CacheShard
  } catch {
    return {}
  }
}

async function atomicWrite(
  file: string,
  data: string | Uint8Array,
  assertLocked: () => void,
) {
  const temporary = `${file}.${randomUUID()}.tmp`
  try {
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(temporary, data, { flag: 'wx' })
    assertLocked()
    await fs.rename(temporary, file)
  } catch (error) {
    await fs.rm(temporary, { force: true }).catch(() => {})
    throw error
  }
}

/** Reload and merge under one shard lock, including its binary files and housekeeping. */
export async function updateCacheShard(
  directory: string,
  index: number,
  changes: ReadonlyMap<string, CacheChange>,
  cutoffDay?: number,
  cleanFiles: readonly string[] = [],
): Promise<CacheShard> {
  const file = cacheShardFile(directory, index)
  await fs.mkdir(directory, { recursive: true })
  let compromised: Error | undefined
  const release = await lockfile.lock(file, {
    realpath: false,
    retries: { retries: 8, minTimeout: 10, maxTimeout: 100 },
    onCompromised: (error) => {
      compromised = error
    },
  })
  const assertLocked = () => {
    if (compromised) throw compromised
  }
  try {
    const entries = await readCacheShard(file)
    let changed = false
    for (const [id, change] of changes) {
      if (change.kind === 'put') {
        if (change.blob)
          await atomicWrite(
            cacheBlobFile(directory, id),
            change.blob,
            assertLocked,
          )
        entries[id] = change.entry
        changed = true
      } else if (change.kind === 'delete') {
        if (Object.hasOwn(entries, id)) {
          delete entries[id]
          changed = true
        }
      } else if (Object.hasOwn(entries, id) && entries[id][0] < change.day) {
        entries[id][0] = change.day
        changed = true
      }
    }
    if (cutoffDay !== undefined) {
      for (const [id, [day]] of Object.entries(entries)) {
        if (day < cutoffDay) {
          delete entries[id]
          changed = true
        }
      }
    }
    assertLocked()
    if (changed) await atomicWrite(file, JSON.stringify(entries), assertLocked)
    for (const target of cleanFiles) {
      const name = path.basename(target)
      const id = name.slice(0, 64)
      // Retained blob entries remain valid regardless of the blob's modification time.
      if (name === `${id}.cache` && entries[id]?.[1] === null) continue
      const stat = await fs.stat(target).catch(() => undefined)
      if (
        stat &&
        cutoffDay !== undefined &&
        stat.mtimeMs < cutoffDay * CACHE_DAY_MS
      ) {
        assertLocked()
        await fs.rm(target, { force: true }).catch(() => {})
      }
    }
    return entries
  } finally {
    await release().catch(() => {})
  }
}

/** Only files owned by this layout are eligible; caller cleans them under their shard's lock. */
export async function listCacheFiles(
  directory: string,
): Promise<Map<number, string[]>> {
  const result = new Map<number, string[]>()
  const add = (index: number, file: string) => {
    const files = result.get(index) ?? []
    files.push(file)
    result.set(index, files)
  }
  const entries = await fs
    .readdir(directory, { withFileTypes: true })
    .catch(() => [])
  for (const entry of entries) {
    if (!entry.isFile()) continue
    const match = /^([01][a-f0-9])\.json(?:\.[a-f0-9-]{36}\.tmp)?$/.exec(
      entry.name,
    )
    if (match) {
      const index = Number.parseInt(match[1], 16)
      if (!result.has(index)) result.set(index, [])
      if (entry.name.endsWith('.tmp'))
        add(index, path.join(directory, entry.name))
    }
  }
  const blobs = await fs
    .readdir(path.join(directory, 'blobs'), { withFileTypes: true })
    .catch(() => [])
  for (const entry of blobs) {
    if (
      entry.isFile() &&
      /^[a-f0-9]{64}\.cache(?:\.[a-f0-9-]{36}\.tmp)?$/.test(entry.name)
    )
      add(
        cacheShardIndex(entry.name),
        path.join(directory, 'blobs', entry.name),
      )
  }
  return result
}
