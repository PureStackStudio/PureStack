// Keep these helpers browser-safe so components like PageScript can reuse them
// without pulling in Node-only modules such as node:path.
const TS_EXT = '.ts'
const JS_EXT = '.js'

export interface OutputAssetPathOptions {
  cacheKey?: string
}

export function isTypeScriptAssetPath(filePath: string) {
  return getExtension(filePath).toLowerCase() === TS_EXT
}

export function toPosixPath(filePath: string) {
  return filePath.replaceAll('\\', '/')
}

export function dirnamePosix(filePath: string) {
  const normalized = toPosixPath(filePath)
  const slashIndex = normalized.lastIndexOf('/')
  if (slashIndex < 0) return '.'
  if (slashIndex === 0) return '/'
  return normalized.slice(0, slashIndex)
}

export function joinPosix(...parts: string[]) {
  const filtered = parts.filter((part) => part.length > 0)
  return normalizePosixPath(filtered.join('/'))
}

export function normalizePosixPath(filePath: string) {
  const normalized = toPosixPath(filePath)
  const isAbsolute = normalized.startsWith('/')
  const segments = normalized.split('/')
  const result: string[] = []

  for (const segment of segments) {
    if (segment.length === 0 || segment === '.') continue
    if (segment === '..') {
      const last = result[result.length - 1]
      if (last && last !== '..') {
        result.pop()
      } else if (!isAbsolute) {
        result.push('..')
      }
      continue
    }
    result.push(segment)
  }

  if (isAbsolute) {
    return result.length > 0 ? `/${result.join('/')}` : '/'
  }
  return result.length > 0 ? result.join('/') : '.'
}

export function toOutputAssetRelPath(
  relPath: string,
  options: OutputAssetPathOptions = {},
) {
  if (!isTypeScriptAssetPath(relPath)) return relPath
  const normalized = toPosixPath(relPath)
  const { dir, name } = splitPath(normalized)
  const cacheKey = normalizeCacheKey(options.cacheKey)
  const fileName = cacheKey
    ? `${name}.${cacheKey}${JS_EXT}`
    : `${name}${JS_EXT}`
  return dir.length > 0 ? `${dir}/${name}/${fileName}` : `${name}/${fileName}`
}

function normalizeCacheKey(value: string | undefined) {
  const normalized = value?.trim().replaceAll(/[^a-zA-Z0-9_-]/g, '')
  return normalized && normalized.length > 0 ? normalized : undefined
}

function getExtension(filePath: string) {
  const normalized = filePath.replaceAll('\\', '/')
  const fileName = normalized.slice(normalized.lastIndexOf('/') + 1)
  const dotIndex = fileName.lastIndexOf('.')
  if (dotIndex <= 0) return ''
  return fileName.slice(dotIndex)
}

function splitPath(filePath: string) {
  const slashIndex = filePath.lastIndexOf('/')
  const dir = slashIndex >= 0 ? filePath.slice(0, slashIndex) : ''
  const base = slashIndex >= 0 ? filePath.slice(slashIndex + 1) : filePath
  const ext = getExtension(base)
  const name = ext.length > 0 ? base.slice(0, -ext.length) : base
  return { dir, name }
}
