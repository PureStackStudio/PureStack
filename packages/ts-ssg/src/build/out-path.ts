import path from 'node:path'

import type { ContentFile } from '../discover/content'
import { resolveRouteInfo } from '../routing/route'

export function resolveOutPath(outDir: string, file: ContentFile) {
  const { route } = resolveRouteInfo(file)
  const outSegments = route === '' ? ['index.html'] : [route, 'index.html']
  return path.join(outDir, ...outSegments)
}
