import { normalizePosixPath } from './assetPath'
import { urlNormalizer } from './urlNormalizer'

export function normalizeBasePath(value: string | undefined): string {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!trimmed || trimmed === '/') return ''
  if (urlNormalizer.isSpecialHref(trimmed)) {
    throw new Error(`basePath must be a site path, not "${value}".`)
  }
  if (trimmed.includes('?') || trimmed.includes('#')) {
    throw new Error(
      `basePath must not include query or hash parts: "${value}".`,
    )
  }

  const normalizedSlashes = trimmed.replaceAll('\\', '/')
  const withLeadingSlash = normalizedSlashes.startsWith('/')
    ? normalizedSlashes
    : `/${normalizedSlashes}`
  const segments = withLeadingSlash.split('/').filter(Boolean)
  if (segments.some((segment) => segment === '.' || segment === '..')) {
    throw new Error(`basePath must stay inside the site root: "${value}".`)
  }

  const normalized = normalizePosixPath(withLeadingSlash).replace(/\/+$/, '')
  return normalized === '/' ? '' : normalized
}

export function withBasePath(basePath: string, href: string): string {
  const normalizedBasePath = normalizeBasePath(basePath)
  if (!normalizedBasePath) return href
  if (!href || href.trim() !== href) return href
  if (urlNormalizer.isSpecialHref(href)) return href
  if (!href.startsWith('/')) return href

  const { base, suffix } = urlNormalizer.splitSuffix(href)
  if (base === normalizedBasePath) return `${base}${suffix}`
  if (base.startsWith(`${normalizedBasePath}/`)) return `${base}${suffix}`
  if (base === '/') return `${normalizedBasePath}/${suffix}`
  return `${normalizedBasePath}${base}${suffix}`
}

export function stripBasePath(basePath: string, pathname: string): string {
  const normalizedBasePath = normalizeBasePath(basePath)
  if (!normalizedBasePath) return pathname
  if (pathname === normalizedBasePath) return '/'
  if (pathname.startsWith(`${normalizedBasePath}/`)) {
    return pathname.slice(normalizedBasePath.length) || '/'
  }
  return pathname
}
