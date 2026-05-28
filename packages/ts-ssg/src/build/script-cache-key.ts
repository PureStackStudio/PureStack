let lastScriptCacheKeyTime = 0

export function createScriptCacheKey(now = Date.now()) {
  const next = now <= lastScriptCacheKeyTime ? lastScriptCacheKeyTime + 1 : now
  lastScriptCacheKeyTime = next
  return next.toString(36)
}

export class ScriptCacheKeyStore {
  private readonly keys = new Map<string, string>()

  constructor(entries: Record<string, { cacheKey?: string }> = {}) {
    for (const [relPath, entry] of Object.entries(entries)) {
      if (!entry.cacheKey) continue
      this.keys.set(this.normalizeRelPath(relPath), entry.cacheKey)
    }
  }

  clear() {
    this.keys.clear()
  }

  ensure(relPath: string) {
    const normalized = this.normalizeRelPath(relPath)
    const current = this.keys.get(normalized)
    if (current) return current
    const next = createScriptCacheKey()
    this.keys.set(normalized, next)
    return next
  }

  get(relPath: string) {
    return this.keys.get(this.normalizeRelPath(relPath))
  }

  set(relPath: string, cacheKey: string) {
    this.keys.set(this.normalizeRelPath(relPath), cacheKey)
  }

  bump(relPath: string) {
    const normalized = this.normalizeRelPath(relPath)
    const next = createScriptCacheKey()
    this.keys.set(normalized, next)
    return next
  }

  remove(relPath: string) {
    this.keys.delete(this.normalizeRelPath(relPath))
  }

  private normalizeRelPath(relPath: string) {
    return relPath.replaceAll('\\', '/')
  }
}
