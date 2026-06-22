import path from 'node:path'

import type { ResolvedContentFile } from '../i18n/content'
import { resolveOutputRouteInfo } from '../routing/route'

export function resolveOutPath(outDir: string, file: ResolvedContentFile) {
  const { route } = resolveOutputRouteInfo(file)
  const outSegments = route === '' ? ['index.html'] : [route, 'index.html']
  return path.join(outDir, ...outSegments)
}
