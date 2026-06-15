import path from 'node:path'

export function resolveFolderKey(relPath: string) {
  const relPosix = toPosixPath(relPath)
  const dir = path.posix.dirname(relPosix)
  return dir === '.' ? '' : dir
}

export function toPosixPath(filePath: string) {
  return filePath.split(path.sep).join('/')
}

export function resolveString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : undefined
}

export function resolveNumber(value: unknown) {
  return typeof value === 'number' && !Number.isNaN(value) ? value : undefined
}

export function resolveBoolean(value: unknown) {
  return value === true
}

export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function humanizeSegment(segment: string) {
  const cleaned = segment.replace(/[-_]+/g, ' ').trim()
  if (!cleaned) return segment
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ')
}

export function stripPathExtension(value: string) {
  const ext = path.posix.extname(value)
  return ext ? value.slice(0, -ext.length) : value
}
