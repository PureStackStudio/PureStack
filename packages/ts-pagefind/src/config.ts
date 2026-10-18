import type { PagefindConfig } from '@purestack/ts-common'

export function resolvePagefindConfig(
  input?: Partial<PagefindConfig>,
  file?: Partial<PagefindConfig>,
): PagefindConfig {
  return {
    enabled: input?.enabled ?? file?.enabled ?? true,
    excludePaths: normalizePagefindExcludePaths(
      input?.excludePaths ?? file?.excludePaths,
    ),
  }
}

function normalizePagefindExcludePaths(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  const unique = new Set<string>()
  for (const entry of value) {
    if (typeof entry !== 'string') continue
    const trimmed = entry.trim()
    if (!trimmed) continue
    const normalized = normalizeExcludePath(trimmed)
    unique.add(normalized)
  }
  return [...unique]
}

function normalizeExcludePath(pathname: string): string {
  const normalized = pathname.replaceAll('\\', '/').trim()
  if (normalized === '/') return '/'
  const withLeading = normalized.startsWith('/') ? normalized : `/${normalized}`
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`
}
