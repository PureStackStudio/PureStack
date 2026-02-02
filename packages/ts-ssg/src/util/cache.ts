type CacheStats = {
  hits: number
  misses: number
  staleHits: number
  evictions: number
  sets: number
}

type CacheEntry<V> = {
  value: V
  expiresAt: number | null
  weight: number
  lastAccess: number
}

export type CacheOptions<K, V> = {
  name?: string
  maxEntries?: number
  maxWeight?: number
  defaultTtlMs?: number
  allowStale?: boolean
  sizeCalculator?: (value: V, key: K) => number
  onEvict?: (entry: { key: K; value: V; reason: 'max' | 'expired' }) => void
  now?: () => number
}

export class Cache<K, V> {
  private readonly name: string
  private readonly allowStale: boolean
  private readonly sizeCalculator: (value: V, key: K) => number
  private readonly onEvict?: CacheOptions<K, V>['onEvict']
  private readonly now: () => number
  private readonly entries = new Map<K, CacheEntry<V>>()
  private readonly inFlight = new Map<K, Promise<V>>()
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    staleHits: 0,
    evictions: 0,
    sets: 0,
  }
  private maxEntries: number
  private maxWeight: number
  private defaultTtlMs: number
  private totalWeight = 0

  constructor(options: CacheOptions<K, V> = {}) {
    this.name = options.name ?? 'cache'
    this.allowStale = options.allowStale ?? false
    this.sizeCalculator = options.sizeCalculator ?? (() => 1)
    this.onEvict = options.onEvict
    this.now = options.now ?? Date.now
    this.maxEntries = Math.max(1, options.maxEntries ?? 1000)
    this.maxWeight = Math.max(1, options.maxWeight ?? Number.MAX_SAFE_INTEGER)
    this.defaultTtlMs = Math.max(0, options.defaultTtlMs ?? 0)
  }

  get size() {
    return this.entries.size
  }

  get weight() {
    return this.totalWeight
  }

  getStats(): CacheStats {
    return { ...this.stats }
  }

  setLimits(options: { maxEntries?: number; maxWeight?: number }) {
    if (typeof options.maxEntries === 'number') {
      this.maxEntries = Math.max(1, options.maxEntries)
    }
    if (typeof options.maxWeight === 'number') {
      this.maxWeight = Math.max(1, options.maxWeight)
    }
    this.evictIfNeeded()
  }

  setDefaultTtl(ttlMs: number) {
    this.defaultTtlMs = Math.max(0, ttlMs)
  }

  has(key: K): boolean {
    const entry = this.entries.get(key)
    if (!entry) return false
    if (this.isExpired(entry)) {
      this.expireEntry(key, entry)
      return false
    }
    return true
  }

  peek(key: K): V | undefined {
    const entry = this.entries.get(key)
    if (!entry) return undefined
    if (this.isExpired(entry)) {
      this.expireEntry(key, entry)
      return this.allowStale ? entry.value : undefined
    }
    return entry.value
  }

  get(key: K): V | undefined {
    const entry = this.entries.get(key)
    if (!entry) {
      this.stats.misses += 1
      return undefined
    }
    if (this.isExpired(entry)) {
      this.expireEntry(key, entry)
      if (this.allowStale) {
        this.stats.staleHits += 1
        return entry.value
      }
      this.stats.misses += 1
      return undefined
    }
    entry.lastAccess = this.now()
    this.touch(key, entry)
    this.stats.hits += 1
    return entry.value
  }

  set(key: K, value: V, ttlMs?: number): V {
    const weight = Math.max(1, this.sizeCalculator(value, key))
    const expiresAt = this.computeExpiry(ttlMs)
    const now = this.now()
    const existing = this.entries.get(key)
    if (existing) {
      this.totalWeight -= existing.weight
      this.entries.delete(key)
    }
    this.entries.set(key, { value, expiresAt, weight, lastAccess: now })
    this.totalWeight += weight
    this.stats.sets += 1
    this.evictIfNeeded()
    return value
  }

  delete(key: K): boolean {
    const entry = this.entries.get(key)
    if (!entry) return false
    this.totalWeight -= entry.weight
    this.entries.delete(key)
    return true
  }

  clear() {
    this.entries.clear()
    this.inFlight.clear()
    this.totalWeight = 0
  }

  async getOrSetAsync(
    key: K,
    loader: () => Promise<V>,
    options?: { ttlMs?: number },
  ): Promise<V> {
    const cached = this.get(key)
    if (cached !== undefined) return cached

    const existing = this.inFlight.get(key)
    if (existing) return existing

    const promise = loader()
      .then((value) => {
        this.set(key, value, options?.ttlMs)
        this.inFlight.delete(key)
        return value
      })
      .catch((error) => {
        this.inFlight.delete(key)
        throw error
      })

    this.inFlight.set(key, promise)
    return promise
  }

  pruneExpired() {
    for (const [key, entry] of this.entries) {
      if (this.isExpired(entry)) {
        this.expireEntry(key, entry)
      }
    }
  }

  private isExpired(entry: CacheEntry<V>) {
    if (entry.expiresAt === null) return false
    return this.now() >= entry.expiresAt
  }

  private computeExpiry(ttlMs?: number) {
    const ttl = typeof ttlMs === 'number' ? ttlMs : this.defaultTtlMs
    if (ttl <= 0) return null
    return this.now() + ttl
  }

  private expireEntry(key: K, entry: CacheEntry<V>) {
    this.totalWeight -= entry.weight
    this.entries.delete(key)
    this.stats.evictions += 1
    this.onEvict?.({ key, value: entry.value, reason: 'expired' })
  }

  private evictIfNeeded() {
    while (
      this.entries.size > this.maxEntries ||
      this.totalWeight > this.maxWeight
    ) {
      const firstKey = this.entries.keys().next().value as K | undefined
      if (firstKey === undefined) break
      const entry = this.entries.get(firstKey)
      if (!entry) {
        this.entries.delete(firstKey)
        continue
      }
      this.totalWeight -= entry.weight
      this.entries.delete(firstKey)
      this.stats.evictions += 1
      this.onEvict?.({ key: firstKey, value: entry.value, reason: 'max' })
    }
  }

  private touch(key: K, entry: CacheEntry<V>) {
    this.entries.delete(key)
    this.entries.set(key, entry)
  }
}
