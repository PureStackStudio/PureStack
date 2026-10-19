import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { Cache } from '@purestack/ts-util'
import {
  CACHE_DAY_MS,
  CACHE_SHARDS,
  type CacheChange,
  type CacheShard,
  cacheBlobFile,
  cacheShardFile,
  cacheShardIndex,
  encodeCacheChange,
  listCacheFiles,
  readCacheShard,
  updateCacheShard,
} from './cacheStorage'

export interface PersistentCacheCodec<T> {
  encode(value: T): string | Uint8Array
  decode(data: Buffer): T
}

export interface PersistentCacheOptions<T> {
  /** Owner name using lowercase letters, digits, underscores, and hyphens. */
  namespace: string
  /** Change whenever the computation or serialized format changes. */
  version: string
  /** Parent directory. Defaults to `os.tmpdir()/purestack-cache`. */
  directory?: string
  /** `false` bypasses both memory and disk. Defaults to `true`. */
  enabled?: boolean
  /** Idle retention in days. Defaults to 30; 0 disables cleanup. */
  maxAgeDays?: number
  /** Defaults to 4096. Also limits buffered mutations. */
  maxMemoryEntries?: number
  /** Approximate combined budget for values, loaded shards, and pending writes. Defaults to 16 MiB. */
  maxMemoryBytes?: number
  /** Best-effort background flush interval. Defaults to 2000 ms; 0 disables the timer. Always await flush before exit. */
  flushIntervalMs?: number
  /** Defaults to JSON. Binary and text over 64 KiB are stored separately from JSON shards. */
  codec?: PersistentCacheCodec<T>
}

interface MemoryEntry<T> {
  value: T
  bytes: number
  touchedDay: number
}
interface LoadedShard {
  entries: CacheShard
  bytes: number
  generation: number
}
type Changes = Map<number, Map<string, CacheChange>>

/** Buffered build-time value cache. Await flush() after a batch to persist its mutations. */
export class PersistentCache<T> {
  private readonly directory: string
  private readonly enabled: boolean
  private readonly version: string
  private readonly maxAgeDays: number
  private readonly maxEntries: number
  private readonly bufferLimit: number
  private readonly flushIntervalMs: number
  private readonly memory: Cache<string, MemoryEntry<T>>
  private readonly shards: Cache<number, LoadedShard>
  private readonly generations = Array<number>(CACHE_SHARDS).fill(0)
  private readonly codec: PersistentCacheCodec<T>
  private pending: Changes = new Map()
  private flushing: Changes = new Map()
  private pendingBytes = 0
  private pendingCount = 0
  private work: Promise<void> = Promise.resolve()
  private readonly failed = new WeakSet<CacheChange>()
  private timer?: NodeJS.Timeout
  private nextMaintenance = 0

  constructor(options: PersistentCacheOptions<T>) {
    if (!/^[a-z0-9][a-z0-9_-]*$/.test(options.namespace))
      throw new Error(
        'Cache namespace must use lowercase letters, digits, underscores, or hyphens.',
      )
    if (typeof options.version !== 'string' || !options.version.length)
      throw new Error('Cache version must be a non-empty string.')
    this.maxAgeDays = options.maxAgeDays ?? 30
    if (!Number.isFinite(this.maxAgeDays) || this.maxAgeDays < 0)
      throw new Error('Cache maxAgeDays must be a non-negative finite number.')
    this.maxEntries = options.maxMemoryEntries ?? 4096
    const budget = options.maxMemoryBytes ?? 16 * 1024 * 1024
    if (
      !Number.isInteger(this.maxEntries) ||
      this.maxEntries < 1 ||
      !Number.isFinite(budget) ||
      budget < 1
    )
      throw new Error(
        'Cache memory limits must be positive; maxMemoryEntries must be an integer.',
      )
    this.flushIntervalMs = options.flushIntervalMs ?? 2000
    if (!Number.isFinite(this.flushIntervalMs) || this.flushIntervalMs < 0)
      throw new Error(
        'Cache flushIntervalMs must be a non-negative finite number.',
      )
    this.directory = path.resolve(
      options.directory ?? path.join(os.tmpdir(), 'purestack-cache'),
      options.namespace,
    )
    this.enabled = options.enabled !== false
    this.version = options.version
    this.bufferLimit = Math.max(1, Math.floor(budget / 3))
    this.memory = new Cache({
      maxEntries: this.maxEntries,
      maxWeight: this.bufferLimit,
      sizeCalculator: (entry) => entry.bytes,
    })
    this.shards = new Cache({
      maxEntries: CACHE_SHARDS,
      maxWeight: this.bufferLimit,
      sizeCalculator: (shard) => shard.bytes,
    })
    this.codec = options.codec ?? {
      encode(value) {
        const data = JSON.stringify(value)
        if (data === undefined)
          throw new Error('Value cannot be serialized as JSON.')
        return data
      },
      decode: (data) => JSON.parse(data.toString('utf8')) as T,
    }
  }

  async get(key: string): Promise<T | undefined> {
    if (!this.enabled) return undefined
    const id = this.id(key)
    let entry = this.memory.get(id)
    if (!entry) {
      entry = await this.read(id)
      if (entry) this.memory.set(id, entry)
    }
    if (entry) await this.touch(id, entry)
    return entry?.value
  }

  /** Buffer a value. Large batches may flush early to keep the write buffer bounded. */
  async set(key: string, value: T): Promise<void> {
    if (!this.enabled) return
    const id = this.id(key)
    this.memory.set(id, await this.write(id, value))
  }

  /** Same-key lookups and computations are coalesced within this instance. */
  async getOrSetAsync(key: string, loader: () => Promise<T>): Promise<T> {
    if (!this.enabled) return loader()
    const id = this.id(key)
    const entry = await this.memory.getOrSetAsync(
      id,
      async () => (await this.read(id)) ?? this.write(id, await loader()),
    )
    await this.touch(id, entry)
    return entry.value
  }

  /** Buffer deletion of a settled entry. Await outstanding operations on this key first. */
  async delete(key: string): Promise<void> {
    if (!this.enabled) return
    const id = this.id(key)
    this.memory.delete(id)
    await this.buffer(id, { kind: 'delete' })
  }

  /** Persist buffered changes; storage failures retain them for the next attempt. Await producers first. */
  flush(): Promise<void> {
    if (!this.enabled) return Promise.resolve()
    clearTimeout(this.timer)
    this.timer = undefined
    this.work = this.work.then(async () => {
      await this.flushPending()
      await this.maintain()
    })
    return this.work
  }

  /** Flush and clean idle entries across all versions of this namespace. */
  prune(): Promise<void> {
    if (!this.enabled) return Promise.resolve()
    clearTimeout(this.timer)
    this.timer = undefined
    this.work = this.work.then(async () => {
      await this.flushPending()
      if (this.maxAgeDays > 0) await this.pruneShards()
    })
    return this.work
  }

  private id(key: string) {
    return createHash('sha256')
      .update(JSON.stringify([this.version, key]))
      .digest('hex')
  }

  private today() {
    return Math.floor(Date.now() / CACHE_DAY_MS)
  }

  private async load(index: number): Promise<CacheShard> {
    const generation = this.generations[index]
    const loaded = await this.shards.getOrSetAsync(index, async () => {
      const entries = await readCacheShard(
        cacheShardFile(this.directory, index),
      )
      return {
        entries,
        generation,
        bytes: Buffer.byteLength(JSON.stringify(entries)),
      }
    })
    if (loaded.generation === this.generations[index]) return loaded.entries
    this.shards.delete(index)
    return this.load(index)
  }

  private remember(index: number, entries: CacheShard) {
    this.generations[index]++
    this.shards.set(index, {
      entries,
      generation: this.generations[index],
      bytes: Buffer.byteLength(JSON.stringify(entries)),
    })
  }

  private async read(id: string): Promise<MemoryEntry<T> | undefined> {
    try {
      const index = cacheShardIndex(id)
      const pending = this.pending.get(index)?.get(id)
      const change =
        pending?.kind === 'touch'
          ? (this.flushing.get(index)?.get(id) ?? pending)
          : (pending ?? this.flushing.get(index)?.get(id))
      if (change?.kind === 'delete') return undefined
      const stored =
        change?.kind === 'put' ? change.entry : (await this.load(index))[id]
      if (!stored) return undefined
      const data =
        stored[1] === null
          ? ((change?.kind === 'put' ? change.blob : undefined) ??
            (await fs.readFile(cacheBlobFile(this.directory, id))))
          : Buffer.from(stored[1])
      return {
        value: this.codec.decode(Buffer.from(data)),
        bytes: data.byteLength,
        touchedDay: stored[0],
      }
    } catch {
      return undefined
    }
  }

  private async write(id: string, value: T): Promise<MemoryEntry<T>> {
    const entry = {
      value,
      bytes: Number.MAX_SAFE_INTEGER,
      touchedDay: this.today(),
    }
    try {
      const encoded = this.codec.encode(value)
      entry.bytes =
        typeof encoded === 'string'
          ? Buffer.byteLength(encoded)
          : encoded.byteLength
      await this.buffer(id, encodeCacheChange(encoded, entry.touchedDay))
    } catch {
      // Codec/storage failures never change the result of a successful computation.
    }
    return entry
  }

  private async touch(id: string, entry: MemoryEntry<T>) {
    const day = this.today()
    if (this.maxAgeDays === 0 || entry.touchedDay === day) return
    entry.touchedDay = day
    await this.buffer(id, { kind: 'touch', day })
  }

  private changeBytes(change: CacheChange) {
    return (
      128 +
      (change.kind === 'put'
        ? (change.blob?.byteLength ?? Buffer.byteLength(change.entry[1] ?? ''))
        : 0)
    )
  }

  private async buffer(id: string, change: CacheChange) {
    const size = this.changeBytes(change)
    while (
      this.pendingCount > 0 &&
      (this.pendingBytes + size > this.bufferLimit ||
        this.pendingCount >= this.maxEntries)
    ) {
      await this.flush()
      // Failed persistence must not make the buffer unbounded or retry forever.
      while (
        this.pendingCount > 0 &&
        (this.pendingBytes + size > this.bufferLimit ||
          this.pendingCount >= this.maxEntries)
      ) {
        if (!this.discardFailedChange()) break
      }
    }
    const index = cacheShardIndex(id)
    const shard = this.pending.get(index) ?? new Map<string, CacheChange>()
    const previous = shard.get(id)
    if (change.kind === 'touch' && previous) {
      if (previous.kind === 'put') previous.entry[0] = change.day
      else if (previous.kind === 'touch') previous.day = change.day
      return
    }
    if (previous) this.pendingBytes -= this.changeBytes(previous)
    else this.pendingCount++
    shard.set(id, change)
    this.pending.set(index, shard)
    this.pendingBytes += size
    if (this.flushIntervalMs > 0 && !this.timer) {
      this.timer = setTimeout(() => {
        this.timer = undefined
        void this.flush()
      }, this.flushIntervalMs)
      this.timer.unref()
    }
    if (size > this.bufferLimit) await this.flush()
  }

  private discardFailedChange() {
    for (const [index, changes] of this.pending) {
      for (const [id, change] of changes) {
        if (!this.failed.has(change)) continue
        changes.delete(id)
        this.pendingBytes -= this.changeBytes(change)
        this.pendingCount--
        if (!changes.size) this.pending.delete(index)
        return true
      }
    }
    return false
  }

  private async flushPending() {
    const batch = this.pending
    this.pending = new Map()
    this.pendingBytes = 0
    this.pendingCount = 0
    this.flushing = batch
    try {
      for (const [index, changes] of batch) {
        try {
          this.remember(
            index,
            await updateCacheShard(this.directory, index, changes),
          )
        } catch {
          // Keep failed changes unless a newer mutation superseded them.
          const next = this.pending.get(index) ?? new Map<string, CacheChange>()
          for (const [id, change] of changes) {
            const newer = next.get(id)
            if (newer) {
              if (newer.kind !== 'touch' || change.kind !== 'put') continue
              change.entry[0] = Math.max(change.entry[0], newer.day)
              this.pendingBytes -= this.changeBytes(newer)
              this.pendingCount--
            }
            next.set(id, change)
            this.failed.add(change)
            this.pendingBytes += this.changeBytes(change)
            this.pendingCount++
          }
          this.pending.set(index, next)
        }
      }
    } finally {
      this.flushing = new Map()
    }
  }

  private async maintain() {
    if (this.maxAgeDays === 0 || Date.now() < this.nextMaintenance) return
    this.nextMaintenance = Date.now() + 3_600_000
    const stat = await fs
      .stat(path.join(this.directory, '.pruned'))
      .catch(() => undefined)
    if (!stat || stat.mtimeMs < Date.now() - 3_600_000) await this.pruneShards()
  }

  private async pruneShards() {
    const cutoff = this.today() - this.maxAgeDays
    for (const [index, files] of await listCacheFiles(this.directory)) {
      try {
        this.remember(
          index,
          await updateCacheShard(
            this.directory,
            index,
            new Map(),
            cutoff,
            files,
          ),
        )
      } catch {
        /* Cache housekeeping is best effort. */
      }
    }
    await fs.writeFile(path.join(this.directory, '.pruned'), '').catch(() => {})
  }
}
