import { urlNormalizer } from './urlNormalizer'

export function resolveString(...values: Array<string | undefined>) {
  for (const value of values) {
    if (typeof value === 'string' && value.length > 0) return value
  }
  return ''
}

export function pickBoolean(input: unknown, file: unknown, fallback = false) {
  const searchValues = [input, file]
  for (const value of searchValues) {
    if (typeof value === 'boolean') return value
  }
  return fallback
}

export function resolveOptionalString(value: unknown) {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : undefined
}

/** Content-root-relative URL, independent of the current page. */
export function resolveConfigUrl(value: string): string
export function resolveConfigUrl(value: string | undefined): string | undefined
export function resolveConfigUrl(value: string | undefined) {
  if (!value || value.startsWith('/') || urlNormalizer.isSpecialHref(value))
    return value
  const { base, suffix } = urlNormalizer.splitSuffix(value)
  const segments: string[] = []
  const pathname = base.replaceAll('\\', '/')
  for (const part of pathname.split('/')) {
    if (!part || part === '.') continue
    if (part === '..') segments.pop()
    else segments.push(part)
  }
  const trailing = pathname.endsWith('/') && segments.length > 0 ? '/' : ''
  return `/${segments.join('/')}${trailing}${suffix}`
}
