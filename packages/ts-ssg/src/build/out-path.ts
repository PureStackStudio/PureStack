import path from 'node:path'

import type { ContentFile } from '../discover/content'

export interface RouteInfo {
  route: string
  urlPath: string
}

export function resolveRouteInfo(file: ContentFile): RouteInfo {
  const relPosix = toPosixPath(file.relPath)
  const baseName = path.posix.basename(relPosix, file.ext)
  const dir = path.posix.dirname(relPosix)
  const isIndex = baseName === 'index'
  const segments: string[] = []
  if (dir !== '.') segments.push(...dir.split('/'))
  if (!isIndex) segments.push(baseName)
  const route = segments.join('/')
  const urlPath = route === '' ? '/' : `/${route}/`
  return { route, urlPath }
}

export function resolveOutPath(outDir: string, file: ContentFile) {
  const { route } = resolveRouteInfo(file)
  const outSegments = route === '' ? ['index.html'] : [route, 'index.html']
  return path.join(outDir, ...outSegments)
}

function toPosixPath(filePath: string) {
  return filePath.split(path.sep).join('/')
}
