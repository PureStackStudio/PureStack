let lastScriptCacheKeyTime = 0

export function createScriptCacheKey(now = Date.now()) {
  const next = now <= lastScriptCacheKeyTime ? lastScriptCacheKeyTime + 1 : now
  lastScriptCacheKeyTime = next
  return next.toString(36)
}
